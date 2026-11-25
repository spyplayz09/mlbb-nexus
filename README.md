# MLBB Nexus

A responsive Mobile Legends: Bang Bang fan dashboard built with React + Vite. The visual direction is inspired by the screenshots supplied by the project owner: warm cream surfaces, bold red accents, heavy black borders, crisp typography and offset shadows.

## Included
- Login / registration with Supabase email-password authentication
- Protected dashboard and sign out
- Demo access when no Supabase project is configured
- Overview, hero meta filters/search, India and Global sample leaderboards
- Dark-system / matchmaking reality-check guide
- Weekly playtime planner, events checklist and hero guides
- Responsive mobile navigation and desktop sidebar
- Vercel SPA rewrite configuration

## Important data note
The included player, hero, leaderboard, playtime and event values are illustrative demo content. They are not official or live MLBB data. The public site does not claim affiliation with Moonton. To publish verified live statistics, connect a lawful and reliable MLBB data provider or your own backend and replace the sample arrays in `src/App.jsx`. Do not scrape private endpoints or request player passwords.

## Run locally
1. Install Node.js 20 or newer.
2. Extract this ZIP and open the `mlbb-nexus` folder in a terminal.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the local URL shown in the terminal.

## Configure Supabase authentication
1. Create a project at https://supabase.com/.
2. In Supabase, open **Authentication → Providers → Email** and enable email/password sign-in.
3. Copy the Project URL and anon/public key from **Project Settings → API**.
4. In the project root, copy `.env.example` to `.env` and fill in:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. In Supabase **Authentication → URL Configuration**, add your local and deployed site URLs to Site URL / Redirect URLs.
6. Restart the dev server after changing `.env`.

Never put a Supabase service-role key in frontend environment variables. Only use the anon/public key in this Vite app.

## Deploy to GitHub and Vercel (Android-friendly)
1. Extract the ZIP on your phone.
2. Create a GitHub repository named `mlbb-nexus`.
3. Upload the contents of this folder to the repository root. Make sure `package.json`, `index.html`, `src/`, and `vercel.json` are at the root — do not upload an extra nested folder level.
4. On Vercel, choose **Add New → Project**, import the GitHub repository.
5. Vercel should detect Vite. Build command: `npm run build`; output directory: `dist`.
6. If using Supabase, open Vercel **Project → Settings → Environment Variables** and add the two `VITE_SUPABASE_...` values. Redeploy after adding them.
7. In Supabase URL Configuration, add your Vercel domain, e.g. `https://your-project.vercel.app`.

## Connect real MLBB statistics later
Create a backend endpoint that fetches and validates provider data. Keep provider secrets server-side (Vercel Functions / server backend), then have the frontend request your endpoint. Replace the demo `heroes`, `globalPlayers`, `indiaPlayers`, and `trend` data in `src/App.jsx` with API responses. Add loading, empty and error states before going live.

## Tech
React 18 · Vite · Supabase JS · Recharts · Lucide React
