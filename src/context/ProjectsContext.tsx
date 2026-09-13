import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from "react";
import * as projectStore from "../lib/projectStore";
import type { Project, SavedStep } from "../types/models";

type Action = { type: "SYNC"; projects: Project[] };

function reducer(_state: Project[], action: Action): Project[] {
  return action.projects;
}

interface ProjectsContextValue {
  projects: Project[];
  create: (name: string) => Project;
  rename: (id: string, name: string) => void;
  remove: (id: string) => void;
  addSavedStep: (id: string, step: SavedStep) => void;
  toggleFavorite: (id: string, toolId: string) => void;
  addImportedProjects: (incoming: Project[]) => { added: number; skipped: number };
}

const ProjectsContext = createContext<ProjectsContextValue | null>(null);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, dispatch] = useReducer(reducer, undefined, projectStore.list);

  const sync = useCallback(() => {
    dispatch({ type: "SYNC", projects: projectStore.list() });
  }, []);

  const create = useCallback(
    (name: string) => {
      const project = projectStore.create(name);
      sync();
      return project;
    },
    [sync],
  );

  const rename = useCallback(
    (id: string, name: string) => {
      projectStore.rename(id, name);
      sync();
    },
    [sync],
  );

  const remove = useCallback(
    (id: string) => {
      projectStore.remove(id);
      sync();
    },
    [sync],
  );

  const addSavedStep = useCallback(
    (id: string, step: SavedStep) => {
      projectStore.addSavedStep(id, step);
      sync();
    },
    [sync],
  );

  const toggleFavorite = useCallback(
    (id: string, toolId: string) => {
      projectStore.toggleFavorite(id, toolId);
      sync();
    },
    [sync],
  );

  const addImportedProjects = useCallback(
    (incoming: Project[]) => {
      const result = projectStore.addImportedProjects(incoming);
      sync();
      return result;
    },
    [sync],
  );

  const value = useMemo(
    () => ({ projects, create, rename, remove, addSavedStep, toggleFavorite, addImportedProjects }),
    [projects, create, rename, remove, addSavedStep, toggleFavorite, addImportedProjects],
  );

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
}

export function useProjects(): ProjectsContextValue {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error("useProjects harus dipakai di dalam ProjectsProvider");
  return ctx;
}
