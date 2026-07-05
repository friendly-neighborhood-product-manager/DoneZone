# DoneZone

DoneZone is a new GitHub Pages + Supabase Postgres task board app.

It is designed as a standalone hosted app. It does not use a local workbook
backend, local Python server, or local app data.

## Stack

- Frontend: static HTML, CSS, and JavaScript for GitHub Pages
- Backend: Supabase Postgres
- Auth: Supabase Auth
- Font: Inter with system fallbacks

## Project Layout

```text
DoneZone/
  index.html
  public/
    donezone-logo.svg
  src/
    app.js
    styles.css
    supabaseClient.js
  supabase/
    schema.sql
    policies.sql
```

## Local Preview

From this folder:

```bash
python3 -m http.server 5173
```

Then open:

```text
http://localhost:5173/
```

## Supabase Notes

The browser app should use only the Supabase project URL and anon public key.
Never commit a `service_role` key or database password.

The SQL files in `supabase/` are the starting point for the backend setup.
Run them in Supabase only after reviewing them for the exact production shape
you want.

## Next Step

Step 2 is to create the Supabase project, run the schema and policies, and then
wire the app to Supabase Auth and Postgres.
