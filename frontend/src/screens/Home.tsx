import { type CSSProperties, useEffect, useMemo, useState } from 'react';
import { type Route } from '../components/ArcadeNav';
import FilterBar, { DEFAULT_FILTERS, type Filters } from '../components/FilterBar';
import GameCard, { type CardActions } from '../components/GameCard';
import { ChevronLeftIcon, ChevronRightIcon, HeartIcon } from '../components/icons';
import {
  applyFilters, formatDate, formatInt, genreFacets, type Genre, type Game, wideCover,
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
  /* Featured = the three newest releases the catalogue reports. */
  const featured = useMemo(() => games.slice(0, 3), [games]);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = (delta: number) => setSlide((n) => (n + delta + featured.length) % featured.length);

  useEffect(() => {
    if (paused || reduced || featured.length < 2) return;
    const t = window.setInterval(() => setSlide((n) => (n + 1) % featured.length), CAROUSEL_MS);
    return () => window.clearInterval(t);
  }, [paused, reduced, featured.length]);

  /* ---- filter bar state: it drives the "Recommended for you" strip ---- */
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const recommendations = useMemo(() => applyFilters(games, filters), [games, filters]);

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
          <div className="arc-hero-art" style={{ '--g-hue': hero.hue } as CSSProperties}>
            {hero.cover ? (
              <img
                src={wideCover(hero.cover)}
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
            <p className="arc-lead">{hero.tagline}</p>

            <ul className="arc-tags" aria-label="Genres">
              {hero.genres.map((g) => <li key={g} className="arc-tag">{g}</li>)}
            </ul>

            <div className="arc-stats">
              <p className="arc-stat">
                <span className="arc-num arc-num-lg arc-num--warm">Free</span>
                <span className="arc-meta">to play</span>
              </p>
              <p className="arc-stat">
                <span className="arc-num arc-num-lg">{hero.platform}</span>
                <span className="arc-meta">runs on</span>
              </p>
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
            <button type="button" className="arc-open arc-link" onClick={() => onNavigate('games')}>Search game</button>.
          </p>
        ) : (
          /* A 416-card horizontal scroller is a slider nobody can use; the strip shows the
             first twelve and hands the rest to Search game, where they are a real grid. */
          <div className="arc-rail arc-stagger">
            {recommendations.slice(0, 12).map((g, i) => (
              <GameCard key={g.id} game={g} index={i} variant="rail" favourite={favourites.includes(g.id)} onToggleFavourite={onToggleFavourite} onOpen={onOpen} />
            ))}
          </div>
        )}

        {recommendations.length > 12 && (
          <p className="arc-meta">
            First 12 ·{' '}
            <button type="button" className="arc-open arc-link" onClick={() => onNavigate('games', filters.genre ?? undefined)}>
              see the rest in Search game
            </button>
          </p>
        )}
      </section>

      {/* ------------------------------------------ recommended by genre rails */}
      <section aria-label="Recommended by genre" className="arc-wrap">
        <div className="arc-stack">
          {genreRails.map((g) => {
            const inGenre = games.filter((x) => x.genres.includes(g));
            const rail = inGenre.slice(0, 6);
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
          <p className="arc-lead">Everything in here is free to play.</p>
          <button type="button" className="arc-btn arc-btn--solid" onClick={() => onNavigate('games')}>
            Browse the catalogue
          </button>
        </div>
      </section>
    </main>
  );
}
