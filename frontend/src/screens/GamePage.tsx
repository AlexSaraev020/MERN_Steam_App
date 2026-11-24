import { useEffect, useState, type CSSProperties } from 'react';
import { type Route } from '../components/ArcadeNav';
import GameCard, { type CardActions } from '../components/GameCard';
import HoursControl from '../components/HoursControl';
import { CloseIcon, HeartIcon } from '../components/icons';
import { fetchGameDetails } from '../actions/apiRequests';
import { formatDate, formatInt, formatRating, lead, paragraphs, type Game, type GameDetails, type Playtime } from '../data/games';

type Props = CardActions & {
  game: Game;
  games: Game[];
  playtime: Playtime;
  signedIn: boolean;
  onAddPlaytime: (id: string, hours: number) => void;
  onNavigate: (route: Route) => void;
  /** Hands the related titles to the app, so opening one of them can resolve it. */
  onKnown: (list: Game[]) => void;
};

/** One item of the media strip. `youtube` is set on a trailer, which the plate plays. */
type Media = { key: string; label: string; thumb: string; full: string; youtube?: string };

/* Everything here is a field the catalogue actually serves. IGDB publishes no price, no system
   requirements and no user reviews — the scores shown are its member votes and its critic
   aggregate. Playtime is the log this device keeps, see data/games.ts. */
