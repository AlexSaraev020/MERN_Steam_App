import { type ComponentType, type SVGProps } from 'react';
import { GamepadIcon, GridIcon, UserIcon } from './icons';

export type Route = 'home' | 'games' | 'game' | 'profile';

type Props = {
  route: Route;
  onNavigate: (route: Route) => void;
  gamertag: string;
};

const ITEMS: { route: Route; label: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { route: 'home', label: 'Store', Icon: GamepadIcon },
  { route: 'games', label: 'Search game', Icon: GridIcon },
  { route: 'profile', label: 'Profile', Icon: UserIcon },
];

const isActive = (route: Route, item: Route) =>
  item === route || (item === 'games' && route === 'game');

/* The mark is the app's own icon (public/), the same file the tab favicon uses. */
const LOGO = `${process.env.PUBLIC_URL}/gamerslobby-logo.png`;
const Brand = ({ onNavigate }: { onNavigate: (route: Route) => void }) => (
  <button type="button" onClick={() => onNavigate('home')} aria-label="Gamers Lobby — go to Store" className="arc-brand">
    <img className="arc-brand-mark" src={LOGO} alt="" width={40} height={40} />
    <span className="arc-brand-word">Gamers Lobby</span>
  </button>
);

/* Same three destinations at every width: one sticky bar on a desktop, a
   compact strip plus a bottom bar on a phone. Which one you see is decided in
   arcade.css, never by rendering a different menu. */
export default function ArcadeNav({ route, onNavigate, gamertag }: Props) {
  return (
    <>
      <a href="#main" className="arc-skip">Skip to content</a>

      <nav aria-label="Main" className="arc-nav">
        <div className="arc-nav-inner">
          <Brand onNavigate={onNavigate} />

          <ul className="arc-nav-list">
            {ITEMS.map(({ route: r, label }) => {
              const active = isActive(route, r);
              return (
                <li key={r}>
                  {/* Text only on a desktop: an icon in front of every nav word is the
                      generic look. The phone bar keeps its icons, where they carry the label. */}
                  <button
                    type="button"
                    aria-current={active ? 'page' : undefined}
                    onClick={() => onNavigate(r)}
                    className="arc-navlink"
                  >
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="arc-session">
            <p className="arc-session-tag">{gamertag}</p>
          </div>
        </div>
      </nav>

      <div className="arc-topbar">
        <Brand onNavigate={onNavigate} />
      </div>

      <nav aria-label="Main" className="arc-tabbar">
        {ITEMS.map(({ route: r, label, Icon }) => {
          const active = isActive(route, r);
          return (
            <button
              key={r}
              type="button"
              aria-current={active ? 'page' : undefined}
              onClick={() => onNavigate(r)}
              className="arc-tab"
            >
              <Icon className="arc-icon arc-icon--lg" />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
