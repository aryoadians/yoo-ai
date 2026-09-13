# PRD — Yoo.ai
### Rekomendasi Tools AI Lintas Vendor + Manajemen Project Lokal

**Status:** Draft v2 untuk pengembangan di Claude Code
**Pemilik produk:** Aryo Adiansyah
**Disusun:** September 2026

---

## 1. Ringkasan

Aplikasi web yang membantu pengguna menemukan tool AI/software paling cocok untuk tujuan tertentu — lintas vendor, lintas kategori, lintas tingkat harga (gratis vs berbayar) — dan **berjalan 100% lokal di browser** (tidak ada server wajib, tidak ada akun). Pengguna bisa menyimpan kombinasi tools yang mereka pakai untuk sebuah project ke "Project" tersimpan, dan memindahkan baik Project maupun seluruh Database Tools ke device lain lewat file export/import — tanpa cloud sama sekali.

## 2. Masalah yang Diselesaikan

- Pengguna sering bingung tool mana yang paling pas untuk kebutuhan spesifik, karena ekosistem AI tools berubah cepat dan tersebar di banyak vendor.
- Kombinasi tools yang cocok untuk satu project tidak ada tempat penyimpanannya supaya bisa dipakai ulang atau dipindah ke device lain.
- Pengguna sering tidak sadar sudah mendekati limit tier gratis, dan tidak tahu berapa biaya kalau upgrade.
- Database tools gampang basi (harga & fitur berubah), tapi aplikasi tidak boleh bergantung pada server/API eksternal yang berjalan terus-menerus — harus tetap murni lokal.

## 3. Target Pengguna

Pengguna utama: Aryo — mahasiswa S1 Sains Data (Universitas Terbuka), digital marketing support, pemilik bisnis dropship (Anekadropship), pembuat konten StudyWithAI, menuju arah AI specialist (agent building, SaaS/PaaS berbasis AI, workflow n8n). Kebutuhan tools-nya lintas domain: riset akademik, produksi konten, otomatisasi bisnis, eksperimen coding/agent — karena itu cakupan database **sengaja dibuat seluas mungkin**, tidak dibatasi ke tiga domain di atas saja.

## 4. Tujuan & Non-Tujuan

**Tujuan (in scope):**
- Rekomendasi tool tunggal maupun alur bertahap dari satu input teks bebas.
- Database tools **seluas mungkin** lintas vendor & kategori — taksonomi kategori terbuka (bisa nambah kategori baru kapan saja, tidak hardcode ke daftar tetap).
- Mode tampilan Gratis vs Berbayar, dengan tips anti-limit (gratis) dan info harga (berbayar).
- Simpan/lihat/hapus/export/import Project secara lokal.
- **Export/import seluruh Database Tools** — supaya database bisa dipindah ke device lain dan diperbarui secara semi-otomatis tanpa aplikasi perlu terhubung ke server manapun.
- Branding dengan logo & warna milik pengguna, nama produk **Yoo.ai**.

**Non-tujuan (out of scope untuk versi awal):**
- Sinkronisasi cloud otomatis real-time (export/import manual sudah cukup untuk migrasi antar device).
- Login/akun/multi-user.
- Aplikasi memanggil API eksternal secara live untuk cek harga (melanggar prinsip 100% lokal) — pembaruan data tetap lewat mekanisme semi-otomatis yang dijelaskan di 5.1.1.
- Transaksi pembayaran langsung ke tools pihak ketiga.

## 5. Fitur Utama

### 5.1 Database Tools (`tools.json`)

Setiap entri tool minimal punya field berikut:

```json
{
  "id": "claude-pro",
  "name": "Claude Pro",
  "vendor": "Anthropic",
  "category": "asisten-chat",
  "pricingTier": "paid",
  "freeAlternativeId": "claude-free",
  "pricing": {
    "amount": "US$20/bulan (US$17/bulan jika tahunan)",
    "billingNote": "Per pengguna individu",
    "verifiedAt": "2026-09-13"
  },
  "freeTierTips": [],
  "officialUrl": "https://claude.com/pricing",
  "keywords": ["asisten", "coding", "menulis", "riset"],
  "stageTags": ["riset", "menulis", "coding"],
  "description": "Asisten AI serba guna dengan Projects, Artifacts, dan akses Claude Code."
}
```

