import { useMemo, useState } from "react";
import AboutPage from "./components/AboutPage";
import ArticlePage from "./components/ArticlePage";
import GuidePage from "./components/GuidePage";
import Header from "./components/Header";
import PricingToggle from "./components/PricingToggle";
import ProjectSidebar from "./components/ProjectSidebar";
import ResultCards from "./components/ResultCards";
import SearchBar from "./components/SearchBar";
import SettingsPage from "./components/SettingsPage";
import StudyCasePage from "./components/StudyCasePage";
import WorkflowStepper from "./components/WorkflowStepper";
import { ProjectsProvider } from "./context/ProjectsContext";
import { ToolsDbProvider, useToolsDb } from "./context/ToolsDbContext";
import { applyPricingFilterToSearchResult, runSearch } from "./lib/searchEngine";
import type { PricingMode } from "./types/models";

export type PageId = "search" | "studycase" | "article" | "guide" | "about" | "settings";

function SearchPage() {
  const { tools } = useToolsDb();
  const [query, setQuery] = useState("");
  const [pricingMode, setPricingMode] = useState<PricingMode>("all");

  const result = useMemo(() => {
    const raw = runSearch(query, tools);
    return applyPricingFilterToSearchResult(raw, tools, pricingMode);
  }, [query, tools, pricingMode]);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6">
      <div className="flex flex-col gap-3">
        <SearchBar onSearch={setQuery} />
        <PricingToggle mode={pricingMode} onChange={setPricingMode} />
      </div>

      <div className="flex flex-col gap-6 sm:flex-row">
        <div key={result.mode} className="min-w-0 flex-1 animate-fade-in">
          {result.mode === "empty" && (
            <div className="rounded-lg border border-dashed border-brand-slate/50 p-6 text-center text-sm text-slate-500">
              {query.trim()
                ? "Belum ketemu yang cocok — coba kata kunci lain atau pilih dari dropdown di atas."
                : "Ketik kebutuhan kamu di atas, atau klik search bar untuk lihat contoh."}
            </div>
          )}
          {result.mode === "ranking" && <ResultCards results={result.results} queryLabel={query} />}
          {result.mode === "workflow" && <WorkflowStepper steps={result.steps} />}
        </div>
        <ProjectSidebar />
      </div>
    </div>
  );
}

function App() {
  const [page, setPage] = useState<PageId>("search");

  return (
    <ToolsDbProvider>
      <ProjectsProvider>
        <div className="flex min-h-screen flex-col bg-white text-slate-900">
          <Header activePage={page} onNavigate={setPage} />
          <div key={page} className="flex-1 animate-fade-in">
            {page === "search" && <SearchPage />}
            {page === "studycase" && <StudyCasePage />}
            {page === "article" && <ArticlePage />}
            {page === "guide" && <GuidePage />}
            {page === "about" && <AboutPage />}
            {page === "settings" && <SettingsPage />}
          </div>
          <footer className="border-t border-brand-slate/30 px-4 py-4 text-center text-xs text-slate-500 sm:px-6">
            Dibuat oleh{" "}
            <button type="button" onClick={() => setPage("about")} className="text-brand-navy underline">
              Aryo Adiansyah
            </button>
          </footer>
        </div>
      </ProjectsProvider>
    </ToolsDbProvider>
  );
}

export default App;
