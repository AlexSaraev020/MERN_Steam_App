import { useMemo, useState } from 'react';
import ArcadeNav, { type Route } from './components/ArcadeNav';
import AllGames from './screens/AllGames';
import Auth from './screens/Auth';
import GamePage from './screens/GamePage';
import Home from './screens/Home';
import Profile from './screens/Profile';
import { GAMES, GAME_BY_ID, type Genre, type Profile as ProfileData, PROFILE } from './data/games';
import './styles/arcade.css';

/* Demo harness: wires the five redesigned screens into one connected flow with
   local state. In the real app your router and API layer replace this file —
   the screens only need the props they already declare. */
export default function App() {
  const [route, setRoute] = useState<Route>('home');
  const [gameId, setGameId] = useState<string | null>(null);
  const [genreSeed, setGenreSeed] = useState<Genre | null>(null);
  const [favourites, setFavourites] = useState<string[]>(['sable-circuit', 'deep-signal']);
  const [profile, setProfile] = useState<ProfileData>(PROFILE);
  const [signedIn, setSignedIn] = useState(false);

  const online = useMemo(() => GAMES.reduce((sum, g) => sum + g.players, 0), []);

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
  const game = gameId ? GAME_BY_ID[gameId] : undefined;

  return (
    <div className="arc-app pt-[56px] pb-[80px] lg:pt-0 lg:pb-0 lg:pl-[252px]">
      <ArcadeNav route={route} onNavigate={navigate} online={online} gamertag={profile.gamertag} />

      {route === 'home' && <Home games={GAMES} {...actions} onNavigate={navigate} />}

      {route === 'games' && (
        <AllGames key={genreSeed ?? 'all'} games={GAMES} {...actions} initialGenre={genreSeed} onNavigate={navigate} />
      )}

      {route === 'game' && game && (
        <GamePage game={game} games={GAMES} {...actions} onNavigate={navigate} />
      )}

      {route === 'profile' && (
        <Profile
          profile={profile} games={GAMES} {...actions}
          onSaveProfile={setProfile} onNavigate={navigate}
        />
      )}

      {route === 'auth' && (
        <Auth
          online={online} titles={GAMES.length} signedIn={signedIn} gamertag={profile.gamertag}
          onSignIn={() => { setSignedIn(true); setRoute('profile'); }}
          onSignOut={() => setSignedIn(false)}
          onBrowse={() => navigate('games')}
        />
      )}
    </div>
  );
}
