import { describe, expect, it } from "vitest";
import { importFromFile, validateProjectsImport, validateToolsDbFile } from "./importExportManager";

function jsonFile(content: string, name = "data.json"): File {
  return new File([content], name, { type: "application/json" });
}

describe("importFromFile + validateToolsDbFile", () => {
  it("menolak file yang bukan JSON valid dengan pesan spesifik", async () => {
    const result = await importFromFile(jsonFile("{ bukan json"), validateToolsDbFile);
    expect(result.valid).toBe(false);
    if (result.valid) throw new Error("expected invalid");
    expect(result.errors[0]?.message).toMatch(/JSON yang valid/);
  });

  it("menolak file JSON valid tapi field wajib hilang, dengan pesan per field", async () => {
    const result = await importFromFile(jsonFile(JSON.stringify({ tools: [{ name: "Tanpa id" }] })), validateToolsDbFile);
    expect(result.valid).toBe(false);
    if (result.valid) throw new Error("expected invalid");
    const paths = result.errors.map((e) => e.path);
    expect(paths).toContain("dataVersion");
    expect(paths).toContain("lastUpdated");
    expect(paths).toContain("tools[0].id");
    expect(paths).toContain("tools[0].category");
    expect(paths).toContain("tools[0].pricingTier");
  });

  it("menerima file tools db yang valid", async () => {
    const validFile = {
      dataVersion: "2026-09-13",
      lastUpdated: "2026-09-13T00:00:00Z",
      tools: [
        {
          id: "t1",
          name: "Tool 1",
          vendor: "V",
          category: "kategori-uji",
          pricingTier: "free",
          pricing: { amount: "Gratis", verifiedAt: null },
          freeTierTips: [],
          officialUrl: "https://example.com",
          keywords: [],
          stageTags: [],
          description: "",
        },
      ],
    };
    const result = await importFromFile(jsonFile(JSON.stringify(validFile)), validateToolsDbFile);
    expect(result.valid).toBe(true);
    if (!result.valid) throw new Error("expected valid");
    expect(result.data.tools).toHaveLength(1);
  });
});

describe("validateProjectsImport", () => {
  it("menerima satu Project langsung", () => {
    const result = validateProjectsImport({
      schemaVersion: 1,
      id: "proj_1",
      name: "Project A",
      createdAt: "2026-09-13T00:00:00Z",
      updatedAt: "2026-09-13T00:00:00Z",
      notes: "",
      savedSteps: [],
      favoriteToolIds: [],
    });
    expect(result.valid).toBe(true);
    if (!result.valid) throw new Error("expected valid");
    expect(result.data).toHaveLength(1);
  });

  it("menerima bungkus { projects: [...] } untuk export semua project", () => {
    const result = validateProjectsImport({
      schemaVersion: 1,
      projects: [
        {
          schemaVersion: 1,
          id: "proj_1",
          name: "Project A",
          createdAt: "",
          updatedAt: "",
          notes: "",
          savedSteps: [],
          favoriteToolIds: [],
        },
        {
          schemaVersion: 1,
          id: "proj_2",
          name: "Project B",
          createdAt: "",
          updatedAt: "",
          notes: "",
          savedSteps: [],
          favoriteToolIds: [],
        },
      ],
    });
    expect(result.valid).toBe(true);
    if (!result.valid) throw new Error("expected valid");
    expect(result.data).toHaveLength(2);
  });

  it("menolak format yang tidak dikenali", () => {
    const result = validateProjectsImport({ foo: "bar" });
    expect(result.valid).toBe(false);
  });
});
