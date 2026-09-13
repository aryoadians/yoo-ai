# Yoo.ai

Temukan tool AI paling cocok untuk kebutuhanmu — lintas vendor, lintas kategori, gratis vs berbayar — 100% berjalan di browser kamu, tanpa server dan tanpa akun.

**Demo live:** https://aryoadians.github.io/yoo-ai/

## Fitur

- **Cari** — ketik kebutuhanmu (mis. "bikin poster promo" atau alur bertahap "pelajari materi, lalu bikin presentasi"), dapat rekomendasi tool dengan fuzzy match & typo tolerance.
- **Studi Kasus** — 40 alur kerja siap pakai untuk kebutuhan umum (bikin konten iklan, riset skripsi, otomatisasi bisnis, dst), lengkap dengan urutan tool yang disarankan.
- **Artikel** — direktori lengkap semua tools di database, dikelompokkan per kategori, dengan deskripsi, study case, dan tutorial cara pakai.
- **Toggle Gratis/Berbayar** — filter hasil supaya cuma tampil tool gratis, dengan alternatif otomatis untuk tool berbayar.
- **Project** — simpan kombinasi tools yang kamu pakai untuk sebuah project, export/import lewat file `.json`.
- **Database Tools portable** — export/import seluruh database tools (`tools.json`) untuk migrasi ke device lain atau update berkala.

Karena semuanya berjalan lokal, datamu (project, database custom) tersimpan di browser kamu sendiri — tidak ada yang dikirim ke server mana pun. Untuk pindah device, pakai fitur Export/Import di halaman Pengaturan.

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:5173` (atau port yang ditampilkan di terminal).

## Build untuk produksi

```bash
npm run build
```

Hasilnya ada di folder `dist/` — file statis murni, bisa di-hosting di mana saja (GitHub Pages, Netlify, Vercel, atau bahkan dibuka langsung dari file lokal).

## Testing

```bash
npm test
```

## Kontribusi

Database tools (`src/data/tools.seed.json`) terbuka untuk kontribusi lewat Pull Request — tambah tool baru atau perbarui harga/tips tool yang sudah ada, ikuti skema yang sudah dipakai di file tersebut.

## Lisensi

[MIT](./LICENSE)