Untuk tool bertier gratis dengan batasan, isi `freeTierTips` (array kalimat actionable), contoh:

```json
{
  "id": "nano-banana-pro",
  "name": "Nano Banana Pro",
  "vendor": "Google",
  "category": "generate-gambar",
  "pricingTier": "freemium",
  "pricing": { "amount": "Gratis dengan kuota ~2-20 gambar/hari, versi penuh via Google AI Pro/Ultra", "verifiedAt": "2026-09-13" },
  "freeTierTips": [
    "Simpan pemakaian Pro buat gambar penting saja (poster utama, thumbnail andalan) — pakai Nano Banana biasa/2 untuk kebutuhan harian.",
    "Kuota biasanya reset harian — kerjakan batch generate di awal hari kalau butuh banyak sekaligus."
  ],
  "keywords": ["poster", "infografis", "gambar teks", "thumbnail"],
  "stageTags": ["gambar", "presentasi-visual"]
}
```

**Kategori:** dibuat sebagai **daftar terbuka** (bukan enum tetap) yang bisa bertambah kapan saja lewat data — mulai dari isi awal seperti `asisten-chat`, `coding-agent`, `no-code-otomatisasi`, `generate-gambar`, `generate-video`, `riset-dokumen`, `desain-ui`, `marketing-campaign`, `produktivitas-dokumen`, `data-analisis-bi`, `project-management`, `customer-support`, `sales-crm`, `penulisan`, `penerjemahan`, `keamanan`, dan terbuka untuk kategori apapun yang muncul saat database diperluas.

**Cakupan vendor: seluas mungkin**, tidak dibatasi ke Google atau ke tiga domain pengguna. Contoh vendor lintas kategori yang perlu mulai diisi: Anthropic (Claude, Claude Code), OpenAI (ChatGPT, Sora), Google (Gemini, NotebookLM, dst — migrasi dari versi sebelumnya), Perplexity, Midjourney, Canva, Adobe Firefly, n8n, Zapier, Make, Figma, Notion AI, HubSpot, Runway, ElevenLabs, GitHub Copilot, Cursor — daftar ini contoh awal, bukan daftar final.

> Catatan harga: semua field `pricing.amount` wajib punya `verifiedAt`. Harga software AI berubah cukup sering — mekanisme pembaruannya dijelaskan di bagian 5.1.1 di bawah.

### 5.1.1 Update Database Tools — Semi-Otomatis, Tetap 100% Lokal

Karena aplikasi **tidak boleh memanggil API/internet secara live** (supaya tetap 100% lokal dan tidak butuh server), "semi-otomatis" di sini berarti: **proses pembaruan data dilakukan di luar aplikasi (lewat sesi riset terpisah), lalu hasilnya di-import ke aplikasi sebagai file** — bukan aplikasi yang fetch data sendiri secara real-time.

**a. Import/Export Database Tools** (terpisah dari import/export Project di 5.5, tapi pakai modul kode yang sama):
- Halaman **Pengaturan** → tombol **"Export Database Tools"** (download `tools.json` saat ini, termasuk entri custom yang pernah ditambah manual) dan **"Import Database Tools"**.
- Saat import, dua mode:
  - **Replace All** — timpa seluruh database dengan file yang diimpor. Cocok untuk migrasi penuh ke device baru.
  - **Merge/Update** — cocokkan entri berdasarkan `id`: entri yang sudah ada di-update (harga, tips, dst diganti versi baru), entri baru ditambahkan, entri lama yang tidak ada di file baru **tetap dipertahankan** (terutama entri custom yang ditambah manual dan tidak ada di sumber luar).
- Root file `tools.json` punya metadata versi:
  ```json
  { "dataVersion": "2026-09-13", "lastUpdated": "2026-09-13T00:00:00Z", "tools": [ /* ... */ ] }
  ```
  Ditampilkan di UI: **"Database terakhir diperbarui: 13 September 2026"** — supaya pengguna tahu kapan harus menjalankan proses pembaruan lagi.

