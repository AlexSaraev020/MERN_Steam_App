import { useEffect, useMemo, useState } from 'react';
import ArcadeNav, { type Route } from './components/ArcadeNav';
import AllGames from './screens/AllGames';
import Auth from './screens/Auth';
import GamePage from './screens/GamePage';
import Home from './screens/Home';
import Profile from './screens/Profile';
import { fetchGames } from './actions/apiRequests';
import { type Game, type Genre, type Profile as ProfileData, PROFILE, toGameList } from './data/games';
import './styles/arcade.css';

/* The five redesigned screens, now on the real catalogue: the backend serves what
   freetogame.com publishes and nothing else, so the placeholder numbers are gone.
   The account plate is still the design study — its endpoints exist in the old
   App.tsx and get wired here in the next pass. */
export default function App() {
  const [route, setRoute] = useState<Route>('home');
  const [gameId, setGameId] = useState<string | null>(null);
  const [genreSeed, setGenreSeed] = useState<Genre | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [favourites, setFavourites] = useState<string[]>([]);
  const [profile, setProfile] = useState<ProfileData>(PROFILE);
  const [signedIn, setSignedIn] = useState(false);

  const load = () => {
    setState('loading');
    fetchGames().then((payload) => {
      const list = toGameList(payload);
      if (!list.length) { setState('failed'); return; }
      setGames(list);
      setState('ready');
    });
  };

  useEffect(() => { load(); }, []);

  const navigate = (next: Route, genre?: Genre) => {
    if (genre !== undefined) setGenreSeed(genre);
    setRoute(next);
  };

  const openGame = (id: string) => {
    setGameId(id);
    setRoute('game');
  };

  const toggleFavourite = (id: string) =>
    setFavourites((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));

  const actions = { favourites, onToggleFavourite: toggleFavourite, onOpen: openGame };
  const byId = useMemo(() => Object.fromEntries(games.map((g) => [g.id, g]) as [string, Game][]), [games]);
  const game = gameId ? byId[gameId] : undefined;

  if (state !== 'ready') {
    return (
      <div className="arc-app pt-[56px] pb-[80px] lg:pt-0 lg:pb-0 lg:pl-[252px]">
        <ArcadeNav route={route} onNavigate={navigate} online={0} gamertag={profile.gamertag} />
        <main id="main" className="flex flex-col gap-[var(--g-s4)] p-[var(--g-s6)]">
          <p className="arc-kicker">
            {state === 'loading' ? 'Loading the catalogue from the backend…' : 'The backend answered with nothing.'}
          </p>
          {state === 'failed' ? (
            <>
              <p className="arc-body max-w-[52ch]">
                The screens ask the backend for <span className="text-[color:var(--g-fg-2)]">/api/games</span> — locally through the
                dev proxy in <span className="text-[color:var(--g-fg-2)]">package.json</span>, because the deployed API only answers
                to <span className="text-[color:var(--g-fg-2)]">gamerslobby.vercel.app</span>. A sleeping free instance can also
                take half a minute to wake. Try again.
              </p>
              <button type="button" className="arc-btn arc-btn--solid w-fit" onClick={load}>Try again</button>
            </>
          ) : null}
        </main>
      </div>
    );
  }

  return (
    <div className="arc-app pt-[56px] pb-[80px] lg:pt-0 lg:pb-0 lg:pl-[252px]">
      <ArcadeNav route={route} onNavigate={navigate} online={games.length} gamertag={profile.gamertag} />

      {route === 'home' && <Home games={games} {...actions} onNavigate={navigate} />}

      {route === 'games' && (
        <AllGames key={genreSeed ?? 'all'} games={games} {...actions} initialGenre={genreSeed} onNavigate={navigate} />
      )}

      {route === 'game' && game && (
        <GamePage game={game} games={games} {...actions} onNavigate={navigate} />
      )}

      {route === 'profile' && (
        <Profile
          profile={profile} games={games} {...actions}
          onSaveProfile={setProfile} onNavigate={navigate}
        />
      )}

      {route === 'auth' && (
        <Auth
          online={games.length} titles={games.length} signedIn={signedIn} gamertag={profile.gamertag}
          onSignIn={() => { setSignedIn(true); setRoute('profile'); }}
          onSignOut={() => setSignedIn(false)}
          onBrowse={() => navigate('games')}
        />
      )}
    </div>
  );
}
