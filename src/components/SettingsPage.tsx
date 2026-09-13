import { useRef, useState } from "react";
import { useProjects } from "../context/ProjectsContext";
import { useToolsDb } from "../context/ToolsDbContext";
import {
  exportToFile,
  importFromFile,
  validateProjectsImport,
  validateToolsDbFile,
} from "../lib/importExportManager";
import * as toolsStore from "../lib/toolsStore";
import type { ValidationError } from "../types/models";

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(
      new Date(iso),
    );
  } catch {
    return iso;
  }
}

function ErrorList({ errors }: { errors: ValidationError[] }) {
  return (
    <ul className="mt-2 list-disc pl-5 text-xs text-red-700">
      {errors.slice(0, 10).map((e, i) => (
        <li key={i}>
          <span className="font-mono">{e.path}</span>: {e.message}
        </li>
      ))}
      {errors.length > 10 && <li>...dan {errors.length - 10} error lainnya.</li>}
    </ul>
  );
}

function SettingsPage() {
  const { meta, tools, replaceAll } = useToolsDb();
  const { addImportedProjects, projects } = useProjects();

  const [toolsMessage, setToolsMessage] = useState<{ text: string; isError: boolean; errors?: ValidationError[] } | null>(
    null,
  );
  const [projectsMessage, setProjectsMessage] = useState<{
    text: string;
    isError: boolean;
    errors?: ValidationError[];
  } | null>(null);

  const toolsFileInputRef = useRef<HTMLInputElement>(null);
  const projectsFileInputRef = useRef<HTMLInputElement>(null);

  async function handleToolsImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const result = await importFromFile(file, validateToolsDbFile);
    if (!result.valid) {
      setToolsMessage({ text: "Import gagal — file tidak sesuai skema.", isError: true, errors: result.errors });
      return;
    }

    const confirmed = confirm(
      `Replace All akan menimpa seluruh database tools saat ini (${tools.length} tools) dengan ${result.data.tools.length} tools dari file ini. Lanjutkan?`,
    );
    if (!confirmed) return;

    const before = new Set(tools.map((t) => t.id));
    const after = new Set(result.data.tools.map((t) => t.id));
    const added = [...after].filter((id) => !before.has(id)).length;
    const updated = [...after].filter((id) => before.has(id)).length;
    const unchanged = [...before].filter((id) => !after.has(id)).length;

    replaceAll(result.data);
    setToolsMessage({
      text: `Import berhasil: ${added} tools ditambahkan, ${updated} tools diperbarui/dipertahankan, ${unchanged} tools lama tidak ada di file baru (hilang karena mode Replace All).`,
      isError: false,
    });
  }

  async function handleProjectsImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const result = await importFromFile(file, validateProjectsImport);
    if (!result.valid) {
      setProjectsMessage({ text: "Import gagal — file tidak sesuai skema.", isError: true, errors: result.errors });
      return;
    }

    const { added, skipped } = addImportedProjects(result.data);
    setProjectsMessage({
      text: `Import selesai: ${added} project ditambahkan, ${skipped} dilewati (id sudah ada).`,
      isError: false,
    });
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-6 sm:px-6">
      <h1 className="text-xl font-semibold text-slate-900">Pengaturan</h1>

      <section className="rounded-lg border border-brand-slate/40 p-4">
        <h2 className="text-sm font-semibold text-slate-900">Database Tools</h2>
        <p className="mt-1 text-sm text-slate-600">
          Database terakhir diperbarui: <strong>{formatDate(meta.lastUpdated)}</strong> ({tools.length} tools)
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => exportToFile(toolsStore.getRawFile(), "tools.json")}
            className="rounded border border-brand-navy px-3 py-1.5 text-sm text-brand-navy"
          >
            Export Database Tools
          </button>
          <button
            type="button"
            onClick={() => toolsFileInputRef.current?.click()}
            className="rounded bg-brand-navy px-3 py-1.5 text-sm text-white"
          >
            Import Database Tools (Replace All)
          </button>
          <input
            ref={toolsFileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleToolsImport}
          />
        </div>
        {toolsMessage && (
          <div className={`mt-2 text-sm ${toolsMessage.isError ? "text-red-700" : "text-green-700"}`}>
            {toolsMessage.text}
            {toolsMessage.errors && <ErrorList errors={toolsMessage.errors} />}
          </div>
        )}
      </section>

      <section className="rounded-lg border border-brand-slate/40 p-4">
        <h2 className="text-sm font-semibold text-slate-900">Project</h2>
        <p className="mt-1 text-sm text-slate-600">{projects.length} project tersimpan.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              exportToFile({ schemaVersion: 1, projects }, "yooai-projects-semua.json")
            }
            className="rounded border border-brand-navy px-3 py-1.5 text-sm text-brand-navy"
          >
            Export Semua Project
          </button>
          <button
            type="button"
            onClick={() => projectsFileInputRef.current?.click()}
            className="rounded bg-brand-navy px-3 py-1.5 text-sm text-white"
          >
            Import Project
          </button>
          <input
            ref={projectsFileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleProjectsImport}
          />
        </div>
        {projectsMessage && (
          <div className={`mt-2 text-sm ${projectsMessage.isError ? "text-red-700" : "text-green-700"}`}>
            {projectsMessage.text}
            {projectsMessage.errors && <ErrorList errors={projectsMessage.errors} />}
          </div>
        )}
      </section>
    </div>
  );
}

export default SettingsPage;
