---
name: GamersLobby
subtitle: A storefront over the IGDB game catalogue, with search, favourites and a playtime log
description: A React and Express storefront over the IGDB game catalogue: search any of its 388,273 titles, keep favourites on the account and log the hours played per title.
category: Web platform
stack:
  - React
  - TypeScript
  - Express
  - MongoDB
  - Mongoose
  - Tailwind CSS
  - JWT
  - IGDB API
  - Render
  - Vercel
status: live
year: 2024 — present
role: Solo — interface, backend routes, session, deployment
cover: docs/portfolio/gamerslobby-store.jpg
gallery:
  - docs/portfolio/gamerslobby-search.jpg
  - docs/portfolio/gamerslobby-title.jpg
  - docs/portfolio/gamerslobby-rails.jpg
  - docs/portfolio/gamerslobby-profile.jpg
live: https://gamerslobby.vercel.app
tags:
  - react
  - express
  - mongodb
  - catalogue
  - storefront
updated: 2026-11-24
---

## Overview

GamersLobby is a store view over IGDB's game catalogue. Three screens carry it: a Store with a featured
carousel and genre rails, Search with a filter bar and a grid or list view, and a profile that
holds the titles you hearted and the hours you logged. The Store shows the shelf IGDB's members rated
most; a typed title is searched at IGDB itself, so all 388,273 records are reachable, not only the
thousand on the shelf.

Everything on screen comes from IGDB: the list, the per-title description, the screenshots and both
scores. IGDB publishes no price and no player count, so the interface shows neither — the numeral on
a card is the score its members gave.

## Problem

The first version was a MERN demo that showed a list of games and nothing you could do with them.
The interesting parts were missing: a session that survives a reload, favourites that live on the
account instead of in the page, and a way to keep track of what you actually played.

The catalogue also has to come from somewhere a personal project may use for free, and the client
secret for that source cannot live in the browser.

## Solution

The frontend is Create React App with TypeScript and Tailwind, and one hand-written stylesheet
(`src/styles/arcade.css`) that carries the whole look through `arc-*` classes and CSS custom
properties — colour ramp, type scale, spacing, radii, durations and breakpoints are tokens, not
per-component decisions.

The backend is Express with Mongoose: `/register`, `/login`, `/user/:id`, `/userUpdate`, `/favorite`
and `/rmfavorite`. Login answers with a JWT and an httpOnly cookie; the page keeps the token in
`localStorage` and decodes it to restore the session, because the cookie cannot be read back from
JavaScript.

Playtime is stored per browser under a key namespaced by the signed-in user id. The user record has
no playtime column yet, so this is a deliberate local store rather than a fake server field.

## Key features

- Featured carousel with keyboard arrows, dots, auto-advance, and a reduced-motion path; the three it features are not repeated in the rails below
- The navigation bar floats off the page edges, and its one underline slides from the tab you were on to the one you picked
- Debounced search sent to IGDB's own full-text index, so a title outside the loaded shelf is found
- Filter bar with genre chips derived from the fetched catalogue, plus newest / oldest / A–Z sorting
- Grid and list views over the same filtered result
- Every card is the same shape: a 3:4 cover shown whole, two title lines, a fixed-height genre strip
- Favourites saved on the account and restored after a reload
- Hours logged per title with `+1 h` and `+5 h` buttons
- The title page is two columns: the trailers and every screenshot on the left, a card on the right with the cover, the short description, the release date, the developer and the publisher
- The title page waits for the media and shows a shimmering skeleton until the screenshots and trailers arrive
- Arrow keys move the media carousel, both on the plate and inside the full-size view
- Favourites and the hours log require a signed-in account; a visitor gets the way in instead of controls that would silently do nothing
- Related titles come from IGDB's own `similar_games` list and from a query for the same developer's other games
- The opened image fills 90% of the viewport and closes on an outside click, Escape or its own button
- The screen lives in the URL hash, so the browser's back and forward work and each screen starts at its top
- The whole card opens a title; the heart sits in a higher layer and keeps its own click
- Profile editor with gamertag and bio validation