**b. Alur kerja pembaruan berkala (dilakukan pengguna, dibantu AI assistant manapun yang punya web search):**
1. Pengguna buka sesi chat baru dengan AI assistant (misalnya Claude, karena punya web search).
2. Pakai prompt template di Lampiran B untuk minta AI meriset harga/fitur terbaru tools yang sudah ada di database + tools baru yang relevan, lalu compile jadi file JSON sesuai skema di atas.
3. AI mengembalikan file `tools.json` baru (atau partial update).
4. Pengguna import file itu ke Yoo.ai lewat halaman Pengaturan, pilih mode Merge/Update.
5. Aplikasi tetap 100% lokal — tidak ada bagian dari aplikasi itu sendiri yang terhubung ke internet, seluruh riset terjadi di sesi chat terpisah.

**c. Validasi saat import (berlaku juga untuk import Project):**
- Cek `dataVersion`/`schemaVersion` dikenali.
- Cek setiap entri minimal punya field wajib (`id`, `name`, `category`, `pricingTier`).
- Kalau file rusak/format tidak sesuai → tampilkan pesan error spesifik (field mana yang bermasalah), **jangan** menimpa data lama.
- Setelah import sukses, tampilkan ringkasan: "X tools ditambahkan, Y tools diperbarui, Z tools tidak berubah."

### 5.2 Search & Rekomendasi

Port logika yang sudah terbukti jalan dari prototipe HTML sebelumnya (bukan didesain ulang dari nol):

**a. Segmentasi query** — pecah input jadi beberapa tahap berdasarkan kata sambung:
- Pemisah: koma, titik koma, `...`, dan kata "lalu", "kemudian", "setelah itu", "terus", "habis itu", "selanjutnya", "dan seterusnya" (case-insensitive, word-boundary).
- Buang token "dst" yang berdiri sendiri.
- Filter segmen dengan panjang ≤ 2 karakter.

**b. Scoring per segmen terhadap tiap tool:**
- Exact substring match (segmen mengandung keyword persis) → skor +3.
- Token-level substring match (kata dalam segmen adalah bagian dari/mengandung salah satu token keyword) → skor +1.
- Fuzzy match (typo tolerance) pakai Levenshtein distance antara kata dan token keyword, threshold berdasar panjang token (`len>=7` → jarak ≤2, `len 4-6` → jarak ≤1, `len<=3` → tidak fuzzy) → skor +1.5.
- Ambil top-3 skor tertinggi (mode satu tujuan) atau top-1 per segmen (mode alur).

**c. Mode output:**
- Jika hasil segmentasi ≥ 2 segmen bermakna → render sebagai **alur bertahap** (numbered stepper), gabungkan segmen berurutan yang tool-nya sama jadi satu langkah.
- Jika 1 segmen → render sebagai **kartu ranking** (top-3, kartu pertama ditandai "paling cocok").
- Jika tidak ada skor > 0 sama sekali → tampilkan empty state yang mengarahkan ke dropdown/contoh, bukan pesan kosong.

**d. Catatan skalabilitas:** karena database sekarang "seluas mungkin" (berpotensi ratusan entri), pastikan scoring dijalankan efisien (loop sekali per pencarian, hindari re-render berlebihan saat mengetik — debounce ringan ~150ms cukup) supaya tetap responsif di HP.

### 5.3 Toggle Mode Gratis / Berbayar

- Switch di dekat search bar: **"Tampilkan: Semua / Hanya Gratis / Termasuk Berbayar"**.
- Mode "Hanya Gratis": filter hasil supaya cuma tampilkan tool `free`/`freemium`; kalau top pick sebenarnya `paid`, tampilkan alternatif gratisnya (`freeAlternativeId`) sebagai pengganti, dengan catatan "Alternatif gratis dari [nama tool berbayar]".
- Mode "Termasuk Berbayar": tampilkan semua, tool berbayar diberi badge harga langsung di kartu hasil.

### 5.4 Tips Anti-Limit & Info Harga

