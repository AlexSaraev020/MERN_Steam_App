import type { CSSProperties } from 'react';
import { formatRating, platformLabel, type Game } from '../data/games';
import { HeartIcon } from './icons';

/** What a screen needs: the whole favourites list plus the two card actions. */
export type CardActions = {
  favourites: string[];
  onToggleFavourite: (id: string) => void;
  onOpen: (id: string) => void;
};

/** A single card knows only its own favourite flag. */
type Props = Omit<CardActions, 'favourites'> & {
  game: Game;
  favourite: boolean;
  /** Rail/grid position, printed on the generated plate when art is missing. */
  index?: number;
  /** rail = fixed width in a scrolling rail, grid = fills its column. */
  variant?: 'grid' | 'rail';
};

/* Every card is the same shape: the art box is 3:4, the ratio IGDB cuts its
   cover_big at, so a cover shows whole instead of sliced. A rail card carries no
   numbers at all — the score and the platform list live on the title page, and a long
   platform list used to push this row out of the card box. */
export default function GameCard({
  game, favourite, onToggleFavourite, onOpen, index, variant = 'grid',
}: Props) {
  const hue = { '--g-hue': game.hue } as CSSProperties;

  return (
    <article className={`arc-card ${variant === 'rail' ? 'arc-card--rail' : 'arc-card--grid'}`}>
      <div className="arc-art" style={hue}>
        {game.cover ? (
          <img src={game.cover} alt={`Cover art for ${game.title}`} width={345} height={460} loading="lazy" />
        ) : (
          <>
            <span className="arc-art-code">{index != null ? `#${String(index + 1).padStart(2, '0')}` : 'LOBBY'}</span>
            <span className="arc-art-title arc-clamp-2">{game.title}</span>
          </>
        )}

        <button
          type="button"
          className="arc-heart"
          aria-pressed={favourite}
          aria-label={favourite ? `Remove ${game.title} from favourites` : `Add ${game.title} to favourites`}
          onClick={() => onToggleFavourite(game.id)}
        >
          <HeartIcon className="arc-icon" filled={favourite} />
        </button>
      </div>

      {/* The plate covers the whole card, not just the photo: anywhere on the card
          except the heart opens the title. The heart sits in a higher layer. */}
      <button
        type="button"
        className="arc-open-plate"
        aria-label={`Open ${game.title}`}
        onClick={() => onOpen(game.id)}
      />

      <div className="arc-card-body">
        <h3 className="arc-card-title arc-clamp-2">{game.title}</h3>

        {/* Three pills, one row: a fourth wrapped under the box and was cut off there anyway. */}
        <ul className="arc-tags" aria-label="Genres">
          {game.genres.slice(0, 3).map((g) => <li key={g} className="arc-tag">{g}</li>)}
        </ul>

        {variant === 'grid' && (
          <div className="arc-card-foot">
            {/* "runs on" is dropped here: "PC + Browser runs on" plus "Free to play" is 305px
                and the narrowest card gives 260px, so the label used to clip. */}
            <p className="arc-nowrap">
              <span className="arc-num arc-num-md">{platformLabel(game.platforms)}</span>
            </p>
          </div>
        )}
      </div>
    </article>
  );
}

/* Dense list row used by the Search list view. */
export function GameRow({ game, favourite, onToggleFavourite, onOpen, index }: Props) {
  return (
    <li className="arc-row">
      <div className="arc-art arc-art--row" style={{ '--g-hue': game.hue } as CSSProperties}>
        {game.cover
          ? <img src={game.cover} alt={`Cover art for ${game.title}`} width={345} height={460} loading="lazy" />
          : <span className="arc-art-code">{String((index ?? -1) + 1).padStart(2, '0')}</span>}
        <button
          type="button"
          className="arc-open-plate"
          aria-label={`Open ${game.title}`}
          onClick={() => onOpen(game.id)}
        />
      </div>

      <div className="arc-row-main">
        <h3 className="arc-h3">
          <button type="button" className="arc-open" onClick={() => onOpen(game.id)}>
            {game.title}
          </button>
        </h3>
        <p className="arc-meta">
          {game.genres.join(' / ')} · {platformLabel(game.platforms)}
        </p>
      </div>

      <p className="arc-row-year arc-nowrap">
        <span className="arc-num arc-num-md">{game.released.slice(0, 4) || '—'}</span>
        <span className="arc-unit">released</span>
      </p>

      <div className="arc-row-actions">
        <button
          type="button"
          className="arc-heart arc-heart--inline"
          aria-pressed={favourite}
          aria-label={favourite ? `Remove ${game.title} from favourites` : `Add ${game.title} to favourites`}
          onClick={() => onToggleFavourite(game.id)}
        >
          <HeartIcon className="arc-icon" filled={favourite} />
        </button>
        {game.rating != null && <p className="arc-num arc-num-md arc-num--warm">{formatRating(game.rating)}</p>}
      </div>
    </li>
  );
}
