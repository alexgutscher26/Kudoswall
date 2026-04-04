# TestimonialWall

[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.0-red?logo=turborepo)](https://turbo.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.1-fb7da4?logo=bun)](https://bun.sh/)

TestimonialWall is a modern, high-performance monorepo application designed for managing and embedding customer testimonials. Built on the Better-T-Stack, it leverages a fully type-safe architecture from the database to the edge.

## Core Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Monorepo Management**: Turborepo
- **API Layer**: tRPC (End-to-end type safety)
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better-Auth
- **Styling**: Tailwind CSS
- **Component Library**: Shared shadcn/ui primitives in `packages/ui`
- **Runtime**: Bun

## Project Architecture

The codebase is organized into a modular monorepo structure to ensure scalability and separation of concerns:

- `apps/web`: The primary Next.js application including the user dashboard and marketing pages.
- `packages/ui`: A centralized design system and shared component library.
- `packages/api`: The core business logic and tRPC router definitions.
- `packages/auth`: Centralized authentication configuration.
- `packages/db`: Database schema definitions, migrations, and client configuration.
- `packages/env`: Type-safe environment variable management.

## Getting Started

### Prerequisites

Ensure you have [Bun](https://bun.sh/) installed on your system.

### Installation

Clone the repository and install dependencies:

```bash
bun install
```

### Database Configuration

1. Provision a PostgreSQL instance.
2. Configure the connection string in `apps/web/.env`.
3. Synchronize the database schema:

```bash
bun run db:push
```

### Development

Start the development server for all applications:

```bash
bun run dev
```

The application will be accessible at `http://localhost:3001`.

## Development Workflows

### UI Development

Shared components are managed within `packages/ui`. To add new shadcn/ui primitives to the shared package:

```bash
npx shadcn@latest add [component-name] -c packages/ui
```

### Available Scripts

- `bun run dev`: Launches all applications in development mode.
- `bun run build`: Generates production builds for all packages.
- `bun run check-types`: Executes TypeScript validation across the workspace.
- `bun run format`: Formats the codebase using Prettier.
- `bun run db:push`: Synchronizes schema changes with the database.
- `bun run db:studio`: Launches the Drizzle Studio database explorer.

## Deployment

The application is configured for deployment on Cloudflare via Alchemy:

- **Deployment**: `cd apps/web && bun run deploy`
- **Cleanup**: `cd apps/web && bun run destroy`

For detailed deployment instructions, refer to the [Better-T-Stack documentation](https://www.better-t-stack.dev/docs/guides/cloudflare-alchemy).

## License

This project is licensed under the MIT License.