- Tool `freemium` → bagian collapsible "💡 Tips biar nggak limit" berisi `freeTierTips`.
- Tool `paid` → badge harga (`pricing.amount`) langsung, plus link `officialUrl` untuk cek harga terbaru.
- Tool `free` → badge hijau polos.

### 5.5 Manajemen Project

Struktur data satu Project (localStorage, key `yooai_projects`):

```json
{
  "schemaVersion": 1,
  "id": "proj_anekadropship",
  "name": "Otomatisasi Anekadropship",
  "createdAt": "2026-09-13T10:00:00Z",
  "updatedAt": "2026-09-13T10:00:00Z",
  "notes": "CS Agent, Posting Agent, Order Router",
  "savedSteps": [
    { "segmentLabel": "Klasifikasi pesan WA", "toolId": "opal", "userNote": "Prototipe dulu di sini" },
    { "segmentLabel": "Produksi sistem final", "toolId": "n8n", "userNote": "" }
  ],
  "favoriteToolIds": ["notebooklm", "ai-studio-build"]
}
```

**Operasi wajib:**
| Aksi | Perilaku |
|---|---|
| Buat Project baru | Modal minta nama, buat entri kosong |
| Simpan hasil pencarian ke Project | Tombol "+ Simpan ke Project" di kartu/langkah hasil |
| Lihat daftar Project | Sidebar/dropdown, urut `updatedAt` terbaru |
| Buka Project | Tampilkan semua `savedSteps` & `favoriteToolIds` |
| Rename / Hapus Project | CRUD standar, hapus perlu konfirmasi |
| **Export Project** (satu atau semua) | Download file `.json` (nama file: `yooai-project-[nama-project].json`) |
| **Import Project** | Upload `.json`, validasi `schemaVersion`, tambahkan ke daftar project (tidak menimpa project lain) |

**Migrasi lintas device:** karena baik Database Tools (5.1.1) maupun Project (di atas) sama-sama punya export/import, memindahkan seluruh kondisi Yoo.ai ke device baru cukup dengan dua file: `tools-export.json` dan `projects-export.json` (atau digabung jadi satu `yooai-backup.json` berisi keduanya — lihat catatan arsitektur di bagian 8).

### 5.6 Branding

- Logo yang diupload user (monogram "Yo" biru-abu, deskripsi lengkap di Lampiran A) ditempatkan di header kiri atas, ukuran ~32-40px, sejajar nama produk **Yoo.ai**.
- Palet warna dari logo sebagai warna utama UI: biru navy `#2B4C8C` (aksen utama, tombol, badge "gratis"), abu-abu kebiruan `#A6ADC0` (sekunder, border, teks muted, badge netral).
- Favicon dari logo yang sama (crop bagian lingkaran biru untuk ukuran kecil kalau perlu disederhanakan).

### 5.7 Fitur Interaktif Tambahan (nice-to-have, prioritas bebas ditentukan saat build)

- Filter kategori (chip multi-select, mengikuti taksonomi terbuka di 5.1).
- Riwayat pencarian (5-10 query terakhir, klik untuk cari ulang).
- Halaman "Bandingkan" — pilih 2-3 tool, tabel perbandingan harga/fitur berdampingan.
- Tandai favorit per tool (bintang), terlepas dari Project manapun.
- Dark mode toggle (opsional, ikut palet logo).

## 6. Alur Pengguna (User Flows)

**Flow A — Pencarian cepat satu kebutuhan:**
1. User ketik "bikin poster promo" di search bar (dengan dropdown saran).
2. Sistem tampilkan top-3 kartu, urutan berdasar skor.
3. User klik "+ Simpan ke Project" di kartu teratas → pilih/buat Project → tersimpan.

**Flow B — Alur belajar bertahap:**
1. User ketik "pelajari materi baru, perdalam, lalu bikin presentasi, lalu bikin aplikasi interaktif".
2. Sistem deteksi 4 segmen, render sebagai stepper, gabungkan langkah dengan tool sama.
3. User toggle ke mode "Hanya Gratis" → semua langkah re-render dengan alternatif gratis bila ada.

