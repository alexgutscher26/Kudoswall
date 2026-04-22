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
    features: {
      ...config.features,
      // Respect master toggle - if disabled globally, it's false for everyone
      // Otherwise, it follows the plan config (which we've also updated)
      video: config.features.video,
    },
    isPro,
    canAddProject: (workspace.projectsCount ?? 0) < config.limits.maxProjects,
    canAddTestimonial: (workspace.testimonialsCount ?? 0) < config.limits.maxTestimonials,
  };
}
