import { type CSSProperties, useEffect, useMemo, useState } from 'react';
import { type Route } from '../components/ArcadeNav';
import FilterBar, { DEFAULT_FILTERS, type Filters } from '../components/FilterBar';
import GameCard, { type CardActions } from '../components/GameCard';
import { ChevronLeftIcon, ChevronRightIcon, HeartIcon } from '../components/icons';
import {
  applyFilters, formatDate, formatInt, type Genre, type Game,
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

  /* The three genre rails are whichever genres the catalogue actually holds most. */
  const genreRails = useMemo(() => {
    const count = new Map<Genre, number>();
    for (const g of games) for (const x of g.genres) count.set(x, (count.get(x) ?? 0) + 1);
    return Array.from(count.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([genre]) => genre);
  }, [games]);
  const hero = featured[Math.min(slide, featured.length - 1)];

  return (
    <main id="main" className="flex flex-col gap-[var(--g-s8)] pb-[var(--g-s9)]">
      {/* ------------------------------------------------ featured carousel */}
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
        className="relative"
      >
        <div className="arc-crt arc-art arc-art-wide !aspect-auto min-h-[420px] lg:min-h-[520px]" style={{ '--g-hue': hero.hue } as CSSProperties}>
          <div className="arc-beam" aria-hidden="true" />
          <div className="absolute inset-0 z-[4] bg-[linear-gradient(to_top,rgba(0,0,0,.92)_0%,rgba(0,0,0,.55)_45%,rgba(0,0,0,.25)_100%)]" aria-hidden="true" />

          <div key={hero.id} className="arc-rise relative z-[5] h-full flex flex-col justify-end gap-[var(--g-s4)] p-[var(--g-s5)] md:p-[var(--g-s7)] md:pb-[var(--g-s8)]">
            <p className="arc-kicker">
              Featured {String(slide + 1).padStart(2, '0')} / {String(featured.length).padStart(2, '0')}
              <span className="arc-unit ml-[10px]">{hero.publisher}</span>
            </p>
            <h1 className="arc-title-hero max-w-[14ch]">{hero.title}</h1>
            <p className="arc-lead arc-clamp-2 max-w-[52ch]">{hero.tagline}</p>

            <ul className="flex flex-wrap gap-[6px]" aria-label="Genres">
              {hero.genres.map((g) => <li key={g} className="arc-tag">{g}</li>)}
            </ul>

            <div className="arc-stagger flex flex-wrap items-end gap-x-[var(--g-s7)] gap-y-[var(--g-s4)] pt-[var(--g-s3)]">
              <div className="arc-stat">
                <p className="arc-num arc-num-xl">Free</p>
                <p className="arc-kicker mt-[4px]">Free to play</p>
              </div>
              <div className="arc-stat">
                <p className="arc-num arc-num-xl text-[color:var(--g-acc-hi)]">{hero.platform}</p>
                <p className="arc-kicker mt-[4px]">Runs on</p>
              </div>
              <div className="arc-stat">
                <p className="arc-num arc-num-xl">{formatDate(hero.released)}</p>
                <p className="arc-kicker mt-[4px]">Released</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-[var(--g-s3)] pt-[var(--g-s2)]">
              <button type="button" className="arc-btn arc-btn--solid" onClick={() => onOpen(hero.id)}>
                View page
              </button>
              <button
                type="button"
                className="arc-btn"
                aria-pressed={favourites.includes(hero.id)}
                onClick={() => onToggleFavourite(hero.id)}
              >
                <HeartIcon className="w-5 h-5" filled={favourites.includes(hero.id)} />
                {favourites.includes(hero.id) ? 'In favourites' : 'Add to favourites'}
              </button>
            </div>
          </div>
        </div>

        {/* carousel controls */}
        <div className="absolute z-[6] right-[var(--g-s4)] bottom-[var(--g-s4)] md:right-[var(--g-s7)] md:bottom-[var(--g-s7)] flex items-center gap-[var(--g-s2)]">
          <button type="button" className="arc-btn arc-icon-btn" aria-label="Previous featured game" onClick={() => go(-1)}>
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <ul className="flex items-center gap-[var(--g-s2)]" aria-label="Featured slides">
            {featured.map((g, i) => (
              <li key={g.id}>
                <button
                  type="button"
                  aria-label={`Show ${g.title}`}
                  aria-current={i === slide ? 'true' : undefined}
                  onClick={() => setSlide(i)}
                  className={[
                    'w-[36px] h-[10px] transition-colors duration-200 focus-visible:outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--g-fg)]',
                    i === slide ? 'bg-[var(--g-acc)]' : 'bg-[var(--g-rule)] hover:bg-[var(--g-fg-3)]',
                  ].join(' ')}
                />
              </li>
            ))}
          </ul>
          <button type="button" className="arc-btn arc-icon-btn" aria-label="Next featured game" onClick={() => go(1)}>
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* ------------------------------------------------------- filter bar */}
      <section aria-label="Browse filters" className="flex flex-col gap-[var(--g-s5)] px-[var(--g-s4)] md:px-[var(--g-s6)]">
        <div className="flex flex-wrap items-end justify-between gap-[var(--g-s4)]">
          <h2 className="arc-h2 flex items-center gap-[var(--g-s3)]">
            <span className="arc-slash" aria-hidden="true" />
            Recommended for you
          </h2>
          <p className="arc-num arc-num-lg arc-nowrap">
            {String(recommendations.length).padStart(3, '0')}
            <span className="arc-unit ml-[8px]">titles match</span>
          </p>
        </div>

        <FilterBar value={filters} onChange={setFilters} idPrefix="home" />

        {recommendations.length === 0 ? (
          <p className="arc-panel p-[var(--g-s5)] arc-body">
            No titles match <span className="text-[color:var(--g-acc-hi)]">{filters.genre ?? 'that filter'}</span>.
            Clear a filter, or browse every title from <button type="button" className="arc-open underline decoration-[var(--g-acc)] text-[color:var(--g-fg)]" onClick={() => onNavigate('games')}>All games</button>.
          </p>
        ) : (
          <div className="arc-rail arc-stagger">
            {recommendations.map((g, i) => (
              <GameCard key={g.id} game={g} index={i} variant="rail" favourite={favourites.includes(g.id)} onToggleFavourite={onToggleFavourite} onOpen={onOpen} />
            ))}
          </div>
        )}
      </section>

      {/* ------------------------------------------ recommended by genre rails */}
      <section aria-label="Recommended by genre" className="flex flex-col gap-[var(--g-s7)] px-[var(--g-s4)] md:px-[var(--g-s6)]">
        {genreRails.map((g) => {
          const inGenre = games.filter((x) => x.genres.includes(g));
          const rail = inGenre.slice(0, 6);
          return (
            <div key={g} className="flex flex-col gap-[var(--g-s4)]">
              <div className="flex flex-wrap items-end justify-between gap-[var(--g-s3)]">
                <h2 className="arc-h2 flex items-center gap-[var(--g-s3)]">
                  <span className="arc-slash" aria-hidden="true" />
                  {g}
                </h2>
                <div className="flex items-center gap-[var(--g-s5)]">
                  <p className="arc-num arc-num-md arc-nowrap">
                    {formatInt(inGenre.length)}
                    <span className="arc-unit ml-[8px]">titles in this genre</span>
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

        <div className="arc-panel arc-hatch p-[var(--g-s6)] flex flex-wrap items-end justify-between gap-[var(--g-s5)]">
          <div>
            <p className="arc-kicker">Titles in the catalogue</p>
            <p className="arc-num text-[clamp(40px,6vw,72px)] mt-[var(--g-s2)]">{formatInt(games.length)}</p>
          </div>
          <button type="button" className="arc-btn arc-btn--solid" onClick={() => onNavigate('games')}>
            Browse all {games.length} titles
          </button>
        </div>
      </section>
    </main>
  );
}
