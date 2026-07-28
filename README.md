
# SSAFY 광주 2반 페이지

> 🌐 **배포 사이트:** [https://randomssafy.netlify.app/](https://randomssafy.netlify.app/)

## Running the code

Double-click `start.bat`, or run `corepack pnpm dev`.

## Supabase photo storage

1. Create a Supabase project and run [`supabase/schema.sql`](./supabase/schema.sql) in its SQL Editor.
2. Copy `.env.example` to `.env.local`, then set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with the project's URL and anon key.
3. In Netlify, add the same two values under **Site configuration → Environment variables**, then redeploy.

The included storage policy allows public uploads for the class gallery. Add Supabase Auth before sharing the site outside the class.

The same SQL file creates the shared coffee orders, anonymous posts, and Bang game rooms. Run it again after pulling updates to add new tables safely.

## Bang board game

Open **게임 → 뱅!** and select a class member profile. Game rooms are cached locally and synchronized through the Supabase `bang_rooms` table so classmates on different devices can join the same room.

## G2 administrator mode

Set `ADMIN_PASSWORD` and `SUPABASE_SERVICE_ROLE_KEY` in Netlify Environment variables. Do not prefix these values with `VITE_`, and never expose the Supabase secret key in client-side code. The `G2` button verifies the password through a Netlify Function before showing the admin page.
  
