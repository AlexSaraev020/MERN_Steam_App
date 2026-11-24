import { Express } from "express";
import axios from "axios";
import UserModel from "../../Models/UserController";

/* ==========================================================================
   The catalogue is IGDB now.

   Auth is a Twitch app token (client_credentials) cached in memory: it lives about
   56 days, so it is only refetched when IGDB answers 401.
   shortcut: one token per process. If Render runs more than one instance each holds
   its own, which is fine — Twitch issues a separate token per request.
   ========================================================================== */
const IGDB_ID = process.env.IGDB_CLIENT_ID;
const IGDB_SECRET = process.env.IGDB_CLIENT_SECRET;

let token: { value: string; until: number } | null = null;

const accessToken = async (): Promise<string> => {
  if (token && token.until > Date.now() + 60000) return token.value;
  const { data } = await axios.post('https://id.twitch.tv/oauth2/token', null, {
    params: { client_id: IGDB_ID, client_secret: IGDB_SECRET, grant_type: 'client_credentials' },
    timeout: 10000,
  });
  token = { value: data.access_token, until: Date.now() + data.expires_in * 1000 };
  return token.value;
};

/* IGDB reads the query body as plain text (Apalypse), not JSON. */
const igdb = async (endpoint: string, query: string) => {
  const call = async () => axios.post(`https://api.igdb.com/v4/${endpoint}`, query, {
    headers: {
      'Client-ID': IGDB_ID,
      Authorization: `Bearer ${await accessToken()}`,
      'Content-Type': 'text/plain',
    },
    timeout: 15000,
  });
  try {
    return (await call()).data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      token = null;
      return (await call()).data;
    }
    throw err;
  }
};

const image = (imageId: string, size: string) =>
  `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`;

const LIST_FIELDS = 'fields id, name, slug, url, total_rating, total_rating_count, first_release_date, cover.image_id, genres.name, platforms.name, involved_companies.company.name, involved_companies.developer, involved_companies.publisher;';

/* The same card fields, prefixed with a relation: IGDB expands them, so one query returns the
   related titles as full cards instead of a list of ids. */
const SIMILAR_FIELDS = 'similar_games.id, similar_games.name, similar_games.slug, similar_games.url, similar_games.total_rating, similar_games.total_rating_count, similar_games.first_release_date, similar_games.cover.image_id, similar_games.genres.name, similar_games.platforms.name, similar_games.involved_companies.company.name, similar_games.involved_companies.developer, similar_games.involved_companies.publisher';

/* IGDB holds 388,273 game records and no popularity feed, so the browsable shelf is the
   500 titles its members rated most, plus the 500 released in the last 400 days that have at
   least one rating. No platform filter: Grand Theft Auto VI is catalogued as console-only, and
   filtering to PC hid it. Anything else is reachable through /api/search.
   The release-date ceiling is needed because IGDB carries entries dated 2030-2040. */
const DAY = 86400;
const NOW = Math.floor(Date.now() / 1000);
const POPULAR = `${LIST_FIELDS}\nsort total_rating_count desc;\nlimit 500;`;
const LATEST = `${LIST_FIELDS}\nwhere first_release_date < ${NOW} & first_release_date > ${NOW - 400 * DAY} & total_rating_count > 0;\nsort first_release_date desc;\nlimit 500;`;

const company = (list: any[] | undefined, kind: 'developer' | 'publisher') =>
  (list ?? []).find((c) => c[kind])?.company?.name ?? '';

const toApiGame = (g: any) => ({
  id: g.id,
  title: g.name,
  slug: g.slug,
  thumbnail: g.cover?.image_id ? image(g.cover.image_id, 'cover_big') : '',
  wideCover: g.cover?.image_id ? image(g.cover.image_id, '1080p') : '',

  genres: (g.genres ?? []).map((x: any) => x.name),
  platforms: (g.platforms ?? []).map((x: any) => x.name),
  release_date: g.first_release_date ? new Date(g.first_release_date * 1000).toISOString().slice(0, 10) : '',
  game_url: g.url ?? '',
  developer: company(g.involved_companies, 'developer'),
  publisher: company(g.involved_companies, 'publisher'),
  rating: g.total_rating ?? null,
  ratingCount: g.total_rating_count ?? 0,
});

/* IGDB stores a title's deluxe editions, game-of-the-year packs and add-on modes as separate
   game records, and it does not mark them consistently: "Ghost of Yotei: Digital Deluxe Edition"
   carries version_parent -> the base game, while "Ghost of Yotei: Legends" and
   ": Complete Edition" carry nothing at all, and `category` is empty on every one of the
   388,273 rows. So the collapse reads the returned titles themselves: a row whose title is
   another row's title plus a ":" or "-" suffix is a version of it, and the one members rated
   most survives.
   shortcut: this also drops a spin-off that shares its parent's name (Minecraft: Story Mode
   under Minecraft), and it cannot see a bundle or a costume pack that shares no name.
   `where version_parent = null` was measured and rejected: it reshuffles the recent rail. */
const isEditionOf = (base: string, other: string) => {
  const a = base.toLowerCase().trim();
  const b = other.toLowerCase().trim();
  return a === b || (b.startsWith(a) && /^\s*[:\-]/.test(b.slice(a.length)));
};

