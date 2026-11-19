/* Placeholder catalogue for the redesign.
   Drop your real Steam API payloads in here (same field names, `cover` = the
   capsule URL) and every screen renders real data with no other change. */

export type Genre =
  | 'Action' | 'RPG' | 'Shooter' | 'Strategy'
  | 'Racing' | 'Survival' | 'Horror' | 'Roguelike';

export const GENRES: Genre[] = [
  'Action', 'RPG', 'Shooter', 'Strategy', 'Racing', 'Survival', 'Horror', 'Roguelike',
];

export type SystemSpec = { os: string; cpu: string; memory: string; gpu: string; storage: string };

export type Game = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  genres: Genre[];
  price: number;        // USD, 0 = free to play
  discount: number;     // 0–90, percent
  released: string;     // ISO date
  players: number;      // concurrent players right now
  score: number;        // 0–100 aggregate
  reviews: number;
  avgHours: number;
  hue: number;          // drives the generated cover plate when `cover` is absent
  cover?: string;       // real capsule URL from your API
  counts: { positive: number; mixed: number; negative: number };
  quotes: { author: string; hours: number; text: string; helpful: number }[];
  min: SystemSpec;
  rec: SystemSpec;
};

const spec = (os: string, cpu: string, memory: string, gpu: string, storage: string): SystemSpec =>
  ({ os, cpu, memory, gpu, storage });

