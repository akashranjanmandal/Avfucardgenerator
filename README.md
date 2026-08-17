# Avfucardgenerator

Identity card generator for Assam Veterinary and Fishery University (Khanapara, Guwahati).

Fill in a cardholder's details, preview the front/back of the card exactly as printed, generate a true-size (8.5cm x 5.4cm) PDF, and store every generated card in the database so it can be searched and re-downloaded later.

## Stack
- Next.js (App Router)
- Netlify DB (Postgres via Neon) for records
- Netlify Blobs for uploaded photos/signatures and generated PDFs
- html2canvas + jsPDF for client-side PDF generation

## Local development
This app needs Netlify's environment (DB connection + Blobs) to run, so use the Netlify CLI instead of plain `next dev`:

```
npm install
netlify login
netlify link      # or `netlify init` for a brand-new site
netlify db init   # provisions Postgres and sets NETLIFY_DATABASE_URL
netlify dev
```

## Deploy
Push to `main` — Netlify auto-builds via `netlify.toml` (`@netlify/plugin-nextjs`).
