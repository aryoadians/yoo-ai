import type { Project, ProjectsFile, SavedStep } from "../types/models";

const STORAGE_KEY = "yooai_projects";
const SCHEMA_VERSION = 1;

function readFile(): ProjectsFile {
  if (typeof localStorage === "undefined") return { schemaVersion: SCHEMA_VERSION, projects: [] };
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { schemaVersion: SCHEMA_VERSION, projects: [] };
  try {
    const parsed = JSON.parse(raw) as ProjectsFile;
    return { schemaVersion: parsed.schemaVersion ?? SCHEMA_VERSION, projects: parsed.projects ?? [] };
  } catch {
    return { schemaVersion: SCHEMA_VERSION, projects: [] };
  }
}

function writeFile(file: ProjectsFile): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(file));
}

function genId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `proj_${crypto.randomUUID()}`;
  }
  return `proj_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

/** Daftar project, urut updatedAt terbaru dulu (PRD 5.5). */
export function list(): Project[] {
  return [...readFile().projects].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function get(id: string): Project | undefined {
  return readFile().projects.find((p) => p.id === id);
}

export function create(name: string): Project {
  const file = readFile();
  const project: Project = {
    schemaVersion: SCHEMA_VERSION,
    id: genId(),
    name,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    notes: "",
    savedSteps: [],
    favoriteToolIds: [],
  };
  file.projects.push(project);
  writeFile(file);
  return project;
}

function update(id: string, mutate: (project: Project) => void): void {
  const file = readFile();
  const project = file.projects.find((p) => p.id === id);
  if (!project) return;
  mutate(project);
  project.updatedAt = nowIso();
  writeFile(file);
}

export function rename(id: string, name: string): void {
  update(id, (p) => {
    p.name = name;
  });
}

export function remove(id: string): void {
  const file = readFile();
  file.projects = file.projects.filter((p) => p.id !== id);
  writeFile(file);
}

export function addSavedStep(id: string, step: SavedStep): void {
  update(id, (p) => {
    p.savedSteps.push(step);
  });
}

export function toggleFavorite(id: string, toolId: string): void {
  update(id, (p) => {
    const idx = p.favoriteToolIds.indexOf(toolId);
    if (idx === -1) {
      p.favoriteToolIds.push(toolId);
    } else {
      p.favoriteToolIds.splice(idx, 1);
    }
  });
}

export function getAllAsFile(): ProjectsFile {
  return readFile();
}

/**
 * Import Project (PRD 5.5): selalu MENAMBAH ke daftar, tidak pernah menimpa project lain.
 * Project dengan id yang sudah ada di-skip (dianggap sudah tersimpan), bukan ditimpa.
 */
export function addImportedProjects(incoming: Project[]): { added: number; skipped: number } {
  const file = readFile();
  const existingIds = new Set(file.projects.map((p) => p.id));
  let added = 0;
  let skipped = 0;
  for (const project of incoming) {
    if (existingIds.has(project.id)) {
      skipped++;
      continue;
    }
    file.projects.push(project);
    existingIds.add(project.id);
    added++;
  }
  writeFile(file);
  return { added, skipped };
}
