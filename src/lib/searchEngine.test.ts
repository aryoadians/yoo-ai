import { describe, expect, it } from "vitest";
import type { Tool } from "../types/models";
import { applyPricingFilterToSearchResult, indexTools, runSearch } from "./searchEngine";

function makeTool(overrides: Partial<Tool> & Pick<Tool, "id" | "name" | "keywords">): Tool {
  return {
    vendor: "Vendor",
    category: "kategori-uji",
    pricingTier: "free",
    pricing: { amount: "Gratis", verifiedAt: null },
    freeTierTips: [],
    officialUrl: "https://example.com",
    stageTags: [],
    description: "",
    ...overrides,
  };
}

// Subset representatif dari 15 tools Google prototipe (keywords asli dipertahankan
// supaya kasus uji ini setara dengan kasus uji di prototipe lama).
const rawTools: Tool[] = [
  makeTool({
    id: "notebooklm",
    name: "NotebookLM",
    pricingTier: "freemium",
    keywords: [
      "riset",
      "kuliah",
      "modul",
      "kuis",
      "flashcard",
      "latihan soal",
      "menguji pemahaman",
      "materi",
      "mempelajari",
      "belajar materi",
      "memperdalam",
      "pendalaman",
      "mendalami",
      "belajar",
      "ringkasan",
      "dokumen",
      "study guide",
      "podcast",
      "rangkuman",
      "presentasi",
      "persentasi",
      "slide",
      "slide deck",
      "ppt",
      "powerpoint",
      "pitch deck",
      "paparan",
    ],
  }),
  makeTool({
    id: "ai-studio-build",
    name: "AI Studio (Build)",
    keywords: [
      "dashboard",
      "order tracker",
      "aplikasi",
      "aplikasi interaktif",
      "interaktif",
      "app",
      "web app",
      "tool internal",
      "fungsional",
      "deploy",
      "tracker",
      "pencatat",
      "website",
    ],
  }),
  makeTool({
    id: "claude-pro",
    name: "Claude Pro",
    vendor: "Anthropic",
    pricingTier: "paid",
    pricing: { amount: "US$20/bulan", verifiedAt: null, billingNote: "Per pengguna" },
    keywords: ["asisten", "coding", "menulis", "riset"],
  }),
];

const tools = indexTools(rawTools);

describe("runSearch", () => {
  it("mentolerir typo lewat fuzzy match (persentasi -> presentasi/NotebookLM)", () => {
    const result = runSearch("bikin persentasi dari materi kuliah", tools);
    expect(result.mode).toBe("ranking");
    if (result.mode !== "ranking") throw new Error("expected ranking mode");
    expect(result.results[0]?.id).toBe("notebooklm");
  });

  it("menghasilkan 2 langkah setelah dedup untuk query alur 4 segmen", () => {
    const query = "pelajari materi baru, perdalam, lalu bikin presentasi, lalu bikin aplikasi interaktif";
    const result = runSearch(query, tools);
    expect(result.mode).toBe("workflow");
    if (result.mode !== "workflow") throw new Error("expected workflow mode");
    expect(result.steps).toHaveLength(2);
    expect(result.steps[0]?.tool?.id).toBe("notebooklm");
    expect(result.steps[0]?.segments).toHaveLength(3);
    expect(result.steps[1]?.tool?.id).toBe("ai-studio-build");
  });

  it("mengembalikan mode empty saat tidak ada skor > 0 sama sekali", () => {
    const result = runSearch("qqqzzzxxx tidak ada yang cocok", tools);
    expect(result.mode).toBe("empty");
  });
});

describe("applyPricingFilterToSearchResult", () => {
  it("men-drop tool paid tanpa freeAlternativeId di mode Hanya Gratis, bukan error", () => {
    const result = runSearch("asisten coding", tools);
    expect(result.mode).toBe("ranking");
    if (result.mode !== "ranking") throw new Error("expected ranking mode");
    expect(result.results.some((t) => t.id === "claude-pro")).toBe(true);

    const filtered = applyPricingFilterToSearchResult(result, tools, "free-only");
    if (filtered.mode === "ranking") {
      expect(filtered.results.some((t) => t.id === "claude-pro")).toBe(false);
    } else {
      expect(filtered.mode).toBe("empty");
    }
  });
});
