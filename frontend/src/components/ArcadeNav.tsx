import { type ComponentType, type SVGProps } from 'react';
import { GamepadIcon, GridIcon, PlayIcon, UserIcon } from './icons';
import { formatInt } from '../data/games';

export type Route = 'home' | 'games' | 'game' | 'profile' | 'auth';

type Props = {
  route: Route;
  onNavigate: (route: Route) => void;
  online: number;
  gamertag: string;
};

const ITEMS: { route: Route; index: string; label: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { route: 'home', index: '01', label: 'Home', Icon: GamepadIcon },
  { route: 'games', index: '02', label: 'All games', Icon: GridIcon },
  { route: 'profile', index: '03', label: 'Profile', Icon: UserIcon },
  { route: 'auth', index: '04', label: 'Account', Icon: PlayIcon },
];

const isActive = (route: Route, item: Route) =>
  item === route || (item === 'games' && route === 'game');

export default function ArcadeNav({ route, onNavigate, online, gamertag }: Props) {
  return (
    <>
      <a
        href="#main"
        className="arc-skip sr-only focus:not-sr-only focus:fixed focus:top-[var(--g-s4)] focus:left-[var(--g-s4)] focus:z-50 arc-btn"
      >
        Skip to content
      </a>

      {/* Desktop: numbered index rail. */}
      <nav
        aria-label="Main"
        className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-[252px] z-40 bg-[var(--g-panel)] arc-hatch border-r border-[color:var(--g-rule)]"
      >
        <div className="flex items-end gap-[var(--g-s3)] px-[var(--g-s5)] pt-[var(--g-s6)] pb-[var(--g-s5)] border-b border-[color:var(--g-rule-soft)]">
          <span className="arc-slash" aria-hidden="true" />
          <span className="arc-title text-[28px] leading-[.95]">Gamers<br />Lobby</span>
        </div>

        <ul className="flex-1 py-[var(--g-s5)]">
          {ITEMS.map(({ route: r, index, label, Icon }) => {
            const active = isActive(route, r);
            return (
              <li key={r}>
                <button
                  type="button"
                  aria-current={active ? 'page' : undefined}
                  onClick={() => onNavigate(r)}
                  className={[
                    'group w-full flex items-center gap-[var(--g-s4)] min-h-[56px] px-[var(--g-s5)] py-[var(--g-s3)] text-left',
                    'border-l-2 transition-colors duration-200 focus-visible:outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--g-fg)]',
                    active
                      ? 'border-[color:var(--g-acc)] bg-[var(--g-panel-2)]'
                      : 'border-transparent hover:bg-[var(--g-panel-2)] hover:border-[color:var(--g-acc)]',
                  ].join(' ')}
                >
                  <span className={`arc-num arc-num-lg ${active ? 'text-[color:var(--g-acc-hi)]' : 'text-[color:var(--g-fg-3)]'}`}>
                    {index}
                  </span>
                  <span className={`arc-h3 flex-1 transition-transform duration-200 group-hover:translate-x-[3px] ${active ? 'text-[color:var(--g-fg)]' : ''}`}>
                    {label}
                  </span>
                  <Icon className={`w-5 h-5 ${active ? 'text-[color:var(--g-acc-hi)]' : 'text-[color:var(--g-fg-3)]'}`} />
                </button>
              </li>
            );
          })}
        </ul>

        <div className="px-[var(--g-s5)] py-[var(--g-s5)] border-t border-[color:var(--g-rule-soft)]">
          <p className="arc-kicker">In the lobby now</p>
          <p className="arc-num arc-num-xl mt-[var(--g-s1)] text-[color:var(--g-acc-hi)] arc-pulse">
            {formatInt(online)}
          </p>
          <p className="arc-meta mt-[var(--g-s2)]">{gamertag}</p>
        </div>
      </nav>

      {/* Mobile: brand strip on top, four-item bar pinned to the bottom. */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between gap-[var(--g-s3)] h-[56px] px-[var(--g-s4)] bg-[rgba(10,10,10,.94)] backdrop-blur-sm border-b border-[color:var(--g-rule)]">
        <span className="flex items-center gap-[var(--g-s2)]">
          <span className="arc-slash" aria-hidden="true" />
          <span className="arc-h3 text-[18px]">Gamers Lobby</span>
        </span>
        <span className="arc-meta arc-nowrap">
          <span className="arc-num arc-num-md text-[color:var(--g-acc-hi)]">{formatInt(online)}</span>
          <span className="arc-unit ml-[6px]">online</span>
        </span>
      </div>

      <nav
        aria-label="Main"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 grid grid-cols-4 bg-[var(--g-panel-2)] border-t border-[color:var(--g-rule)]"
      >
        {ITEMS.map(({ route: r, index, label, Icon }) => {
          const active = isActive(route, r);
          return (
            <button
              key={r}
              type="button"
              aria-current={active ? 'page' : undefined}
              onClick={() => onNavigate(r)}
              className={[
                'flex flex-col items-center gap-[4px] min-h-[64px] py-[var(--g-s3)]',
                'border-t-2 transition-colors duration-200 focus-visible:outline-none focus-visible:bg-[var(--g-panel)]',
                active
                  ? 'border-[color:var(--g-acc)] bg-[var(--g-panel)]'
                  : 'border-transparent hover:bg-[var(--g-panel-2)]',
              ].join(' ')}
            >
              <Icon className={`w-6 h-6 ${active ? 'text-[color:var(--g-acc-hi)]' : 'text-[color:var(--g-fg-3)]'}`} />
              <span className={`arc-meta ${active ? 'text-[color:var(--g-fg)]' : ''}`}>
                {index} {label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
