
  # 랜덤 팀 편성 웹페이지

  This is a code bundle for 랜덤 팀 편성 웹페이지. The original project is available at https://www.figma.com/design/rEKzsa3P4bLFfBq7vZZryP/%EB%9E%9C%EB%8D%A4-%ED%8C%80-%ED%8E%B8%EC%84%B1-%EC%9B%B9%ED%8E%98%EC%9D%B4%EC%A7%80.

  ## Running the code

  Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## Supabase photo storage

1. Create a Supabase project and run [`supabase/schema.sql`](./supabase/schema.sql) in its SQL Editor.
2. Copy `.env.example` to `.env.local`, then set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with the project's URL and anon key.
3. In Netlify, add the same two values under **Site configuration → Environment variables**, then redeploy.

The included storage policy allows public uploads for the class gallery. Add Supabase Auth before sharing the site outside the class.

The same SQL file also creates the shared coffee group-order tables. Run it again after pulling updates to add new tables safely.
  
