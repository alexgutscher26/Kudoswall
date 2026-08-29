import { getPlanConfig, type PlanConfig, type Plan } from "../config/plans";

export interface WorkspacePermissions extends PlanConfig {
  isPro: boolean;
  canAddProject: boolean;
  canAddTestimonial: boolean;
  canAddWidget: boolean;
  effectivePlan: Plan;
  isTrialing: boolean;
  isTrialExpired: boolean;
  trialDaysRemaining: number | null;
}

export function getWorkspacePermissions(workspace: {
  plan: string | null;
  subscriptionStatus?: string | null;
  trialEndsAt?: Date | string | null;
  organization?: {
    plan: string | null;
    subscriptionStatus?: string | null;
    trialEndsAt?: Date | string | null;
  } | null;
  projectsCount?: number;
  testimonialsCount?: number;
  widgetsCount?: number;
}): WorkspacePermissions {
  const rawPlan = workspace.organization?.plan || workspace.plan || "free";
  const subscriptionStatus =
    workspace.organization?.subscriptionStatus || workspace.subscriptionStatus;
  const trialEndsAtRaw = workspace.organization?.trialEndsAt || workspace.trialEndsAt;

  let isTrialing = false;
  let isTrialExpired = false;
  let trialDaysRemaining: number | null = null;
  let effectivePlan: Plan = (rawPlan as Plan) || "free";

  if (subscriptionStatus === "trialing") {
    if (trialEndsAtRaw) {
      const trialDate = new Date(trialEndsAtRaw);
      const now = new Date();
      if (!isNaN(trialDate.getTime())) {
        if (trialDate.getTime() < now.getTime()) {
          isTrialExpired = true;
          isTrialing = false;
          trialDaysRemaining = 0;
          // Graceful fallback to Free tier when trial expires without active subscription
          effectivePlan = "free";
        } else {
          isTrialing = true;
          isTrialExpired = false;
          trialDaysRemaining = Math.max(
            1,
            Math.ceil((trialDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
          );
          effectivePlan = (rawPlan as Plan) || "plan_1";
        }
      }
    } else {
      isTrialing = true;
      trialDaysRemaining = 14;
    }
  }

  const config = getPlanConfig(effectivePlan);
  const isPro = effectivePlan !== "free";

  return {
    ...config,
    features: {
      ...config.features,
      video: config.features.video,
    },
    isPro,
    effectivePlan,
    isTrialing,
    isTrialExpired,
    trialDaysRemaining,
    canAddProject: (workspace.projectsCount ?? 0) < config.limits.maxProjects,
    canAddTestimonial: (workspace.testimonialsCount ?? 0) < config.limits.maxTestimonials,
    canAddWidget: (workspace.widgetsCount ?? 0) < config.limits.maxWidgets,
  };
}
