# GamersLobby

A storefront over IGDB's game catalogue: browse what its members rated most, search any of its
388,273 titles, heart what you want to play, log the hours you spent on each one.

Live app: <https://gamerslobby.vercel.app> · API: <https://gamerslobby-api.onrender.com> · health: <https://gamerslobby-api.onrender.com/health>

The catalogue comes from [IGDB](https://api-docs.igdb.com/), authenticated with a Twitch app token.
The backend re-serves it so the browser talks to one origin and never sees the client secret.
IGDB is free for non-commercial use and allows 4 requests per second.

## Screens

| | |
|---|---|
| Store | featured carousel, genre rails; the three featured titles are not repeated in the rails below them |
| Search game | filter chips, sorting, grid or list view; a typed title is searched at IGDB |
| Title | name on top; left: a 16:9 media plate with the trailers and every screenshot scrolling under it, arrow keys move it; right: a card the same height as the media, with the cover, the short description, the release date, the developer, the publisher, both scores, favourites and hours; below: the long description, IGDB's similar titles and the rest of that developer's catalogue. The page waits for the media before it draws anything |
| Profile | favourites on the account, hours logged, gamertag and bio editor |

The screen you are on is written into the URL hash (`#/game/52189`), so the browser's back and
forward work and a new screen starts at its top.

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

The backend needs `IGDB_CLIENT_ID` and `IGDB_CLIENT_SECRET` — a confidential application registered on
[dev.twitch.tv](https://dev.twitch.tv/console/apps/create), which is how IGDB authenticates — and
`MONGODB_LINK` (a MongoDB connection string). Without the first two the catalogue routes answer 500;
without the third the server still starts and still serves the catalogue, but the account routes have
nowhere to write.

## Routes

`POST /register` · `POST /login` · `GET /user/:userId` · `PUT /userUpdate` · `DELETE /deleteUser/:userId` ·
`GET /api/games` · `GET /api/search?q=` · `GET /api/game/:id` · `POST /favorite` · `DELETE /rmfavorite` · `GET /health`

`/api/games` is the shelf: IGDB's 500 most-rated titles plus its 500 releases from the last 400 days.
Everything else in the 388,273-record catalogue comes back through `/api/search`, which runs IGDB's
own full-text query. IGDB has no popularity feed and `limit` caps at 500, so the shelf cannot be bigger.

The app keeps the shelf in the order its members rated most, so the Store's featured three and the
front rails are the titles with the most votes. Sorting by newest instead put the freshest uploads on
the front page, and IGDB's freshest uploads are mostly titles with one vote. Newest is a sort you can
pick, not the default.

IGDB stores a title's deluxe editions, GOTY packs and add-on modes as separate game records and marks
them inconsistently, so both routes collapse near-duplicates: a row whose title is another row's title
plus a `:` or `-` suffix is dropped, and the one members rated most survives. Nothing is hardcoded —
it reads only the titles the API returned. `/api/game/:id` runs the same rule against the title you are
looking at, so its two recommendation rails drop that title's own editions and its duplicate records.

Login answers with a JWT and an httpOnly cookie. The page also keeps the token in `localStorage` and
decodes it to restore the session, because the cookie cannot be read back from JavaScript.

Playtime lives in the browser, under a key namespaced by the signed-in user id — the user record has
no playtime column yet.

Favourites and the hours log need a signed-in account. The bar's top right shows the gamertag when
you are in and a **Log in** button when you are not, and the title page swaps its favourite button and
hours control for the way in rather than giving a visitor controls that would silently do nothing.

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
