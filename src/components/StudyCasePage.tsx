import { useMemo, useState } from "react";
import { useToolsDb } from "../context/ToolsDbContext";
import type { FilteredTool, WorkflowStep } from "../lib/searchEngine";
import { getAllWorkflows } from "../lib/workflowsStore";
import type { CuratedWorkflow } from "../types/models";
import WorkflowStepper from "./WorkflowStepper";

function categoryLabel(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function categorySlugId(slug: string): string {
  return `studi-kasus-kategori-${slug}`;
}

function resolveSteps(workflow: CuratedWorkflow, toolsById: Map<string, FilteredTool>): WorkflowStep[] {
  return workflow.steps.map((step) => ({
    segments: [step.instruction],
    tool: toolsById.get(step.toolId) ?? null,
  }));
}

function StudyCasePage() {
  const { tools } = useToolsDb();
  const [filter, setFilter] = useState("");

  const toolsById = useMemo(() => new Map(tools.map((t) => [t.id, t as FilteredTool])), [tools]);
  const workflows = useMemo(() => getAllWorkflows(), []);

  const grouped = useMemo(() => {
    const f = filter.trim().toLowerCase();
    const filtered = f
      ? workflows.filter(
          (w) =>
            w.title.toLowerCase().includes(f) ||
            w.summary.toLowerCase().includes(f) ||
            w.category.toLowerCase().includes(f) ||
            w.steps.some((s) => (toolsById.get(s.toolId)?.name ?? "").toLowerCase().includes(f)),
        )
      : workflows;

    const byCategory = new Map<string, CuratedWorkflow[]>();
    for (const wf of filtered) {
      const list = byCategory.get(wf.category) ?? [];
      list.push(wf);
      byCategory.set(wf.category, list);
    }
    for (const list of byCategory.values()) {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }
    return [...byCategory.entries()].sort((a, b) => categoryLabel(a[0]).localeCompare(categoryLabel(b[0])));
  }, [workflows, filter, toolsById]);

  const totalShown = grouped.reduce((sum, [, list]) => sum + list.length, 0);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Studi Kasus: Alur Kerja Siap Pakai</h1>
        <p className="mt-1 text-sm text-slate-600">
          Kalau kebutuhanmu masih umum (mis. "bikin konten iklan"), halaman ini kasih alur langkah-demi-langkah
          yang sudah disusun manual — bukan hasil pencarian bebas — lengkap dengan tool spesifik untuk tiap
          tahap. {workflows.length} studi kasus tersedia.
        </p>
      </div>

      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Cari studi kasus, kategori, atau nama tool..."
        className="w-full rounded-lg border border-brand-slate/50 px-4 py-2.5 text-sm outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/30"
      />

      {grouped.length === 0 ? (
        <p className="text-sm text-slate-500">Tidak ada studi kasus yang cocok dengan filter ini.</p>
      ) : (
        <>
          <nav aria-label="Daftar kategori studi kasus" className="rounded-lg border border-brand-slate/40 p-3 text-sm">
            <p className="mb-1 text-xs font-semibold uppercase text-slate-500">Lompat ke kategori</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {grouped.map(([slug, list]) => (
                <a key={slug} href={`#${categorySlugId(slug)}`} className="text-brand-navy underline">
                  {categoryLabel(slug)} ({list.length})
                </a>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Menampilkan {totalShown} dari {workflows.length} studi kasus.
            </p>
          </nav>

          <div className="flex flex-col gap-8">
            {grouped.map(([slug, list]) => (
              <section key={slug} id={categorySlugId(slug)}>
                <h2 className="border-b border-brand-slate/30 pb-1 text-lg font-semibold text-brand-navy">
                  {categoryLabel(slug)}
                </h2>
                <div className="mt-3 flex flex-col gap-6">
                  {list.map((wf) => (
                    <article key={wf.id} className="rounded-lg border border-brand-slate/30 p-4">
                      <h3 className="font-semibold text-slate-900">{wf.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">{wf.summary}</p>
                      <div className="mt-3">
                        <WorkflowStepper steps={resolveSteps(wf, toolsById)} />
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default StudyCasePage;
