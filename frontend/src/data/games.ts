/* ==========================================================================
   The catalogue the redesigned screens render.

   It is now the real one: the backend serves what freetogame.com publishes, in
   exactly these fields — id, title, thumbnail, short_description, game_url,
   genre, platform, publisher, developer, release_date, freetogame_profile_url.
   Nothing else is knowable from it, so the type carries no price, no discount,
   no concurrent-players count, no aggregate score and no review text. The
   placeholders those numbers used are removed rather than invented.
   ========================================================================== */

export type Genre = string;

/* The genre words the catalogue uses, ordered by how many titles carry them.
   shortcut: read off today's payload; switch to deriving it from the fetched
   games if the backend ever starts serving a different mix. */
export const GENRES: Genre[] = [
  'MMORPG', 'Shooter', 'Strategy', 'Card Game', 'MOBA', 'Sports', 'Fighting',
  'RPG', 'Battle Royale', 'MMO', 'Social',
];

const GENRE_ALIASES: Record<string, Genre> = {
  'Action': 'Action', 'Action Game': 'Action', 'Action RPG': 'Action',
  'ARPG': 'Action', 'MMOARPG': 'Action', 'Card': 'Card Game',
};

export type ApiGame = {
  id: number;
  title: string;
  thumbnail: string;
  short_description: string;
  game_url: string;
  genre: string;
  platform: string;
  publisher: string;
  developer: string;
  release_date: string;
  freetogame_profile_url?: string;
};

export type Game = {
  id: string;
  title: string;
  tagline: string;        // who made it and where it runs
  description: string;    // the catalogue's own summary
  genres: Genre[];
  platform: string;       // PC | Browser | PC + Browser
  released: string;       // ISO date
  cover: string;          // capsule art
  gameUrl: string;
  profileUrl: string;
  developer: string;
  publisher: string;
  hue: number;            // drives the generated plate when the capsule is missing
};

const PLATFORM: Record<string, string> = {
  'PC (Windows)': 'PC',
  'Web Browser': 'Browser',
  'PC (Windows), Web Browser': 'PC + Browser',
};

export const toGame = (a: ApiGame): Game => {
  const genre = GENRE_ALIASES[a.genre.trim()] ?? a.genre.trim();
  const platform = PLATFORM[a.platform] ?? a.platform;
  return {
    id: String(a.id),
    title: a.title,
    tagline: `${platform} · ${a.developer}`,
    description: a.short_description,
    genres: genre ? [genre] : [],
    platform,
    released: a.release_date,
    cover: a.thumbnail,
    gameUrl: a.game_url,
    profileUrl: a.freetogame_profile_url ?? a.game_url,
    developer: a.developer,
    publisher: a.publisher,
    hue: (a.id * 37) % 360,
  };
};

/* popular and latestReleases are the same catalogue in two orders. Keep one
   list, in popularity order, and let the sort do the rest. */
export const toGameList = (payload: { popular: ApiGame[]; latestReleases: ApiGame[] }): Game[] => {
  const byId = new Map<string, Game>();
  for (const a of [...payload.latestReleases, ...payload.popular]) {
    if (!byId.has(String(a.id))) byId.set(String(a.id), toGame(a));
  }
  return Array.from(byId.values());
};

export type SortKey = 'new' | 'old' | 'title';

export const SORTS: { key: SortKey; label: string }[] = [
  { key: 'new', label: 'Newest' },
  { key: 'title', label: 'A–Z' },
  { key: 'old', label: 'Oldest' },
];

export type FilterValue = { genre: Genre | null; sort: SortKey };

const COMPARATORS: Record<SortKey, (a: Game, b: Game) => number> = {
  new: (a, b) => b.released.localeCompare(a.released),
  old: (a, b) => a.released.localeCompare(b.released),
  title: (a, b) => a.title.localeCompare(b.title),
};

export function applyFilters(games: Game[], f: FilterValue): Game[] {
  const list = f.genre ? games.filter((g) => g.genres.includes(f.genre as Genre)) : games;
  return [...list].sort(COMPARATORS[f.sort]);
}

/* The account plate is still the design study: the backend has the same
   endpoints the old app used (register / login / user/:id / favorite), but the
   redesigned Profile screen is not talking to them yet. */
export type Profile = {
  id: string;
  gamertag: string;
  initials: string;
  bio: string;
  favouriteGenre: Genre;
  publicLibrary: boolean;
  joined: string;
  weeklyHours: number;
  owned: string[];      // game ids, so "owned" is a real count
};

export const PROFILE: Profile = {
  id: '',
  gamertag: 'visitor',
  initials: '——',
  bio: '',
  favouriteGenre: 'MMORPG',
  publicLibrary: true,
  joined: '',
  weeklyHours: 0,
  owned: [],
};

export const formatInt = (value: number): string => value.toLocaleString('en-US');

export const compactInt = (value: number): string =>
  value >= 1000 ? `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k` : String(value);

export const formatDate = (iso: string): string => {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};