## Architecture

`frontend/` builds to a static bundle on Vercel. `backend/` is TypeScript compiled with `tsc` and run
by Node on Render. IGDB authenticates with a Twitch application token: the backend asks
`id.twitch.tv/oauth2/token` once, caches the token in memory for its ~56-day life, and refetches it
if IGDB answers 401.

`GET /api/games` runs two Apalypse queries against `api.igdb.com/v4/games` and returns them as
`{ popular, latestReleases }`, which the frontend de-duplicates by id into one list.
`GET /api/search?q=` sends one `search` query to the same endpoint and returns up to 100 matches.
`GET /api/game/:id` adds the long description, the critic score, the media — the cover, every
screenshot and the trailers, which IGDB carries as YouTube ids, each with a strip thumbnail and a
1920-wide plate version — and the two related lists, IGDB's `similar_games` expanded into full cards
plus a second query for the same developer's other titles. The plain `GET /games/:id` endpoint does not
expand those relations, so this goes through the query endpoint. IGDB's `artworks` array is not asked
for: it holds key art, wallpapers, box art and the title's logo in one list, separated only by an
`image_type` reference.

Locally the frontend calls `/api/games` relative and CRA's dev proxy forwards it, because the
deployed API's CORS allowlist answers only to `gamerslobby.vercel.app`.

`GET /health` exists so the free Render instance can be kept awake: a free web service spins down
after 15 minutes without inbound traffic, and the next visitor pays about a minute of wake. The
service asks its own public `/health` every four minutes.

## Challenges

IGDB has no popularity feed and no free-to-play flag, and a query caps at 500 rows, so the shelf is
built from what its members actually rated: the 500 titles with the most ratings, plus the 500 released
in the last 400 days that carry at least one. Sorting by the mean score alone instead surfaces obscure
titles sitting on two perfect votes. The first cut filtered the shelf to PC, which hid Grand Theft Auto
VI — IGDB catalogues it as Xbox Series X|S and PlayStation 5 only — so the platform filter is gone and
every card shows the platforms the entry really has. IGDB also carries entries dated 2030 to 2040, so
the recent rail needs a ceiling at today's date. A search for one title returns its deluxe edition, its
Game-of-the-Year pack and its add-on mode as separate games: IGDB's own `category` field is empty on
all 388,273 records and `version_parent` covers only 8,120 of them, so the duplicates are collapsed by
comparing the returned titles against each other instead of trusting a flag. Card art is 3:4 because the
covers are: 986 of the 1,000 rows on the shelf carry a 3:4 cover and none a 16:9 one, and IGDB's image host
answers only its named presets — a request for an arbitrary crop (`c_fill,h_450,w_800`) comes back 404 — so a
wide card cannot be cut from a cover. 81 of those same 100 titles do carry a 16:9 screenshot, which is the
only dynamic route to a 16:9 card and would widen the shelf request from 157 KB to 267 KB per 100 titles.

On the interface side the fixes were mostly measurement: a rail that overflowed its column instead of
scrolling, a focus ring clipped by the rail's own overflow box, a profile header whose content was
taller than its padding box, a featured panel that changed shape per slide because its release date
wrapped only for some titles, and a featured plate that resized per slide (548 → 614 → 519 px at 1280)
until the panel was given one fixed height and its genre row a fixed box — 720 × 420 px on every slide
now. Ordering the catalogue by
newest instead of by member votes also put one-vote releases on the front page, so the shelf keeps the
order its members rated and Newest stays a sort you pick. The deployed API kept answering with the old
catalogue after the switch because Render's build command was only `npm install` while the start command
ran `node build/index.js` — a compiled `build/` folder carried in the repository and in Render's cache,
never rebuilt from `src/`. The build command now runs `tsc` and the compiled output is no longer committed.

## Future

Playtime moves to the user record when the backend gains the column. The JWT is signed but not
verified on the account routes — that is the known gap, and it is the first thing to close before
this is anything other than a personal project. IGDB allows 4 requests per second, so a real cache
of the catalogue on the backend is the next thing worth building.
