# Dex Flux — Solana Token Directory

Lists Solana tokens (Jupiter token list) + live prices (Jupiter price API) and lets anyone submit missing socials for free (stored in Supabase).

## 1) Setup

```bash
cp .env.example .env.local
# fill Supabase keys
npm i
npm run dev
```

Open: http://localhost:3000

## 2) Supabase
Run SQL in `supabase/schema.sql` inside Supabase SQL editor.

Env vars required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 3) Routes
- `/` token list + search + submit info
- `/token/[mint]` token detail page
- `GET /api/tokens?q=&limit=&offset=`
- `GET /api/token/[mint]`
- `POST /api/submit`

## Notes
- Prices come from Jupiter: `^15.1.6` (Next.js)
- This build uses a minimal dialog implementation (no Radix) to keep deps lean.
