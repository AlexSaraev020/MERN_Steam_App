import { useEffect, useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import ArcadeNav, { type Route } from './components/ArcadeNav';
import AllGames from './screens/AllGames';
import Auth from './screens/Auth';
import GamePage from './screens/GamePage';
import Home from './screens/Home';
import Profile from './screens/Profile';
import {
  fetchAccount, fetchGames, forgetToken, saveFavourite, savedToken, toServerUser, updateAccount, type ServerUser,
} from './actions/apiRequests';
import { type Game, type Genre, loadPlaytime, savePlaytime, toGameList, type Playtime } from './data/games';
import './styles/arcade.css';

/* The store plate runs on the real catalogue; the account plate runs on the real
   backend: /register, /login, /user/:id, /userUpdate, /favorite, /rmfavorite. The
   session is the JWT the login answers with, kept in localStorage because the server's
   own cookie is httpOnly and the page cannot read it back. Playtime is local for now —
   the user record has no column for it yet. */
export default function App() {
  const [route, setRoute] = useState<Route>('home');
  const [gameId, setGameId] = useState<string | null>(null);
  const [genreSeed, setGenreSeed] = useState<Genre | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [user, setUser] = useState<ServerUser | null>(null);
  const [favourites, setFavourites] = useState<string[]>([]);
  const [playtime, setPlaytime] = useState<Playtime>({});

  const who = user?.id ?? 'visitor';

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

  /* A token left over from an earlier visit keeps you signed in. When the account is
     gone the token goes with it. */
  useEffect(() => {
    const token = savedToken();
    if (!token) return;
    let userId = '';
    try { userId = String(jwtDecode<{ userId: string }>(token).userId); } catch { forgetToken(); return; }
    if (!userId) { forgetToken(); return; }
    fetchAccount(userId).then((r) => {
      if (!r.ok) { forgetToken(); return; }
      adopt(toServerUser(r.data));
    });
  }, []);

  useEffect(() => { setPlaytime(loadPlaytime(who)); }, [who]);

  const adopt = (account: ServerUser) => { setUser(account); setFavourites(account.favourites); };

  const navigate = (next: Route, genre?: Genre) => {
    if (genre !== undefined) setGenreSeed(genre);
    setRoute(next);
  };

  const openGame = (id: string) => {
    setGameId(id);
    setRoute('game');
  };

  /* The heart answers at once; the server decides whether it stays. */
  const toggleFavourite = (id: string) => {
    const add = !favourites.includes(id);
    setFavourites((list) => (add ? [...list, id] : list.filter((x) => x !== id)));
    if (!user) return;
    saveFavourite(user.id, Number(id), add).then((r) => {
      if (!r.ok) setFavourites((list) => (add ? list.filter((x) => x !== id) : [...list, id]));
    });
  };

  /* The control sends the hours you typed, so this adds to the running total rather
     than replacing it. A total of zero stays out of the log — no empty rows. */
  const addPlaytime = (id: string, hours: number) => {
    const delta = Math.max(0, Math.round(hours * 10) / 10);
    setPlaytime((log) => {
      const total = Math.round(((log[id] ?? 0) + delta) * 10) / 10;
      if (total === 0) return log;
      const next: Playtime = { ...log, [id]: total };
      savePlaytime(who, next);
      return next;
    });
  };

  /* /login answers with the account but without its stored bio, so the record is read
     back before the profile opens — otherwise the form starts half empty. */
  const signIn = async (account: ServerUser) => {
    const full = await fetchAccount(account.id);
    adopt(full.ok ? toServerUser(full.data) : account);
    setRoute('profile');
  };
  const signOut = () => { forgetToken(); setUser(null); setFavourites([]); setRoute('profile'); };

  const saveProfile = (next: { name: string; bio: string }) => {
    if (!user) return Promise.resolve({ ok: false as const, message: 'No account to save.' });
    return updateAccount(user.id, { userName: next.name, userDescription: next.bio }).then((r) => {
      if (r.ok) adopt(toServerUser(r.data.user));
      return r;
    });
  };

  const actions = { favourites, onToggleFavourite: toggleFavourite, onOpen: openGame };
  const library = { playtime, onAddPlaytime: addPlaytime };
  const byId = useMemo(() => Object.fromEntries(games.map((g) => [g.id, g]) as [string, Game][]), [games]);
  const game = gameId ? byId[gameId] : undefined;
  const gamertag = user?.name ?? 'visitor';
  /* With the Account section gone, signing in happens on the profile screen itself. */
  const accessScreen = (
    <Auth
      signedIn={!!user} gamertag={gamertag}
      onSignIn={signIn} onSignOut={signOut} onBrowse={() => navigate('games')}
      onOpenProfile={() => navigate('profile')}
    />
  );

  if (state !== 'ready') {
    return (
      <div className="arc-app">
        <ArcadeNav route={route} onNavigate={navigate} gamertag={gamertag} />
        <main id="main" className="arc-main">
          {state === 'loading' ? (
            <>
              <p className="arc-sr-only" role="status">Loading the catalogue from the backend…</p>
              {/* Shapes of the real thing: the plate, then the rail of cards it fills. */}
              <div className="arc-wrap" aria-hidden="true">
                <div className="arc-skeleton arc-skeleton--hero" />
              </div>
              <div className="arc-wrap arc-grid" aria-hidden="true">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="arc-card">
                    <div className="arc-skeleton arc-skeleton--art" />
                    <div className="arc-skeleton-body">
                      <div className="arc-skeleton arc-skeleton--line-lg" />
                      <div className="arc-skeleton arc-skeleton--line" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <section className="arc-wrap">
              <div className="arc-panel arc-stack--tight">
                <h1 className="arc-h2">The backend answered with nothing.</h1>
                <p className="arc-body">
                  The screens ask the backend for <span className="arc-strong">/api/games</span> — locally through the
                  dev proxy in <span className="arc-strong">package.json</span>, because the deployed API only answers
                  to <span className="arc-strong">gamerslobby.vercel.app</span>. A sleeping free instance can also
                  take half a minute to wake. Try again.
                </p>
                <div>
                  <button type="button" className="arc-btn arc-btn--solid" onClick={load}>Try again</button>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="arc-app">
      <ArcadeNav route={route} onNavigate={navigate} gamertag={gamertag} />

      {route === 'home' && <Home games={games} {...actions} onNavigate={navigate} />}

      {route === 'games' && (
        <AllGames key={genreSeed ?? 'all'} games={games} {...actions} initialGenre={genreSeed} onNavigate={navigate} />
      )}

      {route === 'game' && game && (
        <GamePage game={game} games={games} {...actions} {...library} onNavigate={navigate} />
      )}

      {route === 'profile' && (user ? (
        <Profile
          account={user} games={games} {...actions} {...library}
          onSaveAccount={saveProfile} onSignOut={signOut} onNavigate={navigate}
        />
      ) : accessScreen)}
    </div>
  );
}
