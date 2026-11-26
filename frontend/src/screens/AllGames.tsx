import { useEffect, useMemo, useState } from 'react';
import { type Route } from '../components/ArcadeNav';
import FilterBar, { DEFAULT_FILTERS, type Filters } from '../components/FilterBar';
import GameCard, { GameRow, type CardActions } from '../components/GameCard';
import { GridIcon, RowsIcon, SearchIcon } from '../components/icons';
import { fetchSearch } from '../actions/apiRequests';
import { applyFilters, genreFacets, type Game } from '../data/games';

type Props = CardActions & {
  games: Game[];
  initialGenre?: Filters['genre'];
  onNavigate: (route: Route) => void;
  /** Hands the found titles to the app, so opening one can resolve it. */
  onSearched: (list: Game[]) => void;
};

export default function AllGames({ games, favourites, onToggleFavourite, onOpen, initialGenre, onNavigate, onSearched }: Props) {
  /* Search results arrive in IGDB's own relevance order; re-sorting them by date put a
     "Portals Apart" above the title you actually typed. */
  const [filters, setFilters] = useState<Filters>({ ...DEFAULT_FILTERS, sort: 'relevance', genre: initialGenre ?? null });
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  /* A typed title is searched at IGDB, not in the loaded rails — the browsable list is
     1,000 titles, the catalogue is 388,273. */
  const term = query.trim();
  const [remote, setRemote] = useState<Game[] | null>(null);
  useEffect(() => {
    if (term.length < 2) { setRemote(null); return; }
    let alive = true;
    const wait = setTimeout(() => fetchSearch(term).then((list) => { if (alive) { setRemote(list); onSearched(list); } }), 350);
    return () => { alive = false; clearTimeout(wait); };
  /* onSearched is the parent's setState — stable, so it does not re-run the search. */
  }, [term, onSearched]);

  const searching = term.length >= 2;
  const results = useMemo(() => applyFilters(remote ?? games, filters), [remote, games, filters]);

  return (
    <main id="main" className="arc-main">
      <header className="arc-wrap arc-page-head">
        <div>
          <p className="arc-meta">IGDB catalogue · 388,273 titles searchable</p>
          <h1 className="arc-title">Search</h1>
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
              placeholder="Type a title — searches IGDB's whole catalogue"
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
                ? <>IGDB has no title matching <span className="arc-strong">“{term}”</span>. Try a shorter fragment, or clear the genre filter.</>
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
