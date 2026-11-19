import type { CSSProperties } from 'react';
import {
  type Game, compactInt, finalPrice, formatInt,
} from '../data/games';
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
  /** Rail/grid position, printed as the plate code. */
  index?: number;
  /** rail = fixed snap card, grid = fills its column. */
  variant?: 'grid' | 'rail';
};

export default function GameCard({
  game, favourite, onToggleFavourite, onOpen, index, variant = 'grid',
}: Props) {
  const price = finalPrice(game.price, game.discount);
  const hue = { ['--g-hue']: game.hue } as CSSProperties;

  return (
    <article
      className={`arc-card group ${variant === 'rail' ? 'w-[290px] 2xl:w-[330px]' : 'w-full'}`}
    >
      <div className="arc-crt arc-art" style={hue}>
        {game.cover ? (
          <img src={game.cover} alt={`Cover art for ${game.title}`} width={460} height={215} loading="lazy" />
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
          <HeartIcon className="w-5 h-5" filled={favourite} />
        </button>
      </div>

      <div className="flex flex-col gap-[var(--g-s3)] p-[var(--g-s4)]">
        <div className="flex items-baseline justify-between gap-[var(--g-s3)]">
          <h3 className="arc-h3 arc-card-title">
            <button
              type="button"
              className="arc-open text-left hover:text-[color:var(--g-fg)] focus-visible:outline-none focus-visible:text-[color:var(--g-acc-hi)]"
              onClick={() => onOpen(game.id)}
            >
              {game.title}
            </button>
          </h3>
          {game.discount > 0 && (
            <span className="arc-num arc-num-md text-[color:var(--g-acc-hi)]">
              −{game.discount}<span className="arc-unit">%</span>
            </span>
          )}
        </div>

        <ul className="flex flex-wrap gap-[6px]" aria-label="Genres">
          {game.genres.map((g) => <li key={g} className="arc-tag">{g}</li>)}
        </ul>

        <div className="flex items-end justify-between gap-[var(--g-s3)] pt-[var(--g-s2)] border-t border-[var(--g-rule-soft)]">
          <p className="arc-meta arc-nowrap">
            <span className="arc-num arc-num-md text-[color:var(--g-fg-2)]">{compactInt(game.players)}</span>
            <span className="arc-unit ml-[6px]">playing</span>
          </p>
          <p className="arc-num arc-num-lg text-right">
            {game.price === 0
              ? <span>Free</span>
              : <>
                  <span className="text-[color:var(--g-fg)]">${price.toFixed(2)}</span>
                  {game.discount > 0 && (
                    <span className="arc-unit block line-through decoration-[var(--g-acc)]">${game.price.toFixed(2)}</span>
                  )}
                </>}
          </p>
        </div>
      </div>
    </article>
  );
}

/* Dense list row used by the All games list view. */
export function GameRow({ game, favourite, onToggleFavourite, onOpen, index }: Props) {
  const price = finalPrice(game.price, game.discount);
  return (
    <li className="arc-row grid-cols-[72px_1fr_auto] lg:grid-cols-[96px_1.4fr_auto_auto] lg:gap-[var(--g-s6)]">
      <div className="arc-crt arc-art" style={{ ['--g-hue']: game.hue } as CSSProperties}>
        {game.cover
          ? <img src={game.cover} alt={`Cover art for ${game.title}`} width={460} height={215} loading="lazy" />
          : <span className="arc-art-code">{String((index ?? -1) + 1).padStart(2, '0')}</span>}
      </div>

      <div className="min-w-0">
        <h3 className="arc-h3">
          <button
            type="button"
            className="arc-open text-left truncate max-w-full hover:text-[color:var(--g-acc-hi)] focus-visible:outline-none focus-visible:text-[color:var(--g-acc-hi)]"
            onClick={() => onOpen(game.id)}
          >
            {game.title}
          </button>
        </h3>
        <p className="arc-meta mt-[4px]">
          {game.genres.join(' / ')} · <span className="arc-num arc-num-md text-[color:var(--g-fg-2)]">{formatInt(game.players)}</span> playing
        </p>
      </div>

      <p className="hidden lg:block arc-num arc-num-md text-[color:var(--g-fg-3)] text-right">
        {game.score}<span className="arc-unit ml-[4px]">score</span>
      </p>

      <div className="flex items-center gap-[var(--g-s2)] justify-end">
        <button
          type="button"
          className="arc-heart !static"
          aria-pressed={favourite}
          aria-label={favourite ? `Remove ${game.title} from favourites` : `Add ${game.title} to favourites`}
          onClick={() => onToggleFavourite(game.id)}
        >
          <HeartIcon className="w-5 h-5" filled={favourite} />
        </button>
        <p className="arc-num arc-num-md w-[86px] text-right">
          {game.price === 0 ? <span>Free</span> : <>
            {game.discount > 0 && <span className="arc-unit mr-[6px] text-[color:var(--g-acc-hi)]">−{game.discount}%</span>}
            <span>${price.toFixed(2)}</span>
          </>}
        </p>
      </div>
    </li>
  );
}
