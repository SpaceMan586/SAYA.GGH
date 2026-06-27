# SAYA.GGH FrontEnd

Aplikasi utama SAYA.GGH berbasis Next.js App Router. Folder ini berisi website publik, dashboard admin, API route chat/admin, integrasi Supabase, translasi bilingual, dan live chat.

## Stack

- Next.js 15, React 19, TypeScript.
- Tailwind CSS, Flowbite React, Framer Motion.
- Supabase untuk PostgreSQL, Auth, dan Storage.
- Google Gemini API untuk translasi AI.

## Setup

Gunakan Node.js 22.x.

```bash
cd FrontEnd
npm install
```

Buat `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
CHAT_SESSION_SECRET=replace_with_a_long_random_secret
GEMINI_API_KEY=your_gemini_api_key
```

`SUPABASE_SERVICE_ROLE_KEY`, `CHAT_SESSION_SECRET`, dan `GEMINI_API_KEY` harus tetap server-side.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

Development server berjalan di `http://localhost:3000`.

## Route

| Halaman | Route |
| --- | --- |
| Home | `/` |
| About | `/about` |
| Project List | `/project` |
| Project Detail | `/project/[id]` |
| News List | `/news` |
| News Detail | `/news/[id]` |
| Admin Login | `/admin/login` |
| Admin Dashboard | `/admin/dashboard` |
| Admin Debug | `/admin/debug` hanya development |

## Supabase

Schema awal dan instruksi lengkap ada di README root repository. SQL tambahan tersedia di:

- `sql/harden-supabase-security.sql`
- `sql/add-news-gallery-urls.sql`

Pastikan bucket Storage bernama `images` sudah dibuat dan user admin di Supabase Auth sudah diberi `app_metadata.role = "admin"`.

Jika upload gambar dari dashboard gagal, cek policy Storage untuk bucket `images` di README root.
