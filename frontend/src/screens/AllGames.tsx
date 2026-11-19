import { useMemo, useState } from 'react';
import { type Route } from '../components/ArcadeNav';
import FilterBar, { DEFAULT_FILTERS, type Filters } from '../components/FilterBar';
import GameCard, { GameRow, type CardActions } from '../components/GameCard';
import { GridIcon, RowsIcon, SearchIcon } from '../components/icons';
import { applyFilters, type Game, formatInt } from '../data/games';

type Props = CardActions & {
  games: Game[];
  initialGenre?: Filters['genre'];
  onNavigate: (route: Route) => void;
};

export default function AllGames({ games, favourites, onToggleFavourite, onOpen, initialGenre, onNavigate }: Props) {
  const [filters, setFilters] = useState<Filters>({ ...DEFAULT_FILTERS, genre: initialGenre ?? null });
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const results = useMemo(() => {
    const filtered = applyFilters(games, filters);
    const q = query.trim().toLowerCase();
    return q ? filtered.filter((g) => g.title.toLowerCase().includes(q) || g.genres.some((x) => x.toLowerCase() === q)) : filtered;
  }, [games, filters, query]);

  const searching = query.trim().length > 0;

  return (
    <main id="main" className="flex flex-col gap-[var(--g-s6)] pb-[var(--g-s9)]">
      <header className="flex flex-wrap items-end justify-between gap-[var(--g-s5)] px-[var(--g-s4)] md:px-[var(--g-s6)] pt-[var(--g-s5)]">
        <div>
          <p className="arc-kicker">Catalogue · 02</p>
          <h1 className="arc-title mt-[var(--g-s1)]">All games</h1>
        </div>
        <p className="arc-num text-[clamp(38px,5vw,64px)]">
          {String(results.length).padStart(3, '0')}
          <span className="arc-unit ml-[10px]">of {String(games.length).padStart(3, '0')} titles</span>
        </p>
      </header>

      <section aria-label="Search and view" className="flex flex-wrap items-end gap-[var(--g-s4)] px-[var(--g-s4)] md:px-[var(--g-s6)]">
        <div className="flex-1 min-w-[240px]">
          <label className="arc-label block mb-[6px]" htmlFor="all-search">Search titles</label>
          <div className="relative">
            <SearchIcon className="w-5 h-5 absolute left-[12px] top-1/2 -translate-y-1/2 text-[color:var(--g-fg-3)] pointer-events-none" />
            <input
              id="all-search"
              type="search"
              className="arc-field !pl-[40px]"
              placeholder="Type a title — Enter to filter"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-end gap-[var(--g-s3)]">
          <span className="arc-label" id="all-view-label">View</span>
          <div className="flex gap-[var(--g-s2)]" role="group" aria-labelledby="all-view-label">
            <button
              type="button"
              className="arc-btn arc-icon-btn"
              aria-pressed={view === 'grid'}
              aria-label="Grid view"
              onClick={() => setView('grid')}
            >
              <GridIcon className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="arc-btn arc-icon-btn"
              aria-pressed={view === 'list'}
              aria-label="List view"
              onClick={() => setView('list')}
            >
              <RowsIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <section aria-label="Browse filters" className="px-[var(--g-s4)] md:px-[var(--g-s6)]">
        <FilterBar value={filters} onChange={setFilters} idPrefix="all" />
      </section>

      {results.length === 0 ? (
        <section className="arc-panel arc-hatch mx-[var(--g-s4)] md:mx-[var(--g-s6)] p-[var(--g-s6)] flex flex-col gap-[var(--g-s4)]">
          <h2 className="arc-h2">Nothing in this slice</h2>
          <p className="arc-body max-w-[60ch]">
            {searching
              ? <>No title matches <span className="text-[color:var(--g-acc-hi)]">“{query.trim()}”</span>. Try a shorter fragment, or drop the genre filter.</>
              : <>This genre and price band is empty. Widen the price band or clear the genre filter to see the rest of the {formatInt(games.length)} titles in the lobby.</>}
          </p>
          <div className="flex flex-wrap gap-[var(--g-s2)]">
            <button type="button" className="arc-btn" onClick={() => { setQuery(''); setFilters({ ...DEFAULT_FILTERS, sort: filters.sort }); }}>
              Clear search and filters
            </button>
            <button type="button" className="arc-btn arc-btn--solid" onClick={() => onNavigate('home')}>
              Back to Home
            </button>
          </div>
        </section>
      ) : view === 'grid' ? (
        <ul className="arc-offset arc-stagger grid gap-[var(--g-s5)] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 px-[var(--g-s4)] md:px-[var(--g-s6)] list-none">
          {results.map((g, i) => (
            <li key={g.id}>
              <GameCard game={g} index={i} favourite={favourites.includes(g.id)} onToggleFavourite={onToggleFavourite} onOpen={onOpen} />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="arc-stagger flex flex-col gap-[var(--g-s2)] px-[var(--g-s4)] md:px-[var(--g-s6)] list-none">
          {results.map((g, i) => (
            <GameRow key={g.id} game={g} index={i} favourite={favourites.includes(g.id)} onToggleFavourite={onToggleFavourite} onOpen={onOpen} />
          ))}
        </ul>
      )}
    </main>
  );
}
