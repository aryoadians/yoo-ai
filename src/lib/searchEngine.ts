import type { IndexedTool, PricingMode, Tool } from "../types/models";

// ---------------------------------------------------------------------------
// Indexing
// ---------------------------------------------------------------------------

/** Gabungan unik keywords + stageTags, dihitung sekali per tool agar scoreTool tidak double-count. */
export function buildSearchTerms(tool: Tool): string[] {
  return Array.from(new Set([...tool.keywords, ...tool.stageTags]));
}

export function indexTools(tools: Tool[]): IndexedTool[] {
  return tools.map((tool) => ({ ...tool, searchTerms: buildSearchTerms(tool) }));
}

// ---------------------------------------------------------------------------
// Fuzzy matching (menangani typo seperti "persentasi" -> "presentasi")
// ---------------------------------------------------------------------------

export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

export function fuzzyHit(word: string, token: string): boolean {
  const len = token.length;
  const threshold = len >= 7 ? 2 : len >= 4 ? 1 : 0;
  if (threshold === 0) return false;
  return levenshtein(word, token) <= threshold;
}

// ---------------------------------------------------------------------------
// Segmentasi query (PRD 5.2a)
// ---------------------------------------------------------------------------

const SEGMENT_SPLIT_RE =
  /,|;|\b(?:lalu|kemudian|setelah itu|terus(?:in)?|habis itu|abis itu|selanjutnya|dan seterusnya)\b/i;
const STANDALONE_DST_RE = /\bdst\.?\b/gi;

export function segmentQuery(query: string): string[] {
  const normalized = query.replace(/\.\.\.+/g, ",");
  return normalized
    .split(SEGMENT_SPLIT_RE)
    .map((s) => s.replace(STANDALONE_DST_RE, "").trim())
    .filter((s) => s.length > 2);
}

// ---------------------------------------------------------------------------
// Scoring (PRD 5.2b)
// ---------------------------------------------------------------------------

export function scoreTool(segment: string, tool: IndexedTool): number {
  const q = segment.toLowerCase().trim();
  if (!q) return 0;
  const words = q.split(/\s+/).filter((w) => w.length > 2);

  let score = 0;
  for (const term of tool.searchTerms) {
    const kw = term.toLowerCase();
    if (q.includes(kw)) {
      score += 3;
      continue;
    }
    for (const tok of kw.split(/\s+/)) {
      for (const word of words) {
        if (tok.includes(word) || word.includes(tok)) {
          score += 1;
        } else if (fuzzyHit(word, tok)) {
          score += 1.5;
        }
      }
    }
  }
  return score;
}

export function searchTop(segment: string, tools: IndexedTool[], limit: number): IndexedTool[] {
  return tools
    .map((tool) => ({ tool, score: scoreTool(segment, tool) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.tool);
}

// ---------------------------------------------------------------------------
// Orkestrasi mode (PRD 5.2c)
// ---------------------------------------------------------------------------

export interface WorkflowStep {
  segments: string[];
  tool: IndexedTool | null;
}

export type SearchResult =
  | { mode: "ranking"; results: IndexedTool[] }
  | { mode: "workflow"; steps: WorkflowStep[] }
  | { mode: "empty" };

function dedupeSteps(rawSteps: { segment: string; tool: IndexedTool | null }[]): WorkflowStep[] {
  const deduped: WorkflowStep[] = [];
  for (const step of rawSteps) {
    const last = deduped[deduped.length - 1];
    if (last && step.tool && last.tool && step.tool.id === last.tool.id) {
      last.segments.push(step.segment);
    } else {
      deduped.push({ segments: [step.segment], tool: step.tool });
    }
  }
  return deduped;
}

export function runSearch(rawQuery: string, tools: IndexedTool[]): SearchResult {
  const query = rawQuery.trim();
  if (!query) return { mode: "empty" };

  const segments = segmentQuery(query);

  if (segments.length >= 2) {
    const rawSteps = segments.map((segment) => ({
      segment,
      tool: searchTop(segment, tools, 1)[0] ?? null,
    }));
    const steps = dedupeSteps(rawSteps);
    const hasAnyMatch = steps.some((step) => step.tool !== null);
    if (!hasAnyMatch) return { mode: "empty" };
    return { mode: "workflow", steps };
  }

  const singleSegment = segments[0] ?? query;
  const results = searchTop(singleSegment, tools, 3);
  if (results.length === 0) return { mode: "empty" };
  return { mode: "ranking", results };
}

// ---------------------------------------------------------------------------
// Filter mode Gratis/Berbayar (PRD 5.3) — post-processing, terpisah dari scoring
// ---------------------------------------------------------------------------

export interface FilteredTool extends IndexedTool {
  isSubstitutedFreeAlternative?: boolean;
  substitutedFromName?: string;
}

function substituteForFreeOnly(tool: IndexedTool, allTools: IndexedTool[]): FilteredTool | null {
  if (tool.pricingTier !== "paid") return tool;
  if (tool.freeAlternativeId) {
    const alt = allTools.find((t) => t.id === tool.freeAlternativeId);
    if (alt) {
      return { ...alt, isSubstitutedFreeAlternative: true, substitutedFromName: tool.name };
    }
  }
  return null;
}

export function applyPricingFilter(
  tools: IndexedTool[],
  allTools: IndexedTool[],
  mode: PricingMode,
): FilteredTool[] {
  if (mode === "all") return tools;
  return tools
    .map((tool) => substituteForFreeOnly(tool, allTools))
    .filter((tool): tool is FilteredTool => tool !== null);
}

export function applyPricingFilterToSearchResult(
  result: SearchResult,
  allTools: IndexedTool[],
  mode: PricingMode,
): SearchResult {
  if (mode === "all" || result.mode === "empty") return result;

  if (result.mode === "ranking") {
    const filtered = applyPricingFilter(result.results, allTools, mode);
    return filtered.length === 0 ? { mode: "empty" } : { mode: "ranking", results: filtered };
  }

  const steps = result.steps.map((step) => ({
    segments: step.segments,
    tool: step.tool ? (substituteForFreeOnly(step.tool, allTools) ?? null) : null,
  }));
  const hasAnyMatch = steps.some((step) => step.tool !== null);
  return hasAnyMatch ? { mode: "workflow", steps } : { mode: "empty" };
}
