import seed from "../data/tools.seed.json";
import type { IndexedTool, Tool, ToolsDbFile } from "../types/models";
import { indexTools } from "./searchEngine";

const STORAGE_KEY = "yooai_tools_db";

const seedFile: ToolsDbFile = seed as ToolsDbFile;

function readStoredFile(): ToolsDbFile | null {
  if (typeof localStorage === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ToolsDbFile;
  } catch {
    return null;
  }
}

function writeStoredFile(file: ToolsDbFile): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(file));
}

let cache: { file: ToolsDbFile; indexed: IndexedTool[] } | null = null;

function loadFile(): ToolsDbFile {
  return readStoredFile() ?? seedFile;
}

function ensureCache(): { file: ToolsDbFile; indexed: IndexedTool[] } {
  if (!cache) {
    const file = loadFile();
    cache = { file, indexed: indexTools(file.tools) };
  }
  return cache;
}

/** Semua tools saat ini (dari localStorage kalau pernah di-import, kalau belum dari seed), sudah ter-index untuk searchEngine. */
export function getAll(): IndexedTool[] {
  return ensureCache().indexed;
}

export function getDbMeta(): { dataVersion: string; lastUpdated: string } {
  const { file } = ensureCache();
  return { dataVersion: file.dataVersion, lastUpdated: file.lastUpdated };
}

/** Timpa seluruh database dengan file yang diimpor (mode Replace All, PRD 5.1.1). */
export function replaceAll(file: ToolsDbFile): void {
  writeStoredFile(file);
  cache = { file, indexed: indexTools(file.tools) };
}

/** Kembalikan ke data seed bawaan (dipakai mis. saat testing/reset, bukan alur pengguna biasa). */
export function resetToSeed(): void {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
  cache = { file: seedFile, indexed: indexTools(seedFile.tools) };
}

export function getRawToolById(id: string): Tool | undefined {
  return ensureCache().file.tools.find((t) => t.id === id);
}

/** File mentah (tanpa searchTerms turunan) — dipakai saat export Tools DB. */
export function getRawFile(): ToolsDbFile {
  return ensureCache().file;
}
