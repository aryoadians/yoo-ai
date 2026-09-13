import type { FilteredTool } from "../lib/searchEngine";
import SaveToProjectMenu from "./SaveToProjectMenu";
import ToolExpandableDetails from "./ToolExpandableDetails";
import ToolPricingInfo from "./ToolPricingInfo";

interface WorkflowStepperStep {
  segments: string[];
  tool: FilteredTool | null;
}

interface WorkflowStepperProps {
  steps: WorkflowStepperStep[];
}

function WorkflowStepper({ steps }: WorkflowStepperProps) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Alur yang direkomendasikan
      </p>
      <div className="flex flex-col">
        {steps.map((step, i) => (
          <div key={i} className="relative flex gap-3 pb-6 last:pb-0">
            {i < steps.length - 1 && (
              <span className="absolute left-3 top-7 h-full w-px bg-brand-slate/40" aria-hidden />
            )}
            <span className="z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-navy text-xs font-bold text-white">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-xs italic text-slate-500">
                {step.segments.map((s) => `"${s}"`).join(" → ")}
              </p>
              {step.tool ? (
                <div className="mt-1 rounded-lg border border-brand-slate/40 bg-white p-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{step.tool.name}</span>
                    <span className="text-xs text-slate-500">{step.tool.vendor}</span>
                  </div>
                  <ToolExpandableDetails
                    description={step.tool.description}
                    studyCase={step.tool.studyCase}
                    tutorial={step.tool.tutorial}
                  />
                  <ToolPricingInfo tool={step.tool} />
                  <div className="mt-2">
                    <SaveToProjectMenu toolId={step.tool.id} segmentLabel={step.segments.join(" / ")} />
                  </div>
                </div>
              ) : (
                <p className="mt-1 rounded-lg border border-dashed border-brand-slate/40 p-3 text-sm text-slate-500">
                  Belum ketemu tool spesifik buat bagian ini — coba kata lain.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkflowStepper;
