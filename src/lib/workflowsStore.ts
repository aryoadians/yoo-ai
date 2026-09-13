import seed from "../data/workflows.seed.json";
import type { CuratedWorkflow, CuratedWorkflowsFile } from "../types/models";

const workflowsFile: CuratedWorkflowsFile = seed as CuratedWorkflowsFile;

export function getAllWorkflows(): CuratedWorkflow[] {
  return workflowsFile.workflows;
}

export function getWorkflowsMeta(): { dataVersion: string; lastUpdated: string } {
  return { dataVersion: workflowsFile.dataVersion, lastUpdated: workflowsFile.lastUpdated };
}
