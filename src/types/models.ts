export type PricingTier = "free" | "freemium" | "paid";

export interface ToolPricing {
  amount: string;
  billingNote?: string;
  /** Tanggal harga ini benar-benar dicek (bukan tanggal file ditulis). Kosongkan jika belum pernah diverifikasi. */
  verifiedAt: string | null;
}

export interface Tool {
  id: string;
  name: string;
  vendor: string;
  /** Taksonomi terbuka — string bebas, bukan enum tetap (PRD 5.1). */
  category: string;
  pricingTier: PricingTier;
  /** id Tool lain yang jadi alternatif gratis, dipakai saat mode "Hanya Gratis" (PRD 5.3). */
  freeAlternativeId?: string;
  pricing: ToolPricing;
  freeTierTips: string[];
  officialUrl: string;
  keywords: string[];
  stageTags: string[];
  description: string;
  /** Contoh skenario pemakaian nyata/konkret untuk tool ini, ditampilkan di kartu hasil & Artikel. */
  studyCase?: string;
  /** Langkah-langkah singkat cara pakai tool ini, ditampilkan sebagai daftar bernomor. */
  tutorial?: string[];
  /**
   * true jika harga/detail entri ini berasal dari pengetahuan umum saat data ditulis,
   * bukan dari riset nyata lewat alur Lampiran B. Lihat ToolPricing.verifiedAt.
   */
  needsPriceVerification?: boolean;
}

/** Tool + field turunan yang dihitung sekali saat data dimuat, dipakai oleh searchEngine. */
export interface IndexedTool extends Tool {
  /** Gabungan unik keywords + stageTags, dipakai scoreTool agar tidak double-count. */
  searchTerms: string[];
}

export interface ToolsDbFile {
  dataVersion: string;
  lastUpdated: string;
  tools: Tool[];
}

export interface SavedStep {
  segmentLabel: string;
  toolId: string;
  userNote: string;
}

export interface Project {
  schemaVersion: number;
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  notes: string;
  savedSteps: SavedStep[];
  favoriteToolIds: string[];
}

export interface ProjectsFile {
  schemaVersion: number;
  projects: Project[];
}

/**
 * PRD 5.3 menjabarkan tiga label switch ("Semua / Hanya Gratis / Termasuk Berbayar")
 * tapi hanya mendefinisikan dua perilaku berbeda: filter ke gratis saja, atau tampilkan
 * semua (dengan badge harga untuk yang berbayar). "Semua" dan "Termasuk Berbayar"
 * dipetakan ke behavior "all" yang sama; hanya "Hanya Gratis" yang punya logic filter.
 */
export type PricingMode = "all" | "free-only";

/**
 * Satu langkah di alur kerja kuratorial "Studi Kasus" (menu terpisah dari pencarian bebas) —
 * ditulis manual oleh tim Yoo.ai, bukan hasil segmentasi query pengguna.
 */
export interface CuratedWorkflowStep {
  toolId: string;
  instruction: string;
}

export interface CuratedWorkflow {
  id: string;
  title: string;
  /** Taksonomi terbuka sama seperti Tool.category. */
  category: string;
  summary: string;
  steps: CuratedWorkflowStep[];
}

export interface CuratedWorkflowsFile {
  dataVersion: string;
  lastUpdated: string;
  workflows: CuratedWorkflow[];
}

export interface ValidationError {
  path: string;
  message: string;
}

export type SchemaValidationResult<T> =
  | { valid: true; data: T }
  | { valid: false; errors: ValidationError[] };
