# KudosWall 💖

<div align="center">
  <p align="center">
    <strong>Collect, manage, and embed stunning customer testimonials in under 3 minutes.</strong>
  </p>
  <p align="center">
    <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-black.svg" alt="License: MIT"></a>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js"></a>
    <a href="https://turbo.build/"><img src="https://img.shields.io/badge/Turborepo-2.9-red?logo=turborepo" alt="Turborepo"></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript" alt="TypeScript"></a>
    <a href="https://bun.sh/"><img src="https://img.shields.io/badge/Bun-1.1-fb7da4?logo=bun" alt="Bun"></a>
    <a href="https://orm.drizzle.team/"><img src="https://img.shields.io/badge/Drizzle_ORM-0.30-teal?logo=drizzle" alt="Drizzle ORM"></a>
  </p>
</div>

---

## Table of Contents

- [1. About KudosWall](#1-about-kudoswall)
- [2. Features](#2-features)
- [3. Project Architecture](#3-project-architecture)
- [4. Getting Started](#4-getting-started)
  - [4.1 Prerequisites](#41-prerequisites)
  - [4.2 Installation](#42-installation)
  - [4.3 Environment Configuration](#43-environment-configuration)
  - [4.4 Database Syncing](#44-database-syncing)
  - [4.5 Running Locally](#45-running-locally)
- [5. Master Tutorial: From Zero to Hero](#5-master-tutorial-from-zero-to-hero)
- [6. Development Workflow & Scripts](#6-development-workflow--scripts)
- [7. Operational Guides](#7-operational-guides)
- [8. License](#8-license)

---

## 1. About KudosWall

KudosWall is an elite, high-performance monorepo SaaS application designed for collecting, managing, and embedding customer testimonials (both text and video). Built on the **Better-T-Stack**, it features a fully type-safe pipeline extending from database columns through server routers down to native UI client elements.

By leveraging edge-compatible Next.js 16 proxies, serverless PostgreSQL connection pooling, and HMAC-signed media delivery, KudosWall bridges the gap between raw web speed and rock-solid enterprise reliability.

---

## 2. Features

- 🎥 **Text & Video Testimonials**: Enable clients to write testimonials or record high-fidelity videos straight from their browser.
- 🎨 **Bespoke Collection Pages**: Gather user feedback with fully customized branding options including logos, dynamic palettes, and typography.
- ⚡ **High-Speed Keyboard Navigation**: Process and triage reviews using professional keyboard navigation hotkeys (`J`/`K` to step, `A` to approve, `R` to reject).
- 🔒 **Secure R2 CDN Streaming**: Play video testimonials securely using temporary signed paths powered by Cloudflare R2 and HMAC-SHA256 tokens.
- 💳 **Plan-Gated Feature System**: Protect premium features (like single review sharing and unlimited projects) using structured plan configurations across Free, Pro, Agency, and Lifetime plans.
- 🚀 **SEO & Schema Optimized**: Automatically inject JSON-LD schema on public pages to boost search engine discoverability.

---

## 3. Project Architecture

KudosWall uses Turborepo to govern a clean, decoupled workspace layer:

```mermaid
graph TD
    subgraph Apps
        Web[apps/web - Next.js 16 Client & Edge Proxy]
    end

    subgraph Packages
        UI[packages/ui - Shared Component Primitives]
        API[packages/api - tRPC Routers & Business Logic]
        DB[packages/db - Drizzle Schema & Client]
        Auth[packages/auth - Better-Auth Config]
        Env[packages/env - Zod Valided Environment vars]
    end

    Web --> UI
    Web --> API
    API --> DB
    API --> Env
    Web --> Auth
    Auth --> DB
```

- `apps/web`: Primary Next.js 16 front-facing dashboard, collection endpoints, and single share pages.
- `packages/api`: Type-safe tRPC routers and billing feature definitions.
- `packages/db`: Drizzle schema declarations and migrations.
- `packages/ui`: High-fidelity, HSL-themed Tailwind CSS shared components based on shadcn/ui.

---

## 4. Getting Started

### 4.1 Prerequisites

Ensure you have **[Bun](https://bun.sh/)** v1.1 or higher installed on your system.

### 4.2 Installation

Clone the repository and install dependencies:

```bash
bun install
```

### 4.3 Environment Configuration

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://user:pass@host/db"
BETTER_AUTH_SECRET="your-32-character-auth-secret"
R2_SIGNING_SECRET="your-hmac-sha256-media-secret"
```

### 4.4 Database Syncing

Push the schema to your serverless PostgreSQL database:

```bash
bun run db:push
```

### 4.5 Running Locally

Fire up all Turborepo development processes:

```bash
bun run dev
```

The primary application will be running live at [http://localhost:3000](http://localhost:3000).

---

## 5. Master Tutorial: From Zero to Hero

Here's how to collect and display your first customer testimonial in under 3 minutes.

### Step 1: Create a Collection Campaign

1. Log in to your KudosWall dashboard at [http://localhost:3000/dashboard](http://localhost:3000/dashboard).
2. Click **Create Collection**. Set the name to `"Acme Launch Campaign"` and assign a custom logo and matching HSL brand color.
3. Save the collection to generate a public collection slug: `acme-launch`.

### Step 2: Submit a Testimonial (Visitor's Flow)

1. Open the generated collection page: `http://localhost:3000/collect/acme-launch`.
2. Click **Write a Testimonial**. Enter a rating (5 stars), add high-converting review text, fill out the user details, and click **Submit**.
3. The review will land inside the workspace's testimonial inbox in a `"pending"` state.

### Step 3: Approve and Share (Dashboard Flow)

1. Go back to your Inbox at `/dashboard/testimonials`.
2. Find the pending Acme review. Use your keyboard: press `J` or `K` to highlight it, and press `A` to instantly **Approve** it.
3. Click **Copy Share Link** to grab the public `/t/[id]` link to share this beautiful 5-star verified review with your sales team!

---

## 6. Development Workflow & Scripts

Keep the repository clean, type-safe, and professional with these standard commands:

- **Format Code**: `bun run format` (Uses Prettier with Tailwind CSS integration)
- **Type Check**: `bun run check-types` (Strict TypeScript compiler checking)
- **Build Verification**: `bun run build` (Ensures edge compilation passes)
- **Database Studio**: `bun run db:studio` (Opens visual Drizzle database explorer)

---

## 7. Operational Guides

To understand deep operations, scaling, and architectural decisions, explore our formal documentation guides:

- **[Diátaxis Documentation Index](file:///c:/Users/gutsc/OneDrive/Desktop/TestimonialWall/docs/DIATAXIS.md)** - A structured map of all guide quadrants.
- **[System State & Roadmap](file:///c:/Users/gutsc/OneDrive/Desktop/TestimonialWall/docs/current_project_state.md)** - Visual Mermaid workflows and project roadmap details.
- **[Database Pit-in-Time Recovery](file:///c:/Users/gutsc/OneDrive/Desktop/TestimonialWall/docs/database-pitr-strategy.md)** - Detailed PG transaction restoration procedures.
- **[ Neon Connection Pooling](file:///c:/Users/gutsc/OneDrive/Desktop/TestimonialWall/docs/database-pooling.md)** - Technical details on scaling Postgres active pools.

---

## 8. License

This repository is licensed under the MIT License. See [LICENSE](LICENSE) for more information.
