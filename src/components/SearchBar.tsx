import { useEffect, useRef, useState } from "react";

const SUGGESTIONS = [
  "Pelajari materi baru, perdalam, lalu bikin presentasi, lalu bikin aplikasi interaktif",
  "Bikin dashboard order tracker",
  "Bikin poster promo dengan teks jelas",
  "Bikin presentasi dari materi kuliah",
  "Otomatisasi balasan WA customer",
  "Bikin video promo pendek buat TikTok",
  "Perbaiki bug di kode",
  "Analisa brand & bikin campaign marketing",
  "Desain tampilan aplikasi",
];

const DEBOUNCE_MS = 150;

interface SearchBarProps {
  onSearch: (query: string) => void;
}

function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onSearch(value), DEBOUNCE_MS);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const filtered = value.trim()
    ? SUGGESTIONS.filter((s) => s.toLowerCase().includes(value.trim().toLowerCase()))
    : SUGGESTIONS;

  function selectSuggestion(s: string) {
    setValue(s);
    setShowDropdown(false);
    onSearch(s);
  }

  return (
    <div ref={wrapRef} className="relative w-full">
      <input
        type="text"
        value={value}
        placeholder="Mau bikin apa? mis. 'bikin poster promo'"
        onFocus={() => setShowDropdown(true)}
        onChange={(e) => {
          setValue(e.target.value);
          setShowDropdown(true);
        }}
        className="w-full rounded-lg border border-brand-slate/50 px-4 py-3 text-base outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/30"
      />
      {showDropdown && filtered.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-brand-slate/40 bg-white shadow-lg">
          {filtered.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => selectSuggestion(s)}
              className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-brand-slate/10"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
