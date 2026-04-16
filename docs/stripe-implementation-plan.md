# Implementation Plan: Stripe & Feature Gating (Updated)

## 📊 Subscription Structure

- **Free**: Baseline features.
- **Plan 1 (Standard)**: Entry-level paid tier.
- **Plan 2 (Premium)**: Mid-level paid tier.
- **Plan 3 (Enterprise)**: High-level paid tier.
- **LTD (Lifetime Deal)**: One-time payment, specific feature set.

## Phase 1: Foundation & Schema Updates

- [ ] **Database Migration**:
  - Update `workspace` table in `packages/db/src/schema/app.ts`.
  - Add `plan`: text field (Enum: `FREE`, `PLAN_1`, `PLAN_2`, `PLAN_3`, `LTD`).
  - Add `stripeCustomerId`, `stripeSubscriptionId`, `subscriptionStatus`.
- [ ] **Plan Definition API**:
  - Create `packages/api/src/config/plans.ts` mapping each plan to its features:
    - Max Projects (e.g., 1, 5, 20, Unlimited)
    - Max Testimonials (e.g., 10, 100, 500, Unlimited)
    - Video Recording access (Toggle)
    - Custom Branding (Toggle)
    - Custom Domains (Toggle)

## Phase 2: Stripe Logic & Webhooks

- [ ] **Stripe Client**: Initialize Stripe SDK in `packages/api/src/stripe.ts`.
- [ ] **Checkout Sessions**: tRPC procedures for Subscriptions and one-time LTD payments.
- [ ] **Webhook Controller**:
  - Implement `apps/web/src/app/api/webhooks/stripe/route.ts`.
  - Sync Stripe events to DB.
- [ ] **Customer Portal**: Direct users to Stripe for billing management.

## Phase 3: Feature Gating Engine

- [ ] **Unified Access Control**: Create a `getWorkspacePermissions(workspaceId)` helper.
- [ ] **API Gating**: Middleware to enforce limits on creation procedures.
- [ ] **Frontend Gating**: Premium UI components (Modals/Banners) for upgrade prompts.

## Phase 4: Billing Dashboard

- [ ] **Pricing Page**: Implement a 3-tier matrix + LTD option.
- [ ] **Billing Settings**: Summary of current plan and upgrade/manage actions.