**Flow C — Migrasi penuh ke device baru:**
1. Di device lama, user buka Pengaturan → "Export Database Tools" dan "Export Semua Project" (atau satu tombol "Export Semua Data Yoo.ai").
2. File(s) `.json` terdownload/dipindah (via email/USB/cloud storage pribadi — di luar tanggung jawab aplikasi).
3. Di device baru, user install/buka Yoo.ai, ke Pengaturan → Import kedua file tadi.
4. Semua tools & project muncul persis seperti di device lama.

**Flow D — Pembaruan database berkala:**
1. Sebulan sekali (atau kapan user ingat), user jalankan prompt template (Lampiran B) di sesi chat AI terpisah.
2. Import hasilnya ke Yoo.ai lewat mode Merge/Update.
3. Badge "Database terakhir diperbarui" ter-update.

## 7. Kebutuhan Non-Fungsional

- **100% lokal:** tidak ada request jaringan dari aplikasi itu sendiri untuk fungsi inti manapun (search, project, update database) — satu-satunya file yang masuk adalah lewat import manual oleh pengguna.
- **Tanpa akun:** tidak ada login; identitas project & database murni berbasis browser + file export/import.
- **Responsif:** nyaman dipakai di layar mobile (≤420px).
- **Aksesibilitas dasar:** kontras warna cukup (cek rasio kontras abu-abu `#A6ADC0` di atas putih untuk teks kecil), focus state terlihat untuk keyboard navigation.
- **Data tidak hilang diam-diam:** setiap operasi destruktif (hapus project, Replace All saat import database) perlu konfirmasi eksplisit dan idealnya menawarkan auto-backup sebelum menimpa (misal: export otomatis ke file sementara sebelum Replace All dieksekusi).
- **Skalabel ke database besar:** karena cakupan "seluas mungkin", struktur data & rendering list harus tetap ringan walau berisi ratusan entri (virtualized list jika perlu di fase lanjut).

## 8. Rekomendasi Arsitektur Teknis (untuk Claude Code)

- **Stack disarankan:** React + Vite, Tailwind untuk styling cepat konsisten dengan palet logo.
- **Struktur folder awal:**
  ```
  /src
    /data/tools.seed.json        // data awal, bisa ditimpa oleh localStorage setelah user import
    /lib/searchEngine.ts         // segmentasi + scoring + fuzzy match
    /lib/projectStore.ts         // CRUD project di localStorage
    /lib/toolsStore.ts           // CRUD database tools di localStorage (terpisah dari seed)
    /lib/importExportManager.ts  // modul BERSAMA: serialize/download & upload/validate untuk Project maupun Tools DB
    /components/SearchBar.tsx
    /components/ResultCards.tsx
    /components/WorkflowStepper.tsx
    /components/ProjectSidebar.tsx
    /components/PricingToggle.tsx
    /components/SettingsPage.tsx // import/export Project & Tools DB, tampilkan lastUpdated
    /components/Header.tsx       // logo + branding
  ```
- **`importExportManager.ts`** menangani dua tipe data (`project` dan `toolsDatabase`) lewat satu set fungsi generik (`exportToFile(data, filename)`, `importFromFile(file, schemaValidator)`) supaya logic download/upload/validasi tidak ditulis dua kali.
- **State management:** React Context/`useReducer` cukup untuk skala ini.
- **Persistensi:** `localStorage` untuk data aktif; file `.json` sebagai medium migrasi/backup (bukan sumber data utama saat runtime).
- **Testing minimal:** unit test untuk `searchEngine.ts` (port kasus uji dari prototipe: query "persentasi" harus match NotebookLM, query alur 4 segmen harus hasilkan 2 langkah setelah dedup) dan untuk `importExportManager.ts` (import file rusak harus ditolak dengan pesan jelas, Merge/Update tidak menghapus entri custom).

## 9. Rencana Bertahap

**MVP (fase 1):**
- Migrasi data 15 tools Google yang sudah ada + database awal seluas mungkin lintas vendor (mulai ~40-50 entri sebagai fondasi, taksonomi kategori terbuka).
- Search engine (single + workflow mode).
- Toggle Gratis/Berbayar dasar.
- **Export/Import Database Tools (Replace All dulu, Merge/Update boleh menyusul)** — ini naik prioritas ke MVP karena jadi cara utama database berkembang & berpindah device.
- Export/Import Project dasar.
- Branding logo "Yoo.ai" + palet warna.

