# PromptHub MVP

PromptHub adalah web app sederhana untuk menyimpan, mencari, menyalin, dan membagikan prompt AI. MVP ini dibangun dengan Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, Supabase Auth, dan Supabase PostgreSQL.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase Auth dan Database

## Local Setup

1. Install dependency:

```bash
npm install
```

2. Buat `.env.local` dari `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Gunakan Project URL Supabase tanpa suffix `/rest/v1`.

3. Jalankan migration database:

```sql
-- Supabase Dashboard > SQL Editor
-- paste isi file supabase/migrations/20260518190000_create_profiles_and_prompts.sql
-- lalu Run
```

4. Jalankan dev server:

```bash
npm run dev
```

5. Buka `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run test:smoke
npm run build
npm run start
```

`npm run test:smoke` membutuhkan dev server yang sedang berjalan di `http://127.0.0.1:3000`. Script ini mengecek protected route, env Supabase public, dan RLS dasar untuk anon user.

## Supabase Setup

1. Buat project baru di Supabase.
2. Ambil Project URL dan anon key dari Project Settings.
3. Isi `.env.local` untuk local development.
4. Jalankan SQL migration di `supabase/migrations`.
5. Di Supabase Auth settings, pastikan redirect URL development mengizinkan:

```txt
http://localhost:3000
http://127.0.0.1:3000
```

Untuk production, tambahkan domain Vercel final:

```txt
https://your-domain.vercel.app
https://your-custom-domain.com
```

## Deploy ke Vercel

1. Push repository ke Git provider.
2. Import project di Vercel sebagai Next.js app.
3. Isi Environment Variables di Vercel:

```txt
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Jangan isi service role key di variable `NEXT_PUBLIC_*`.

4. Pastikan migration Supabase sudah dijalankan di project Supabase production.
5. Tambahkan production URL Vercel ke Supabase Auth redirect URLs.
6. Jalankan build production lokal sebelum deploy final:

```bash
npm run lint
npm run typecheck
npm run test:smoke
npm run build
```

7. Deploy lewat Vercel.

## MVP Verification

Sebelum dianggap selesai, cek flow utama:

- Guest dapat membuka landing page, public feed, detail prompt public, search prompt public, dan copy prompt.
- Guest tidak dapat membuka dashboard, create prompt, edit prompt, settings, atau private prompt user lain.
- User login dapat membuat prompt private dan public.
- User login dapat melihat, edit, dan delete prompt miliknya sendiri.
- Public feed hanya menampilkan prompt public.
- Dashboard menampilkan total prompt, total public, dan total private milik user.
- Form validation berjalan untuk title, description, category, tags, content, dan visibility.
- UI rapi di mobile, tablet, desktop, light mode, dan dark mode.

Checklist manual lengkap ada di `local-docs/qa-checklist.md`.
