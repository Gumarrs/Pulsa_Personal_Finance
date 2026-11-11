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

## 5. Deploy ke Vercel

1. Push project ke repository Git (GitHub/GitLab/Bitbucket).
2. Di Vercel: **Add New → Project**, pilih repository. Framework terdeteksi otomatis sebagai Nuxt.
3. Tambahkan Environment Variables (Production dan Preview): `NUXT_PUBLIC_SUPABASE_URL` dan `NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
4. Deploy. Setiap perubahan environment variable memerlukan redeploy karena nilainya ikut dibangun ke aplikasi.

## 6. Redirect URL Supabase Auth

Supabase Dashboard → **Authentication → URL Configuration**:

- **Site URL**: URL produksi, mis. `https://pulsa-kamu.vercel.app`
- **Redirect URLs** (tambahkan semuanya):
  - `http://localhost:3000/**`
  - `https://pulsa-kamu.vercel.app/**`
  - `https://*-<nama-akun-vercel>.vercel.app/**` (opsional, untuk preview deployment)

Tautan "Lupa kata sandi" mengarah ke `/reset-password`, dan tautan konfirmasi email ke root situs; keduanya harus ada di daftar Redirect URLs. Jika "Confirm email" aktif, pengguna baru harus mengonfirmasi email sebelum bisa masuk.

## Perilaku penting

- **Saldo wallet** dibaca dari view `public.wallet_balances` (kolom yang dikenali: `wallet_id` atau `id`, dan `balance`, `current_balance`, atau `final_balance`). Jika view tidak ada atau kolomnya berbeda, muncul banner peringatan dan saldo **sementara dihitung di aplikasi** (saldo awal + income − expense ± transfer). Buat view tersebut agar angka konsisten.
- **Transfer** tidak dihitung sebagai pemasukan maupun pengeluaran. Net cash flow = total income − total expense.
- Semua laporan memakai `transaction_date` pada zona waktu profil (default `Asia/Jakarta`).
- Tema dan bahasa disimpan di `localStorage`; mata uang disimpan di `localStorage` dan disinkronkan ke `profiles.currency`.
- Nama kategori ditampilkan apa adanya dari database (tidak diterjemahkan).

## Batasan MVP

- Nominal hanya bilangan bulat (tanpa desimal) pada form; transaksi lama yang berdesimal tetap utuh bila nominalnya tidak diubah.
- Mengganti mata uang hanya mengubah format tampilan; tidak ada konversi kurs, dan wallet campur mata uang tidak dipisahkan.
- Seluruh transaksi dimuat ke browser (per 1.000 baris) dan difilter di sisi klien. Cocok untuk penggunaan pribadi; untuk puluhan ribu transaksi perlu paginasi di sisi server.
- Budgets, financial goals, dan recurring transactions belum dipakai.

## Struktur

```
components/   UI reusable (sidebar, bottom nav, modal, chart, form, list, dll.)
composables/  auth, data Supabase, prefs, i18n, toast, periode
i18n/         kamus Indonesia & English
layouts/      default (app) dan auth
middleware/   proteksi route
pages/        dashboard, transactions, wallets, analytics, settings, auth
plugins/      klien Supabase, pemuat preferensi
types/ utils/ tipe, format Rupiah, tanggal, agregasi laporan
```
