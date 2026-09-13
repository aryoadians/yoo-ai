import type { ReactNode } from "react";

interface GuideSection {
  id: string;
  title: string;
  body: ReactNode;
}

const SECTIONS: GuideSection[] = [
  {
    id: "cari",
    title: "1. Menu Cari",
    body: (
      <>
        <p>Ketik kebutuhanmu di kolom pencarian pakai bahasa sehari-hari, misalnya "bikin poster promo".</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Klik kolom pencariannya buat lihat beberapa contoh query di dropdown.</li>
          <li>
            Kalau kebutuhanmu satu hal saja, hasilnya muncul sebagai <strong>kartu ranking</strong> (top-3, kartu
            pertama ditandai "Paling cocok").
          </li>
          <li>
            Kalau kebutuhanmu berupa alur bertahap (dipisah koma atau kata "lalu", "kemudian", dst — mis. "riset
            materi, lalu bikin presentasi, lalu bikin video"), hasilnya muncul sebagai{" "}
            <strong>alur bertahap (stepper)</strong> bernomor.
          </li>
          <li>
            Klik tombol <strong>"Termasuk Berbayar" / "Hanya Gratis"</strong> untuk memfilter hasil — mode Hanya
            Gratis otomatis menampilkan alternatif gratis kalau tool teratas ternyata berbayar.
          </li>
          <li>
            Di tiap kartu tool, klik <strong>"Baca selengkapnya & cara pakai"</strong> untuk lihat deskripsi
            lengkap, contoh study case, dan langkah-langkah cara memakai tool tersebut.
          </li>
          <li>
            Klik <strong>"+ Simpan ke Project"</strong> di kartu manapun untuk menyimpan tool itu ke salah satu
            Project kamu (atau buat Project baru langsung dari situ).
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "studi-kasus",
    title: "2. Menu Studi Kasus",
    body: (
      <p>
        Kalau kebutuhanmu masih umum (mis. "bikin konten iklan" atau "nulis skripsi"), buka menu ini untuk lihat
        alur kerja siap pakai yang sudah disusun langkah demi langkah, lengkap dengan tool spesifik untuk tiap
        tahap. Pakai kolom pencarian atau daftar "Lompat ke kategori" untuk cepat menemukan studi kasus yang
        relevan.
      </p>
    ),
  },
  {
    id: "artikel",
    title: "3. Menu Artikel",
    body: (
      <p>
        Direktori lengkap semua tools di database Yoo.ai, dikelompokkan per kategori. Cocok dipakai untuk
        eksplorasi bebas (bukan berdasarkan kebutuhan spesifik) — mis. lihat semua tool di kategori "generate
        video" sekaligus. Sama seperti menu Cari, tiap tool punya study case dan tombol "Cara pakai".
      </p>
    ),
  },
  {
    id: "project",
    title: "4. Kelola Project",
    body: (
      <>
        <p>Panel "Project Saya" muncul di samping hasil pencarian pada menu Cari.</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Ketik nama lalu klik "Buat" untuk bikin Project baru.</li>
          <li>Klik nama Project di daftar untuk membukanya — di situ kelihatan semua langkah tersimpan.</li>
          <li>Ganti nama lewat kolom rename, atau hapus lewat tombol "Hapus" (perlu konfirmasi).</li>
          <li>Tombol "Export" mengunduh Project itu sebagai file `.json` yang bisa disimpan atau dipindah.</li>
        </ul>
      </>
    ),
  },
  {
    id: "pengaturan",
    title: "5. Menu Pengaturan",
    body: (
      <>
        <p>Tempat mengelola data secara menyeluruh:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Export/Import Database Tools</strong> — unduh atau ganti seluruh database tools (mode saat
            ini: Replace All, jadi file yang diimpor akan menimpa seluruh database lama).
          </li>
          <li>
            <strong>Export/Import Project</strong> — unduh semua Project sekaligus, atau impor file Project dari
            device lain (project yang sudah ada tidak akan ketimpa).
          </li>
          <li>Tanggal "Database terakhir diperbarui" menunjukkan seberapa baru data harga/tool yang kamu pakai.</li>
        </ul>
      </>
    ),
  },
  {
    id: "install-offline",
    title: "6. Install jadi App & Pakai Offline",
    body: (
      <>
        <p>Yoo.ai bisa di-install seperti aplikasi biasa dan tetap jalan tanpa internet setelah dibuka sekali:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Android (Chrome):</strong> buka menu titik tiga di pojok kanan atas → "Add to Home
            screen"/"Install app".
          </li>
          <li>
            <strong>iPhone/iPad (Safari):</strong> tombol Share (kotak dengan panah ke atas) → "Add to Home
            Screen".
          </li>
          <li>
            <strong>Desktop (Chrome/Edge):</strong> klik ikon install di address bar (biasanya di sisi kanan kolom
            URL).
          </li>
          <li>Setelah pertama kali dibuka, semua fitur (kecuali export/import file) tetap bisa dipakai offline.</li>
        </ul>
      </>
    ),
  },
];

function GuidePage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Panduan: Cara Pakai Yoo.ai</h1>
        <p className="mt-1 text-sm text-slate-600">
          Yoo.ai bantu kamu cari tool AI paling cocok untuk kebutuhanmu, simpan kombinasi tools ke Project, dan
          semuanya berjalan lokal di browser tanpa akun. Berikut cara pakai tiap fiturnya.
        </p>
      </div>

      <nav aria-label="Daftar bagian panduan" className="rounded-lg border border-brand-slate/40 p-3 text-sm">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="text-brand-navy underline">
              {s.title}
            </a>
          ))}
        </div>
      </nav>

      <div className="flex flex-col gap-6">
        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id}>
            <h2 className="border-b border-brand-slate/30 pb-1 text-lg font-semibold text-brand-navy">{s.title}</h2>
            <div className="mt-2 flex flex-col gap-2 text-sm text-slate-700">{s.body}</div>
          </section>
        ))}
      </div>
    </div>
  );
}

export default GuidePage;
