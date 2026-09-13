import { useState } from "react";

/** Kotak "Cara pakai" yang bisa di-collapse, dipakai di halaman Artikel (dedicated reading page). */
function TutorialSection({ steps }: { steps: string[] }) {
  const [open, setOpen] = useState(false);
  if (steps.length === 0) return null;

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-100"
      >
        <span aria-hidden className={`inline-block transition-transform duration-150 ${open ? "rotate-90" : ""}`}>
          ▸
        </span>
        🛠️ Cara pakai
      </button>
      {open && (
        <ol className="mt-2 list-decimal space-y-1 rounded-md bg-slate-50 py-2 pl-8 pr-3 text-xs text-slate-700">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default TutorialSection;