export const GAMES: Game[] = [
  {
    id: 'voidrunner', title: 'Voidrunner: Protocol',
    tagline: 'Speedrun the collapse of a station nobody maintained.',
    description: 'A momentum shooter set on a dying orbital ring. Every weapon you pick up is borrowed, every corridor is rearranging, and the station clock only ever runs one way. Learn the loops, then break them.',
    genres: ['Shooter', 'Action'], price: 29.99, discount: 40, released: '2025-03-14',
    players: 41263, score: 91, reviews: 18342, avgHours: 34, hue: 348,
    counts: { positive: 16120, mixed: 1640, negative: 582 },
    quotes: [
      { author: 'kestrel_0x', hours: 118, text: 'The movement is the whole game. I stopped reading the story logs because I was too busy beating my own split times.', helpful: 412 },
      { author: 'nova_plate', hours: 9, text: 'Brutal for the first two hours, then it clicks and never lets go.', helpful: 168 },
    ],
    min: spec('Windows 10 64-bit', 'Ryzen 5 2600 / i5-9400', '8 GB RAM', 'GTX 1060 6GB', '45 GB available space'),
    rec: spec('Windows 11 64-bit', 'Ryzen 7 5800X / i7-11700K', '16 GB RAM', 'RTX 3070', '45 GB SSD'),
  },
  {
    id: 'ashen-crown', title: 'Ashen Crown',
    tagline: 'A turn-based war for a kingdom that already lost.',
    description: 'Command a broken army through a winter that will not end. Ashen Crown trades hero fantasy for logistics: heat, morale, and the cost of one more week of holding a road.',
    genres: ['Strategy', 'RPG'], price: 39.99, discount: 0, released: '2024-11-05',
    players: 12874, score: 87, reviews: 9120, avgHours: 61, hue: 28,
    counts: { positive: 7560, mixed: 1120, negative: 440 },
    quotes: [
      { author: 'winter_logistics', hours: 240, text: 'The supply screen is the best designed UI I have used all year.', helpful: 604 },
      { author: 'pale_marshal', hours: 31, text: 'Slow, punishing, and completely fair. I lost a campaign to my own greed.', helpful: 211 },
    ],
    min: spec('Windows 10 64-bit', 'Ryzen 5 1600 / i5-8400', '8 GB RAM', 'GTX 1050 Ti', '20 GB available space'),
    rec: spec('Windows 11 64-bit', 'Ryzen 7 3700X / i7-10700', '16 GB RAM', 'RTX 2070', '20 GB SSD'),
  },
  {
    id: 'neon-drift', title: 'Neon Drift Override',
    tagline: 'Street racing with the safety systems removed.',
    description: 'Nine districts, one unlicensed circuit, and a handling model that rewards braking later than you think is possible. Time trials, ghost duels, and a garage you actually have to earn.',
    genres: ['Racing', 'Action'], price: 24.99, discount: 55, released: '2025-06-20',
    players: 27440, score: 82, reviews: 6410, avgHours: 22, hue: 288,
    counts: { positive: 4980, mixed: 980, negative: 450 },
    quotes: [
      { author: 'apex_ghost', hours: 74, text: 'Ghost racing against the top 100 in my district is the entire reason I log in.', helpful: 289 },
      { author: 'brake_late', hours: 12, text: 'Handling is brilliant. Controller vibration could be better.', helpful: 96 },
    ],
    min: spec('Windows 10 64-bit', 'Ryzen 5 2600 / i5-9600K', '8 GB RAM', 'GTX 1660', '40 GB available space'),
    rec: spec('Windows 11 64-bit', 'Ryzen 7 5800X / i7-12700', '16 GB RAM', 'RTX 3070 Ti', '40 GB SSD'),
  },
  {
    id: 'deep-signal', title: 'Deep Signal',
    tagline: 'Submarine survival with no weapons and no map.',
    description: 'You have one sonar ping per minute and a hull that is losing pressure. Solve the trench by sound alone, and decide which crew member to leave behind.',
    genres: ['Survival', 'Horror'], price: 14.99, discount: 0, released: '2024-08-09',
    players: 3120, score: 89, reviews: 4270, avgHours: 17, hue: 196,
    counts: { positive: 3690, mixed: 420, negative: 160 },
    quotes: [
      { author: 'hull_9', hours: 41, text: 'The scariest game I have played in years and there is not a single monster in it.', helpful: 512 },
      { author: 'quiet_ping', hours: 6, text: 'Short, tense, and it ends the moment you decide to surface.', helpful: 143 },
    ],
    min: spec('Windows 10 64-bit', 'Ryzen 3 3200G / i3-10100', '8 GB RAM', 'GTX 1050', '12 GB available space'),
    rec: spec('Windows 11 64-bit', 'Ryzen 5 5600 / i5-12400', '16 GB RAM', 'RTX 2060', '12 GB SSD'),
  },
  {
    id: 'hardlight', title: 'Hardlight Arena',
    tagline: 'Free 5v5 with no unlockable paywalls.',
    description: 'A team shooter built around one rule: every player gets the same loadout every round. Ranked seasons, replay export, and a dedicated server browser.',
    genres: ['Shooter', 'Action'], price: 0, discount: 0, released: '2025-01-22',
    players: 98120, score: 74, reviews: 22410, avgHours: 88, hue: 208,
    counts: { positive: 14890, mixed: 5120, negative: 2400 },
    quotes: [
      { author: 'no_paywall', hours: 310, text: 'The only free shooter where my rank actually means something.', helpful: 878 },
      { author: 'queue_04', hours: 27, text: 'Queue times are long off-peak. Match quality is worth the wait.', helpful: 205 },
    ],
    min: spec('Windows 10 64-bit', 'Ryzen 3 3300X / i5-7600', '8 GB RAM', 'GTX 1060 3GB', '30 GB available space'),
    rec: spec('Windows 11 64-bit', 'Ryzen 5 5600X / i7-9700K', '16 GB RAM', 'RTX 2070', '30 GB SSD'),
  },
  {
    id: 'pale-meridian', title: 'Pale Meridian',
    tagline: 'An open world with the fast travel turned off.',
    description: 'Walk a continent that keeps records of everything you took from it. Reputation is regional, death costs progress, and the story is what the map remembers.',
    genres: ['RPG', 'Action'], price: 49.99, discount: 25, released: '2024-05-30',
    players: 18703, score: 84, reviews: 15680, avgHours: 112, hue: 152,
    counts: { positive: 12540, mixed: 2210, negative: 930 },
    quotes: [
      { author: 'on_foot', hours: 402, text: 'I have 400 hours and I still find new valleys. No waypoints, no markers, just consequences.', helpful: 1020 },
      { author: 'ledger_rpg', hours: 55, text: 'The inventory bookkeeping is punishing in the good way.', helpful: 344 },
    ],
    min: spec('Windows 10 64-bit', 'Ryzen 5 3600 / i7-8700K', '12 GB RAM', 'RTX 2060', '70 GB available space'),
    rec: spec('Windows 11 64-bit', 'Ryzen 7 7700X / i7-13700K', '16 GB RAM', 'RTX 4070', '70 GB SSD'),
  },
  {
    id: 'sable-circuit', title: 'Sable Circuit',
    tagline: 'Deckbuilding where every card costs you a limb.',
    description: 'A roguelike card run with no health bar: your hand is your body. Discard a card and you lose the ability it stands for, permanently, for the rest of the run.',
    genres: ['Roguelike', 'Strategy'], price: 19.99, discount: 0, released: '2025-02-11',
    players: 7640, score: 93, reviews: 8110, avgHours: 46, hue: 268,
    counts: { positive: 7480, mixed: 480, negative: 150 },
    quotes: [
      { author: 'limb_hand', hours: 189, text: 'Best roguelike of the year. Every discard is a real decision.', helpful: 622 },
      { author: 'run_114', hours: 22, text: 'Runs are 40 minutes and I have started 114 of them.', helpful: 187 },
    ],
    min: spec('Windows 10 64-bit', 'Ryzen 3 3200G / i5-7400', '8 GB RAM', 'Intel Iris Xe', '6 GB available space'),
    rec: spec('Windows 11 64-bit', 'Ryzen 5 5600 / i5-12400', '8 GB RAM', 'GTX 1650', '6 GB SSD'),
  },
  {
    id: 'frostline', title: 'Frostline Tactics',
    tagline: 'Squad tactics on ground that freezes under you.',
    description: 'Turn-based squad combat where the terrain is an active participant: lakes freeze, thaw, and collapse mid-battle, and your squad’s heat budget decides who can hold a ridge.',
    genres: ['Strategy', 'Survival'], price: 24.99, discount: 33, released: '2024-02-27',
    players: 4180, score: 79, reviews: 3980, avgHours: 39, hue: 186,
    counts: { positive: 2990, mixed: 690, negative: 300 },
    quotes: [
      { author: 'heat_budget', hours: 96, text: 'Fighting on a frozen lake that gives way under the heavy unit is peak tactical design.', helpful: 355 },
      { author: 'ridge_hold', hours: 14, text: 'Steep learning curve, but the tutorials finally explain overwatch.', helpful: 121 },
    ],
    min: spec('Windows 10 64-bit', 'Ryzen 5 1600 / i5-8400', '8 GB RAM', 'GTX 1050 Ti', '18 GB available space'),
    rec: spec('Windows 11 64-bit', 'Ryzen 7 3700X / i7-10700', '16 GB RAM', 'RTX 2060', '18 GB SSD'),
  },
  {
    id: 'rust-ruin', title: 'Rust & Ruin',
    tagline: 'Co-op scavenging in a city that is still burning.',
    description: 'Four players, one truck, and a shrinking grid of salvage. Extraction is optional, cargo is heavy, and the fire front moves on its own schedule.',
    genres: ['Survival', 'Action'], price: 19.99, discount: 50, released: '2023-10-17',
    players: 15320, score: 76, reviews: 11240, avgHours: 74, hue: 12,
    counts: { positive: 7980, mixed: 2260, negative: 1000 },
    quotes: [
      { author: 'four_trucks', hours: 260, text: 'Our crew has been running the same map for two years and it still surprises us.', helpful: 480 },
      { author: 'extraction_late', hours: 18, text: 'Server queue for the night shift, otherwise flawless co-op.', helpful: 132 },
    ],
    min: spec('Windows 10 64-bit', 'Ryzen 5 2600 / i5-9400F', '10 GB RAM', 'GTX 1070', '35 GB available space'),
    rec: spec('Windows 11 64-bit', 'Ryzen 7 5800X / i7-12700K', '16 GB RAM', 'RTX 3070', '35 GB SSD'),
  },
  {
    id: 'hyperion-fall', title: 'Hyperion Fall',
    tagline: 'One descent. No checkpoints. No undo.',
    description: 'A single continuous descent through a collapsing arcology, played in one take. The game saves nothing but your run number and the corpse count you left behind.',
    genres: ['Action', 'Roguelike'], price: 9.99, discount: 0, released: '2025-04-02',
    players: 6040, score: 88, reviews: 5310, avgHours: 12, hue: 42,
    counts: { positive: 4620, mixed: 480, negative: 210 },
    quotes: [
      { author: 'one_take', hours: 63, text: 'Ninety minutes, no saves, no mercy. I have never been so glad to reach the bottom.', helpful: 398 },
      { author: 'run_no_9', hours: 4, text: 'Brutal to a fault. That is the point.', helpful: 116 },
    ],
    min: spec('Windows 10 64-bit', 'Ryzen 3 3200G / i5-6500', '8 GB RAM', 'GTX 1050', '10 GB available space'),
    rec: spec('Windows 11 64-bit', 'Ryzen 5 5600 / i5-12400', '8 GB RAM', 'GTX 1660', '10 GB SSD'),
  },
  {
    id: 'null-sector', title: 'Null Sector Zero',
    tagline: 'Extraction shooter for people who like maps.',
    description: 'Three-faction extraction warfare with a live territory map that players change every season. Full weapon gunsmithing and no aim assist, ever.',
    genres: ['Shooter', 'Survival'], price: 39.99, discount: 20, released: '2024-09-13',
    players: 54980, score: 71, reviews: 27410, avgHours: 143, hue: 232,
    counts: { positive: 16380, mixed: 7120, negative: 3910 },
    quotes: [
      { author: 'territory_map', hours: 611, text: 'The season map wars are the reason I still have this installed.', helpful: 1420 },
      { author: 'gunsmith_77', hours: 88, text: 'Gunsmithing is unmatched. Matchmaking at high levels needs work.', helpful: 402 },
    ],
    min: spec('Windows 10 64-bit', 'Ryzen 5 2600 / i5-9600K', '12 GB RAM', 'GTX 1070 Ti', '60 GB available space'),
    rec: spec('Windows 11 64-bit', 'Ryzen 7 7700X / i7-13700K', '16 GB RAM', 'RTX 4070', '60 GB SSD'),
  },
  {
    id: 'lantern-deep', title: 'Lantern of the Deep',
    tagline: 'A fishing sim with a horror debt.',
    description: 'Sell the catch, feed the town, and pay what the water asked for. Calm loops, a slow calendar, and one night per season you do not go back out.',
    genres: ['Survival', 'Horror'], price: 9.99, discount: 0, released: '2024-12-03',
    players: 2410, score: 85, reviews: 3140, avgHours: 28, hue: 168,
    counts: { positive: 2710, mixed: 320, negative: 110 },
    quotes: [
      { author: 'harbour_ledger', hours: 88, text: 'Cozy for 40 days and then the game collects. I have replayed it three times.', helpful: 265 },
      { author: 'night_one', hours: 11, text: 'That one night per season is worth the whole price.', helpful: 98 },
    ],
    min: spec('Windows 10 64-bit', 'Ryzen 3 3200G / i5-7400', '8 GB RAM', 'Intel UHD 630', '8 GB available space'),
    rec: spec('Windows 11 64-bit', 'Ryzen 5 5600 / i5-12400', '8 GB RAM', 'GTX 1650', '8 GB SSD'),
  },
  {
    id: 'tidebreakers', title: 'Tidebreakers',
    tagline: 'Naval auto-battler with a real tide chart.',
    description: 'Build a fleet, read the tide, and commit. Waves move on a live hourly clock, so a fleet that wins at dawn may not be able to reach the strait at dusk.',
    genres: ['Strategy', 'Roguelike'], price: 14.99, discount: 35, released: '2025-05-08',
    players: 5120, score: 80, reviews: 2870, avgHours: 52, hue: 214,
    counts: { positive: 2210, mixed: 470, negative: 190 },
    quotes: [
      { author: 'dawn_fleet', hours: 141, text: 'The tide clock makes every run a scheduling puzzle. Genuinely new.', helpful: 311 },
      { author: 'strait_run', hours: 20, text: 'Match resolution can be slow. Planning is the fun part anyway.', helpful: 87 },
    ],
    min: spec('Windows 10 64-bit', 'Ryzen 3 3300X / i5-8400', '8 GB RAM', 'GTX 1050', '14 GB available space'),
    rec: spec('Windows 11 64-bit', 'Ryzen 5 5600 / i5-12400', '16 GB RAM', 'RTX 2060', '14 GB SSD'),
  },
  {
    id: 'ironveil', title: 'Ironveil',
    tagline: 'Heavy armour, no dodging, one corridor at a time.',
    description: 'A melee action game with commitment built into the controls: once the swing starts, you are in it. Manage stamina, armour heat, and the two seconds after every hit.',
    genres: ['Action', 'RPG'], price: 59.99, discount: 15, released: '2023-08-22',
    players: 22870, score: 90, reviews: 31220, avgHours: 68, hue: 8,
    counts: { positive: 27100, mixed: 2980, negative: 1140 },
    quotes: [
      { author: 'commit_swing', hours: 344, text: 'The commitment system makes every fight feel like a decision you paid for.', helpful: 1680 },
      { author: 'armour_heat', hours: 47, text: 'Perfected my build twice. Boss variety could be higher.', helpful: 455 },
    ],
    min: spec('Windows 10 64-bit', 'Ryzen 5 3600 / i7-8700', '12 GB RAM', 'RTX 2060', '80 GB available space'),
    rec: spec('Windows 11 64-bit', 'Ryzen 7 7800X3D / i9-13900K', '16 GB RAM', 'RTX 4080', '80 GB SSD'),
  },
];

