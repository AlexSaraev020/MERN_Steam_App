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

/* Genre chips derived from the fetched catalogue, most titles first. The old
   hardcoded list carried 11 words while the feed uses 15 after aliasing, so ten
   genres could not be filtered at all. */
export const genreFacets = (games: Game[]): Genre[] => {
  const count = new Map<Genre, number>();
  for (const g of games) for (const x of g.genres) count.set(x, (count.get(x) ?? 0) + 1);
  return Array.from(count.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([genre]) => genre);
};

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


export const formatInt = (value: number): string => value.toLocaleString('en-US');

export const compactInt = (value: number): string =>
  value >= 1000 ? `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k` : String(value);

export const formatDate = (iso: string): string => {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

/** The wide plate behind the featured panel: 1200x675 instead of the 365x206 capsule.
    shortcut: checked 120 of 416 titles, 3 had no wide plate — Home falls back to the capsule. */
export const wideCover = (cover: string): string => cover.replace('/thumbnail.', '/background.');

/* What the catalogue's per-title endpoint adds on top of the list: a long
   description, its own screenshots and minimum system requirements. The status
   field is served too but reads "Live" for every one of 93 titles checked
   (including titles that shut down years ago), so the UI does not show it. */
export type GameDetails = {
  id: number;
  description?: string;
  screenshots?: { id: number; image: string }[];
  minimum_system_requirements?: Record<string, string> | null;
};

/** Blank-line separated source text into paragraphs. The source separates with CRLF CRLF,
    which a plain \n{2,} never matches. */
export const paragraphs = (text: string): string[] =>
  text.split(/(?:\r\n|\r|\n){2,}/).map((p) => p.replace(/\s+/g, ' ').trim()).filter(Boolean);

/** Only the spec lines the source filled: 31 of 39 sampled titles have any, and the
    values carry stray spaces and "?" placeholders. */
const SPEC_LABELS: Record<string, string> = { os: 'OS', processor: 'Processor', memory: 'Memory', graphics: 'Graphics', storage: 'Storage' };

export const specRows = (specs?: Record<string, string> | null): { label: string; value: string }[] =>
  Object.entries(specs ?? {})
    .map(([key, value]) => ({
      label: SPEC_LABELS[key] ?? key.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase()),
      value: String(value ?? '').trim(),
    }))
    .filter((row) => row.value.length > 1 && row.value !== '?');

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
