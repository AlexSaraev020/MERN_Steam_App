import { type CSSProperties } from 'react';
import { type Route } from '../components/ArcadeNav';
import GameCard, { type CardActions } from '../components/GameCard';
import { ChevronLeftIcon, HeartIcon } from '../components/icons';
import {
  type Game, formatDate, finalPrice, formatInt, scoreBand,
} from '../data/games';

type Props = CardActions & {
  game: Game;
  games: Game[];
  onNavigate: (route: Route) => void;
};

const SPEC_ROWS = [
  ['Operating system', 'os'],
  ['Processor', 'cpu'],
  ['Memory', 'memory'],
  ['Graphics', 'gpu'],
  ['Storage', 'storage'],
] as const;

export default function GamePage({ game, games, favourites, onToggleFavourite, onOpen, onNavigate }: Props) {
  const price = finalPrice(game.price, game.discount);
  const isFavourite = favourites.includes(game.id);
  const total = game.counts.positive + game.counts.mixed + game.counts.negative;
  const pct = (n: number) => (total > 0 ? (n / total) * 100 : 0);
  const similar = games.filter((g) => g.id !== game.id && g.genres.some((x) => game.genres.includes(x))).slice(0, 6);
  const hue = { ['--g-hue']: game.hue } as CSSProperties;

  return (
    <main id="main" className="flex flex-col gap-[var(--g-s7)] pb-[var(--g-s9)]">
      <div className="flex items-center justify-between gap-[var(--g-s4)] px-[var(--g-s4)] md:px-[var(--g-s6)] pt-[var(--g-s5)]">
        <button type="button" className="arc-btn" onClick={() => onNavigate('games')}>
          <ChevronLeftIcon className="w-5 h-5" />
          All games
        </button>
        <p className="arc-kicker">Title file · {game.id.toUpperCase()}</p>
      </div>

      {/* ---------------------------------------------------------- cover */}
      <header className="arc-crt arc-art arc-art-wide !aspect-auto min-h-[300px] lg:min-h-[440px] relative" style={hue}>
        <div className="arc-beam" aria-hidden="true" />
        {game.cover && (
          <img src={game.cover} alt={`Cover art for ${game.title}`} width={460} height={215} />
        )}
        <div className="absolute inset-0 z-[4] bg-[linear-gradient(to_top,rgba(0,0,0,.94)_0%,rgba(0,0,0,.6)_40%,rgba(0,0,0,.2)_100%)]" aria-hidden="true" />
        <div className="arc-rise absolute z-[5] inset-x-0 bottom-0 flex flex-col gap-[var(--g-s3)] p-[var(--g-s5)] md:p-[var(--g-s7)]">
          <p className="arc-kicker">{game.genres.join(' · ')} · Released {formatDate(game.released)}</p>
          <h1 className="arc-title-hero max-w-[16ch]">{game.title}</h1>
          <p className="arc-lead max-w-[56ch]">{game.tagline}</p>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-[var(--g-s6)] px-[var(--g-s4)] md:px-[var(--g-s6)]">
        <div className="flex-1 min-w-0 flex flex-col gap-[var(--g-s6)]">
          {/* price + action block, oversized numerals */}
          <section className="arc-panel arc-hatch p-[var(--g-s5)] flex flex-wrap items-end justify-between gap-[var(--g-s5)]" aria-label="Purchase panel">
            <div>
              <p className="arc-kicker">{game.price === 0 ? 'Free to play' : 'Price now'}</p>
              <p className="arc-num text-[clamp(44px,6vw,72px)] mt-[var(--g-s1)]">
                {game.price === 0
                  ? 'Free'
                  : <>${price.toFixed(2)}{game.discount > 0 && <span className="arc-unit ml-[10px] line-through decoration-[var(--g-acc)]">${game.price.toFixed(2)}</span>}</>}
              </p>
            </div>
            {game.discount > 0 && (
              <p className="arc-num arc-num-xl text-[color:var(--g-acc-hi)]">
                −{game.discount}<span className="arc-unit ml-[6px]">off</span>
              </p>
            )}
            <div className="flex flex-wrap items-center gap-[var(--g-s2)]">
              <button
                type="button"
                className="arc-btn arc-btn--solid"
                aria-pressed={isFavourite}
                onClick={() => onToggleFavourite(game.id)}
              >
                <HeartIcon className="w-5 h-5" filled={isFavourite} />
                {isFavourite ? 'Saved to favourites' : 'Add to favourites'}
              </button>
            </div>
          </section>

          <section aria-label="About this title" className="flex flex-col gap-[var(--g-s3)]">
            <h2 className="arc-h2 flex items-center gap-[var(--g-s3)]">
              <span className="arc-slash" aria-hidden="true" />
              About
            </h2>
            <p className="arc-body max-w-[70ch]">{game.description}</p>
            <ul className="flex flex-wrap gap-[6px] pt-[var(--g-s2)]" aria-label="Genres">
              {game.genres.map((g) => <li key={g} className="arc-tag">{g}</li>)}
            </ul>
          </section>

          {/* live numbers */}
          <section className="arc-stagger grid grid-cols-2 lg:grid-cols-4 gap-[var(--g-s5)]" aria-label="Live stats">
            {[
              { label: 'Playing now', value: formatInt(game.players), accent: true },
              { label: 'Reviews', value: formatInt(game.reviews) },
              { label: 'Average playtime', value: `${game.avgHours}`, unit: 'hrs' },
              { label: 'Aggregate score', value: `${game.score}`, unit: '/100' },
            ].map((s) => (
              <div key={s.label} className="arc-stat">
                <p className={`arc-num arc-num-xl ${s.accent ? 'text-[color:var(--g-acc-hi)]' : ''}`}>
                  {s.value}{s.unit && <span className="arc-unit ml-[6px]">{s.unit}</span>}
                </p>
                <p className="arc-kicker mt-[4px]">{s.label}</p>
              </div>
            ))}
          </section>

          {/* ------------------------------------------------ system requirements */}
          <section aria-label="System requirements" className="flex flex-col gap-[var(--g-s3)]">
            <h2 className="arc-h2 flex items-center gap-[var(--g-s3)]">
              <span className="arc-slash" aria-hidden="true" />
              System requirements
            </h2>

            {/* md+ : three-column table. Small screens: stacked pairs, same data. */}
            <table className="hidden md:table w-full border-collapse">
              <thead>
                <tr className="border-b border-[color:var(--g-rule)]">
                  <th scope="col" className="arc-kicker text-left py-[var(--g-s3)] pr-[var(--g-s4)] font-normal">Component</th>
                  <th scope="col" className="arc-kicker text-left py-[var(--g-s3)] pr-[var(--g-s4)] font-normal">Minimum</th>
                  <th scope="col" className="arc-kicker text-left py-[var(--g-s3)] font-normal">Recommended</th>
                </tr>
              </thead>
              <tbody>
                {SPEC_ROWS.map(([label, key]) => (
                  <tr key={key} className="border-b border-[color:var(--g-rule-soft)]">
                    <th scope="row" className="arc-meta text-left py-[var(--g-s3)] pr-[var(--g-s4)] font-normal">{label}</th>
                    <td className="arc-body py-[var(--g-s3)] pr-[var(--g-s4)]">{game.min[key]}</td>
                    <td className="arc-body py-[var(--g-s3)] text-[color:var(--g-fg)]">{game.rec[key]}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <dl className="md:hidden flex flex-col gap-[var(--g-s4)]">
              {SPEC_ROWS.map(([label, key]) => (
                <div key={key} className="arc-panel p-[var(--g-s4)]">
                  <dt className="arc-meta">{label}</dt>
                  <dd className="arc-body mt-[var(--g-s1)]"><span className="arc-kicker mr-[8px]">Min</span>{game.min[key]}</dd>
                  <dd className="arc-body mt-[var(--g-s1)] text-[color:var(--g-fg)]"><span className="arc-kicker mr-[8px]">Rec</span>{game.rec[key]}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        {/* --------------------------------------------------------- reviews */}
        <aside aria-label="Reviews summary" className="lg:w-[360px] flex flex-col gap-[var(--g-s4)]">
          <div className="arc-panel p-[var(--g-s5)]">
            <p className="arc-kicker">Reviewer signal</p>
            <p className="arc-num text-[clamp(48px,7vw,80px)] mt-[var(--g-s1)]">
              {game.score}<span className="arc-unit ml-[8px]">/100</span>
            </p>
            <p className="arc-h3 mt-[var(--g-s2)] text-[color:var(--g-acc-hi)]">{scoreBand(game.score)}</p>

            <div className="mt-[var(--g-s5)] flex h-[14px] w-full overflow-hidden" aria-hidden="true">
              <span className="bg-[var(--g-acc)]" style={{ width: `${pct(game.counts.positive)}%` }} />
              <span className="bg-[#a1a1aa]" style={{ width: `${pct(game.counts.mixed)}%` }} />
              <span className="bg-[#52525b] shadow-[inset_0_0_0_1px_#a1a1aa]" style={{ width: `${pct(game.counts.negative)}%` }} />
            </div>
            <ul className="mt-[var(--g-s3)] flex flex-col gap-[var(--g-s1)]">
              {[
                ['Positive', game.counts.positive],
                ['Mixed', game.counts.mixed],
                ['Negative', game.counts.negative],
              ].map(([label, n]) => (
                <li key={label as string} className="flex items-baseline justify-between gap-[var(--g-s3)]">
                  <span className="arc-meta">{label}</span>
                  <span className="arc-num arc-num-md arc-nowrap">{formatInt(n as number)}<span className="arc-unit ml-[6px]">{pct(n as number).toFixed(0)}%</span></span>
                </li>
              ))}
            </ul>
          </div>

          <ul className="flex flex-col gap-[var(--g-s3)]">
            {game.quotes.map((q) => (
              <li key={q.author} className="arc-panel p-[var(--g-s4)] flex flex-col gap-[var(--g-s2)]">
                <blockquote className="arc-body">“{q.text}”</blockquote>
                <p className="arc-meta">
                  {q.author} · {q.hours} hrs · {formatInt(q.helpful)} found helpful
                </p>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {similar.length > 0 && (
        <section aria-label="More like this" className="flex flex-col gap-[var(--g-s4)] px-[var(--g-s4)] md:px-[var(--g-s6)]">
          <h2 className="arc-h2 flex items-center gap-[var(--g-s3)]">
            <span className="arc-slash" aria-hidden="true" />
            More like this
          </h2>
          <div className="arc-rail arc-stagger">
            {similar.map((g, i) => (
              <GameCard key={g.id} game={g} index={i} variant="rail" favourite={favourites.includes(g.id)} onToggleFavourite={onToggleFavourite} onOpen={onOpen} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