export const GAME_BY_ID: Record<string, Game> = Object.fromEntries(GAMES.map((g) => [g.id, g]));

/* Featured carousel slots on Home. */
export const FEATURED_IDS = ['voidrunner', 'ironveil', 'pale-meridian'];

/* Which rails Home shows under "Recommended by genre". */
export const FEATURED_GENRES: Genre[] = ['Shooter', 'Strategy', 'Survival'];

export type SortKey = 'score' | 'players' | 'price-asc' | 'price-desc' | 'new';
export const SORTS: { key: SortKey; label: string }[] = [
  { key: 'score', label: 'Top rated' },
  { key: 'players', label: 'Most played' },
  { key: 'new', label: 'Newest' },
  { key: 'price-asc', label: 'Price low' },
  { key: 'price-desc', label: 'Price high' },
];

export type PriceBand = 'all' | 'free' | 'under10' | 'under25';
export const PRICE_BANDS: { key: PriceBand; label: string }[] = [
  { key: 'all', label: 'Any price' },
  { key: 'free', label: 'Free' },
  { key: 'under10', label: 'Under $10' },
  { key: 'under25', label: 'Under $25' },
];

export type Profile = {
  id: string;
  gamertag: string;
  initials: string;
  bio: string;
  favouriteGenre: Genre;
  publicLibrary: boolean;
  joined: string;
  weeklyHours: number;
  owned: string[];      // ids in this library, so "owned" is a real count
};

