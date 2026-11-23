import { useMemo, useState } from 'react';
import { type Route } from '../components/ArcadeNav';
import FilterBar, { DEFAULT_FILTERS, type Filters } from '../components/FilterBar';
import GameCard, { GameRow, type CardActions } from '../components/GameCard';
import { GridIcon, RowsIcon, SearchIcon } from '../components/icons';
import { applyFilters, genreFacets, type Game } from '../data/games';

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
    <main id="main" className="arc-main">
      <header className="arc-wrap arc-page-head">
        <div>
          <p className="arc-meta">Free-to-play catalogue</p>
          <h1 className="arc-title">Search game</h1>
        </div>
        {/* Same rule as the Store: a count only when something is actually filtered. */}
        {(filters.genre || searching) && (
          <p className="arc-count">
            <span className="arc-num arc-num-xl arc-num--warm">{String(results.length).padStart(3, '0')}</span>
            <span className="arc-unit">titles</span>
          </p>
        )}
      </header>

      <section aria-label="Search and view" className="arc-wrap arc-search-bar">
        <div className="arc-search-field">
          <label className="arc-label" htmlFor="all-search">Search titles</label>
          <div className="arc-field-shell">
            <SearchIcon className="arc-icon" />
            <input
              id="all-search"
              type="search"
              className="arc-field arc-field--icon"
              placeholder="Type a title — filters as you type"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="arc-view-toggle">
          <span className="arc-label" id="all-view-label">View</span>
          <div className="arc-view-group" role="group" aria-labelledby="all-view-label">
            <button
              type="button"
              className="arc-btn arc-icon-btn"
              aria-pressed={view === 'grid'}
              aria-label="Grid view"
              onClick={() => setView('grid')}
            >
              <GridIcon className="arc-icon" />
            </button>
            <button
              type="button"
              className="arc-btn arc-icon-btn"
              aria-pressed={view === 'list'}
              aria-label="List view"
              onClick={() => setView('list')}
            >
              <RowsIcon className="arc-icon" />
            </button>
          </div>
        </div>
      </section>

      <section aria-label="Browse filters" className="arc-wrap">
        <FilterBar value={filters} onChange={setFilters} genres={genreFacets(games)} idPrefix="all" />
      </section>

      {results.length === 0 ? (
        <section className="arc-wrap">
          <div className="arc-panel arc-stack arc-empty">
            <h2 className="arc-h2">Nothing in this slice</h2>
            <p className="arc-body">
              {searching
                ? <>No title matches <span className="arc-strong">“{query.trim()}”</span>. Try a shorter fragment, or clear the genre filter.</>
                : <>No title in the catalogue carries that genre right now. Clear the genre filter to see every title.</>}
            </p>
            <div className="arc-view-group">
              <button type="button" className="arc-btn" onClick={() => { setQuery(''); setFilters({ ...DEFAULT_FILTERS, sort: filters.sort }); }}>
                Clear search and filters
              </button>
              <button type="button" className="arc-btn arc-btn--solid" onClick={() => onNavigate('home')}>
                Back to Store
              </button>
            </div>
          </div>
        </section>
      ) : view === 'grid' ? (
        <>
          <h2 className="arc-h2 arc-wrap">Results</h2>
          <ul className="arc-wrap arc-grid arc-stagger">
            {results.map((g, i) => (
              <li key={g.id}>
                <GameCard game={g} index={i} favourite={favourites.includes(g.id)} onToggleFavourite={onToggleFavourite} onOpen={onOpen} />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <h2 className="arc-h2 arc-wrap">Results</h2>
          <ul className="arc-wrap arc-list arc-stagger">
            {results.map((g, i) => (
              <GameRow key={g.id} game={g} index={i} favourite={favourites.includes(g.id)} onToggleFavourite={onToggleFavourite} onOpen={onOpen} />
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
