import type { PricingMode } from "../types/models";

interface PricingToggleProps {
  mode: PricingMode;
  onChange: (mode: PricingMode) => void;
}

/**
 * PRD 5.3 menjabarkan tiga label ("Semua / Hanya Gratis / Termasuk Berbayar") untuk dua
 * perilaku: "Semua" dan "Termasuk Berbayar" sama-sama menampilkan semua tool dengan badge
 * harga, jadi keduanya dipetakan ke PricingMode "all" di sini (lihat catatan di models.ts).
 */
function PricingToggle({ mode, onChange }: PricingToggleProps) {
  return (
    <div className="inline-flex rounded-md border border-brand-slate/50 p-0.5 text-sm">
      <button
        type="button"
        onClick={() => onChange("all")}
        className={`rounded px-3 py-1 ${mode === "all" ? "bg-brand-navy text-white" : "text-slate-700"}`}
      >
        Termasuk Berbayar
      </button>
      <button
        type="button"
        onClick={() => onChange("free-only")}
        className={`rounded px-3 py-1 ${mode === "free-only" ? "bg-brand-navy text-white" : "text-slate-700"}`}
      >
        Hanya Gratis
      </button>
    </div>
  );
}

export default PricingToggle;
