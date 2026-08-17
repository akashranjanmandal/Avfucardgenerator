# Avfucardgenerator

Identity card generator for Assam Veterinary and Fishery University (Khanapara, Guwahati).

Fill in a cardholder's details, preview the front/back of the card exactly as printed, generate a true-size (8.5cm x 5.4cm) PDF, and store every generated card in the database so it can be searched and re-downloaded later.

## Stack
- Next.js (App Router)
- Supabase (Postgres, accessed via its REST API through `@supabase/supabase-js`) for records
- Netlify Blobs for uploaded photos/signatures and generated PDFs
- html2canvas + jsPDF for client-side PDF generation

## One-time database setup
The app talks to Supabase over its REST API using the `service_role` key, so it never needs a raw Postgres connection string — but that also means it can't run `CREATE TABLE` itself. Before first use, create the table once:

1. Open your Supabase project → **SQL Editor** → New query.
2. Paste the contents of `supabase/migrations/0001_create_cards.sql` and run it.
3. Paste the contents of `supabase/migrations/0002_id_no_nullable.sql` and run it (needed once the card number switched to the auto-assigned row id — see below).

(Alternatively, if you have the Supabase CLI: `supabase login`, `supabase link --project-ref <your-project-ref>`, `supabase db push`.)

## Card numbers
Each card's number is its database row id: unique, sequential, starting at 1, assigned automatically when the card is first saved, and never editable. "Date of Issue" defaults to the day the card is first saved, and "Valid Upto" defaults to two years after the Date of Issue — both remain plain editable fields if you need to correct them.

## Environment variables
Set these in Netlify's site **Environment variables** (never commit them or paste them into chat/code):
- `SUPABASE_URL` — your project URL, e.g. `https://<project-ref>.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` — the `service_role`/secret key from Project Settings → API. This key bypasses Row Level Security, so it's used server-side only (inside API routes) and must never be exposed to the browser.

## Local development
This app needs Netlify Blobs to run, so use the Netlify CLI instead of plain `next dev`:

```
npm install
netlify login
netlify link                                          # or `netlify init` for a brand-new site
netlify env:set SUPABASE_URL "https://<project-ref>.supabase.co"
netlify env:set SUPABASE_SERVICE_ROLE_KEY "..."
netlify dev
```

## Deploy
Push to `main` — Netlify auto-builds via `netlify.toml` (`@netlify/plugin-nextjs`). Make sure the two Supabase env vars are set in Netlify first, and that the `cards` table has been created (see above).
