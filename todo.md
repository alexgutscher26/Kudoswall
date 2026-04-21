# 🌌 KudosWall: The Infinite Roadmap

> **A living product bible.** Every checkbox is actionable, every section is ship-ready.
> _Last updated: 2026-04-12_

---

## 💎 Table of Contents

1. [🏛️ Core Foundation & Infrastructure](#1-core-foundation--infrastructure)
2. [🔐 Auth & Multi-tenancy](#2-auth--multi-tenancy)
3. [📹 The "Sender" Experience (Collection)](#3-the-sender-experience-collection)
4. [📊 The "Owner" Experience (Dashboard)](#4-the-owner-experience-dashboard)
5. [📦 Widget & Embed Engine](#5-widget--embed-engine)
6. [🎨 Widget Customizer & Theming](#6-widget-customizer--theming)
7. [💳 Billing & Monetization](#7-billing--monetization)
8. [🤖 AI & Intelligence Layer](#8-ai--intelligence-layer)
9. [🔌 Integrations & Ecosystem](#9-integrations--ecosystem)
10. [🏢 Enterprise & Agency Suite](#10-enterprise--agency-suite)
11. [📱 Mobile Strategy & PWA](#11-mobile-strategy--pwa)
12. [📈 Analytics & Insights](#12-analytics--insights)
13. [🛡️ Security, Privacy & Compliance](#13-security-privacy--compliance)
14. [🎬 Advanced Video Suite](#14-advanced-video-suite)
15. [🚀 Performance & Edge Engineering](#15-performance--edge-engineering)
16. [🌍 Internationalization (i18n)](#16-internationalization-i18n)
17. [🌱 Growth, SEO & Viral Loops](#17-growth-seo--viral-loops)
18. [🤝 Support & Customer Success](#18-support--customer-success)
19. [🛠️ DevOps, Observability & Internal Ops](#19-devops-observability--internal-ops)
20. [☁️ Public API & Developer Portal](#20-public-api--developer-portal)
21. [📣 Marketing & Content Engine](#21-marketing--content-engine)
22. [🧪 Testing & Quality Assurance](#22-testing--quality-assurance)
23. [🌠 Future V2 (Moonshots)](#23-future-v2-moonshots)
24. [🎯 2026 Competitive Intelligence & Positioning](#24-2026-competitive-intelligence--positioning)

---

## 🏛️ 1. Core Foundation & Infrastructure

### 1.1 Project & Tooling Setup

- [x] Initialize Turborepo monorepo with Next.js 16 (App Router)
- [x] Configure Tailwind CSS v4 with CSS-first design tokens
- [x] Set up Drizzle ORM with PostgreSQL database
- [x] Configure Cloudflare Pages/Workers deployment via OpenNext
- [x] Set up Prettier with Tailwind CSS plugin + Lefthook git hooks
- [x] Implement tRPC v11 for end-to-end type-safe API
- [x] Migrate all `any` TypeScript types to strict `unknown` equivalents
- [x] Add `strict: true` to all `tsconfig.json` files in packages

### 1.2 Data Architecture

- [x] Implement database migrations with Drizzle Kit
- [x] Core schema: Users, Workspaces, Collections, Testimonials, Tags
- [x] Relational integrity: `testimonialToTags` join table
- [x] Implement soft-deletes (`deletedAt` column) across all tables
- [x] Audit-logging table for every DB mutation (actor, timestamp, diff)
- [x] Set up automated daily database backups with restore testing
- [x] Implement read-replicas for high-traffic widget queries
- [x] Point-in-time recovery (PITR) strategy documentation
- [x] Database connection pooling via PgBouncer or Prisma Accelerate
- [x] Database partitioning strategy for 10M+ testimonials by `createdAt`
- [x] Add `updatedBy` / `createdBy` foreign key columns to all tables
- [x] Implement database health check endpoint (`/api/health/db`)
- [x] Add composite indexes for common query patterns (e.g., `workspaceId + state`)

### 1.3 Storage & Asset Pipeline

- [ ] Configure Cloudflare R2 for video & image storage
- [ ] Implement signed URL generation for all private asset access
- [ ] Build image optimization pipeline (Sharp on upload → WebP + AVIF)
- [ ] Auto-generate multiple video resolutions (360p, 720p, 1080p) via FFmpeg
- [ ] Add CDN distribution layer for all user-uploaded static assets
- [ ] Implement R2 lifecycle policies (archive videos > 12 months to cold storage)
- [ ] Set up virus/malware scanning on file upload (ClamAV or similar)
- [ ] Enforce file type validation server-side (MIME sniffing, not extension)
- [ ] Add maximum file size enforcement per plan tier

### 1.4 Edge & Caching Strategy

- [ ] Implement Edge Caching for Widget API via Cloudflare Cache Rules
- [ ] KV-store for fast widget metadata lookups (sub-10ms)
- [ ] Global CDN cache purge on testimonial approval/edit
- [ ] Multi-region deployment strategy for <50ms P99 latency globally
- [ ] Stale-While-Revalidate (SWR) strategy for collection page data
- [ ] Request coalescing at edge to prevent cache stampedes

---

## 🔐 2. Auth & Multi-tenancy

### 2.1 Authentication

- [x] Email/Password authentication via Better Auth
- [x] Google OAuth provider
- [x] GitHub OAuth provider
- [x] LinkedIn OAuth provider
- [x] Magic Link (passwordless) authentication
- [ ] Two-Factor Authentication (2FA) via TOTP Authenticator App
- [ ] Backup / recovery codes for locked-out 2FA accounts
- [ ] Passkey / WebAuthn support (Biometric: FaceID / TouchID)
- [ ] Session management UI: View all active sessions, terminate individually
- [ ] Suspicious login detection with email alert
- [ ] Account lockout after N failed login attempts with CAPTCHA unlock
- [ ] "Remember this device for 30 days" checkbox on login

### 2.2 Enterprise Identity (SSO)

- [ ] SAML 2.0 / SSO integration (Okta, Azure AD, Google Workspace)
- [ ] SCIM provisioning for large team onboarding/offboarding
- [ ] Custom SSO domain configuration per workspace
- [ ] JIT (Just-in-Time) user provisioning on first SSO login
- [ ] Enforce SSO-only mode for Enterprise orgs (disable password login)

### 2.3 Multi-tenancy Architecture

- [x] Workspace-based architecture with unique URL slugs
- [x] Workspace switcher UI in the top navigation bar
- [ ] Row-level security (RLS) / tenant isolation at the ORM layer
- [x] Custom subdomain per workspace (`customer.kudoswall.com`)
- [ ] Workspace-level settings page (name, logo, timezone, language)
- [ ] Organization-wide billing: One subscription covers all workspaces

### 2.4 Team Collaboration & RBAC

- [ ] Invite team members via email link or auto-capture company domain
- [x] Granular role system: Owner, Admin, Editor, Moderator, Viewer
- [ ] Custom permission sets per role (e.g., can-approve, can-delete)
- [ ] Activity feed: See what teammates are working on in real-time
- [ ] In-app commenting system for team discussions on specific testimonials
- [ ] Notifications: @mention teammates in comments
- [ ] Audit trail: Who approved / rejected each testimonial

---

## 📹 3. The "Sender" Experience (Collection)

### 3.1 Collection Engine

- [x] Multi-step submission wizard (Rating → Text → Photo → Video)
- [x] Custom fields: Company name, LinkedIn URL, Job title, Tagline
- [x] In-browser photo cropping for profile pictures
- [x] Confetti animation on successful submission
- [x] Progress bar across all wizard steps
- [x] Auto-save draft to LocalStorage (recover if browser crashes)
- [x] Fully responsive mobile-first layout
- [x] Dark / Light mode detection (`prefers-color-scheme`)
- [x] Animated step transitions (slide, fade) between wizard steps
- [x] "Skip this step" button for optional fields (Video, Photo)
- [x] Multi-language support on collection pages (auto-detect browser locale)
- [x] End-user consent checkbox for data storage before submission
- [x] IP-based rate limiting on the collection submission endpoint

### 3.2 Video Recording Excellence

- [ ] Countdown timer (3…2…1…) with audio click sound before recording starts
- [ ] Visual audio level indicator (VU meter) during recording
- [ ] Teleprompter overlay (customer sees their script while recording)
- [ ] Video prompts: Owner records a question; customer records a reply
- [ ] Instant playback and re-record capability after recording
- [ ] Automatic background noise suppression (WebAudio API Noise Gate)
- [ ] Virtual background blur (Portrait Mode) via BodyPix / MediaPipe
- [ ] Graceful "Upload only" fallback if camera access is denied
- [ ] Screen recording mode (for software testimonials)
- [ ] Recording duration limit configurable by owner (30s, 60s, 120s)
- [ ] Show recording quality warning if low bandwidth is detected

### 3.3 Branding & Whitelabeling on Collection Pages

- [x] Owner-uploaded logo displayed at the top of collection form
- [x] Custom primary color / accent color applied to CTA buttons
- [x] Custom "Thank You" page with configurable CTA button
- [x] 35+ Google Fonts selectable and dynamically loaded
- [x] Upload custom `.woff2` font file for 100% brand match
- [ ] Full custom CSS override textarea for advanced users
- [x] Branded Favicon for collection page tab
- [x] Custom domain for collection page (`reviews.yourbrand.com`)
- [ ] Custom email "From" name for submission confirmation emails
- [x] Remove "Powered by KudosWall" badge (paid plan)
- [ ] Custom background (solid color, gradient, or image upload)
- [ ] Animated gradient background option for high-end feel

### 3.4 Identity Verification

- [ ] "Verify via LinkedIn" button to reduce fake testimonials
- [ ] "Verify via Google" OAuth verification with badge display
- [ ] Display verified badge on testimonial cards in the widget
- [ ] Optional email verification step before submission is accepted

---

## 📊 4. The "Owner" Experience (Dashboard)

### 4.1 Testimonial Inbox 2.0

- [x] Testimonial list view with basic filtering
- [x] Approve / Reject / Delete individual testimonials
- [x] Tag assignment to testimonials
- [x] Tag persistence across API queries (testimonialToTags relation included)
- [ ] Real-time inbox (WebSocket or SSE) — new submissions appear instantly
- [x] Filter tabs: All / Pending / Approved / Rejected / Featured / Archived
- [ ] Search bar: Filter by customer name, email, company, or keyword
- [ ] Advanced filter panel: By rating (1-5), by type (Text/Video), by tag, by language, by date range
- [ ] Bulk actions: Approve all, Reject all, Tag selected, Export selected, Delete selected
- [ ] Drag-and-drop reordering of featured testimonials
- [ ] "Feature" toggle to pin top testimonials in widgets
- [ ] External public link to share a single testimonial (for sales teams)
- [ ] Testimonial preview modal with full card render
- [ ] Keyboard shortcuts: `A` to approve, `R` to reject, `J/K` to navigate

### 4.2 Collection Management

- [x] Create and manage multiple collection forms
- [x] Per-collection branding settings (logo, color, font)
- [x] Collection page live preview
- [ ] Collection analytics: Submission rate, completion rate per step, drop-off heatmap
- [ ] A/B testing for collection form copy (Headline, CTA button text)
- [x] Collection form duplication (Clone an existing form)
- [ ] Archive / delete old collections
- [ ] QR code generator per collection for offline use (print on receipts, flyers)
- [ ] Short URL / vanity URL per collection (`kudoswall.com/c/yourslug`)
- [x] Embed collection form as an inline modal on your own website
- [ ] Collection page password protection (for private review campaigns)

### 4.3 CRM & Customer Relationship

- [ ] Customer profile view: All testimonials from one person in one timeline
- [ ] Direct email outreach to customers from the dashboard (via Resend)
- [ ] "Request update" flow: Ask a customer to re-record or improve their review
- [ ] Automated reward system: Send discount codes or "Spin the Wheel" freebies to submitters
- [ ] Follow-up email sequences for customers who viewed the form but didn't submit
- [ ] Customer satisfaction score (CSAT) aggregation per account

### 4.4 Testimonial Request Campaigns (The "Month 3" Automation Differentiator)

- [ ] Bulk import customer emails (CSV upload)
- [ ] One-click campaign: Send request emails to an entire customer list
- [ ] Email sequence builder: Day 0, Day 3, Day 7 follow-up (with opt-out)
- [ ] Campaign dashboard: Track open rate, click rate, and submission rate per campaign
- [ ] Personalization tokens in email templates (`{{first_name}}`, `{{product_name}}`)
- [ ] Smart send-time optimization (Send at 10am in recipient's timezone)

### 4.5 Global Dashboard UX

- [x] Onboarding checklist widget on the home dashboard ("Your first testimonial in 5 steps")
- [ ] Global search (Cmd+K): Find testimonials, collections, customers instantly
- [x] Dashboard home redesign: Key metrics, recent activity, quick actions
- [ ] Collapsible sidebar for more screen real estate
- [ ] Dark mode for the entire dashboard
- [ ] Notification center (bell icon) for all async events

---

## 📦 5. Widget & Embed Engine

### 5.1 Architecture & Performance

- [x] Iframe-based isolation for CSS sandboxing
- [x] Seamless auto-resizer (no scrollbars, no clipping)
- [x] Zero Cumulative Layout Shift (CLS): Explicit dimension placeholders
- [x] Lazy-load video assets (only when visible in viewport)
- [x] Edge-rendered widget content via API route
- [x] `widget.js` loader script (single `<script>` tag embed)
- [ ] Compress `widget.js` loader to <2KB gzipped
- [ ] Preconnect hints (`<link rel="preconnect">`) injected by loader
- [ ] Service Worker caching for repeat widget visitors
- [ ] Render-blocking prevention: Load widget as non-blocking async script

### 5.2 Layout Library

- [x] **Grid** — Classic responsive card grid
- [x] **Masonry** — Pinterest-style height-variable layout
- [x] **Carousel** — Touch/swipe-enabled with auto-play, pause-on-hover
- [ ] **Bento Grid** — Asymmetric premium layout (1 large + N small cards)
- [ ] **Single Quote** — Full-width minimalist hero section quote
- [ ] **Video Bubble** — Floating "Story" style bubble in page corner
- [ ] **Ticker / Marquee** — Horizontally scrolling social proof strip
- [ ] **List** — Simple vertical stack (great for sidebars)
- [ ] **Spotlight** — One featured testimonial with CTA occupying full section

### 5.3 Card Types

- [x] Text testimonial card
- [x] Video testimonial card with play button
- [x] Star rating display on cards
- [x] Customer avatar, name, company, and role display
- [ ] Verified badge display on cards (when identity verified)
- [ ] Source badge display (e.g., "from Google Reviews", "from Trustpilot")
- [ ] "Read more / Read less" for long testimonials (expandable inline)
- [ ] Social sharing buttons per card (Share to X, LinkedIn, copy link)
- [ ] Video cards: Auto-play on hover, mute by default
- [ ] Video cards: Caption / subtitle overlay (from AI transcription)

### 5.4 Widget Interaction & Logic

- [ ] Client-side filter bar on widget (Filter by type, rating, tag)
- [ ] Infinite scroll or "Load more" pagination
- [ ] Lead capture CTA panel at the bottom of the wall
- [ ] Custom CSS hooks / `data-kudos-*` attributes for developer customization
- [ ] Testimonial deep-link modal: Click a card → full-screen card overlay
- [ ] Scroll-triggered entrance animations for cards (fade/slide up)

---

## 🎨 6. Widget Customizer & Theming

### 6.1 Customizer UI (Dashboard Side)

- [x] Live WYSIWYG preview of the widget as settings change
- [x] Layout selector (Grid, Masonry, Carousel)
- [x] Color pickers: Background, Card, Text, Accent, Border
- [x] Border radius slider (0px → 24px)
- [x] Card shadow intensity slider
- [x] Font family selector (35+ Google Fonts, dynamically loaded)
- [x] Font size adjustment (Base size slider)
- [x] Display toggles: Show/hide avatar, rating, company, role, date
- [x] Max testimonials to display (slider)
- [x] Filter: Show only video, only text, or both
- [ ] Theme preset library: Minimal, Glassmorphism, Neo-brutalism, Dark Luxury, Soft Pastel
- [ ] Save / name multiple widget themes per collection
- [ ] Import/export widget config as JSON
- [ ] Global design variables: Apply one color change everywhere
- [ ] Spacing controls: Card gap, internal padding
- [ ] Animation toggle: Enable/disable entrance animations
- [ ] Custom CSS editor (Monaco Editor) for power users

### 6.2 Embed Code Generation

- [x] Auto-generate `<script>` embed snippet
- [x] Widget ID dynamically injected into snippet
- [x] Origin URL injected for CORS security
- [x] Copy-to-clipboard button with feedback toast
- [ ] iFrame embed code option (for platforms that block scripts)
- [ ] WordPress shortcode format option
- [ ] Webflow / Framer integration instructions inline
- [ ] Preview of the embed code in a syntax-highlighted code block

### 6.3 Theme System Internals

- [x] CSS variable injection into iframe (`--kudos-bg`, `--kudos-font`, etc.)
- [x] Google Font dynamic loader injected into iframe `<head>`
- [x] Font fallback stack for all 35+ fonts (system fonts as fallback)
- [ ] Dark/Light mode variant per widget (override or follow system)
- [ ] Responsive breakpoints for the widget itself (mobile vs. desktop card size)

---

## 💳 7. Billing & Monetization

### 7.1 Subscription Foundation

- [x] Stripe Checkout integration for plan onboarding
- [x] Monthly vs. Yearly billing cycle toggle with savings badge ("Save 20%")
- [ ] Automated proration for mid-cycle plan upgrades/downgrades
- [x] Self-serve Billing Portal: Update card, cancel subscription, download invoices
- [x] Plan comparison table on the pricing page
- [x] Feature gating: Upsell modal when user hits a plan limit
- [ ] Dunning flow: Retry failed payments, pause account, send recovery emails
- [ ] Grace period: 7-day window on payment failure before access revoked

### 7.2 Plan Tiers (Proposed)

- [x] **Free**: 1 collection, 25 testimonials, 1 widget, KudosWall branding
- [x] **Starter** ($19/mo): 3 collections, 200 testimonials, 3 widgets, no branding
- [x] **Pro** ($29/mo): **Competitive Match** - Unlimited collections, 1000 testimonials, all layouts, AI features
- [x] **Business** ($99/mo): Video suite, team members (5 seats), custom domain
- [x] **Enterprise** (custom): SSO, SCIM, SLA, dedicated support, data residency

### 7.3 Usage-Based Billing

- [ ] Track and limit video storage by GB per plan
- [ ] Track and limit testimonial count per month
- [ ] Track and limit workspace / team member seats
- [ ] Over-usage alerts sent via email at 80% and 100% of limits
- [ ] Hard-stop or overage billing (configurable per plan)

### 7.4 Growth & Retention Features

- [x] 7-day free trial
- [x] Coupon code management system in Stripe + admin panel
- [ ] Trial expiration drip emails: 7 days left, 3 days left, 1 day left, expired
- [ ] "Cancel" page with retention offer (1-month discount or pause option)
- [ ] Plan pause option (keep data, lose access, $5/mo hold fee)
- [ ] Affiliate/referral program deep integration with Rewardful

### 7.5 Tax & International Compliance

- [ ] Stripe Tax integration for global VAT / Sales Tax automation
- [ ] Collect VAT number for EU B2B customers (reverse charge)
- [ ] PDF invoice generation with correct customer tax details
- [ ] Support for non-USD currencies (GBP, EUR, AUD)

---

## 🤖 8. AI & Intelligence Layer

### 8.1 Text Analysis

- [ ] Sentiment scoring per testimonial (Positive / Neutral / Negative + score 0-100)
- [ ] Sort testimonials dashboard by "Most Enthusiastic" (highest sentiment)
- [ ] Keyword extraction: Auto-identify most mentioned topics ("Support", "Easy to use")
- [ ] Topic clustering: Group testimonials by theme automatically
- [ ] Automated profanity, spam, and toxicity filtering on submission
- [ ] Competitor mention detection (Alert owner if a competitor is named)
- [ ] Feature gap suggestions: "Customers often mention X — maybe address it in your FAQ?"

### 8.2 Video Intelligence

- [ ] AI transcription of all video testimonials (OpenAI Whisper / Deepgram)
- [ ] Subtitle / caption generation with word-level sync (Karaoke highlight)
- [ ] Smart thumbnail selection: AI picks the frame where the speaker is smiling
- [ ] Face blur option for privacy-conscious customers
- [ ] AI one-sentence headline generated for each video
- [ ] Automatic silence trimming from start and end of recordings
- [ ] Speaker diarization for multi-person recordings

### 8.3 Automation Engine

- [ ] Auto-tagging based on content analysis (e.g., "High Energy", "Mentions Pricing")
- [ ] Auto-approve low-risk submissions (verified identity + positive sentiment + clean content)
- [ ] AI "Thank You" email body suggestion for CRM outreach
- [ ] Smart testimonial ranking: Surface the most conversion-relevant testimonials in widgets
- [ ] AI case study generator: Convert a testimonial into Problem → Solution → Result format

### 8.4 AI Writing Tools

- [ ] "Polish my testimonial" — AI rewrites submitted text for clarity and impact
- [ ] Quote extractor: Pull the single most powerful sentence from a long testimonial
- [ ] Headline generator: Create 5 social-ready headline variations per testimonial

---

## 🔌 9. Integrations & Ecosystem

### 9.1 Review Source Imports

- [ ] Google Business Reviews importer (OAuth integration)
- [ ] Trustpilot connector (API key)
- [ ] Import from 30+ platforms (Shopify, G2, Yelp, Trustpilot, CSV, etc.)
- [ ] X/Twitter "Mention to Import" — monitor your @handle and import praise tweets
- [ ] LinkedIn recommendation importer
- [ ] App Store & Google Play review importer

### 9.2 Platform Plugins & Embeds

- [ ] Official Shopify App (Shopify App Store listing)
- [ ] WordPress Plugin with Gutenberg Block (WordPress.org listing)
- [ ] Elementor Widget for WordPress
- [ ] Wix App Market integration
- [ ] Framer component integration guide
- [ ] Webflow integration guide + Cloneable project
- [ ] Squarespace Code Injection guide
- [ ] Ghost CMS integration
- [ ] Chrome Extension: Capture praise from any URL with one click

### 9.3 Workflow Connectivity

- [ ] Zapier official app (Published in Zapier directory)
- [ ] Make.com (Integromat) official app
- [ ] Native Slack notification: New submission → Slack channel
- [ ] Native Discord notification: New submission → Discord channel
- [ ] HubSpot CRM: Sync testimonials to contact records
- [ ] Salesforce integration: Attach testimonials to Opportunity records
- [ ] Notion integration: Push new testimonials to a Notion database
- [ ] Custom Webhook manager (Create, test, view logs in dashboard)
- [ ] Incoming webhook: Accept testimonials from external forms/apps

### 9.4 Email & Notifications

- [x] Resend integration for transactional emails
- [ ] Custom email templates (branded HTML, full WYSIWYG editor)
- [ ] Email notification preferences per user (Digest vs. Instant)
- [ ] Weekly digest email: Top testimonials received this week
- [ ] Confirmation email to sender after successful submission

---

## 🏢 10. Enterprise & Agency Suite

### 10.1 Agency Multi-Client Management

- [ ] Umbrella/parent account to manage 50+ client workspaces from one login
- [ ] White-label dashboards for clients (Remove all KudosWall branding)
- [ ] Per-client billing models (Bill clients separately or centrally)
- [ ] Client access controls: Grant clients limited dashboard access
- [ ] Agency analytics overview: Testimonials collected across all clients this month

### 10.2 Governance & Compliance

- [ ] Full audit log table: Every action taken by any user in the org, exportable
- [ ] Data Residency options: EU-only storage for GDPR-strict companies
- [ ] IP Whitelisting for dashboard access
- [ ] SSO enforcement (Block non-SSO logins for Enterprise)
- [x] Contractual DPA (Data Processing Agreement) self-service flow

### 10.3 Enterprise Branding & Customization

- [ ] Custom primary domains for collection pages (`reviews.yourbrand.com`)
- [ ] Fully whitelabeled outbound emails (From: `support@yourdomain.com`)
- [ ] Remove "Powered by KudosWall" from all widgets and collection pages
- [ ] Custom embed script domain (serve `widget.js` from their own CDN)
- [ ] Custom internal name/logo for the dashboard (full white-label)

### 10.4 SLA & Enterprise Operations

- [ ] 99.9% uptime SLA with status page
- [ ] Priority support queue with 4-hour response SLA
- [ ] Custom onboarding sessions (video call with CS team)
- [ ] Quarterly business reviews (QBR) for top-tier accounts
- [ ] Professional services: Data migration from competitors

---

## 📱 11. Mobile Strategy & PWA

### 11.1 Progressive Web App (PWA)

- [ ] Offline recording support via IndexedDB (Sync video when back online)
- [ ] "Add to Home Screen" install prompt on mobile
- [ ] Splash screen and optimized app icon set (192x192, 512x512)
- [ ] Background sync for pending submissions after connectivity restores
- [ ] Web Share API integration: Share a collection link natively from mobile

### 11.2 Mobile Dashboard Experience

- [ ] Mobile-optimized dashboard: Quick approve/reject with swipe gestures
- [ ] Push notifications for new testimonial submissions (Web Push API)
- [ ] Bottom navigation bar for mobile dashboard (vs. sidebar on desktop)

### 11.3 Native SDK (Future)

- [ ] iOS SDK: Native video recording component for mobile apps
- [ ] Android SDK: Native video recording component for mobile apps
- [ ] React Native component library for collecting testimonials in-app
- [ ] QR Code generator: Print on receipts or flyers → scan → submit review
- [ ] QR Code tracking: Know which physical location the scan came from

### 11.4 Camera & Recording Optimization

- [ ] Portrait mode background blur in-browser (via MediaPipe / BodyPix)
- [ ] Flash/lighting quality tips shown before recording starts
- [ ] Optimal recording orientation enforced (landscape warning on mobile)
- [ ] Auto-switch to rear/front camera button during recording

---

## 📈 12. Analytics & Insights

### 12.1 Widget Analytics (Fix Priority 🔴)

- [x] **Fix**: Ensure `trackEvent` tRPC mutation correctly persists to `analytics_event` table
- [x] **Fix**: Verify `widgetId` and `eventType` are correctly passed from widget iframe
- [x] **Fix**: Verify `eventType` enum matches DB schema (`view`, `click`, `video_play`)
- [x] Widget Impression tracking (page load counts per widget)
- [x] Video Play Rate & Completion Rate (25%, 50%, 75%, 100% milestones)
- [x] Click-through rate (CTR) on Widget CTA buttons
- [x] Unique visitor tracking (cookie-less: IP + UA hash for privacy)
- [ ] Traffic source attribution for widget views (referrer tracking)

### 12.2 Collection Analytics

- [ ] Collection page view count
- [x] Submission funnel: View → Start → Step 2 → Step 3 → Submit
- [ ] Step-level drop-off rates (Which step loses the most users?)
- [ ] Device breakdown: Mobile vs Desktop submissions
- [ ] Geographic distribution of submitters (Heatmap on world map)
- [ ] Time-to-complete: Average time to fill the form

### 12.3 Business Intelligence Dashboard

- [ ] High-level KPI dashboard: Total testimonials, total views, avg rating, conversion rate
- [ ] Attribution layer: Which testimonials appear on pages that convert?
- [ ] Testimonial performance score: Combine view count + play rate + sentiment
- [ ] Weekly / Monthly PDF performance reports emailed to owners
- [ ] Benchmark data: "Your conversion is 23% above industry average"
- [ ] Custom date range picker for all analytics charts
- [ ] Export analytics data as CSV

### 12.4 Speed & Health Monitoring

- [ ] Core Web Vitals monitoring for widget performance
- [ ] Asset load-time tracking across global regions (Cloudflare Analytics)
- [ ] Widget error rate tracking (JS errors in iframe reported back)
- [ ] API response time percentile tracking (P50, P95, P99)

---

## 🛡️ 13. Security, Privacy & Compliance

### 13.1 Privacy-First Architecture

- [x] GDPR/CCPA compliant data processing agreements (DPA)
- [x] Cookie-less widget impression tracking (IP + UA fingerprint, no cookies)
- [x] One-click "Right to be forgotten" tool (Delete all submitter data)
- [x] One-click data export for submitters (JSON/CSV)
- [x] Cookie consent banners on collection pages (optional, configurable)
- [x] Privacy policy generator for collection page footer
- [x] Data retention policies: Auto-delete testimonials after N years if configured

### 13.2 Application Hardening

- [x] Content Security Policy (CSP) headers
- [x] CORS configuration for widget API
- [x] Configure `Strict-Transport-Security` (HSTS) with preload
- [x] Configure `X-Content-Type-Options: nosniff`
- [x] Configure `X-Frame-Options: SAMEORIGIN` (except for widget iframe)
- [x] Configure `Referrer-Policy: strict-origin-when-cross-origin`
- [x] Configure `Permissions-Policy` (disable camera/mic by default)
- [ ] Rate limiting on all public-facing API endpoints (Upstash Redis)
- [ ] API key rotation endpoint for public API users
- [ ] Encryption at rest (AES-256) for video assets in R2

### 13.3 Abuse Prevention

- [ ] AI-driven spam detection on text submissions
- [ ] IP blacklisting for known botnets / abusers
- [ ] Cloudflare Turnstile CAPTCHA on submission form (invisible, privacy-first)
- [ ] Honeypot field in collection form (bot trap)
- [ ] Duplicate submission guard: Block same email within configurable window
- [ ] Server-side file type validation (MIME sniffing beyond extension check)

### 13.4 Vulnerability Management

- [ ] Integrate Snyk or GitHub Advanced Security for dependency scanning
- [ ] Weekly automated `npm audit` report to team Slack channel
- [x] Security.txt file at `/.well-known/security.txt`
- [x] Responsible disclosure policy

---

## 🎬 14. Advanced Video Suite

### 14.1 Browser-Based Video Editor

- [ ] Start/end trimming with a visual timeline scrubber
- [ ] Branded watermark / logo overlay in the corner
- [ ] Lower-third name tag overlay ("Alex • Director of Marketing")
- [ ] Dynamic background music (Library of royalty-free tracks)
- [ ] Mute the original audio + replace with music
- [ ] Add intro bumper / outro card from a template library
- [ ] Text annotations on timeline (Highlight key moments)
- [ ] Output quality selector (720p vs. 1080p)

### 14.2 Video Export & Distribution

- [ ] Export as TikTok/Reels-ready vertical (9:16) with captions burned in
- [ ] Export as LinkedIn-ready square (1:1)
- [ ] Export as traditional landscape (16:9) for YouTube / website
- [ ] 1-Click share to LinkedIn, X (Twitter), and Instagram Stories
- [ ] Video "Wall of Fame" page: Public gallery of video testimonials
- [ ] Video Sizzle Reels: AI-powered remix of video testimonials into social ads/posts
- [ ] Video embed code (just the video, without the full wall)

### 14.3 Video Processing Pipeline

- [ ] FFmpeg transcoding job queue (Cloudflare Queue or BullMQ)
- [ ] Progress indicator while video is processing post-upload
- [ ] Processing failure recovery with user notification
- [ ] Webhook notification when video processing completes
- [ ] Video thumbnail generation at 0s, 25%, 50%, 75% marks

---

## 🚀 15. Performance & Edge Engineering

### 15.1 Next.js Performance

- [x] Implement Partial Prerendering (PPR) for the dashboard home page
- [x] Convert heavy client components to React Server Components where possible
- [x] Implement React Compiler (`react-compiler` Babel plugin) for auto-memoization
- [x] Eliminate unnecessary `use client` boundaries across the codebase
- [x] Add `<Suspense>` boundaries with skeleton loaders for all async data

### 15.2 Widget Performance

- [ ] Move widget data fetching from SQL to KV-store (sub-10ms reads)
- [ ] Image & Video optimization at the edge (Cloudflare Images / R2 Transform)
- [ ] Bundle squeezing: Remove all unused JS from widget loader (`widget.js`)
- [ ] Preload critical widget font via `<link rel="preload">` hint in loader
- [ ] Widget LCP measurement and optimization (<1.5s target)

### 15.3 Database Query Optimization

- [ ] Run `EXPLAIN ANALYZE` on the 10 most-called queries
- [ ] Add missing indexes identified by slow query log
- [ ] Eliminate N+1 queries in tRPC routers (use `.with()` in Drizzle)
- [ ] Implement query result caching for read-heavy endpoints

### 15.4 Monitoring & Alerting

- [ ] Install `@sentry/nextjs` for client and server error tracking
- [ ] Configure Sentry source maps upload in CI pipeline
- [ ] Set up Sentry alerting for new errors with >5 occurrences per hour
- [ ] Set up Uptime monitoring (BetterStack or Checkly) with PagerDuty alerts
- [ ] Set up real-time performance dashboards (Cloudflare Analytics + Vercel Analytics)

---

## 🌍 16. Internationalization (i18n)

### 16.1 Dashboard Localization

- [ ] Extract all hardcoded strings to i18n translation keys
- [ ] Translate dashboard into: Spanish (es), French (fr), German (de), Japanese (ja), Portuguese (pt-BR)
- [ ] Language selector in user account settings
- [ ] Number, date, and currency formatting per locale

### 16.2 Public UI Localization

- [ ] Support 100+ languages on collection pages (via `next-intl` or `i18next`)
- [ ] Auto-detect browser locale → Load appropriate translation
- [ ] Manual language override in collection page URL (`?lang=fr`)
- [ ] Locale-specific typographic rules (quotes, punctuation)

### 16.3 RTL & Accessibility

- [ ] Full RTL layout support: Arabic (`ar`), Hebrew (`he`), Persian (`fa`)
- [ ] CSS logical properties throughout (margin-inline-start vs margin-left)
- [ ] Font fallback stacks for CJK scripts (Chinese, Japanese, Korean)

### 16.4 AI-Powered Translation

- [ ] Integrate DeepL API to auto-translate testimonial text in the inbox
- [ ] Display original and translated text side-by-side in the dashboard
- [ ] "Show in original language" toggle on widget cards

---

## 🌱 17. Growth, SEO & Viral Loops

### 17.1 On-Site SEO

- [x] Dynamic XML sitemaps for all public collection pages
- [x] JSON-LD Structured Data for testimonial widgets (Google Rich Results)
- [x] Canonical URL management
- [x] Open Graph / Twitter Card meta tags for collection pages
- [x] `robots.txt` with specific allow/disallow rules
- [x] Breadcrumb Schema markup
- [x] FAQ Schema on marketing pages
- [x] Hreflang tags for localized pages
- [x] Core Web Vitals optimization: LCP <2.5s, CLS <0.1, INP <200ms on all pages

### 17.2 Content Marketing Engine

- [ ] AI Case Study generator: Testimonial → Professional case study page
- [ ] Public "Wall of Love" directory: SEO-indexed showcase for opted-in brands
- [x] Blog / Changelog built with MDX (Next.js static rendering)
- [ ] Customer spotlight pages: Full brand story with embedded wall
- [ ] "Best review of the week" automated social post (AI-generated)

### 17.3 Viral & Referral Loops

- [ ] "Powered by KudosWall" badge on free tier → links to branded referral signup page
- [ ] Automatic referral bonus for customers who submit reviews (e.g., Discord invite code)
- [ ] Rewardful affiliate program: 30% recurring commission for affiliates
- [ ] Social share toolkit: Pre-written captions + download brand assets for affiliates

### 17.4 Product-Led Growth

- [x] Freemium funnel: New user → first testimonial in < 5 minutes
- [ ] In-app upgrade prompts at the exact moment value is felt (after 3rd testimonial)
- [ ] Shareable "My Reviews" public profile page per user (SEO + virality)
- [x] Build `/vs/senja` and `/vs/testimonial-to` comparison pages (Target "Senja alternative")
- [ ] Product Hunt launch prep: Hunter outreach, teaser assets, Golden Kitty strategy

---

## 🤝 18. Support & Customer Success

### 18.1 In-App Support

- [ ] Integrated live chat widget (Intercom or Crisp) in the dashboard
- [ ] Interactive product tour on first login (Shepherd.js or Intro.js)
- [ ] Contextual help tooltips on all complex settings
- [ ] Keyboard shortcut cheatsheet (accessible via `?` key)
- [ ] System status banner: Show incidents inline if status page reports issues

### 18.2 Help Center & Documentation

- [ ] Knowledge Base (Mintlify or Notion-powered) synced to in-app help search
- [ ] Video tutorial library (Loom recordings for every major feature)
- [x] Step-by-step guides: "Collect your first video testimonial"
- [ ] API documentation site (Stripe-quality, openapi spec + interactive try-it)

### 18.3 Onboarding & Activation

- [x] Onboarding checklist: "5 steps to your first testimonial"
- [ ] Reward for completing onboarding (e.g., unlock 5 free bonus video minutes)
- [ ] Setup wizard on account creation (Guided: Name workspace → Create collection → Customize widget → Share)
- [ ] "Import your existing reviews" screen shown during onboarding
- [ ] Onboarding email drip sequence: Day 1, Day 3, Day 7 tips

### 18.4 Customer Feedback Loop

- [ ] In-app NPS survey (shown after 30 days of use or after first testimonial collected)
- [ ] Feature request voting board (Canny or Linear-powered)
- [ ] Monthly user interviews pipeline (Calendly integration for CS team)

---

## 🛠️ 19. DevOps, Observability & Internal Ops

### 19.1 CI/CD Pipeline

- [ ] Automated E2E tests with Playwright on every PR
- [ ] Required CI checks: Type-check + lint + build + E2E before merge
- [ ] Canary deployments for high-risk widget changes
- [ ] Preview deployments on every PR (Cloudflare Pages PR previews)
- [ ] Automated bundle size checks: Alert if `widget.js` grows >2KB gzipped
- [ ] Dependency update automation (Renovate Bot with auto-merge for patches)

### 19.2 Observability Stack

- [ ] Sentry: Client + server error tracking with source maps
- [ ] Sentry Performance: Transaction tracing for slow API calls
- [ ] OpenTelemetry instrumentation on tRPC routers
- [ ] Structured logging (JSON) for all server-side operations
- [ ] Log aggregation pipeline (Axiom or Cloudflare Logpush)
- [ ] Distributed tracing for multi-platform request flows
- [ ] Real User Monitoring (RUM) for widget performance in the wild

### 19.3 Internal Admin Panel

- [ ] Internal Admin UI to search and manage all users and workspaces
- [ ] "Log in as user" (Impersonate) for support debugging with audit trail
- [ ] Real-time health monitoring of R2 storage, DB connections, and API latency
- [ ] Feature flag management UI (LaunchDarkly or Vercel Flags)
- [ ] Manual coupon code generation for support team
- [ ] Data deletion tool for "Right to be forgotten" requests

### 19.4 Reliability

- [ ] Multi-region failover for the database (hot standby)
- [ ] Automated disaster recovery runbook documented and tested quarterly
- [ ] Chaos engineering exercises (Kill a DB replica, test fallback behavior)
- [ ] SLO tracking dashboard: 99.9% uptime goal, measured weekly

---

## ☁️ 20. Public API & Developer Portal

### 20.1 RESTful Public API

- [ ] API Key management: Create, rotate, revoke keys in dashboard
- [ ] Full REST API: CRUD for collections, testimonials, widgets
- [ ] API versioning strategy (`/v1/`, `/v2/`)
- [ ] Pagination: Cursor-based + limit/offset support
- [ ] Rate limiting per API key (e.g., 100 req/min on free tier)
- [ ] Webhook event subscriptions (testimonial.created, testimonial.approved, etc.)
- [ ] Webhook delivery retry logic with exponential backoff
- [ ] Webhook logs and delivery status UI in dashboard

### 20.2 SDKs & DX Tools

- [ ] Official Node.js SDK (TypeScript-first)
- [ ] Official Python SDK
- [ ] Official Go client
- [ ] Postman Collection for the full API
- [ ] OpenAPI (`openapi.json`) spec auto-generated from tRPC routers
- [ ] GitHub Actions sample for importing testimonials automatically

### 20.3 Developer Hub

- [ ] Developer documentation site (Mintlify or similar)
- [ ] Interactive API reference with "Try it" buttons
- [ ] Quickstart guides: "Display testimonials in 60 seconds"
- [ ] Community forum / Discord for developers
- [ ] Changelog feed (API changes notified via email)

---

## 📣 21. Marketing & Content Engine

### 21.1 Marketing Website (Marketing App)

- [x] Landing page / Hero section
- [x] Feature sections with animations
- [x] Pricing page with plan comparison table
- [ ] Customer success stories / Case studies
- [ ] Integration directory page (Zapier, Shopify, etc.)
- [ ] "Testimonial wall" on the KudosWall marketing site itself
- [ ] Trust signals: Customer logos, review count, G2 badge
- [ ] Exit-intent popup with free trial CTA

### 21.2 Conversion Optimization

- [ ] A/B testing framework for landing page CTAs (Vercel Edge Config)
- [ ] Live chat on marketing pages during business hours
- [ ] Demo booking page (Calendly embed for Enterprise tier)
- [ ] ROI calculator: "How many conversions will this add?"
- [ ] "See it in action" interactive demo (Arcade or Storylane embed)

### 21.3 Email Marketing

- [x] Welcome email sequence (New account)
- [ ] Feature announcement emails to existing users
- [ ] Monthly newsletter for SaaS social proof insights
- [ ] Re-engagement campaign for inactive users (>30 days no login)

---

## 🧪 22. Testing & Quality Assurance

### 22.1 Unit & Integration Tests

- [ ] Set up Vitest for unit testing across all packages
- [ ] Unit tests for all tRPC router procedures (mock DB)
- [ ] Integration tests for Drizzle ORM schema (test DB)
- [ ] Unit tests for utility functions (date formatting, slug generation)
- [ ] Coverage target: >80% for `packages/api` and `packages/db`

### 22.2 End-to-End Tests (Plaaywright)

- [ ] E2E: Full testimonial submission flow (Text + Video)
- [ ] E2E: Owner approves testimonial and sees it appear in widget
- [ ] E2E: Widget renders correctly with all 7 layout types
- [ ] E2E: Billing flow (Upgrade plan → Verify feature unlock)
- [ ] E2E: Auth flow (Sign up → Log in → Log out → Reset password)
- [ ] Visual regression tests for widget layouts (Percy or Playwright screenshots)

### 22.3 Performance Testing

- [ ] Load test collection submission endpoint (1000 concurrent submitters)
- [ ] Load test widget API endpoint (10,000 req/sec)
- [ ] Measure and budget widget first-paint time per layout
- [x] Lighthouse CI on every PR for marketing pages

### 22.4 Accessibility Testing

- [ ] `axe` accessibility audit on all dashboard pages
- [ ] Screen reader test (NVDA / VoiceOver) for collection form
- [ ] Keyboard-only navigation test for all interactive elements
- [ ] Color contrast ratio check: All text meets WCAG 2.1 AA (4.5:1)

---

## 🌠 23. Future V2 (Moonshots)

- [ ] **Voice Interface**: One-click voice recording with real-time transcript overlay
- [ ] **AI Interviewer**: AI video avatar asks smart follow-up questions to customers live
- [ ] **Interactive Storybook**: TikTok-style swipeable Stories for web testimonials
- [ ] **Social Proof Live Feed**: Real-time toast popups ("Alex from Seattle just left a 5★ review")
- [ ] **Testimonial Marketplace**: Allow brands to discover and feature industry testimonials from a curated pool
- [ ] **Sentiment Trend Alerts**: "Your satisfaction score dropped 12% this month — here's why"
- [ ] **AI Brand Voice Trainer**: Learn your brand's tone and rewrite testimonials to match
- [ ] **Video Interview Platform**: Full async video interview tool (not just testimonials) for HR / Sales teams
- [ ] **Loom-like Screen + Face Recording**: Combined screen share + face cam recording mode
- [ ] **Testimonial Studio App**: Dedicated macOS/Windows desktop app for power users
- [ ] **Browser Extension v2**: Capture testimonials from any site (G2, Twitter, Slack) with one click + import
- [ ] **Real-time Collaboration**: Multiple team members working on the same testimonial inbox simultaneously (presence indicators)
- [ ] **Generative Video Ads**: AI creates a 30-second video ad from multiple testimonial clips + music

---

## 📋 Immediate Action Items (Next Sprint)

> Prioritized by impact and urgency.

### 🔴 Critical (This Week)

- [x] **Fix analytics event tracking** — `trackEvent` mutation not persisting to DB correctly
- [x] **Fix widget font inheritance** — Fonts not applying in carousel/masonry on first load in some browsers
- [ ] **Set up Sentry** — Install `@sentry/nextjs`, configure source maps in CI, alert on >5 errors/hour

### 🟠 High (This Month)

- [x] Implement Stripe Checkout for billing / plan gating
- [ ] Add "Read more / Read less" to long text testimonials in widgets
- [ ] Build Bento Grid layout for widgets
- [ ] Add filter bar to the testimonial inbox (by rating, type, tag)
- [ ] Write Playwright E2E tests for the core submission flow

### 🟡 Medium (Next Quarter)

- [ ] Launch AI transcription (Whisper) for video testimonials
- [ ] Build the Agency multi-client management view
- [ ] Public API v1 with API key management
- [ ] Shopify App Store listing
- [ ] Multi-language support on collection pages

---

_The Infinite Roadmap is a living document. We iterate, we build, we win._
_Updated: 2026-04-12_
