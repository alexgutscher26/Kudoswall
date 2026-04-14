# KudosWall Code Standards

This project follows strict code quality standards to ensure a maintainable, type-safe, and high-performance monorepo.

## Quick Reference

- **Format code**: `bun run format` (Uses Prettier with Tailwind CSS plugin)
- **Type check**: `bun run check-types`
- **Build check**: `bun run build`
- **DB Push**: `bun run db:push`

Formatting is handled by Prettier. Automated git hooks via Lefthook ensure that all code is formatted and type-checked before being committed or pushed.

---

## Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**. Focus on clarity and explicit intent over brevity.

### Type Safety & Explicitness

- **No `any`**: Use strict typing. Prefer `unknown` over `any` for uncertain types.
- **Explicit Returns**: Use explicit return types for functions, especially in public APIs/tRPC procedures.
- **Zod Validation**: Leverage `zod` for all runtime validation (API inputs, DB schemas, Env vars).
- **Discriminated Unions**: Use discriminated unions for complex state or response types.
- **Constants**: Extract magic numbers/strings into descriptive constants.

### Monorepo Dependency Rules

- **Workspace Imports**: Use `@my-better-t-app/*` for internal package imports with `workspace:*` versioning.
- **Unidirectional Flow**: Packages must not import from `apps`. Higher-level packages (like `api`) can import from lower-level ones (`db`, `env`).
- **Clean Imports**: Avoid deep imports from packages (e.g., import from `@my-better-t-app/ui`, not `@my-better-t-app/ui/src/button`).

### API (tRPC) & Data Fetching

- **Separation of Concerns**: Define business logic in `packages/api`. The `apps/web` should primarily handle UI and routing.
- **Procedures**: Use `protectedProcedure` for any action requiring authentication.
- **Server Components**: Prefer fetching data in Server Components via tRPC callers or direct DB access where appropriate.
- **React Query**: Use `@tanstack/react-query` hooks for client-side interactivity and mutations.

### Database (Drizzle ORM)

- **Schema Setup**: Define tables in `packages/db/src/schema/app.ts`. Use `snake_case` for database columns and `camelCase` for TypeScript fields.
- **Relations**: Use Drizzle's `relations` API to define associations between tables.
- **Efficiency**: Use `db.query` for clean, nested reads. For performance-critical paths, use explicit `.select()` with `.innerJoin()`.
- **Naming**: Ensure all indexes and constraints are explicitly named.

### React & JSX (Next.js 16+)

- **Server-First**: Use **React Server Components (RSC)** by default. Sprinkle `'use client'` only for interactive components.
- **React Compiler**: The project uses the React Compiler. Trust it for optimizations, but maintain clean dependency arrays in `useMemo`/`useEffect` for clarity.
- **Action Pattern**: Use Server Actions for data mutations directly from forms.
- **No Middleware**: For Next.js 16 compatibility and custom domain routing, **use `src/proxy.ts` instead of `middleware.ts`**. This ensures stable edge execution on Cloudflare.
- **Accessibility**: Use semantic HTML (`<main>`, `<section>`, `<nav>`) and ensure all interactive elements have correct ARIA roles.

### Environment Management

- **Centralized Env**: Always import environment variables from `@my-better-t-app/env`.
- **No `process.env`**: Never use `process.env.KEY` directly in app logic; it bypasses type safety and validation.

### Error Handling & Logging

- **Type-Safe Errors**: Define custom error classes or use a standard result object pattern for expected failures.
- **User Feedback**: Use `goey-toast` for user-facing notifications.
- **Audit Trails**: Log critical operations (CRUD) to the `audit_log` table for traceability.

---

## Workspace Architecture

- `apps/web`: Primary Next.js 16 application (Dashboard, marketing, collection pages).
- `packages/api`: tRPC routers, inputs, and business logic.
- `packages/db`: Drizzle schemas, migrations, and shared client.
- `packages/ui`: Shadcn/ui based design system and components.
- `packages/auth`: Better-Auth configuration and server utilities.
- `packages/env`: Zod-validated environment variable schema.

---

## Feature Implementation Workflow

1. **Schema**: If the feature needs data, update `packages/db/src/schema/app.ts` and run `bun run db:push`.
2. **API**: Define relevant tRPC procedures in `packages/api/src/router`.
3. **UI Components**: Create reusable UI components in `packages/ui` if they don't exist.
4. **App Logic**: Implement the page/logic in `apps/web` using the API and UI components.
5. **Types**: Ensure `bun run check-types` passes before committing.
