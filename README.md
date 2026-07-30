
# SSAFY 광주 2반 페이지

> 🌐 **배포 사이트:** [https://ssafy-2class-page.vercel.app/](https://ssafy-2class-page.vercel.app/)

## Running the code

Double-click `start.bat`, or run `corepack pnpm dev`.

## Supabase photo storage

1. Create a Supabase project and run [`supabase/schema.sql`](./supabase/schema.sql) in its SQL Editor.
2. Copy `.env.example` to `.env.local`, then set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with the project's URL and anon key.
3. In Vercel, add the same two values under **Project Settings → Environment Variables**, then redeploy.

The included storage policy allows public uploads for the class gallery. Add Supabase Auth before sharing the site outside the class.

The same SQL file creates the shared coffee orders, anonymous posts, and Bang game rooms. Run it again after pulling updates to add new tables safely.

## Study progress sync

For an existing Supabase project, run [`supabase/study_progress.sql`](./supabase/study_progress.sql) once in the Supabase SQL Editor.
Python questions stay versioned in [`src/data/pythonQuestionBank.ts`](./src/data/pythonQuestionBank.ts), while multiple-choice, short-answer, and essay responses are synchronized to the `study_attempts` table. The browser keeps a local pending queue and retries when Supabase becomes available.

The current class-member selector is a lightweight profile switch, not secure authentication. The table includes an optional `auth_user_id` column so Supabase Auth and owner-only RLS can be enabled later without replacing the progress model.

## Bang board game

Open **게임 → 뱅!** and select a class member profile. Game rooms are cached locally and synchronized through the Supabase `bang_rooms` table so classmates on different devices can join the same room.

## G2 administrator mode

Set `ADMIN_PASSWORD` and `SUPABASE_SERVICE_ROLE_KEY` in Vercel Environment Variables. Do not prefix these values with `VITE_`, and never expose the Supabase secret key in client-side code. The `G2` button verifies the password through a Vercel Function before showing the admin page.
  
