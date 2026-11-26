import { useEffect, useRef, useState, type ComponentType, type SVGProps } from 'react';
import { GamepadIcon, GridIcon, UserIcon } from './icons';

export type Route = 'home' | 'games' | 'game' | 'profile';

type Props = {
  route: Route;
  onNavigate: (route: Route) => void;
  gamertag: string;
  signedIn: boolean;
};

const ITEMS: { route: Route; label: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { route: 'home', label: 'Store', Icon: GamepadIcon },
  { route: 'games', label: 'Search', Icon: GridIcon },
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
export default function ArcadeNav({ route, onNavigate, gamertag, signedIn }: Props) {
  /* One underline for the whole list rather than one per word: it is moved under the current
     word, so switching tabs slides it across instead of redrawing in place. */
  const inner = useRef<HTMLDivElement>(null);
  const [mark, setMark] = useState<{ x: number; w: number } | null>(null);
  useEffect(() => {
    const box = inner.current;
    if (!box) return;
    const place = () => {
      const a = box.querySelector<HTMLElement>('[aria-current="page"]');
      /* Below 1024px this bar is display:none and the word measures 0 wide; the bottom tab bar
         carries its own mark there. */
      if (!a || !a.offsetWidth) return setMark(null);
      const own = box.getBoundingClientRect(), at = a.getBoundingClientRect();
      setMark({ x: at.left - own.left, w: at.width });
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(box);
    return () => ro.disconnect();
  }, [route]);

  return (
    <>
      <a href="#main" className="arc-skip">Skip to content</a>

      <nav aria-label="Main" className="arc-nav">
        <div className="arc-nav-inner" ref={inner}>
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

          {mark && (
            <span
              className="arc-nav-mark"
              aria-hidden="true"
              style={{ transform: `translateX(${mark.x}px)`, width: `${mark.w}px` }}
            />
          )}

          {/* A signed-in name or the way in — the profile screen is where signing in happens. */}
          <div className="arc-session">
            {signedIn
              ? <p className="arc-session-tag">{gamertag}</p>
              : <button type="button" className="arc-navlink" onClick={() => onNavigate('profile')}>Log in</button>}
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
