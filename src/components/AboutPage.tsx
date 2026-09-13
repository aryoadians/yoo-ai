function AboutPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-6 sm:px-6">
      <h1 className="text-xl font-semibold text-slate-900">Tentang</h1>

      <div className="flex flex-col items-center gap-4 rounded-lg border border-brand-slate/40 p-6 text-center sm:flex-row sm:text-left">
        <img
          src={`${import.meta.env.BASE_URL}profile.png`}
          alt="Foto profil Aryo Adiansyah"
          className="h-32 w-32 shrink-0 rounded-full border border-brand-slate/40 object-cover object-top sm:h-28 sm:w-28"
        />
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Aryo Adiansyah</h2>
          <p className="text-sm text-brand-navy">
            Mahasiswa S1 Sains Data (Universitas Terbuka) · Digital Marketing Support · Kreator StudyWithAI
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
            <a
              href="https://id.linkedin.com/in/aryoadiansyah"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-brand-navy px-3 py-1 text-xs font-medium text-brand-navy transition-colors duration-150 hover:bg-brand-navy hover:text-white"
            >
              LinkedIn
            </a>
            <a
              href="https://www.instagram.com/studywithai.id/"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-brand-navy px-3 py-1 text-xs font-medium text-brand-navy transition-colors duration-150 hover:bg-brand-navy hover:text-white"
            >
              Instagram · StudyWithAI
            </a>
          </div>
        </div>
      </div>

      <section className="flex flex-col gap-3 text-sm text-slate-700">
        <p>
          Aryo adalah mahasiswa Sains Data di Universitas Terbuka yang juga berkarier sebagai digital marketing
          support dan membuat konten edukasi lewat <strong>StudyWithAI</strong>. Sehari-hari, kebutuhannya
          bersinggungan dengan puluhan tool AI lintas vendor — mulai dari riset akademik, produksi konten,
          sampai otomatisasi bisnis.
        </p>
        <p>
          <strong>Kenapa Yoo.ai dibikin:</strong> ekosistem tool AI berubah sangat cepat dan tersebar di banyak
          vendor, sehingga sering bingung menentukan tool mana yang paling cocok untuk kebutuhan tertentu, dan
          kombinasi tool yang sudah terbukti jalan untuk sebuah project gampang terlupakan begitu saja. Yoo.ai
          dibangun untuk merapikan pengetahuan itu di satu tempat — 100% berjalan lokal di browser, tanpa akun,
          dan datanya bisa dibawa pindah kapan saja lewat file export/import.
        </p>
        <p>
          Ke depannya, Aryo mengarahkan fokusnya ke jalur <strong>AI specialist</strong> — membangun AI agent,
          produk SaaS/PaaS berbasis AI, dan workflow otomatisasi bisnis dengan n8n. Yoo.ai sendiri dirilis
          sebagai proyek open source, supaya siapa pun bisa memakai, mengembangkan, dan ikut berkontribusi pada
          database tools-nya.
        </p>
      </section>
    </div>
  );
}

export default AboutPage;
