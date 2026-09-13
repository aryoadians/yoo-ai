import { useEffect, useState } from "react";
import type { PageId } from "../App";

interface HeaderProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}

const NAV_ITEMS: { id: PageId; label: string }[] = [
  { id: "search", label: "Cari" },
  { id: "studycase", label: "Studi Kasus" },
  { id: "article", label: "Artikel" },
  { id: "about", label: "Tentang" },
  { id: "settings", label: "Pengaturan" },
];

function Header({ activePage, onNavigate }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Tutup panel otomatis kalau layar melebar ke breakpoint desktop (mis. rotasi tablet).
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handle = () => setMenuOpen(false);
    mq.addEventListener("change", handle);
    return () => mq.removeEventListener("change", handle);
  }, []);

  // Kunci scroll body saat panel mobile terbuka.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function handleNavigate(page: PageId) {
    onNavigate(page);
    setMenuOpen(false);
  }

  return (
    <header className="relative flex items-center justify-between border-b border-brand-slate/40 px-4 py-3 sm:px-6">
      <div className="flex items-center gap-2">
        <img
          src={`${import.meta.env.BASE_URL}favicon.svg`}
          alt="Logo Yoo.ai"
          className="h-8 w-8 shrink-0 sm:h-9 sm:w-9"
        />
        <span className="text-lg font-semibold text-brand-navy">Yoo.ai</span>
      </div>

      {/* Nav untuk layar sm ke atas */}
      <nav className="hidden flex-wrap gap-1 text-sm md:flex">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleNavigate(item.id)}
            className={`rounded-md px-2.5 py-1.5 transition-colors duration-150 ${
              activePage === item.id ? "bg-brand-navy text-white" : "text-brand-navy hover:bg-brand-slate/20"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Tombol hamburger, cuma tampil di mobile */}
      <button
        type="button"
        onClick={() => setMenuOpen(true)}
        aria-label="Buka menu navigasi"
        aria-expanded={menuOpen}
        className="flex h-9 w-9 items-center justify-center rounded-md text-brand-navy transition-colors duration-150 hover:bg-brand-slate/20 md:hidden"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Backdrop panel mobile */}
      <div
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-30 bg-slate-900/30 transition-opacity duration-200 md:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel navigasi samping (mobile) */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigasi"
        className={`fixed inset-y-0 right-0 z-40 flex w-64 max-w-[80vw] flex-col gap-1 bg-white p-4 shadow-xl transition-transform duration-200 ease-out md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Menu</span>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Tutup menu"
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors duration-150 hover:bg-brand-slate/20"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleNavigate(item.id)}
            className={`rounded-md px-3 py-2 text-left text-sm transition-colors duration-150 ${
              activePage === item.id ? "bg-brand-navy text-white" : "text-brand-navy hover:bg-brand-slate/20"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
}

export default Header;
