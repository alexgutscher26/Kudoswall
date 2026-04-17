# Plan: Implement Resend Emails and Fix Analytics

## Phase 1: Planning & Discovery

- [ ] Map out all email triggers in the codebase.
- [ ] Define the `packages/email` structure and dependencies (`react-email`, `resend`).
- [ ] Audit the `analytics` router and UI for inconsistencies.

## Phase 2: Implementation - Foundation

- [ ] Create `packages/email` with React Email templates.
  - [ ] Setup Tailwind configuration for emails.
  - [ ] Implement base layout (White background, dark header with orange accent, Georgia serif).
- [ ] Configure Resend in `packages/auth` for verification/magic links.
- [ ] Create a central `EmailService` in `packages/infra` or `packages/email`.

## Phase 3: Implementation - Core Emails

- [ ] **Welcome Email**: Trigger on signup (better-auth `onSignup` or `getOrCreateWorkspace`).
- [ ] **First Testimonial Email**: Trigger in `updateTestimonialStatus` when first testimonial is approved.
- [ ] **Activation Nudge**: Implement background task (e.g., using a cron job or Upstash QStash) to check for users with no collection links after 24h.
- [ ] **Re-engagement Email**: Implement background task for 14d inactivity.
- [ ] **Paid Plan TODOs**:
  - [ ] Upgrade prompt (5th testimonial).
  - [x] Trial expiring.
  - [x] Weekly digest (Pro).
  - [x] Cancellation (Stripe integration needed).

## Phase 4: Fix Analytics

- [ ] Implement real "change" (%) calculations in `analytics` router.
- [ ] Fix hardcoded `+0%` in `analytics-page.tsx`.
- [ ] Ensure `getDashboardData` uses live data instead of mocks for views.
- [ ] Add better empty states and error handling.

## Phase 5: Verification

- [ ] Test email delivery in development (using Resend's test mode or console logging).
- [ ] Verify analytics data accuracy against DB.
- [ ] Run `security_scan.py` and `lint_runner.py`.