**Fase 2:**
- Mode Merge/Update penuh untuk import Database Tools (kalau belum selesai di fase 1).
- Tips anti-limit & badge harga di seluruh entri tool.
- Auto-backup sebelum operasi destruktif.

**Fase 3 (opsional):**
- Filter kategori, riwayat pencarian, halaman perbandingan, favorit, dark mode, virtualized list untuk database besar.

## 10. Keputusan yang Sudah Dikonfirmasi

1. **Update database:** semi-otomatis lewat proses riset di luar aplikasi (prompt template di Lampiran B) + import manual — aplikasi tetap 100% lokal, tidak ada pemanggilan API live.
2. **Migrasi lintas device:** disediakan lewat fitur export/import untuk Database Tools maupun Project (lihat 5.1.1 dan 5.5).
3. **Cakupan database:** seluas mungkin, tidak dibatasi ke domain user, taksonomi kategori terbuka.
4. **Nama produk:** **Yoo.ai**.

**Sisa hal kecil yang masih perlu diputuskan saat build** (tidak menghambat mulai coding, bisa diputuskan sambil jalan):
- Interval ideal menjalankan prompt template pembaruan (mingguan? bulanan?) — bisa dimulai dari "bulanan" dan disesuaikan.
- Apakah export Database Tools & Project digabung jadi satu file "Backup Yoo.ai" atau tetap dua file terpisah — disarankan sediakan keduanya (satu tombol "Export Semua" yang menggabungkan, plus opsi export terpisah untuk kontrol lebih detail).

## 11. Strategi Personal Branding, Open Source, & Offline-First

Tiga tujuan tambahan ini (personal branding untuk Aryo, dirilis open source, dan bisa dipakai tanpa internet) saling memperkuat kalau didesain bersamaan sejak awal.

### 11.1 Offline-First (PWA)
- Tambahkan `manifest.json` + service worker supaya bisa di-install ("Add to Home Screen") dan tetap berfungsi penuh tanpa internet setelah load pertama.
- Semua dependency (font, ikon, library JS) di-bundle lokal — jangan panggil CDN eksternal, supaya tidak gagal diam-diam saat offline.
- Sediakan opsi **"Download versi standalone (1 file HTML)"** untuk pengguna yang mau pakai tanpa install apapun — nilai jual unik dibanding tools serupa yang wajib online.
- Uji dengan mode pesawat sebagai bagian dari checklist rilis.

### 11.2 Open Source
- Lisensi: **MIT** — paling permisif, memaksimalkan adopsi & kontribusi, sejalan dengan tujuan personal branding (makin banyak dipakai/fork, makin luas nama Yoo.ai/Aryo tersebar).
- README.md kuat: value proposition di 2 kalimat pertama, GIF/screenshot demo, instruksi instal lokal, link demo live (GitHub Pages).
- **Model kontribusi database sebagai solusi maintenance**: buka `tools.json` untuk kontribusi komunitas lewat Pull Request — pengguna tool tertentu bisa submit update harga/tips sendiri, bukan Aryo sendirian riset ulang tiap bulan. Sediakan GitHub Action yang validasi schema `tools.json` otomatis di tiap PR.
- CONTRIBUTING.md yang jelas soal format entri tools baru (reuse skema di 5.1).
- Badge repo (license, build status) untuk sinyal profesionalisme.

### 11.3 Personal Branding
- Halaman **"Tentang"** singkat: siapa Aryo, kenapa Yoo.ai dibikin (mahasiswa Sains Data + digital marketer yang bikin tool ini dari kebutuhan sendiri) — taruh di satu halaman ini saja, bukan tersebar di semua tempat, biar app tetap terasa sebagai produk.
- Footer minimal: "Dibuat oleh Aryo Adiansyah" + link profil (GitHub/LinkedIn/StudyWithAI).
- Halaman/panel **Changelog** publik — tiap update database atau fitur baru dicatat singkat, sinyal "aktif dikembangkan" untuk kredibilitas.
- Sinergi dengan StudyWithAI: tiap kali menambah kategori/tool besar ke database, jadi bahan konten StudyWithAI ("cara pakai tool X buat belajar Y") — satu riset, dua output.

