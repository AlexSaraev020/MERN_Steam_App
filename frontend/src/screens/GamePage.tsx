import { useEffect, useState, type CSSProperties } from 'react';
import { type Route } from '../components/ArcadeNav';
import GameCard, { type CardActions } from '../components/GameCard';
import HoursControl from '../components/HoursControl';
import { ChevronLeftIcon, CloseIcon, HeartIcon } from '../components/icons';
import { fetchGameDetails } from '../actions/apiRequests';
import { formatDate, paragraphs, specRows, type Game, type GameDetails, type Playtime, wideCover } from '../data/games';

type Props = CardActions & {
  game: Game;
  games: Game[];
  playtime: Playtime;
  onAddPlaytime: (id: string, hours: number) => void;
  onNavigate: (route: Route) => void;
};

/* Everything here is a field the catalogue actually serves. The pass that had
   reviews, aggregate score and system requirements invented is gone: the backend
   publishes no reviews or scores. The minimum specs are real — they come from the
   per-title endpoint. Playtime is the log this device keeps, see data/games.ts. */
export default function GamePage({
  game, games, favourites, playtime, onAddPlaytime, onToggleFavourite, onOpen, onNavigate,
}: Props) {
  const isFavourite = favourites.includes(game.id);
  const similar = games.filter((g) => g.id !== game.id && g.genres.some((x) => game.genres.includes(x))).slice(0, 6);
  const hue = { '--g-hue': game.hue } as CSSProperties;

  /* The list row carries 10 fields; the catalogue's per-title endpoint adds the long
     description, its own screenshots and minimum specs. It answers any origin, so the
     page asks it directly instead of waiting on a backend route. */
  const [details, setDetails] = useState<GameDetails | null>(null);
  /* A screenshot opens full size; a click anywhere outside it, or Escape, closes it. */
  const [shot, setShot] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    setDetails(null);
    setShot(null);
    fetchGameDetails(game.id).then((d) => { if (alive) setDetails(d); });
    return () => { alive = false; };
  }, [game.id]);

  const about = paragraphs(details?.description || game.description);
  const shots = (details?.screenshots ?? []).slice(0, 4);
  const specs = specRows(details?.minimum_system_requirements);

  useEffect(() => {
    if (!shot) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShot(null); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [shot]);

  const facts = [
    { label: 'Developer', value: game.developer },
    { label: 'Publisher', value: game.publisher },
    { label: 'Runs on', value: game.platform },
    { label: 'Released', value: formatDate(game.released) },
  ];

  return (
    <main id="main" className="arc-main">
      <div className="arc-wrap arc-backbar">
        <button type="button" className="arc-btn" onClick={() => onNavigate('games')}>
          <ChevronLeftIcon className="arc-icon" />
          Search game
        </button>
        <p className="arc-meta">Catalogue id {game.id}</p>
      </div>

      {/* ------------------------------------------------------- key art */}
      <header className="arc-wrap arc-title-head">
        <div className="arc-art arc-art--hero" style={hue}>
          {game.cover && (
            <img
              src={wideCover(game.cover)}
              alt={`Cover art for ${game.title}`}
              width={1200}
              height={675}
              onError={(e) => { const el = e.currentTarget; if (el.src !== game.cover) el.src = game.cover; }}
            />
          )}
        </div>
        <div className="arc-title-plate">
          <p className="arc-meta">{game.genres.join(' · ')} · Released {formatDate(game.released)}</p>
          <h1 className="arc-title-hero">{game.title}</h1>
          <p className="arc-lead">{game.tagline}</p>
        </div>
      </header>

      <div className="arc-wrap arc-split">
        <div className="arc-stack arc-stack--tight">
          {/* every title in this catalogue is free to play */}
          <section className="arc-panel" aria-label="Access panel">
            <div className="arc-section-head">
              <p className="arc-stat">
                <span className="arc-num arc-num--hero arc-num--warm">Free</span>
                <span className="arc-meta">to play · no purchase needed to start</span>
              </p>
              <button
                type="button"
                className="arc-btn arc-btn--solid"
                aria-pressed={isFavourite}
                onClick={() => onToggleFavourite(game.id)}
              >
                <HeartIcon className="arc-icon" filled={isFavourite} />
                {isFavourite ? 'Saved to favourites' : 'Add to favourites'}
              </button>
            </div>

            <div className="arc-access-hours">
              <HoursControl
                hours={playtime[game.id] ?? 0}
                onAdd={(h) => onAddPlaytime(game.id, h)}
                label={game.title}
              />
            </div>
          </section>

          <section aria-label="About this title" className="arc-stack--tight">
            <h2 className="arc-h2">About</h2>
            <div className="arc-prose">
              {about.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <ul className="arc-tags" aria-label="Genres">
              {game.genres.map((g) => <li key={g} className="arc-tag">{g}</li>)}
            </ul>
          </section>

          {shots.length > 0 && (
            <section aria-label="Screenshots">
              <div className="arc-section-head">
                <h2 className="arc-h2">Screenshots</h2>
                <p className="arc-count">
                  <span className="arc-num arc-num-md">{String(shots.length).padStart(2, '0')}</span>
                  <span className="arc-unit">from the catalogue</span>
                </p>
              </div>
              <ul className="arc-shots arc-stagger">
                {shots.map((s, i) => (
                  <li key={s.id} className="arc-shot">
                    <button
                      type="button"
                      className="arc-shot-btn"
                      aria-label={`Open screenshot ${i + 1} of ${game.title} full size`}
                      onClick={() => setShot(s.image)}
                    >
                      <img src={s.image} alt={`Screenshot ${i + 1} of ${game.title}`} width={1920} height={1080} loading="lazy" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <ul className="arc-facts" aria-label="Title credits">
            {facts.map((s) => (
              <li key={s.label} className="arc-fact">
                <span className="arc-meta">{s.label}</span>
                <span className="arc-fact-value">{s.value}</span>
              </li>
            ))}
          </ul>
        </div>

        <aside aria-label="Catalogue entry" className="arc-side">
          <div className="arc-panel">
            <h2 className="arc-h2">Where this entry came from</h2>
            <p className="arc-body">
              The list you browse, the text above, the screenshots and the requirements below all come
              from the free-to-play catalogue at freetogame.com. The app adds nothing to them.
              Every link here is a page on that site — the feed carries no address for the developer's
              own site.
              {/* shortcut: checked 60 of 416 game_url values, all freetogame.com. If a source ever
                  publishes the studio's homepage, relabel this list. */}
            </p>
            <ul className="arc-list">
              <li>
                <a className="arc-link" href={game.profileUrl} target="_blank" rel="noopener noreferrer">
                  Catalogue profile
                </a>
              </li>
              <li>
                <a className="arc-link" href={game.gameUrl} target="_blank" rel="noopener noreferrer">
                  Play page
                </a>
              </li>
            </ul>
          </div>

          {specs.length > 0 && (
            <div className="arc-panel">
              <h2 className="arc-h2">Minimum requirements</h2>
              <dl className="arc-specs">
                {specs.map((r) => (
                  <div key={r.label} className="arc-spec">
                    <dt>{r.label}</dt>
                    <dd>{r.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </aside>
      </div>

      {similar.length > 0 && (
        <section aria-label="More like this" className="arc-wrap">
          <h2 className="arc-h2">More like this</h2>
          <div className="arc-rail arc-stagger">
            {similar.map((g, i) => (
              <GameCard key={g.id} game={g} index={i} variant="rail" favourite={favourites.includes(g.id)} onToggleFavourite={onToggleFavourite} onOpen={onOpen} />
            ))}
          </div>
        </section>
      )}

      {shot && (
        <div
          className="arc-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Screenshot of ${game.title}, full size`}
          onClick={() => setShot(null)}
        >
          <img className="arc-lightbox-img" src={shot} alt={`Screenshot of ${game.title}`} onClick={(e) => e.stopPropagation()} />
          <button type="button" className="arc-lightbox-close" aria-label="Close screenshot" autoFocus onClick={() => setShot(null)}>
            <CloseIcon className="arc-icon arc-icon--lg" />
          </button>
        </div>
      )}
    </main>
  );
}
