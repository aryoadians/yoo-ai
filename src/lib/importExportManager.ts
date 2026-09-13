import type { Project, SchemaValidationResult, ToolsDbFile, ValidationError } from "../types/models";

// ---------------------------------------------------------------------------
// Modul bersama Project & Tools DB (PRD bagian 8): download/upload generik,
// validasi spesifik per tipe data lewat `schemaValidator` yang di-pass masuk.
// ---------------------------------------------------------------------------

export function exportToFile(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function importFromFile<T>(
  file: File,
  schemaValidator: (raw: unknown) => SchemaValidationResult<T>,
): Promise<SchemaValidationResult<T>> {
  let text: string;
  try {
    text = await file.text();
  } catch {
    return { valid: false, errors: [{ path: "file", message: "Tidak bisa membaca file." }] };
  }

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { valid: false, errors: [{ path: "file", message: "File bukan JSON yang valid (gagal di-parse)." }] };
  }

  return schemaValidator(raw);
}

// ---------------------------------------------------------------------------
// Validator: Tools DB (PRD 5.1.1c)
// ---------------------------------------------------------------------------

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

const VALID_PRICING_TIERS = new Set(["free", "freemium", "paid"]);

export function validateToolsDbFile(raw: unknown): SchemaValidationResult<ToolsDbFile> {
  const errors: ValidationError[] = [];

  if (!isRecord(raw)) {
    return { valid: false, errors: [{ path: "root", message: "File harus berupa objek JSON." }] };
  }

  if (typeof raw.dataVersion !== "string" || !raw.dataVersion) {
    errors.push({ path: "dataVersion", message: "dataVersion wajib diisi (string)." });
  }
  if (typeof raw.lastUpdated !== "string" || !raw.lastUpdated) {
    errors.push({ path: "lastUpdated", message: "lastUpdated wajib diisi (string)." });
  }

  if (!Array.isArray(raw.tools)) {
    errors.push({ path: "tools", message: "tools wajib berupa array." });
  } else {
    raw.tools.forEach((tool, i) => {
      if (!isRecord(tool)) {
        errors.push({ path: `tools[${i}]`, message: "Setiap entri tool harus berupa objek." });
        return;
      }
      if (typeof tool.id !== "string" || !tool.id) {
        errors.push({ path: `tools[${i}].id`, message: "id wajib diisi." });
      }
      if (typeof tool.name !== "string" || !tool.name) {
        errors.push({ path: `tools[${i}].name`, message: "name wajib diisi." });
      }
      if (typeof tool.category !== "string" || !tool.category) {
        errors.push({ path: `tools[${i}].category`, message: "category wajib diisi." });
      }
      if (typeof tool.pricingTier !== "string" || !VALID_PRICING_TIERS.has(tool.pricingTier)) {
        errors.push({ path: `tools[${i}].pricingTier`, message: "pricingTier wajib salah satu dari free/freemium/paid." });
      }
    });
  }

  if (errors.length > 0) return { valid: false, errors };
  return { valid: true, data: raw as unknown as ToolsDbFile };
}

// ---------------------------------------------------------------------------
// Validator: Project (PRD 5.5) — terima file satu Project ATAU { projects: Project[] }
// ---------------------------------------------------------------------------

function isValidProjectShape(raw: unknown, path: string, errors: ValidationError[]): raw is Project {
  if (!isRecord(raw)) {
    errors.push({ path, message: "Project harus berupa objek." });
    return false;
  }
  let ok = true;
  if (typeof raw.schemaVersion !== "number") {
    errors.push({ path: `${path}.schemaVersion`, message: "schemaVersion wajib diisi (angka)." });
    ok = false;
  }
  if (typeof raw.id !== "string" || !raw.id) {
    errors.push({ path: `${path}.id`, message: "id wajib diisi." });
    ok = false;
  }
  if (typeof raw.name !== "string" || !raw.name) {
    errors.push({ path: `${path}.name`, message: "name wajib diisi." });
    ok = false;
  }
  if (!Array.isArray(raw.savedSteps)) {
    errors.push({ path: `${path}.savedSteps`, message: "savedSteps wajib berupa array." });
    ok = false;
  }
  return ok;
}

export function validateProjectsImport(raw: unknown): SchemaValidationResult<Project[]> {
  const errors: ValidationError[] = [];

  if (!isRecord(raw)) {
    return { valid: false, errors: [{ path: "root", message: "File harus berupa objek JSON." }] };
  }

  let candidates: unknown[];
  if (Array.isArray(raw.projects)) {
    candidates = raw.projects;
  } else if (typeof raw.id === "string" && typeof raw.name === "string") {
    candidates = [raw];
  } else {
    return {
      valid: false,
      errors: [{ path: "root", message: "Format file project tidak dikenali (bukan Project maupun { projects: [...] })." }],
    };
  }

  const validProjects: Project[] = [];
  candidates.forEach((candidate, i) => {
    if (isValidProjectShape(candidate, `projects[${i}]`, errors)) {
      validProjects.push(candidate);
    }
  });

  if (errors.length > 0) return { valid: false, errors };
  return { valid: true, data: validProjects };
}
