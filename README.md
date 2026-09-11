# Form Studio

Aplikasi React untuk membina resume yang boleh diedit, disimpan secara automatik dalam browser, dicetak atau dieksport sebagai PDF, dan dikongsi melalui link.

## Jalankan

```bash
npm install
npm run dev
```

Buka URL yang dipaparkan oleh Vite. Data editor disimpan menggunakan `localStorage`, manakala dokumen dalam `Save List` disimpan ke PostgreSQL melalui `DATABASE_URL` dalam `.env`. Link share mengandungi data resume yang telah dienkod dalam hash URL.

Link share menggunakan ID pendek yang merujuk kepada data dokumen yang disimpan dalam database.

### Database

Pastikan `.env` mengandungi:

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

Server API akan mencipta jadual `documents` secara automatik pada sambungan pertama. Jangan letakkan `DATABASE_URL` dalam kod frontend atau commit fail `.env`.

### Railway

Railway akan menggunakan `npm run build` untuk build dan `npm start` untuk menjalankan aplikasi. Tambah `DATABASE_URL` di **Project Settings > Variables** menggunakan connection string PostgreSQL Neon. Selepas deploy, buka domain Railway yang diberikan.