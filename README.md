# PULSA — Personal Finance Tracker (MVP)

Aplikasi pencatatan keuangan pribadi berbasis **Nuxt 3 + Vue 3 + TypeScript + Tailwind CSS + Supabase**.

Fitur: autentikasi (login, register, logout, lupa kata sandi, sesi tersimpan, route terproteksi), dashboard, transaksi (CRUD, search, filter), wallet (CRUD, arsip), analytics, pengaturan (profil, tema terang/gelap, Bahasa Indonesia/English, mata uang), dan layout responsif (sidebar desktop, bottom navigation mobile).

> Aplikasi ini **tidak membuat atau mengubah database**. Ia memakai tabel yang sudah ada: `profiles`, `wallets`, `categories`, `transactions`, serta view `wallet_balances` (hanya dibaca).

## 1. Install

Prasyarat: Node.js 18.18+ (disarankan 20+) dan npm.

```bash
npm install
```

## 2. Environment variables

```bash
cp .env.example .env.local
```

Isi `.env.local`:

```
NUXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable / anon key>
```

Nilai ada di Supabase Dashboard → Project Settings → API. Gunakan **publishable (anon) key saja**; jangan pernah memasukkan service role key. `.env.local` sudah masuk `.gitignore`. Bila variabel kosong, aplikasi menampilkan layar error konfigurasi.

## 3. Menjalankan

```bash
npm run dev          # http://localhost:3000
```

## 4. Production build

```bash
npm run build
npm run preview      # uji hasil build secara lokal
npm run typecheck    # opsional: pemeriksaan TypeScript (vue-tsc)
```
