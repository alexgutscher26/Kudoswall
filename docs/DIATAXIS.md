# KudosWall Documentation Index (Diátaxis Framework)

Welcome to the KudosWall technical documentation repository. This space is structured following the **Diátaxis framework**, which separates documentation into four distinct categories based on user needs: **Tutorials** (learning-oriented), **How-To Guides** (goal-oriented), **Reference** (information-oriented), and **Explanation** (understanding-oriented).

---

## 1. Tutorials (Learning-Oriented)

_Getting started guides to walk developers and users through core user journeys._

- **[Quickstart: Local Monorepo Setup](file:///c:/Users/gutsc/OneDrive/Desktop/TestimonialWall/README.md#getting-started)**  
  Learn how to install dependencies via Bun, set up the local Postgres database, seed mock workspaces, and run the Next.js dev server.
- **[Tutorial: Collecting Your First Testimonial](file:///c:/Users/gutsc/OneDrive/Desktop/TestimonialWall/README.md#master-tutorial-from-zero-to-social-proof)**  
  A step-by-step guide to configuring a collection form campaign, submitting a text review, and approving it from the dashboard inbox.
- **[Tutorial: Drag-and-Drop Wall Configuration](file:///c:/Users/gutsc/OneDrive/Desktop/TestimonialWall/docs/PLAN_WIDGET_REDESIGN.md)**  
  How to use the drag-and-drop inbox reorder system to arrange featured testimonials and live-preview widgets.

---

## 2. How-To Guides (Goal-Oriented)

_Actionable, step-by-step instructions to solve specific, real-world problems._

### 🛠️ Operations & Local Development

- **[How to Update DB Schema Safely](file:///c:/Users/gutsc/OneDrive/Desktop/TestimonialWall/AGENTS.md#feature-implementation-workflow)**  
  How to push Drizzle migrations with `bun run db:push` and refresh types across packages.
- **[How to Embed a Collection Form Inline](file:///c:/Users/gutsc/OneDrive/Desktop/TestimonialWall/todo.md#L209)**  
  Steps to integrate KudosWall collection modal snippets on static HTML pages or external React applications.

### 💳 Billing & Plan Gating

- **[How to Activate Lifetime Plan (LTD) Workspaces](file:///c:/Users/gutsc/OneDrive/Desktop/TestimonialWall/packages/api/src/config/plans.ts)**  
  How to assign specific tier feature flags such as `singleTestimonialShare` or unlimited video limits to lifetime accounts.
- **[How to Add Stripe Webhooks and Listeners](file:///c:/Users/gutsc/OneDrive/Desktop/TestimonialWall/docs/stripe-implementation-plan.md)**  
  Guide to configuring local Stripe CLI listener tunnels for subscription events.

### 💾 Backup & Disaster Recovery

- **[How to Schedule Daily Automated Database Backups](file:///c:/Users/gutsc/OneDrive/Desktop/TestimonialWall/docs/database-backups.md)**  
  Configuration instructions for setting up daily off-site PG snapshots with restore check triggers.
- **[How to Perform Database Point-in-Time Recovery (PITR)](file:///c:/Users/gutsc/OneDrive/Desktop/TestimonialWall/docs/database-pitr-strategy.md)**  
  Detailed recovery steps to roll back database transactions to a specific microsecond without service outages.

---

## 3. Reference (Information-Oriented)

_Technical descriptions, schemas, checklists, and configuration specs._

- **[Monorepo Architecture Map](file:///c:/Users/gutsc/OneDrive/Desktop/TestimonialWall/README.md#project-architecture)**  
  Overview of the directory layout dividing apps (`apps/web`) from shared engines (`packages/db`, `packages/api`, `packages/ui`).
- **[Database Schema and Relations](file:///c:/Users/gutsc/OneDrive/Desktop/TestimonialWall/packages/db/src/schema/app.ts)**  
  Reference catalog of Drizzle PostgreSQL schemas including workspace, organization, project, testimonial, and tag entities.
- **[Workspace Limits and Feature matrix](file:///c:/Users/gutsc/OneDrive/Desktop/TestimonialWall/packages/api/src/config/plans.ts)**  
  An exhaustive reference matrix mapping feature gates and count limits across Free, Pro (Plan 1), Agency (Plan 2), and LTD.
- **[Security Audit Checklist](file:///c:/Users/gutsc/OneDrive/Desktop/TestimonialWall/SECURITY.md)**  
  OWASP compliance checklist, CORS policies, XSS sanitation procedures, and secure Cloudflare R2 media access protocols.

---

## 4. Explanation (Understanding-Oriented)

_High-level explanations of architectural patterns, design constraints, and technological choices._

- **[Why We Use Next.js 16 Edge Proxies Instead of Middleware](file:///c:/Users/gutsc/OneDrive/Desktop/TestimonialWall/AGENTS.md#react--jsx-nextjs-16)**  
  An architectural explanation of the server edge proxy model in `src/proxy.ts` avoiding Next.js edge runtime execution crashes on Cloudflare.
- **[Cloudflare R2 Secure Media Signing Mechanics](file:///c:/Users/gutsc/OneDrive/Desktop/TestimonialWall/apps/web/src/lib/signed-url.ts)**  
  Understanding how we protect user-uploaded video reviews using HMAC-SHA256 authenticated links to prevent hotlinking and unauthenticated traffic.
- **[Neon PostgreSQL Connection Pooling & PgBouncer](file:///c:/Users/gutsc/OneDrive/Desktop/TestimonialWall/docs/database-pooling.md)**  
  Understanding Neon transaction-level caching and proxy connection pooling limits during heavy write periods.
- **[Table Partitioning for Large Scales](file:///c:/Users/gutsc/OneDrive/Desktop/TestimonialWall/docs/database-partitioning.md)**  
  Why we split the testimonial table across ranges of `workspaceId` to ensure rapid lookups even at 10M+ rows.
