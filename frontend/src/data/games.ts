/* ==========================================================================
   The catalogue the screens render.

   It comes from IGDB through the backend: id, title, cover, wide cover, summary,
   genres, release date, developer, publisher, and the member rating. IGDB publishes
   no price and no player count, so the type carries neither — the numeral the cards
   show is the rating, not a price.
   ========================================================================== */

export type Genre = string;

/* Genre chips derived from the fetched catalogue, most titles first. */
export const genreFacets = (games: Game[]): Genre[] => {
  const count = new Map<Genre, number>();
  for (const g of games) for (const x of g.genres) count.set(x, (count.get(x) ?? 0) + 1);
  return Array.from(count.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([genre]) => genre);
};

/* IGDB's own genre names carry their abbreviation in parentheses; the chips read
   better without it. */
const GENRE_ALIASES: Record<string, Genre> = {
  'Role-playing (RPG)': 'RPG',
  'Real Time Strategy (RTS)': 'RTS',
  'Turn-based strategy (TBS)': 'Turn-based',
  'Hack and slash/Beat \'em up': 'Beat \'em up',
  'Card & Board Game': 'Card & Board',
  'Quiz/Trivia': 'Trivia',
};

export type ApiGame = {
  id: number;
  title: string;
  slug: string;
  thumbnail: string;
  wideCover: string;
  genres: string[];
  platforms: string[];
  release_date: string;
  game_url: string;
  developer: string;
  publisher: string;
  rating: number | null;
  ratingCount: number;
};

/* IGDB's platform names are sentence-length; a card has room for three short ones. */
const PLATFORM_SHORT: Record<string, string> = {
  'PC (Microsoft Windows)': 'PC', 'PlayStation 5': 'PS5', 'PlayStation 4': 'PS4',
  'PlayStation 3': 'PS3', 'PlayStation 2': 'PS2', 'Xbox Series X|S': 'Xbox',
  'Xbox One': 'Xbox', 'Nintendo Switch': 'Switch', 'Nintendo Switch 2': 'Switch 2',
  'Google Stadia': 'Stadia',
};

export const platformLabel = (platforms: string[]): string => {
  const short = Array.from(new Set(platforms.map((p) => PLATFORM_SHORT[p] ?? p)));
  if (short.length === 0) return '—';   // IGDB lists no platform for some records
  return short.slice(0, 3).join(' / ') + (short.length > 3 ? ` +${short.length - 3}` : '');
};

export type Game = {
  id: string;
  title: string;
  tagline: string;        // where it runs and who made it
  genres: Genre[];
  platforms: string[];    // short labels, in IGDB's order
  released: string;       // ISO date
  cover: string;          // capsule art
  wide: string;           // the 16:9 plate behind the featured panel
  gameUrl: string;
  developer: string;
  publisher: string;
  rating: number | null;  // IGDB member score, 0-100
  ratingCount: number;
  hue: number;            // drives the generated plate when the capsule is missing
};

/* A row that carries neither list is treated as carrying empty ones: an older response
   (a cached answer from the previous backend) used to throw here and leave the whole page
   stuck on its loading skeleton, because the throw happened before the failed state could
   be set. */
export const toGame = (a: ApiGame): Game => {
  const platforms = Array.from(new Set((a.platforms ?? []).map((p) => PLATFORM_SHORT[p] ?? p)));
  return {
    id: String(a.id),
    title: a.title,
    tagline: [platforms.join(' / '), a.developer].filter(Boolean).join(' · '),

    genres: (a.genres ?? []).map((g) => GENRE_ALIASES[g] ?? g),
    platforms,
    released: a.release_date,
    cover: a.thumbnail,
    wide: a.wideCover,
    gameUrl: a.game_url,
    developer: a.developer,
    publisher: a.publisher,
    rating: a.rating,
    ratingCount: a.ratingCount,
    hue: (a.id * 37) % 360,
  };
};

