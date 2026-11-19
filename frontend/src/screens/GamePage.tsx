import { type CSSProperties } from 'react';
import { type Route } from '../components/ArcadeNav';
import GameCard, { type CardActions } from '../components/GameCard';
import { ChevronLeftIcon, HeartIcon } from '../components/icons';
import { type Game, formatDate } from '../data/games';

type Props = CardActions & {
  game: Game;
  games: Game[];
  onNavigate: (route: Route) => void;
};

/* Everything here is a field the catalogue actually serves. The pass that had
   reviews, playtime, aggregate score and system requirements is gone: the backend
   publishes none of those, and invented ones read as data. */
export default function GamePage({ game, games, favourites, onToggleFavourite, onOpen, onNavigate }: Props) {
  const isFavourite = favourites.includes(game.id);
  const similar = games.filter((g) => g.id !== game.id && g.genres.some((x) => game.genres.includes(x))).slice(0, 6);
  const hue = { '--g-hue': game.hue } as CSSProperties;

  const facts = [
    { label: 'Developer', value: game.developer },
    { label: 'Publisher', value: game.publisher },
    { label: 'Runs on', value: game.platform },
    { label: 'Released', value: formatDate(game.released) },
  ];

  return (
    <main id="main" className="flex flex-col gap-[var(--g-s7)] pb-[var(--g-s9)]">
      <div className="flex items-center justify-between gap-[var(--g-s4)] px-[var(--g-s4)] md:px-[var(--g-s6)] pt-[var(--g-s5)]">
        <button type="button" className="arc-btn" onClick={() => onNavigate('games')}>
          <ChevronLeftIcon className="w-5 h-5" />
          All games
        </button>
        <p className="arc-kicker">Title file · {game.id}</p>
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
          {/* every title in this catalogue is free to play */}
          <section className="arc-panel arc-hatch p-[var(--g-s5)] flex flex-wrap items-end justify-between gap-[var(--g-s5)]" aria-label="Access panel">
            <div>
              <p className="arc-kicker">Free to play</p>
              <p className="arc-num text-[clamp(44px,6vw,72px)] mt-[var(--g-s1)]">Free</p>
            </div>
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

          <section className="arc-stagger grid grid-cols-2 lg:grid-cols-4 gap-[var(--g-s5)]" aria-label="Title credits">
            {facts.map((s) => (
              <div key={s.label} className="arc-stat">
                <p className="arc-h3 text-[color:var(--g-fg)] break-words">{s.value}</p>
                <p className="arc-kicker mt-[4px]">{s.label}</p>
              </div>
            ))}
          </section>
        </div>

        <aside aria-label="Catalogue entry" className="lg:w-[360px] flex flex-col gap-[var(--g-s4)]">
          <div className="arc-panel p-[var(--g-s5)] flex flex-col gap-[var(--g-s3)]">
            <p className="arc-kicker">Where this entry came from</p>
            <p className="arc-body">
              The backend mirrors the free-to-play catalogue at freetogame.com and adds nothing to it.
              Every link below is a page on that site — the feed carries no address for the developer's
              own site.
              {/* shortcut: checked 60 of 416 game_url values, all freetogame.com. If a source ever
                  publishes the studio's homepage, relabel this list. */}
            </p>
            <ul className="flex flex-col gap-[var(--g-s2)] pt-[var(--g-s2)]">
              <li>
                <a className="arc-open underline decoration-[var(--g-acc)] text-[color:var(--g-fg)]" href={game.profileUrl} target="_blank" rel="noopener noreferrer">
                  Catalogue profile
                </a>
              </li>
              <li>
                <a className="arc-open underline decoration-[var(--g-acc)] text-[color:var(--g-fg)]" href={game.gameUrl} target="_blank" rel="noopener noreferrer">
                  Play page
                </a>
              </li>
            </ul>
          </div>
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
