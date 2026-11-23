# GamersLobby

A storefront for the free-to-play game catalogue: browse it, heart what you want to play, log the
hours you spent on each title.

Live app: <https://gamerslobby.vercel.app> · API: <https://gamerslobby-api.onrender.com> · health: <https://gamerslobby-api.onrender.com/health>

The catalogue comes from [freetogame.com](https://www.freetogame.com/api-doc). The backend re-serves
it so the browser talks to one origin.

## Screens

| | |
|---|---|
| Store | featured carousel, genre rails |
| Search game | filter chips, sorting, grid or list view |
| Title | description, screenshots (lightbox), minimum requirements, hours control |
| Profile | favourites on the account, hours logged, gamertag and bio editor |

## Layout

```
gamers-lobby/
├── frontend/   Create React App + TypeScript + Tailwind
│   └── src/styles/arcade.css   the whole look, one file
└── backend/    Express + Mongoose, TypeScript compiled with tsc
```

## Run it locally

```powershell
npm --prefix backend install
npm --prefix backend run dev
```

```powershell
npm --prefix frontend install
npm --prefix frontend run start
```

Frontend on `http://localhost:3000`, backend on `http://localhost:3001` (`PORT` overrides it).

`frontend/.env.local` sets `REACT_APP_SERVER_LINK=` empty on purpose: the requests then go to
`/api/games` relative and CRA's dev proxy (`frontend/package.json`) forwards them to the deployed
API, whose CORS allowlist answers only to `gamerslobby.vercel.app` and refuses `localhost`.

The backend needs `MONGODB_LINK` (a MongoDB connection string). Without it the server still starts
and still serves `/api/games`, but the account routes have nowhere to write.

## Routes

`POST /register` · `POST /login` · `GET /user/:userId` · `PUT /userUpdate` · `DELETE /deleteUser/:userId` ·
`GET /api/games` · `POST /favorite` · `DELETE /rmfavorite` · `GET /health`

Login answers with a JWT and an httpOnly cookie. The page also keeps the token in `localStorage` and
decodes it to restore the session, because the cookie cannot be read back from JavaScript.

Playtime lives in the browser, under a key namespaced by the signed-in user id — the user record has
no playtime column yet.

## Keeping the backend awake

Render's free web service spins down after 15 minutes without inbound traffic, and the wake costs
the next visitor about a minute. Two things stop that:

- the service asks its own public `/health` every 4 minutes (`backend/src/index.ts`, gated on
  `RENDER=true` and `RENDER_EXTERNAL_URL`)
- an external cron hitting <https://gamerslobby-api.onrender.com/health> works too, and is the
  fallback if Render ever stops counting a service's own requests as inbound

## Known gaps

The JWT is signed but not verified on the account routes, and `/register` and `/userUpdate` return
the stored bcrypt hash. Fine for a personal project, not for anything else.
