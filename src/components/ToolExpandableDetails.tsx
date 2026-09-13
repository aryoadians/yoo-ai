import { useState } from "react";

interface ToolExpandableDetailsProps {
  description: string;
  studyCase?: string;
  tutorial?: string[];
}

/** Deskripsi tool yang bisa di-expand buat lihat versi lengkap + study case + tutorial, dipakai di tampilan ringkas (kartu hasil/stepper). */
function ToolExpandableDetails({ description, studyCase, tutorial }: ToolExpandableDetailsProps) {
  const [open, setOpen] = useState(false);
  const hasExtra = Boolean(studyCase) || Boolean(tutorial && tutorial.length > 0);

  return (
    <div className="mt-1">
      <p className={`text-sm text-slate-700 ${open ? "" : "line-clamp-2"}`}>{description}</p>
      {(description.length > 90 || hasExtra) && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="mt-1 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium text-brand-navy hover:bg-brand-navy/10"
        >
          <span aria-hidden className={`inline-block transition-transform ${open ? "rotate-90" : ""}`}>
            ▸
          </span>
          {open ? "Ringkas" : hasExtra ? "Baca selengkapnya & cara pakai" : "Baca selengkapnya"}
        </button>
      )}
      {open && studyCase && (
        <div className="mt-2 rounded-md border-l-4 border-brand-navy bg-brand-navy/5 py-2 pl-3 pr-2 text-xs text-slate-700">
          <span className="font-semibold text-brand-navy">📌 Study case: </span>
          {studyCase}
        </div>
      )}
      {open && tutorial && tutorial.length > 0 && (
        <div className="mt-2 rounded-md bg-slate-50 py-2 pl-3 pr-2 text-xs text-slate-700">
          <p className="mb-1 font-semibold text-slate-800">🛠️ Cara pakai:</p>
          <ol className="list-decimal space-y-1 pl-4">
            {tutorial.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export default ToolExpandableDetails;