/* popular and latestReleases are the same catalogue in two orders. Keep one list, in the order
   its members actually rated things, and let the sort do the rest. Leading with the newest
   releases put one-vote titles on the front page: the newest 12 rows were GTA VI, Unicorn
   Academy (1 vote), Fakin It XL (1 vote), Splatchinko (1 vote). */
export const toGameList = (payload: { popular: ApiGame[]; latestReleases: ApiGame[] }): Game[] => {
  const byId = new Map<string, Game>();
  for (const a of [...payload.popular, ...payload.latestReleases]) {
    if (!byId.has(String(a.id))) byId.set(String(a.id), toGame(a));
  }
  return Array.from(byId.values());
};

export type SortKey = 'relevance' | 'new' | 'old' | 'title';

export const SORTS: { key: SortKey; label: string }[] = [
  { key: 'relevance', label: 'Best match' },
  { key: 'new', label: 'Newest' },
  { key: 'title', label: 'A–Z' },
  { key: 'old', label: 'Oldest' },
];

export type FilterValue = { genre: Genre | null; sort: SortKey };

const COMPARATORS: Record<SortKey, (a: Game, b: Game) => number> = {
  relevance: () => 0,   // keep the order the source sent
  new: (a, b) => b.released.localeCompare(a.released),
  old: (a, b) => a.released.localeCompare(b.released),
  title: (a, b) => a.title.localeCompare(b.title),
};

export function applyFilters(games: Game[], f: FilterValue): Game[] {
  const list = f.genre ? games.filter((g) => g.genres.includes(f.genre as Genre)) : games;
  return [...list].sort(COMPARATORS[f.sort]);
}


export const formatInt = (value: number): string => value.toLocaleString('en-US');

export const compactInt = (value: number): string =>
  value >= 1000 ? `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k` : String(value);

export const formatDate = (iso: string): string => {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

/* What the per-title endpoint adds on top of the list: the long description, the
   screenshots, the critic score and the age ratings. IGDB publishes no system
   requirements, so the page no longer has a requirements block. */
/** One picture from the entry: a small one for the strip, a 1920-wide one for the plate. */
export type Shot = { id: number; thumb: string; full: string };

export type GameDetails = {
  id: number;
  description?: string;
  cover?: { thumb: string; full: string } | null;
  screenshots?: Shot[];
  videos?: { id: number; name: string; youtube: string }[];
  rating?: number | null;
  ratingCount?: number;
  criticRating?: number | null;
  /** IGDB's own `similar_games`, and the rest of the developer's catalogue. */
  similar?: Game[];
  byDeveloper?: Game[];
};

/** Blank-line separated source text into paragraphs. */
export const paragraphs = (text: string): string[] =>
  text.split(/(?:\r\n|\r|\n){2,}/).map((p) => p.replace(/\s+/g, ' ').trim()).filter(Boolean);

/** A paragraph cut to a card: ends on a whole word, never mid-word. */
export const lead = (text: string, max = 220): string =>
  text.length <= max ? text : `${text.slice(0, max).replace(/\s+\S*$/, '')}…`;

/** 87.41340726540926 -> 87. IGDB scores are means over member votes. */
export const formatRating = (rating: number): string => String(Math.round(rating));

/* Playtime per title, keyed by whoever is signed in. The user record has no playtime
   column — that needs a backend field plus a Render redeploy — so the log lives in this
   browser. shortcut: localStorage, move it to /userUpdate when the field exists. */
export type Playtime = Record<string, number>;

const playKey = (who: string) => `gamerslobby-playtime-${who}`;

export const loadPlaytime = (who: string): Playtime => {
  try {
    const raw = JSON.parse(localStorage.getItem(playKey(who)) ?? '{}');
    return raw && typeof raw === 'object' ? raw as Playtime : {};
  } catch { return {}; }
};

export const savePlaytime = (who: string, log: Playtime): void => {
  localStorage.setItem(playKey(who), JSON.stringify(log));
};

export const totalHours = (log: Playtime): number =>
  Object.values(log).reduce((sum, h) => sum + h, 0);

export const formatHours = (h: number): string => (Number.isInteger(h) ? String(h) : h.toFixed(1));