const collapseEditions = <T extends { title: string; ratingCount: number }>(rows: T[]): T[] => {
  const drop = new Set<T>();
  const byVotes = [...rows].sort((x, y) => y.ratingCount - x.ratingCount);
  for (let i = 0; i < byVotes.length; i++) {
    for (let j = i + 1; j < byVotes.length; j++) {
      if (!drop.has(byVotes[j]) && isEditionOf(byVotes[i].title, byVotes[j].title)) drop.add(byVotes[j]);
    }
  }
  return rows.filter((r) => !drop.has(r));
};

export function fetchGames(app: Express) {
  app.get('/api/games', async (req, res) => {
    try {
      const [popular, latestReleases] = await Promise.all([
        igdb('games', POPULAR),
        igdb('games', LATEST),
      ]);
      res.json({ popular: collapseEditions(popular.map(toApiGame)), latestReleases: collapseEditions(latestReleases.map(toApiGame)) });
    } catch (error) {
      console.error('Error fetching games:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  /* IGDB's own full-text search, so a title outside the two browsable rails is still reachable.
     Quotes and newlines are stripped: Apalypse reads " as a string delimiter. */
  app.get('/api/search', async (req, res) => {
    const term = String(req.query.q ?? '').replace(/["\r\n]/g, '').trim();
    if (term.length < 2) return res.json([]);
    try {
      const found = await igdb('games', `${LIST_FIELDS}\nsearch "${term}";\nlimit 100;`);
      res.json(collapseEditions(found.map(toApiGame)));
    } catch (error) {
      console.error('Error searching games:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  /* What the per-title page adds on top of the list: the long description, the screenshots
     and trailers the entry carries, the critic score. GET /games/:id does not expand those
     relations, so this goes through the query endpoint.
     IGDB's `artworks` array is deliberately not asked for: it is one mixed bag of key art,
     wallpapers, box art and the title's own logo, split only by an `image_type` reference
     (the docs list `artworks.image_type`, and `logos` is a separate table). Grand Theft Auto
     VI carries 21 artworks against 20 screenshots, and IGDB's own page shows one of them.
     `screenshots` is the array that means in-game pictures, so the strip is cover +
     screenshots + videos.
     IGDB's image host serves only its named presets, and screenshot_med is the smallest one
     that exists on covers and screenshots alike. Videos come as YouTube ids. */
  app.get('/api/game/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'Bad title id' });
    try {
      const [g] = await igdb('games',
        `fields id, name, summary, total_rating, total_rating_count, aggregated_rating, cover.image_id, screenshots.image_id, videos.*, involved_companies.company.id, involved_companies.developer, ${SIMILAR_FIELDS};\nwhere id = ${id};\nlimit 1;`);
      if (!g) return res.status(404).json({ message: 'No such title' });
      const media = (list: any[] | undefined) => (list ?? []).map((m: any) => ({
        id: m.id, thumb: image(m.image_id, 'screenshot_med'), full: image(m.image_id, '1080p'),
      }));
      /* IGDB lists a title's editions, re-releases and duplicate records as separate rows that
         carry the same name, and its `similar_games` mixes them in with real games. So a related
         row is dropped when it is the title you are looking at, an edition of it, or the one it
         duplicates — the same name rule the shelf uses, no list of words to match against. */
      const related = (rows: any[]) => collapseEditions(
        (rows ?? []).map(toApiGame).filter((r) => r.id !== id && !isEditionOf(g.name, r.title) && !isEditionOf(r.title, g.name)),
      );
      const similar = related(g.similar_games).slice(0, 10);

      /* What else this title's developer made, best-rated first. IGDB filters on the company
         inside involved_companies, so this is one query and not a walk through the shelf. */
      const devId = (g.involved_companies ?? []).find((c: any) => c.developer)?.company?.id;
      const byDeveloper = devId
        ? related(await igdb('games', `${LIST_FIELDS}\nwhere involved_companies.company = ${devId} & id != ${id};\nsort total_rating_count desc;\nlimit 12;`)).slice(0, 10)
        : [];

      res.json({
        id: g.id,
        description: g.summary ?? '',
        cover: g.cover?.image_id ? { thumb: image(g.cover.image_id, 'screenshot_med'), full: image(g.cover.image_id, '1080p') } : null,
        screenshots: media(g.screenshots),
        videos: (g.videos ?? []).filter((v: any) => v.video_id).map((v: any) => ({ id: v.id, name: v.name ?? 'Video', youtube: v.video_id })),
        rating: g.total_rating ?? null,
        ratingCount: g.total_rating_count ?? 0,
        criticRating: g.aggregated_rating ?? null,
        similar,
        byDeveloper,
      });
    } catch (error) {
      console.error('Error fetching one game:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
}

export function favoriteGame(app: Express) {
    app.post('/favorite', async (req, res) => {
        const { userId, gameId } = req.body;
        try {
            await UserModel.findByIdAndUpdate(
                userId,
                { $addToSet: { favoriteGames: gameId } },
                { new: true }
            );
            res.status(200).json({ message: 'Added to favorite' });
        } catch (error) {
            res.status(500).json({ message: 'Error adding favorite game', error });
        }
    });

    app.delete('/rmfavorite', async (req, res) => {
        const { userId, gameId } = req.body;

        try {
            const user = await UserModel.findByIdAndUpdate(
                userId,
                { $pull: { favoriteGames: gameId } },
                { new: true }
            );
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: 'Error removing favorite game', error });
        }
    });

}
