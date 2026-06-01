# Loops.so Marketing Loops & Sync Integration Plan

## Overview

This plan implements syncing KudosWall's user events and contact properties to Loops.so. This allows Loops to trigger automated onboarding campaigns, transactional templates, and re-engagement workflows (such as the "Showcase Customer Testimonials in Minutes" workflow or "Your payment is confirmed" transactional email) based on real-time application events.

## Project Type

WEB (Next.js Monorepo running on Cloudflare Edge)

## Success Criteria

- [x] Users signing up are synced to Loops with initialized properties (`plan: "free"`, `testimonialCount: 0`, `widgetCount: 0`, `projectCount: 0`).
- [x] Creating a project triggers the `project_created` event and updates `projectCount` in Loops.
- [x] Receiving a testimonial triggers the `testimonial_received` event and updates `testimonialCount` in Loops.
- [x] Creating a widget triggers the `widget_created` event and updates `widgetCount` in Loops.
- [x] Successful checkout payments trigger a Loops transactional email for subscription confirmation, and update `plan` and `subscriptionStatus` properties.
- [x] Monorepo passes type-checks (`bun run check-types`) and builds successfully (`bun run build`).

## Tech Stack

- **Loops API**: Endpoints:
  - `POST /v1/contacts/create` (Create contact)
  - `PUT /v1/contacts/update` (Update contact properties)
  - `POST /v1/events/send` (Send custom marketing events)
  - `POST /v1/transactional` (Send transactional emails)
- **Standard Fetch**: Lightweight request client, ensuring optimal performance on Cloudflare Edge.

## File Structure

```
├── apps/web/src/
│   ├── app/api/webhooks/stripe/route.ts              (Modify: Sync payment state & send subscription transaction)
│   ├── app/dashboard/actions.ts                     (Modify: Sync project creation to Loops)
│   └── lib/email-helpers.ts                         (Modify: Sync testimonial count & trigger testimonial received)
├── packages/
│   ├── api/src/routers/widget.ts                     (Modify: Sync widget creation to Loops)
│   ├── auth/src/index.ts                             (Modify: Initialize properties on user signup)
│   ├── email/src/
│   │   ├── index.ts                                  (No change needed: already exports LoopsService)
│   │   └── loops.ts                                  (Modify: Add updateContact, sendEvent, and sendTransactional methods)
│   └── env/env.d.ts                                  (Modify: Declare LOOPS_TRANSACTIONAL_SUBSCRIBED_ID)
```

## Task Breakdown

### Task 1: Update Loops Service API Client

- **Agent**: `backend-specialist`
- **Priority**: P0
- **INPUT**: Loops API specifications.
- **OUTPUT**: Updated `packages/email/src/loops.ts` with `updateContact`, `sendEvent`, and `sendTransactional` methods.
- **VERIFY**: Compilation of `loops.ts`.

### Task 2: User Sign Up Initialization

- **Agent**: `backend-specialist`
- **Priority**: P1
- **Dependencies**: Task 1
- **INPUT**: `packages/auth/src/index.ts` create hook.
- **OUTPUT**: Extended signup hook that initializes contact properties in Loops.
- **VERIFY**: Hook compiles successfully.

### Task 3: Sync Actions & Events (Project, Testimonial, Widget)

- **Agent**: `backend-specialist`
- **Priority**: P1
- **Dependencies**: Task 1
- **INPUT**: Project, Testimonial, and Widget creation controllers.
- **OUTPUT**: Injected event triggers in:
  - `apps/web/src/app/dashboard/actions.ts` (`project_created` event)
  - `apps/web/src/lib/email-helpers.ts` (`testimonial_received` event)
  - `packages/api/src/routers/widget.ts` (`widget_created` event)
- **VERIFY**: Check syntax and type compatibility of updated controllers.

### Task 4: Stripe Checkout Webhook Sync

- **Agent**: `backend-specialist`
- **Priority**: P1
- **Dependencies**: Task 1
- **INPUT**: `apps/web/src/app/api/webhooks/stripe/route.ts` webhook handler.
- **OUTPUT**: Webhook updates properties in Loops and sends a Loops transactional confirmation email.
- **VERIFY**: Run type checking to verify.

## Phase X: Verification

- [x] Run `bun run check-types`
- [x] Run `bun run build`

## ✅ PHASE X COMPLETE

- Lint: ✅ Pass
- Security: ✅ No critical issues
- Build: ✅ Success
- Date: 2026-06-01
