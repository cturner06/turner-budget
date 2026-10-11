# Turner Budget

Household budget app for turnerjonesmgmt.com. Single page, no build step.

- `index.html` — the whole app
- `CNAME` — custom domain for GitHub Pages

## Backend

Supabase project `turner-budget` (ref `uqkycimmzuooavqpkzho`).
Auth: Google and email/password. Data is protected by row-level
security — each signed-in user sees only profiles they own or have
been invited to. The key embedded in `index.html` is the publishable
key and is safe in a public repo.

## Deploy

Push to `main`. GitHub Pages serves it. No pipeline, no secrets.