export const PROFILE: Profile = {
  id: 'u_7741',
  gamertag: 'kestrel_0x',
  initials: 'K0',
  bio: 'Split-time shooter runner. Currently grinding Voidrunner sub-9 minute loops.',
  favouriteGenre: 'Shooter',
  publicLibrary: true,
  joined: '2019-04-11',
  weeklyHours: 26,
  owned: [
    'voidrunner', 'ashen-crown', 'neon-drift', 'deep-signal', 'hardlight', 'pale-meridian',
    'sable-circuit', 'frostline', 'rust-ruin', 'hyperion-fall', 'lantern-deep', 'ironveil',
  ],
};

/* ---------------------------------------------------------------- formatting */

export const formatPrice = (value: number): string =>
  value === 0 ? 'Free' : `$${value.toFixed(2)}`;

/* Discounted price, rounded like the store does (2 decimals). */
export const finalPrice = (price: number, discount: number): number =>
  price === 0 ? 0 : Math.round(price * (1 - discount / 100) * 100) / 100;

export const formatInt = (value: number): string => value.toLocaleString('en-US');

export const compactInt = (value: number): string =>
  value >= 1000 ? `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k` : String(value);

/* Review band wording derives from the same value the score numerals show. */
export const scoreBand = (score: number): string => {
  if (score >= 95) return 'Overwhelmingly positive';
  if (score >= 80) return 'Very positive';
  if (score >= 70) return 'Mostly positive';
  if (score >= 40) return 'Mixed';
  return 'Mostly negative';
};

export const formatDate = (iso: string): string =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

/* ---------------------------------------------------------------- filtering */

export type FilterValue = { genre: Genre | null; band: PriceBand; sort: SortKey };

const COMPARATORS: Record<SortKey, (a: Game, b: Game) => number> = {
  score: (a, b) => b.score - a.score,
  players: (a, b) => b.players - a.players,
  new: (a, b) => b.released.localeCompare(a.released),
  'price-asc': (a, b) => finalPrice(a.price, a.discount) - finalPrice(b.price, b.discount),
  'price-desc': (a, b) => finalPrice(b.price, b.discount) - finalPrice(a.price, a.discount),
};

/* Shared by Home and All games so both screens filter and sort identically. */
export function applyFilters(games: Game[], f: FilterValue): Game[] {
  const list = games.filter((g) => {
    if (f.genre && !g.genres.includes(f.genre)) return false;
    if (f.band === 'free') return g.price === 0;
    const price = finalPrice(g.price, g.discount);
    if (f.band === 'under10') return price < 10;
    if (f.band === 'under25') return price < 25;
    return true;
  });
  return [...list].sort(COMPARATORS[f.sort]);
}