### 11.4 Fitur yang Melayani Branding + Open Source Sekaligus
- **"Bagikan alur sebagai gambar"** — dari hasil workflow stepper, tombol "Download sebagai gambar" (canvas/html-to-image di sisi klien, tanpa server) menghasilkan kartu ringkasan rapi dengan watermark kecil "dibuat dengan Yoo.ai" untuk dibagikan ke sosmed — distribusi organik.
- **"Usulkan tool"** — form yang men-generate draf GitHub Issue/PR (link pre-filled ke `github.com/.../issues/new?body=...`) supaya komunitas bisa kontribusi tanpa Aryo jadi satu-satunya sumber update dan tanpa perlu backend.
- **"Tool of the Month"** — satu tool disorot tiap bulan di beranda (data statis, update manual), jadi rutinitas konten yang gampang dipertahankan dan alasan pengunjung untuk kembali.

### 11.5 Catatan Penyeimbang
Kontribusi komunitas lewat GitHub berarti sebagian data datang dari luar — pastikan tetap ada proses review (minimal Aryo approve tiap PR manual di awal) sebelum masuk ke `main`, supaya kualitas & akurasi database tetap terjaga meski sumbernya terbuka.

## Lampiran A — Deskripsi Logo untuk Referensi Desainer/Claude Code

Monogram dua warna, gaya guratan tebal berujung bulat (hand-drawn, bukan geometris kaku):
- Elemen tengah biru navy (`#2B4C8C`) membentuk kombinasi huruf "Y" dan "O" berdampingan, sekaligus menyerupai wajah/mata sederhana — sisi kiri seperti huruf Y bersudut, sisi kanan lingkaran tebal dengan kotak kecil abu-abu di tengah seperti pupil.
- Elemen luar abu-abu kebiruan (`#A6ADC0`) membentuk garis tebal menyerupai gelembung ucapan/awan — mulai dari simpul kecil di kanan atas, melengkung mengelilingi bentuk biru, berakhir terbuka di kiri bawah.
- Kesan keseluruhan: ramah, modern, sedikit playful — bisa dibaca sebagai ikon mata (insight) atau ikon percakapan (assistant/chat), cocok untuk nama produk **Yoo.ai**.

## Lampiran B — Prompt Template untuk Pembaruan Database Berkala

Gunakan template ini di sesi chat AI baru (dengan akses web search aktif) secara berkala untuk memperbarui `tools.json`:

```
Saya sedang mengelola database tools AI/software untuk aplikasi bernama Yoo.ai.
Tolong riset informasi TERBARU untuk daftar tools berikut (dan tools baru yang
relevan di kategori yang sama), lalu kembalikan sebagai JSON sesuai skema ini:

{
  "id": "slug-unik",
  "name": "Nama Tool",
  "vendor": "Nama Vendor",
  "category": "kategori-bebas",
  "pricingTier": "free | freemium | paid",
  "freeAlternativeId": "id-tool-gratis-pengganti (opsional)",
  "pricing": { "amount": "...", "billingNote": "...", "verifiedAt": "YYYY-MM-DD" },
  "freeTierTips": ["tips 1", "tips 2"],
  "officialUrl": "https://...",
  "keywords": ["kata kunci pencarian"],
  "stageTags": ["tahap alur kerja terkait"],
  "description": "1-2 kalimat"
}

Daftar tools yang perlu dicek ulang: [TEMPEL DAFTAR ID/NAMA TOOLS LAMA DI SINI]
Kategori baru yang ingin ditambahkan (opsional): [ISI KALAU ADA]

Kembalikan HANYA file JSON lengkap ({ "dataVersion": "...", "lastUpdated": "...", "tools": [...] }),
tanpa penjelasan tambahan, supaya bisa langsung saya import ke Yoo.ai.
```

Hasil dari prompt ini tinggal disimpan sebagai file `.json` dan diimpor lewat halaman Pengaturan Yoo.ai (mode Merge/Update).
