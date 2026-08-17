# Avfucardgenerator

Identity card generator for Assam Veterinary and Fishery University (Khanapara, Guwahati).

Fill in a cardholder's details, preview the front/back of the card exactly as printed, generate a true-size (8.5cm x 5.4cm) PDF, and store every generated card in the database so it can be searched and re-downloaded later.

## Stack
- Next.js (App Router)
- Supabase (Postgres) for records — accessed via a direct SQL connection (`lib/db.js`), not the Supabase client SDK
- Netlify Blobs for uploaded photos/signatures and generated PDFs
- html2canvas + jsPDF for client-side PDF generation

## Environment variables
- `DATABASE_URL` — your Supabase Postgres **connection string** (Supabase dashboard → Project Settings → Database → Connection string; use the *connection pooling* one, port 6543, transaction mode, for serverless use). Set this in Netlify's site Environment Variables — never commit it or paste it into chat/code.

## Local development
This app needs a live DB connection and Netlify Blobs to run, so use the Netlify CLI instead of plain `next dev`:

```
npm install
netlify login
netlify link          # or `netlify init` for a brand-new site
netlify env:set DATABASE_URL "postgres://...supabase connection string..."
netlify dev
```

## Deploy
Push to `main` — Netlify auto-builds via `netlify.toml` (`@netlify/plugin-nextjs`). Make sure `DATABASE_URL` is set in the site's Environment Variables on Netlify first.
