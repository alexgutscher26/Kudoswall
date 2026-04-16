// We use process.env directly for Price IDs to ensure they are available in both client and server contexts
// when this config is shared/required in Client Components.

export type Plan = "free" | "plan_1" | "plan_2" | "plan_3" | "ltd";

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
  };
}

export const PLANS: Record<Plan, PlanConfig> = {
  free: {
    id: "free",
    name: "Free",
    priceLabel: "$0",
    limits: {
      maxProjects: 1,
      maxTestimonials: 10,
    },
    features: {
      video: false,
      customDomain: false,
      whiteLabel: false,
      prioritySupport: false,
      memberInvites: false,
    },
  },
  plan_1: {
    id: "plan_1",
    name: "Pro",
    priceLabel: "$29/mo",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PLAN_1_PRICE_ID,
    limits: {
      maxProjects: 1,
      maxTestimonials: 1000,
    },
    features: {
      video: true,
      customDomain: true,
      whiteLabel: false,
      prioritySupport: false,
      memberInvites: true,
    },
  },
  plan_2: {
    id: "plan_2",
    name: "Agency",
    priceLabel: "$79/mo",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PLAN_2_PRICE_ID,
    limits: {
      maxProjects: 5,
      maxTestimonials: 5000,
    },
    features: {
      video: true,
      customDomain: true,
      whiteLabel: true,
      prioritySupport: true,
      memberInvites: true,
    },
  },
  plan_3: {
    id: "plan_3",
    name: "Enterprise",
    priceLabel: "$199/mo",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PLAN_3_PRICE_ID,
    limits: {
      maxProjects: 100,
      maxTestimonials: 50000,
    },
    features: {
      video: true,
      customDomain: true,
      whiteLabel: true,
      prioritySupport: true,
      memberInvites: true,
    },
  },
  ltd: {
    id: "ltd",
    name: "Lifetime",
    priceLabel: "$199 once",
    // stripePriceId: env.STRIPE_LTD_PRICE_ID, // Handled differently typically
    limits: {
      maxProjects: 5,
      maxTestimonials: 250,
    },
    features: {
      video: true,
      customDomain: true,
      whiteLabel: true,
      prioritySupport: true,
      memberInvites: true,
    },
  },
};

export const PRICE_TO_PLAN: Record<string, Plan> = Object.values(PLANS).reduce(
  (acc, plan) => {
    if (plan.stripePriceId) {
      acc[plan.stripePriceId] = plan.id;
    }
    return acc;
  },
  {} as Record<string, Plan>,
);

export const getPlanConfig = (planId: string | null | undefined): PlanConfig => {
  const id = (planId as Plan) || "free";
  return PLANS[id] || PLANS.free;
};
