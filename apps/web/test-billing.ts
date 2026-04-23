// test-billing.ts
import Stripe from "stripe";
import { GetContent } from "fs"; // Just a placeholder for your .env values

// Paste your values here temporarily from your .env for the test
const STRIPE_SECRET_KEY = "sk_test_51TMjnNLxspWmATptsGLI41pw7L737oYXeYRNh2rBMND5OGUbVa20mACFA6bAZOS3pP1bT8hnvjiVSoLzfQMaDTXn00EDTNExky"; 
const STRIPE_CUSTOMER_ID = "cus_..."; 
const ORIGIN = "http://localhost:3001";

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

async function test() {
  console.log("🚀 Starting Standalone Billing Test...");
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: STRIPE_CUSTOMER_ID,
      return_url: `${ORIGIN}/dashboard/settings`,
    });
    console.log("✅ SUCCESS! Portal URL:", session.url);
  } catch (err) {
    console.error("❌ STRIPE ERROR:", err.message);
    if (err.raw) console.error("Detailed Error:", JSON.stringify(err.raw, null, 2));
  }
}

test();
