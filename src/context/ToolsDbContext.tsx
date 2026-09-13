import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from "react";
import * as toolsStore from "../lib/toolsStore";
import type { IndexedTool, ToolsDbFile } from "../types/models";

interface ToolsDbState {
  tools: IndexedTool[];
  meta: { dataVersion: string; lastUpdated: string };
}

type Action = { type: "SYNC"; state: ToolsDbState };

function reducer(_state: ToolsDbState, action: Action): ToolsDbState {
  return action.state;
}

function readFromStore(): ToolsDbState {
  return { tools: toolsStore.getAll(), meta: toolsStore.getDbMeta() };
}

interface ToolsDbContextValue extends ToolsDbState {
  replaceAll: (file: ToolsDbFile) => void;
}

const ToolsDbContext = createContext<ToolsDbContextValue | null>(null);

export function ToolsDbProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, readFromStore);

  const replaceAll = useCallback((file: ToolsDbFile) => {
    toolsStore.replaceAll(file);
    dispatch({ type: "SYNC", state: readFromStore() });
  }, []);

  const value = useMemo(() => ({ ...state, replaceAll }), [state, replaceAll]);

  return <ToolsDbContext.Provider value={value}>{children}</ToolsDbContext.Provider>;
}

export function useToolsDb(): ToolsDbContextValue {
  const ctx = useContext(ToolsDbContext);
  if (!ctx) throw new Error("useToolsDb harus dipakai di dalam ToolsDbProvider");
  return ctx;
}