export default function GamePage({
  game, games, favourites, playtime, signedIn, onAddPlaytime, onToggleFavourite, onOpen, onNavigate, onKnown,
}: Props) {
  const isFavourite = favourites.includes(game.id);
  const hue = { '--g-hue': game.hue } as CSSProperties;

  /* The list carries what a card needs; the backend's per-title route adds the long
     description, the screenshots, the critic score and the two related lists. */
  const [details, setDetails] = useState<GameDetails | null>(null);
  /* A still on the plate opens full size; a click anywhere outside it, or Escape, closes it. */
  const [big, setBig] = useState(false);
  /* Which item of the carousel the big plate shows. */
  const [index, setIndex] = useState(0);
  useEffect(() => {
    let alive = true;
    setDetails(null);
    setBig(false);
    setIndex(0);
    fetchGameDetails(game.id).then((d) => {
      if (!alive) return;
      setDetails(d);
      /* The cards in the two rails below are not on the shelf; the app has to know them or
         clicking one says the title does not exist. */
      if (d) onKnown([...(d.similar ?? []), ...(d.byDeveloper ?? [])]);
    });
    return () => { alive = false; };
  }, [game.id, onKnown]);

  const about = paragraphs(details?.description ?? '');
  /* IGDB's own similar list when it has one; otherwise the shelf's genre neighbours, which is
     what this page did before the related route existed. */
  const similar = details?.similar?.length
    ? details.similar
    : games.filter((g) => g.id !== game.id && g.genres.some((x) => game.genres.includes(x))).slice(0, 6);
  const byDeveloper = details?.byDeveloper ?? [];

  /* What the carousel carries: the trailers IGDB links to YouTube first, then every screenshot.
     The cover is not in it — it sits in the card on the right the whole time. Nothing is capped,
     and IGDB's `artworks` array stays out: that is where a title's logo, wallpapers and box art
     all live, and it is not a set of pictures of the game. */
  const media: Media[] = [
    ...(details?.videos ?? []).map((v) => ({ key: `v${v.id}`, label: v.name, thumb: `https://img.youtube.com/vi/${v.youtube}/hqdefault.jpg`, full: '', youtube: v.youtube })),
    ...(details?.screenshots ?? []).map((s, i) => ({ key: `s${s.id}`, label: `Screenshot ${i + 1} of ${game.title}`, thumb: s.thumb, full: s.full })),
  ];
  /* A title with neither a trailer nor a screenshot still needs something on the plate. */
  const shown = media[Math.min(index, Math.max(media.length - 1, 0))]
    ?? { key: 'cover', label: `Cover art for ${game.title}`, thumb: game.cover, full: game.wide || game.cover };
  const cover = (details?.cover?.full ?? game.wide) || game.cover;
  const rating = details?.rating ?? game.rating;
  const critics = details?.criticRating ?? null;
  const members = details?.ratingCount ?? game.ratingCount;
  const ratingLabel = rating == null
    ? 'no ratings yet'
    : `rated by ${formatInt(members)} IGDB members${critics == null ? '' : ` · critics ${formatRating(critics)}`}`;

  /* Left and right move the plate, and they keep working while a picture is open big. The
     carousel is trailers first and stills after, so inside the lightbox the range is the stills
     only — an arrow never throws you onto a trailer. */
  const firstStill = media.findIndex((m) => !m.youtube);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setBig(false); return; }
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const dir = e.key === 'ArrowRight' ? 1 : -1;
      setIndex((i) => {
        if (!big) return (i + dir + media.length) % media.length;
        const lo = firstStill, hi = media.length - 1;
        const n = i + dir;
        return n < lo ? hi : n > hi ? lo : n;
      });
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [big, media.length, firstStill]);

  useEffect(() => {
    if (!big) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [big]);

  const facts = [
    { label: 'Released', value: formatDate(game.released) },
    { label: 'Developer', value: game.developer || '—' },
    { label: 'Publisher', value: game.publisher || '—' },
    { label: 'Runs on', value: game.platforms.join(' / ') || '—' },
  ];

  /* The page waits for the media. Showing the plate and the card before the screenshots and the
     trailers arrived made the layout jump twice while you were already looking at it. */
  if (!details) {
    return (
      <main id="main" className="arc-main arc-main--title" aria-busy="true">
        <div className="arc-wrap arc-title-cols">
          <div className="arc-media-col">
            <div className="arc-skeleton arc-skeleton--line-lg" />
            <div className="arc-skeleton arc-skeleton--hero" />
            <div className="arc-rail">
              {[0, 1, 2, 3, 4].map((i) => <div key={i} className="arc-skeleton arc-thumb" />)}
            </div>
          </div>
          <div className="arc-skeleton arc-title-card" />
        </div>
      </main>
    );
  }

  return (
    <main id="main" className="arc-main arc-main--title">
      {/* Name and platforms above the media, the way a store page reads them. */}
      <header className="arc-wrap arc-title-head">
        <div className="arc-title-plate">
          <h1 className="arc-title-hero">{game.title}</h1>
          <p className="arc-lead">{game.tagline}</p>
        </div>
      </header>

      {/* Left: the plate and every picture the entry carries, scrolling sideways up to the
          trailers. Right: the card, which stays where it is while the page scrolls. */}
      <div className="arc-wrap arc-title-cols">
        <div className="arc-media-col">
          <div className="arc-art arc-art--hero" style={hue}>
            {shown.youtube ? (
              <iframe
                src={`https://www.youtube.com/embed/${shown.youtube}`}
                title={`${shown.label} — ${game.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <img
                src={shown.full}
                alt={shown.label}
                width={1200}
                height={675}
                onError={(e) => { const el = e.currentTarget; if (el.src !== game.cover) el.src = game.cover; }}
              />
            )}
            {!shown.youtube && (
              <button
                type="button"
                className="arc-open-plate"
                aria-label={`Open ${shown.label} full size`}
                onClick={() => setBig(true)}
              />
            )}
          </div>

          {/* A click moves an item up to the plate instead of opening a second view. The item on
              the plate is the marked one. */}
          {media.length > 1 && (
            <div className="arc-rail" aria-label="Videos and screenshots">
              {media.map((m, i) => (
                <button
                  key={m.key}
                  type="button"
                  className="arc-thumb"
                  aria-pressed={i === Math.min(index, media.length - 1)}
                  aria-label={`Show ${m.label}`}
                  onClick={() => setIndex(i)}
                >
                  <img src={m.thumb} alt="" width={192} height={108} loading="lazy" />
                  {m.youtube && <span className="arc-thumb-play" aria-hidden="true">▶</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        <aside className="arc-title-card" aria-label={`${game.title} at a glance`}>
          <div className="arc-art arc-art--cover" style={hue}>
            <img
              src={cover}
              alt={`Cover art for ${game.title}`}
              width={640}
              height={360}
              onError={(e) => { const el = e.currentTarget; if (el.src !== game.cover) el.src = game.cover; }}
            />
          </div>
          {about.length > 0 && <p className="arc-body">{lead(about[0])}</p>}
          <ul className="arc-facts">
            {facts.map((s) => (
              <li key={s.label} className="arc-fact">
                <span className="arc-meta">{s.label}</span>
                <span className="arc-fact-value">{s.value}</span>
              </li>
            ))}
          </ul>
          <p className="arc-stat">
            <span className="arc-num arc-num--warm">{rating == null ? '—' : formatRating(rating)}</span>
            <span className="arc-meta">{ratingLabel}</span>
          </p>
          {signedIn ? (
            <>
              <button
                type="button"
                className="arc-btn arc-btn--solid"
                aria-pressed={isFavourite}
                onClick={() => onToggleFavourite(game.id)}
              >
                <HeartIcon className="arc-icon" filled={isFavourite} />
                {isFavourite ? 'Saved to favourites' : 'Add to favourites'}
              </button>
              <HoursControl hours={playtime[game.id] ?? 0} onAdd={(h) => onAddPlaytime(game.id, h)} label={game.title} />
            </>
          ) : (
            /* Favourites live on the account and the hours log is keyed by it, so a visitor gets
               the way in instead of controls that would silently do nothing. */
            <button type="button" className="arc-btn arc-btn--solid" onClick={() => onNavigate('profile')}>
              Log in to keep favourites and log hours
            </button>
          )}
        </aside>
      </div>

      <div className="arc-wrap arc-split">
        <div className="arc-stack arc-stack--tight">
          <section aria-label="About this title" className="arc-stack--tight">
            <h2 className="arc-h2">About</h2>
            <div className="arc-prose">
              {about.length === 0
                ? <p>IGDB has no description for this entry yet.</p>
                : about.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <ul className="arc-tags" aria-label="Genres">
              {game.genres.map((g) => <li key={g} className="arc-tag">{g}</li>)}
            </ul>
          </section>
        </div>

        <aside aria-label="Catalogue entry" className="arc-side">
          <div className="arc-panel">
            <h2 className="arc-h2">Where this entry came from</h2>
            <p className="arc-body">
              The list you browse, the text above, the screenshots and both scores come from IGDB.
              The app adds nothing to them: the big numeral is what IGDB members voted, the critic
              score is IGDB's aggregate of published reviews. IGDB publishes no price and no system
              requirements, so this page shows neither.
            </p>
            <ul className="arc-list">
              <li>
                <a className="arc-link" href={game.gameUrl} target="_blank" rel="noopener noreferrer">
                  Entry on IGDB
                </a>
              </li>
            </ul>
          </div>
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

      {byDeveloper.length > 0 && (
        <section aria-label="More from the same developer" className="arc-wrap">
          <h2 className="arc-h2">More from {game.developer}</h2>
          <div className="arc-rail arc-stagger">
            {byDeveloper.map((g, i) => (
              <GameCard key={g.id} game={g} index={i} variant="rail" favourite={favourites.includes(g.id)} onToggleFavourite={onToggleFavourite} onOpen={onOpen} />
            ))}
          </div>
        </section>
      )}

      {big && !shown.youtube && (
        <div
          className="arc-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${shown.label}, full size. Arrow keys move to the next one, Escape closes it.`}
          onClick={() => setBig(false)}
        >
          <img className="arc-lightbox-img" src={shown.full} alt={shown.label} onClick={(e) => e.stopPropagation()} />
          <button type="button" className="arc-lightbox-close" aria-label="Close screenshot" autoFocus onClick={() => setBig(false)}>
            <CloseIcon className="arc-icon arc-icon--lg" />
          </button>
        </div>
      )}
    </main>
  );
}
