import Stripe from "stripe";
import { env } from "../../packages/env/src/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

async function check() {
  try {
    const promoCodes = await stripe.promotionCodes.list({
      code: "ONBOARDING50",
      active: true,
    });

    if (promoCodes.data.length > 0) {
      console.log("✅ Promotion code ONBOARDING50 already exists.");
    } else {
      console.log("❌ Promotion code ONBOARDING50 does not exist in Stripe.");
    }
  } catch (err) {
    console.error("❌ Error checking Stripe:", err.message);
  }
}

check();
