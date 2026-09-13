import { useState } from "react";
import { useProjects } from "../context/ProjectsContext";
import { useToolsDb } from "../context/ToolsDbContext";
import { exportToFile } from "../lib/importExportManager";

function slugify(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "project";
}

function ProjectSidebar() {
  const { projects, create, rename, remove } = useProjects();
  const { tools } = useToolsDb();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [renameDraft, setRenameDraft] = useState("");

  const selected = projects.find((p) => p.id === selectedId) ?? null;

  function toolName(id: string): string {
    return tools.find((t) => t.id === id)?.name ?? id;
  }

  function handleCreate() {
    const name = newName.trim();
    if (!name) return;
    const project = create(name);
    setNewName("");
    setSelectedId(project.id);
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`Hapus project "${name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    remove(id);
    if (selectedId === id) setSelectedId(null);
  }

  return (
    <aside className="flex w-full flex-col gap-4 border-brand-slate/30 sm:w-72 sm:border-l sm:pl-4">
      <div>
        <h2 className="mb-2 text-sm font-semibold text-slate-900">Project Saya</h2>
        <div className="flex gap-1">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="Nama project baru"
            className="min-w-0 flex-1 rounded border border-brand-slate/50 px-2 py-1 text-sm outline-none focus:border-brand-navy"
          />
          <button type="button" onClick={handleCreate} className="shrink-0 rounded bg-brand-navy px-2 py-1 text-xs text-white">
            Buat
          </button>
        </div>
      </div>

      <ul className="flex flex-col gap-1">
        {projects.length === 0 && <li className="text-sm text-slate-500">Belum ada project tersimpan.</li>}
        {projects.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => {
                setSelectedId(p.id);
                setRenameDraft(p.name);
              }}
              className={`block w-full rounded px-2 py-1.5 text-left text-sm ${
                selectedId === p.id ? "bg-brand-navy text-white" : "hover:bg-brand-slate/10"
              }`}
            >
              {p.name}
            </button>
          </li>
        ))}
      </ul>

      {selected && (
        <div className="rounded-lg border border-brand-slate/40 p-3">
          <div className="flex gap-1">
            <input
              type="text"
              value={renameDraft}
              onChange={(e) => setRenameDraft(e.target.value)}
              className="min-w-0 flex-1 rounded border border-brand-slate/50 px-2 py-1 text-sm outline-none focus:border-brand-navy"
            />
            <button
              type="button"
              onClick={() => rename(selected.id, renameDraft.trim() || selected.name)}
              className="shrink-0 rounded border border-brand-navy px-2 py-1 text-xs text-brand-navy"
            >
              Simpan nama
            </button>
          </div>

          <p className="mt-3 text-xs font-semibold uppercase text-slate-500">Langkah tersimpan</p>
          {selected.savedSteps.length === 0 ? (
            <p className="text-sm text-slate-500">Belum ada langkah tersimpan.</p>
          ) : (
            <ul className="mt-1 list-disc pl-4 text-sm text-slate-700">
              {selected.savedSteps.map((s, i) => (
                <li key={i}>
                  {toolName(s.toolId)} — <span className="italic">{s.segmentLabel}</span>
                </li>
              ))}
            </ul>
          )}

          {selected.favoriteToolIds.length > 0 && (
            <>
              <p className="mt-3 text-xs font-semibold uppercase text-slate-500">Favorit</p>
              <ul className="mt-1 list-disc pl-4 text-sm text-slate-700">
                {selected.favoriteToolIds.map((id) => (
                  <li key={id}>{toolName(id)}</li>
                ))}
              </ul>
            </>
          )}

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => exportToFile(selected, `yooai-project-${slugify(selected.name)}.json`)}
              className="rounded border border-brand-navy px-2 py-1 text-xs text-brand-navy"
            >
              Export
            </button>
            <button
              type="button"
              onClick={() => handleDelete(selected.id, selected.name)}
              className="rounded border border-red-400 px-2 py-1 text-xs text-red-600"
            >
              Hapus
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}

export default ProjectSidebar;
