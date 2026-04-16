import { getPlanConfig, type PlanConfig } from "../config/plans";

export interface WorkspacePermissions extends PlanConfig {
  isPro: boolean;
  canAddProject: boolean;
  canAddTestimonial: boolean;
}

export function getWorkspacePermissions(workspace: {
  plan: string | null;
  projectsCount?: number;
  testimonialsCount?: number;
}): WorkspacePermissions {
  const config = getPlanConfig(workspace.plan);
  const isPro = workspace.plan !== "free" && workspace.plan !== null;

  return {
    ...config,
    isPro,
    canAddProject: (workspace.projectsCount ?? 0) < config.limits.maxProjects,
    canAddTestimonial: (workspace.testimonialsCount ?? 0) < config.limits.maxTestimonials,
  };
}
