import { env } from "@my-better-t-app/env/server";

export type Plan = "free" | "plan_1" | "plan_2" | "ltd";

export interface PlanConfig {
  id: Plan;
  name: string;
  priceLabel: string;
  stripePriceId?: string;
  limits: {
    maxProjects: number;
    maxTestimonials: number;
  };
  features: {
    video: boolean;
    customDomain: boolean;
    whiteLabel: boolean;
    prioritySupport: boolean;
    memberInvites: boolean;
    csvExport: boolean;
    analytics: boolean;
  };
  displayFeatures: string[];
}

export const PLANS: Record<Plan, PlanConfig> = {
  free: {
    id: "free",
    name: "Free",
    priceLabel: "$0",
    limits: {
      maxProjects: 1,
      maxTestimonials: 5,
    },
    features: {
      video: false,
      customDomain: false,
      whiteLabel: false,
      prioritySupport: false,
      memberInvites: false,
      csvExport: false,
      analytics: false,
    },
    displayFeatures: [
      "Up to 5 testimonials",
      "1 Project",
      "Text testimonials only",
      "KudosWall branding",
    ],
  },
  plan_1: {
    id: "plan_1",
    name: "Pro",
    priceLabel: "$29/mo",
    stripePriceId: env.STRIPE_PLAN_1_PRICE_ID || env.NEXT_PUBLIC_STRIPE_PLAN_1_PRICE_ID,
    limits: {
      maxProjects: 1,
      maxTestimonials: Infinity,
    },
    features: {
      video: true,
      customDomain: true,
      whiteLabel: true,
      prioritySupport: false,
      memberInvites: true,
      csvExport: true,
      analytics: true,
    },
    displayFeatures: [
      "Unlimited testimonials",
      "1 Project",
      "Video + text reviews",
      "All 3 widget layouts",
      "Custom branding & colors",
      "Remove 'Powered by' badge",
      "Custom domain for collection",
      "CSV Export",
    ],
  },
  plan_2: {
    id: "plan_2",
    name: "Agency",
    priceLabel: "$79/mo",
    stripePriceId: env.STRIPE_PLAN_2_PRICE_ID || env.NEXT_PUBLIC_STRIPE_PLAN_2_PRICE_ID,
    limits: {
      maxProjects: 5,
      maxTestimonials: Infinity,
    },
    features: {
      video: true,
      customDomain: true,
      whiteLabel: true,
      prioritySupport: true,
      memberInvites: true,
      csvExport: true,
      analytics: true,
    },
    displayFeatures: [
      "Everything in Pro",
      "Up to 5 projects",
      "Up to 3 team members",
      "White-label collection page",
      "Priority VIP support",
    ],
  },
  ltd: {
    id: "ltd",
    name: "Lifetime",
    priceLabel: "$199 once",
    limits: {
      maxProjects: 5,
      maxTestimonials: Infinity,
    },
    features: {
      video: true,
      customDomain: true,
      whiteLabel: true,
      prioritySupport: true,
      memberInvites: true,
      csvExport: true,
      analytics: true,
    },
    displayFeatures: ["Everything in Agency", "Lifetime access", "No monthly fees"],
  },
};

export const getPriceToPlan = (): Record<string, Plan> => {
  return Object.values(PLANS).reduce(
    (acc, plan) => {
      if (plan.stripePriceId) {
        acc[plan.stripePriceId] = plan.id;
      }
      return acc;
    },
    {} as Record<string, Plan>,
  );
};

export const PRICE_TO_PLAN = getPriceToPlan();

export const getPlanConfig = (planId: string | null | undefined): PlanConfig => {
  const id = (planId as Plan) || "free";
  return PLANS[id] || PLANS.free;
};
