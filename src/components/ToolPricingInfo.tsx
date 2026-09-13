import { useState } from "react";
import type { FilteredTool } from "../lib/searchEngine";

const TIER_LABEL: Record<string, string> = {
  free: "GRATIS",
  freemium: "FREEMIUM",
  paid: "BERBAYAR",
};

const TIER_CLASS: Record<string, string> = {
  free: "bg-green-100 text-green-800",
  freemium: "bg-amber-100 text-amber-800",
  paid: "bg-brand-navy/10 text-brand-navy",
};

/** Badge harga + tips anti-limit sesuai PRD 5.4. */
function ToolPricingInfo({ tool }: { tool: FilteredTool }) {
  const [tipsOpen, setTipsOpen] = useState(false);

  return (
    <div className="mt-1 flex flex-col gap-1">
      {tool.isSubstitutedFreeAlternative && tool.substitutedFromName && (
        <p className="text-xs italic text-brand-navy">Alternatif gratis dari {tool.substitutedFromName}</p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded px-2 py-0.5 text-xs font-semibold ${TIER_CLASS[tool.pricingTier]}`}>
          {TIER_LABEL[tool.pricingTier]}
        </span>
        {tool.pricingTier === "paid" && (
          <>
            <span className="text-xs text-slate-700">{tool.pricing.amount}</span>
            <a
              href={tool.officialUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-brand-navy underline"
            >
              Cek harga terbaru
            </a>
          </>
        )}
        {tool.needsPriceVerification && (
          <span className="text-xs text-amber-700" title="Harga diisi dari pengetahuan umum, belum dicek ulang lewat riset live.">
            ⚠ Perlu verifikasi harga
          </span>
        )}
      </div>
      {tool.pricingTier === "freemium" && tool.freeTierTips.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setTipsOpen((o) => !o)}
            aria-expanded={tipsOpen}
            className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 transition-colors hover:bg-amber-100 active:bg-amber-200"
          >
            <span aria-hidden className={`inline-block transition-transform ${tipsOpen ? "rotate-90" : ""}`}>
              ▸
            </span>
            💡 Tips biar nggak limit
            <span className="rounded-full bg-amber-200 px-1.5 text-[10px] font-semibold text-amber-900">
              {tool.freeTierTips.length}
            </span>
          </button>
          {tipsOpen && (
            <ul className="mt-2 list-disc space-y-1 rounded-md bg-amber-50/60 py-2 pl-8 pr-3 text-xs text-slate-700">
              {tool.freeTierTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default ToolPricingInfo;
