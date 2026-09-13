import { useRef, useState } from "react";
import { useProjects } from "../context/ProjectsContext";

interface SaveToProjectMenuProps {
  toolId: string;
  segmentLabel: string;
}

function SaveToProjectMenu({ toolId, segmentLabel }: SaveToProjectMenuProps) {
  const { projects, create, addSavedStep } = useProjects();
  const [open, setOpen] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  function saveTo(projectId: string, projectName: string) {
    addSavedStep(projectId, { segmentLabel, toolId, userNote: "" });
    setOpen(false);
    setSavedMessage(`Tersimpan ke "${projectName}"`);
    setTimeout(() => setSavedMessage(null), 2500);
  }

  function handleCreateAndSave() {
    const name = newProjectName.trim();
    if (!name) return;
    const project = create(name);
    saveTo(project.id, project.name);
    setNewProjectName("");
  }

  return (
    <div ref={wrapRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="rounded-md border border-brand-navy px-2.5 py-1 text-xs font-medium text-brand-navy hover:bg-brand-navy/10"
      >
        + Simpan ke Project
      </button>
      {savedMessage && <p className="mt-1 text-xs text-green-700">{savedMessage}</p>}
      {open && (
        <div className="absolute z-10 mt-1 w-64 rounded-lg border border-brand-slate/40 bg-white p-2 shadow-lg">
          {projects.length > 0 && (
            <ul className="mb-2 max-h-40 overflow-y-auto text-sm">
              {projects.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => saveTo(p.id, p.name)}
                    className="block w-full rounded px-2 py-1 text-left hover:bg-brand-slate/10"
                  >
                    {p.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="flex gap-1">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Nama project baru"
              className="min-w-0 flex-1 rounded border border-brand-slate/50 px-2 py-1 text-sm outline-none focus:border-brand-navy"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateAndSave();
              }}
            />
            <button
              type="button"
              onClick={handleCreateAndSave}
              className="shrink-0 rounded bg-brand-navy px-2 py-1 text-xs text-white"
            >
              Buat & simpan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SaveToProjectMenu;
