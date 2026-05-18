# PLAN-referral-system.md

## Overview

Implement a referral system where users can invite others to KudosWall. Instead of monetary rewards, successful referrals (where the referred user embeds their first wall) grant both the referrer and the referred user **30 days of stackable badge removal**.

## Goals

- Drive viral growth through a high-value free reward.
- Create an upgrade pipeline by giving users a taste of "No Badge" (a Pro feature).
- Implement a dedicated "Rewards" dashboard for tracking.

## Technical Requirements

### 1. Database Schema (`packages/db`)

- **`user` table updates**:
  - `referralCode`: `text` (unique, e.g., `ALEX123`).
  - `referredById`: `text` (references `user.id`).
  - `referralActivatedAt`: `timestamp` (tracked when they embed their first wall).
- **`workspace` table updates**:
  - `badgeRemovedUntil`: `timestamp` (nullable, represents the end date of the reward).

### 2. Referral Logic (`packages/api`)

- **Signup Hook**:
  - Capture `ref` query param during signup and set `referredById`.
  - Generate a unique `referralCode` for the new user.
- **Activation Logic (`analytics.trackEvent`)**:
  - When an `eventType: "view"` occurs for a `widget`:
    - Check if the workspace owner has `referredById` and `referralActivatedAt` is null.
    - If yes:
      - Set `referralActivatedAt` = now.
      - **Referrer Reward**: Increment `workspace.badgeRemovedUntil` by 30 days. If the date is in the past, set it to `now + 30 days`. If in the future, add 30 days to the existing date.
      - **Referred User Reward**: Set `workspace.badgeRemovedUntil` = `now + 30 days`.
- **tRPC Procedures**:
  - `referral.getStats`: Returns total referrals, activated referrals, and current badge removal status.
  - `referral.getCode`: Returns the user's referral code.

### 3. Dashboard UI (`apps/web`)

- **Rewards Tab**:
  - **Hero Section**: "Refer a friend, get 30 days of badge-free embedding."
  - **Referral Link**: Copyable link (e.g., `https://kudoswall.org/signup?ref=CODE`).
  - **Stats Card**:
    - "Referrals Sent"
    - "Active Rewards" (e.g., "60 days remaining")
  - **Referral List**: Table showing referred users and their activation status (Pending vs. Active).

### 4. Widget Integration (`apps/web` & `packages/api`)

- **Data Fetching**:
  - Update `widget.getPublicData` to return `isBadgeRemoved` (boolean).
  - `isBadgeRemoved` = `true` if `isPro` OR `workspace.badgeRemovedUntil > now`.
- **Component Update (`widget.tsx`)**:
  - Respect the `isBadgeRemoved` flag to hide the "Powered by KudosWall" link.

## Verification Checklist

### Phase 1: Database

- [ ] Migration adds all fields to `user` and `workspace`.
- [ ] `referralCode` is automatically generated for new users.

### Phase 2: Referral Flow

- [ ] Signing up with `?ref=XYZ` correctly populates `referredById`.
- [ ] Embedding a wall for the first time triggers the reward logic.
- [ ] Referrer's `badgeRemovedUntil` stacks correctly (30, 60, 90 days).
- [ ] Referred user gets their initial 30 days.

### Phase 3: UI/UX

- [ ] "Rewards" tab is visible in the dashboard sidebar.
- [ ] Referral link copies to clipboard.
- [ ] Badge disappears from the widget when a reward is active.

## Potential Edge Cases

- **Self-referral**: Basic IP/Fingerprint check (optional for MVP, activation requirement helps).
- **Multiple Workspaces**: Reward should probably apply to the _owner's_ primary workspace or all workspaces they own. Let's start with "Primary Workspace".
- **Expiration**: Ensure the badge reappears exactly when the timestamp passes.
