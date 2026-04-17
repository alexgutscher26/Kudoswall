# Task: Setup Stripe Yearly Plans

Support for annual billing with a monthly/yearly toggle on the pricing page.

## Status: 🏗️ In Progress

## Pre-requisites

- [ ] confirm yearly price IDs from user (or use placeholders)
- [ ] Confirm yearly pricing (e.g., $290/yr for Pro, $790/yr for Agency)

## 1. Environment Variables

- [x] Update `apps/web/.env` with yearly price IDs
- [x] Update `apps/web/.env.example`
- [x] Update `packages/env/env.d.ts`
- [x] Update `packages/env/src/web.ts`
- [x] Update `turbo.json` with new env vars

## 2. Configuration Layer

- [x] Refactor `PLANS` in `packages/api/src/config/plans.ts`:
  - Rename `stripePriceId` to `stripePriceIdMonthly`
  - Add `stripePriceIdYearly`
  - Update `getPriceToPlan` helper to index all price IDs

## 3. Frontend Implementation

- [x] Update `PricingGrid.tsx`:
  - Fix `handleAction` to use the currently selected `billingCycle` to pick the correct `stripePriceId`.
  - Ensure `monthlyPrice` and `yearlyPrice` in the UI are consistent with config.

## 4. Lifetime (LTD) Plan Implementation

- [x] Update `billingRouter.ts`:
  - Add `getLTDCount` procedure.
  - Support `mode: "payment"` for one-time LTD purchases.
- [x] Update Stripe Webhook:
  - Support `checkout.session.completed` for one-time payments (no subscription ID).
- [x] Update `LTDCard.tsx`:
  - Fetch real LTD count from DB.
  - Implement functional checkout button.

## 5. Verification

- [ ] Verify checkout session is created with the correct price ID for both cycles.
- [ ] Check webhook processing for both subscriptions and one-time payments.
- [ ] Verify LTD seat count decrements correctly after a purchase.
