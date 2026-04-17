import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PLAN_1_PRICE_ID: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PLAN_2_PRICE_ID: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PLAN_3_PRICE_ID: z.string().optional(),
    NEXT_PUBLIC_STRIPE_LTD_PRICE_ID: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PLAN_1_YEARLY_PRICE_ID: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PLAN_2_YEARLY_PRICE_ID: z.string().optional(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_STRIPE_PLAN_1_PRICE_ID: process.env.NEXT_PUBLIC_STRIPE_PLAN_1_PRICE_ID,
    NEXT_PUBLIC_STRIPE_PLAN_2_PRICE_ID: process.env.NEXT_PUBLIC_STRIPE_PLAN_2_PRICE_ID,
    NEXT_PUBLIC_STRIPE_PLAN_3_PRICE_ID: process.env.NEXT_PUBLIC_STRIPE_PLAN_3_PRICE_ID,
    NEXT_PUBLIC_STRIPE_LTD_PRICE_ID: process.env.NEXT_PUBLIC_STRIPE_LTD_PRICE_ID,
    NEXT_PUBLIC_STRIPE_PLAN_1_YEARLY_PRICE_ID:
      process.env.NEXT_PUBLIC_STRIPE_PLAN_1_YEARLY_PRICE_ID,
    NEXT_PUBLIC_STRIPE_PLAN_2_YEARLY_PRICE_ID:
      process.env.NEXT_PUBLIC_STRIPE_PLAN_2_YEARLY_PRICE_ID,
  },
  emptyStringAsUndefined: true,
});
