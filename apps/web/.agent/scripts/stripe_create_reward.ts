import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

async function createReward() {
  try {
    // 1. Create the Coupon
    const coupon = await stripe.coupons.create({
      percent_off: 50,
      duration: "forever",
      name: "Onboarding Reward (50% Off)",
    });
    console.log("✅ Created Coupon:", coupon.id);

    // 2. Create the Promotion Code
    const promoCode = await stripe.promotionCodes.create({
      coupon: coupon.id,
      code: "ONBOARDING50",
    });
    console.log("✅ Created Promotion Code:", promoCode.code);
    console.log("🎉 The code is now live and will work at checkout!");
  } catch (err) {
    console.error("❌ Failed to create reward in Stripe:", err.message);
  }
}

createReward();
