import type { FilteredTool } from "../lib/searchEngine";
import SaveToProjectMenu from "./SaveToProjectMenu";
import ToolExpandableDetails from "./ToolExpandableDetails";
import ToolPricingInfo from "./ToolPricingInfo";

interface ResultCardsProps {
  results: FilteredTool[];
  queryLabel: string;
}

function ResultCards({ results, queryLabel }: ResultCardsProps) {
  return (
    <div className="flex flex-col gap-3">
      {results.map((tool, i) => (
        <div
          key={tool.id}
          className={`rounded-lg border p-4 ${
            i === 0 ? "border-brand-navy bg-brand-navy/5" : "border-brand-slate/40 bg-white"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-navy text-xs font-bold text-white">
              {i + 1}
            </span>
            <span className="font-semibold text-slate-900">{tool.name}</span>
            <span className="text-xs text-slate-500">{tool.vendor}</span>
            {i === 0 && (
              <span className="ml-auto rounded bg-brand-navy px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                Paling cocok
              </span>
            )}
          </div>
          <ToolExpandableDetails description={tool.description} studyCase={tool.studyCase} tutorial={tool.tutorial} />
          <ToolPricingInfo tool={tool} />
          <div className="mt-2">
            <SaveToProjectMenu toolId={tool.id} segmentLabel={queryLabel} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ResultCards;
