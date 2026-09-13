import { useMemo, useState } from "react";
import { useToolsDb } from "../context/ToolsDbContext";
import type { FilteredTool } from "../lib/searchEngine";
import SaveToProjectMenu from "./SaveToProjectMenu";
import ToolPricingInfo from "./ToolPricingInfo";
import TutorialSection from "./TutorialSection";

function categoryLabel(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function categorySlugId(slug: string): string {
  return `kategori-${slug}`;
}

function ArticlePage() {
  const { tools, meta } = useToolsDb();
  const [filter, setFilter] = useState("");

  const grouped = useMemo(() => {
    const f = filter.trim().toLowerCase();
    const filtered = f
      ? tools.filter(
          (t) =>
            t.name.toLowerCase().includes(f) ||
            t.vendor.toLowerCase().includes(f) ||
            t.category.toLowerCase().includes(f) ||
            t.keywords.some((k) => k.toLowerCase().includes(f)),
        )
      : tools;

    const byCategory = new Map<string, FilteredTool[]>();
    for (const tool of filtered) {
      const list = byCategory.get(tool.category) ?? [];
      list.push(tool);
      byCategory.set(tool.category, list);
    }
    for (const list of byCategory.values()) {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return [...byCategory.entries()].sort((a, b) => categoryLabel(a[0]).localeCompare(categoryLabel(b[0])));
  }, [tools, filter]);

  const totalShown = grouped.reduce((sum, [, list]) => sum + list.length, 0);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Artikel: Kenalan dengan Semua Tools AI di Yoo.ai</h1>
        <p className="mt-1 text-sm text-slate-600">
          Penjelasan tiap tool di database Yoo.ai, dikelompokkan per kategori — di-generate otomatis dari{" "}
          <code className="rounded bg-brand-slate/10 px-1 py-0.5 text-xs">tools.json</code>, jadi selalu sinkron
          dengan hasil pencarian. {tools.length} tools total, data per{" "}
          {new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(
            new Date(meta.lastUpdated),
          )}
          .
        </p>
      </div>

      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Cari nama tool, vendor, atau kategori..."
        className="w-full rounded-lg border border-brand-slate/50 px-4 py-2.5 text-sm outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/30"
      />

      {grouped.length === 0 ? (
        <p className="text-sm text-slate-500">Tidak ada tool yang cocok dengan filter ini.</p>
      ) : (
        <>
          <nav aria-label="Daftar kategori" className="rounded-lg border border-brand-slate/40 p-3 text-sm">
            <p className="mb-1 text-xs font-semibold uppercase text-slate-500">Lompat ke kategori</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {grouped.map(([slug, list]) => (
                <a key={slug} href={`#${categorySlugId(slug)}`} className="text-brand-navy underline">
                  {categoryLabel(slug)} ({list.length})
                </a>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-500">Menampilkan {totalShown} dari {tools.length} tools.</p>
          </nav>

          <div className="flex flex-col gap-8">
            {grouped.map(([slug, list]) => (
              <section key={slug} id={categorySlugId(slug)}>
                <h2 className="border-b border-brand-slate/30 pb-1 text-lg font-semibold text-brand-navy">
                  {categoryLabel(slug)}
                </h2>
                <div className="mt-3 flex flex-col gap-4">
                  {list.map((tool) => (
                    <article key={tool.id} className="rounded-lg border border-brand-slate/30 p-4">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <h3 className="font-semibold text-slate-900">{tool.name}</h3>
                        <span className="text-xs text-slate-500">oleh {tool.vendor}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-700">{tool.description}</p>
                      {tool.studyCase && (
                        <div className="mt-2 rounded-md border-l-4 border-brand-navy bg-brand-navy/5 py-2 pl-3 pr-2 text-xs text-slate-700">
                          <span className="font-semibold text-brand-navy">📌 Study case: </span>
                          {tool.studyCase}
                        </div>
                      )}
                      <ToolPricingInfo tool={tool} />
                      <TutorialSection steps={tool.tutorial ?? []} />
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <a
                          href={tool.officialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-brand-navy underline"
                        >
                          Situs resmi
                        </a>
                        <SaveToProjectMenu toolId={tool.id} segmentLabel="Dari halaman Artikel" />
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

export default ArticlePage;
