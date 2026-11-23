---
name: GamersLobby
subtitle: A storefront for the free-to-play catalogue, with favourites and a playtime log
description: A React and Express storefront over the free-to-play game catalogue: search and filter titles, keep favourites on the account and log the hours played per title.
category: Web platform
stack:
  - React
  - TypeScript
  - Express
  - MongoDB
  - Mongoose
  - Tailwind CSS
  - JWT
  - Render
  - Vercel
status: live
year: 2024 — present
role: Solo — interface, backend routes, session, deployment
cover: docs/portfolio/gamerslobby-store.jpg
gallery:
  - docs/portfolio/gamerslobby-search.jpg
  - docs/portfolio/gamerslobby-title.jpg
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

GamersLobby is a store view over the free-to-play game catalogue. Three screens carry it: a Store
with a featured carousel and genre rails, Search game with a filter bar and a grid or list view, and
a profile that holds the titles you hearted and the hours you logged.

Everything on screen comes from data the app actually holds. The catalogue is served by the backend
from freetogame.com; the per-title page adds the long description, the screenshots and the minimum
system requirements from the same source. There is no price, no review score and no player count
anywhere in the interface, because the feed publishes none.

## Problem

The first version was a MERN demo that showed a list of games and nothing you could do with them.
The interesting parts were missing: a session that survives a reload, favourites that live on the
account instead of in the page, and a way to keep track of what you actually played.

## Solution

The frontend is Create React App with TypeScript and Tailwind, and one hand-written stylesheet
(`src/styles/arcade.css`) that carries the whole look through `arc-*` classes and CSS custom
properties — colour ramp, type scale, spacing, radii, durations and breakpoints are tokens, not
per-component decisions.

The backend is Express with Mongoose: `/register`, `/login`, `/user/:id`, `/userUpdate`,
`/favorite` and `/rmfavorite`. Login answers with a JWT and an httpOnly cookie; the page keeps the
token in `localStorage` and decodes it to restore the session, because the cookie cannot be read
back from JavaScript.

Playtime is stored per browser under a key namespaced by the signed-in user id. The user record has
no playtime column yet, so this is a deliberate local store rather than a fake server field.

## Key features

- Featured carousel with keyboard arrows, dots, auto-advance, and a reduced-motion path
- Filter bar with genre chips derived from the fetched catalogue, plus newest / oldest / A–Z sorting
- Grid and list views over the same filtered result
- Favourites saved on the account and restored after a reload
- Hours logged per title with `+1 h` and `+5 h` buttons
- Screenshots open in a lightbox that closes on an outside click, Escape or its own button
- The whole card opens a title; the heart sits in a higher layer and keeps its own click
- Profile editor with gamertag and bio validation

## Architecture

`frontend/` builds to a static bundle on Vercel. `backend/` is TypeScript compiled with `tsc` and
run by Node on Render; `GET /api/games` fetches the catalogue from freetogame.com and returns it as
`{ popular, latestReleases }`, which the frontend de-duplicates by id into one list.

Locally the frontend calls `/api/games` relative and CRA's dev proxy forwards it, because the
deployed API's CORS allowlist answers only to `gamerslobby.vercel.app`. The per-title details call
goes to freetogame.com directly — that endpoint answers any origin.

`GET /health` exists so the free Render instance can be kept awake: a free web service spins down
after 15 minutes without inbound traffic, and the next visitor pays about a minute of wake. The
service asks its own public `/health` every four minutes.

## Challenges

The catalogue's list endpoint serves ten fields and nothing else, so every number the earlier
interface displayed had to go rather than be invented. Genre chips were rebuilt from the fetched
data because the hardcoded list could not filter ten of the genres the feed actually uses.

On the interface side the fixes were mostly measurement: a rail that overflowed its column instead
of scrolling, a focus ring clipped by the rail's own overflow box, a profile header whose content
was taller than its padding box, and a featured panel that changed shape per slide because its
release date wrapped only for some titles.

## Future

Playtime moves to the user record when the backend gains the column. The per-title details are a
candidate for a backend route so the browser talks to one origin. The JWT is signed but not verified
on the account routes — that is the known gap, and it is the first thing to close before this is
anything other than a personal project.
