import { env } from "@my-better-t-app/env/server";

const IS_VIDEO_ENABLED =
  process.env.NEXT_PUBLIC_ENABLE_VIDEO === "true" ||
  process.env.NEXT_PUBLIC_ENABLE_VIDEO === "1" ||
  String(env.NEXT_PUBLIC_ENABLE_VIDEO).toLowerCase() === "true" ||
  String(process.env.NEXT_PUBLIC_ENABLE_VIDEO).toLowerCase() === "true";

console.log(
  "[PLANS_CONFIG] IS_VIDEO_ENABLED:",
  IS_VIDEO_ENABLED,
  "Env:",
  process.env.NEXT_PUBLIC_ENABLE_VIDEO,
);

export type Plan = "free" | "plan_1" | "plan_2" | "ltd";

export interface PlanConfig {
  id: Plan;
  name: string;
  priceLabel: string;
  stripePriceIdMonthly?: string;
  stripePriceIdYearly?: string;
  stripePriceIdLifetime?: string;
  limits: {
    maxProjects: number;
    maxTestimonials: number;
    maxTeamMembers: number;
    /** Max video upload size in MB. 0 means video uploads are not allowed. */
    maxVideoSizeMb: number;
    /** Max image upload size in MB. */
    maxImageSizeMb: number;
  };
  features: {
    video: boolean;
    customDomain: boolean;
    whiteLabel: boolean;
    prioritySupport: boolean;
    memberInvites: boolean;
    csvExport: boolean;
    analytics: boolean;
    premiumWidgets: boolean;
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
      maxTestimonials: 50,
      maxTeamMembers: 1,
      maxVideoSizeMb: 128, // Enabled video
      maxImageSizeMb: 5,
    },
    features: {
      video: IS_VIDEO_ENABLED,
      customDomain: false,
      whiteLabel: false,
      prioritySupport: false,
      memberInvites: false,
      csvExport: false,
      analytics: false,
      premiumWidgets: false,
    },
    displayFeatures: [
      "Up to 50 testimonials",
      "1 Project",
      "Text & Video testimonials",
      "KudosWall branding",
    ],
  },
  plan_1: {
    id: "plan_1",
    name: "Pro",
    priceLabel: "$19/mo",
    stripePriceIdMonthly:
      env.STRIPE_PLAN_1_PRICE_ID || process.env.NEXT_PUBLIC_STRIPE_PLAN_1_PRICE_ID,
    stripePriceIdYearly:
      env.STRIPE_PLAN_1_YEARLY_PRICE_ID || process.env.NEXT_PUBLIC_STRIPE_PLAN_1_YEARLY_PRICE_ID,
    limits: {
      maxProjects: 1,
      maxTestimonials: Infinity,
      maxTeamMembers: 1,
      maxVideoSizeMb: 128,
      maxImageSizeMb: 10,
    },
    features: {
      video: IS_VIDEO_ENABLED, // Respect master toggle
      customDomain: true,
      whiteLabel: true,
      prioritySupport: false,
      memberInvites: true,
      csvExport: true,
      analytics: true,
      premiumWidgets: true,
    },
    displayFeatures: [
      "Unlimited testimonials",
      "1 Project",
      "Text & Video testimonials",
      "All 4 widget layouts",
      "Custom branding & colors",
      "Remove 'Powered by' badge",
      "Custom domain for collection",
      "CSV Export",
    ],
  },
  plan_2: {
    id: "plan_2",
    name: "Agency",
    priceLabel: "$59/mo",
    stripePriceIdMonthly:
      env.STRIPE_PLAN_2_PRICE_ID || process.env.NEXT_PUBLIC_STRIPE_PLAN_2_PRICE_ID,
    stripePriceIdYearly:
      env.STRIPE_PLAN_2_YEARLY_PRICE_ID || process.env.NEXT_PUBLIC_STRIPE_PLAN_2_YEARLY_PRICE_ID,
    limits: {
      maxProjects: 5,
      maxTestimonials: Infinity,
      maxTeamMembers: 3,
      maxVideoSizeMb: 250,
      maxImageSizeMb: 20,
    },
    features: {
      video: IS_VIDEO_ENABLED, // Respect master toggle
      customDomain: true,
      whiteLabel: true,
      prioritySupport: true,
      memberInvites: true,
      csvExport: true,
      analytics: true,
      premiumWidgets: true,
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
    stripePriceIdLifetime: env.STRIPE_LTD_PRICE_ID || process.env.NEXT_PUBLIC_STRIPE_LTD_PRICE_ID,
    limits: {
      maxProjects: 5,
      maxTestimonials: Infinity,
      maxTeamMembers: 3,
      maxVideoSizeMb: 250,
      maxImageSizeMb: 20,
    },
    features: {
      video: IS_VIDEO_ENABLED, // Respect master toggle
      customDomain: true,
      whiteLabel: true,
      prioritySupport: true,
      memberInvites: true,
      csvExport: true,
      analytics: true,
      premiumWidgets: true,
    },
    displayFeatures: ["Everything in Agency", "Lifetime access", "No monthly fees"],
  },
};

export const getPriceToPlan = (): Record<string, Plan> => {
  return Object.values(PLANS).reduce(
    (acc, plan) => {
      if (plan.stripePriceIdMonthly) {
        acc[plan.stripePriceIdMonthly] = plan.id;
      }
      if (plan.stripePriceIdYearly) {
        acc[plan.stripePriceIdYearly] = plan.id;
      }
      if (plan.stripePriceIdLifetime) {
        acc[plan.stripePriceIdLifetime] = plan.id;
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
