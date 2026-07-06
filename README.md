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

This is only for checking the files on your own machine. Do not add this
localhost URL to Supabase Auth settings when the app should authenticate only
from GitHub Pages.

From this folder:

```bash
python3 -m http.server 7777
```

Then open:

```text
http://localhost:7777/
```

## Supabase Notes

The browser app uses only the Supabase project URL and publishable public key.
Never commit a `service_role` key, database password, or Postgres connection
string.

Supabase Auth should use the GitHub Pages URL only:

- Site URL: `https://friendly-neighborhood-product-manager.github.io/DoneZone/`
- Redirect URL: `https://friendly-neighborhood-product-manager.github.io/DoneZone/`

Do not add `http://localhost:7777/` as a Supabase Auth URL unless you decide to
test sign-in locally later.

The SQL files in `supabase/` are the starting point for the backend setup.
Run them in Supabase only after reviewing them for the exact production shape
you want.

## Supabase Project

- Project URL: `https://phemaiswganfskmhjvkf.supabase.co`
- Browser key: configured in `src/supabaseClient.js`

## Next Step

After the SQL setup has run in Supabase, publish the app through GitHub Pages:

1. Commit and push these files to `friendly-neighborhood-product-manager/DoneZone`.
2. In GitHub, open the repository settings.
3. Open Pages.
4. Publish from the `main` branch.
5. Open `https://friendly-neighborhood-product-manager.github.io/DoneZone/`.
6. Sign in with your email. The sign-in email will redirect back to GitHub Pages.
