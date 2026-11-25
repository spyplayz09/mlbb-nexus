# MLBB Nexus

Public-access MLBB community dashboard built with React + Vite. The login / registration system and Supabase authentication are not included.

## Setup

```bash
npm install
npm run dev
```

## Deploy on Vercel

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Root directory: `./`

Optional environment variable:

```env
VITE_MLBB_API_BASE=https://arena.fastapicloud.dev/api
```

The default API base is already configured in the app, so this variable is optional. The app uses the community-maintained, unofficial Rone Arena API. Live data availability, freshness, and response fields depend on that upstream service. No Moonton affiliation is implied.

## Feature notes

- Hero Meta reads `main_hero_appearance_rate` as pick rate and reads the documented win / ban rate fields.
- Counter Picks renders matchup records from the public hero counters endpoint.
- Hero Guides displays recommended build equipment IDs and counter matchup data from Academy endpoints. The API may not provide localized equipment names or full guide prose for every hero.
- Player Lookup, global player leaderboards, payment processing, and diamond fulfilment are not guaranteed by this public API; the existing UI labels those limitations rather than inventing results.
