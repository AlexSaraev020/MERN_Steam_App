import { type CSSProperties, type MouseEvent, type TouchEvent, useEffect, useMemo, useRef, useState } from 'react';
import { type Route } from '../components/ArcadeNav';
import FilterBar, { DEFAULT_FILTERS, type Filters } from '../components/FilterBar';
import GameCard, { type CardActions } from '../components/GameCard';
import { ChevronLeftIcon, ChevronRightIcon, HeartIcon } from '../components/icons';
import {
  applyFilters, formatDate, formatInt, formatRating, genreFacets, type Genre, type Game,
} from '../data/games';

type Props = CardActions & {
  games: Game[];
  onNavigate: (route: Route, genre?: Genre) => void;
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const on = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

const CAROUSEL_MS = 7000;

export default function Home({ games, favourites, onToggleFavourite, onOpen, onNavigate }: Props) {
  const reduced = useReducedMotion();
  /* Featured = the first three of the catalogue, which arrives ordered by how many members rated
     each title. Taking the newest three instead put one-vote releases on the front page. */
  const featured = useMemo(() => games.slice(0, 3), [games]);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = (delta: number) => setSlide((n) => (n + delta + featured.length) % featured.length);

  /* A phone has no arrows on the plate, so the plate is swiped. The swipe is
     recognised only when it travels sideways further than it travels up, so
     scrolling the page is untouched, and the click the browser still fires at the
     end of the swipe is swallowed so a swipe does not open the title page. */
  const touch = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    const t = e.changedTouches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    const from = touch.current;
    touch.current = null;
    if (!from) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - from.x, dy = t.clientY - from.y;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    swiped.current = true;
    go(dx < 0 ? 1 : -1);
  };
  const onPlateClick = (e: MouseEvent<HTMLDivElement>) => {
    if (swiped.current) { e.stopPropagation(); swiped.current = false; }
  };

  useEffect(() => {
    /* NN/g: never auto-forward on a phone — the page is short, so by the time the
       frame changes the reader is already below it. Width is read once per run. */
    if (paused || reduced || featured.length < 2 || window.matchMedia('(max-width: 639px)').matches) return;
    const t = window.setInterval(() => setSlide((n) => (n + 1) % featured.length), CAROUSEL_MS);
    return () => window.clearInterval(t);
  }, [paused, reduced, featured.length]);

  /* ---- filter bar state: it drives the "Recommended for you" strip ---- */
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  /* The featured three are already on the plate at the top of the page, so they are not shown
     again in the rails below it. Counts and chips still come from the whole shelf. */
  const rest = useMemo(() => games.filter((g) => !featured.some((f) => f.id === g.id)), [games, featured]);
  const recommendations = useMemo(() => applyFilters(rest, filters), [rest, filters]);

  const facets = useMemo(() => genreFacets(games), [games]);
  /* The three genre rails are whichever genres the catalogue actually holds most. */
  const genreRails = facets.slice(0, 3);
  const hero = featured[Math.min(slide, featured.length - 1)];
  const heroSaved = favourites.includes(hero.id);

  return (
    <main id="main" className="arc-main">
      {/* ---------------------------------------------------- featured plate */}
      <section
        aria-label="Featured games"
        aria-roledescription="carousel"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
          if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
        }}
        className="arc-wrap"
      >
        <div className="arc-hero">
          <div
            className="arc-hero-art"
            style={{ '--g-hue': hero.hue } as CSSProperties}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onClickCapture={onPlateClick}
          >
            {hero.cover ? (
              <img
                src={hero.wide || hero.cover}
                alt={`Cover art for ${hero.title}`}
                width={1200}
                height={675}
                onError={(e) => { const el = e.currentTarget; if (el.src !== hero.cover) el.src = hero.cover; }}
              />
            ) : null}

            {/* One signature effect: a sheen crossing the plate when the slide
                changes. It is a layer, it runs once per slide, and reduced motion
                turns it off entirely. */}
            <span key={hero.id} className="arc-sheen" aria-hidden="true" />

            {/* The plate itself opens the title; the arrows and dots sit above it. */}
            <button
              type="button"
              className="arc-open-plate"
              aria-label={`Open ${hero.title}`}
              onClick={() => onOpen(hero.id)}
            />

            {/* On a phone the name is this banner and the frame count is the only
                control: no arrows, no dots. Both are hidden at 640px and above, where
                the panel beside the plate carries the words. */}
            <h1 className="arc-title-hero arc-hero-name arc-clamp-2">{hero.title}</h1>
            <p className="arc-hero-count">
              {slide + 1} / {featured.length}
            </p>

            <div className="arc-hero-nav">
              <button type="button" className="arc-btn arc-icon-btn" aria-label="Previous featured game" onClick={() => go(-1)}>
                <ChevronLeftIcon className="arc-icon" />
              </button>
              <ul className="arc-view-group" aria-label="Featured slides">
                {featured.map((g, i) => (
                  <li key={g.id}>
                    <button
                      type="button"
                      aria-label={`Show ${g.title}`}
                      aria-current={i === slide ? 'true' : undefined}
                      onClick={() => setSlide(i)}
                      className="arc-dot"
                    />
                  </li>
                ))}
              </ul>
              <button type="button" className="arc-btn arc-icon-btn" aria-label="Next featured game" onClick={() => go(1)}>
                <ChevronRightIcon className="arc-icon" />
              </button>
            </div>
          </div>

          <div key={`copy-${hero.id}`} className="arc-hero-panel arc-rise">
            <p className="arc-meta">
              Featured {String(slide + 1).padStart(2, '0')} of {String(featured.length).padStart(2, '0')} · {hero.publisher}
            </p>
            <h1 className="arc-title-hero">{hero.title}</h1>
            <p className="arc-lead arc-clamp-2">{hero.tagline}</p>

            {/* Three pills in a fixed-height row: a fourth wrapped and made the panel — and with it
                the plate — taller than the previous slide. */}
            <ul className="arc-tags arc-hero-tags" aria-label="Genres">
              {hero.genres.slice(0, 3).map((g) => <li key={g} className="arc-tag">{g}</li>)}
            </ul>

            <div className="arc-stats">
              <p className="arc-stat">
                <span className="arc-num arc-num-lg arc-num--warm">
                  {hero.rating != null ? formatRating(hero.rating) : '—'}
                </span>
                <span className="arc-meta">
                  {hero.rating != null ? `rated by ${formatInt(hero.ratingCount)} members` : 'no ratings yet'}
                </span>
              </p>
              {/* "runs on" is not repeated here: the line above the pills already lists every
                  platform, and the same list twice in two sizes is what read as inconsistent. */}
              <p className="arc-stat">
                <span className="arc-num arc-num-lg">{formatDate(hero.released)}</span>
                <span className="arc-meta">released</span>
              </p>
            </div>

            <div className="arc-hero-actions">
              <button type="button" className="arc-btn arc-btn--solid" onClick={() => onOpen(hero.id)}>
                View page
              </button>
              <button
                type="button"
                className="arc-btn"
                aria-pressed={heroSaved}
                onClick={() => onToggleFavourite(hero.id)}
              >
                <HeartIcon className="arc-icon" filled={heroSaved} />
                {heroSaved ? 'In favourites' : 'Add to favourites'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- filter bar */}
      <section aria-label="Browse filters" className="arc-wrap">
        <div className="arc-section-head">
          <h2 className="arc-h2">Recommended for you</h2>
          {/* The count is a filter readout, so it only appears once a filter is on. */}
          {filters.genre && (
            <p className="arc-count">
              <span className="arc-num arc-num-lg arc-num--warm">{String(recommendations.length).padStart(3, '0')}</span>
              <span className="arc-unit">titles match</span>
            </p>
          )}
        </div>

        <FilterBar value={filters} onChange={setFilters} genres={facets} idPrefix="home" />

        {recommendations.length === 0 ? (
          <p className="arc-panel arc-body">
            No titles match <span className="arc-strong">{filters.genre ?? 'that filter'}</span>. Clear a filter, or browse every title from{' '}
            <button type="button" className="arc-open arc-link" onClick={() => onNavigate('games')}>Search</button>.
          </p>
        ) : (
          /* A 416-card horizontal scroller is a slider nobody can use; the strip shows the
             first eight and hands the rest to Search, where they are a real grid. */
          <div className="arc-rail arc-stagger">
            {recommendations.slice(0, 8).map((g, i) => (
              <GameCard key={g.id} game={g} index={i} variant="rail" favourite={favourites.includes(g.id)} onToggleFavourite={onToggleFavourite} onOpen={onOpen} />
            ))}
          </div>
        )}

        {recommendations.length > 8 && (
          <p className="arc-meta">
            First 8 ·{' '}
            <button type="button" className="arc-open arc-link" onClick={() => onNavigate('games', filters.genre ?? undefined)}>
              see the rest in Search
            </button>
          </p>
        )}
      </section>

      {/* ------------------------------------------ recommended by genre rails */}
      <section aria-label="Recommended by genre" className="arc-wrap">
        <div className="arc-stack">
          {genreRails.map((g) => {
            const inGenre = games.filter((x) => x.genres.includes(g));
            const rail = rest.filter((x) => x.genres.includes(g)).slice(0, 6);
            return (
              <div key={g}>
                <div className="arc-section-head">
                  <h2 className="arc-h2">{g}</h2>
                  <div className="arc-view-group">
                    <p className="arc-count">
                      <span className="arc-num arc-num-md">{formatInt(inGenre.length)}</span>
                      <span className="arc-unit">titles</span>
                    </p>
                    <button type="button" className="arc-btn" onClick={() => onNavigate('games', g)}>
                      See all {g}
                    </button>
                  </div>
                </div>
                <div className="arc-rail arc-stagger">
                  {rail.map((x, i) => (
                    <GameCard key={x.id} game={x} index={i} variant="rail" favourite={favourites.includes(x.id)} onToggleFavourite={onToggleFavourite} onOpen={onOpen} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="arc-panel arc-cta-bar">
          <p className="arc-lead">The shelf is what IGDB's members rated most.</p>
          <button type="button" className="arc-btn arc-btn--solid" onClick={() => onNavigate('games')}>
            Browse the catalogue
          </button>
        </div>
      </section>
    </main>
  );
}
