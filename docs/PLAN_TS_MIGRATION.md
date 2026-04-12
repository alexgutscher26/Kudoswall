# PLAN: TypeScript `any` to `unknown` Migration

## Goal

Improve type safety and code quality by migrating all `any` types to `unknown` (or more specific types where possible) across the KudosWall monorepo.

## Scope

- `apps/web` (Next.js Application)
- `packages/api` (tRPC Router & Business Logic)
- `packages/db` (Drizzle ORM & Database Schema)
- `packages/ui` (Shared Design System)
- `packages/email` (Email Templates)

## Proposed Phases

### Phase 1: Discovery & Planning (Current)

- [x] Map all `any` occurrences.
- [ ] Categorize `any` usage into:
  - `catch` blocks (standard error handling)
  - Component Props (UI data flow)
  - API/Database interactions (Data layer)
  - Third-party library integrations (External boundaries)

### Phase 2: Implementation - Foundation & Low Risk

- **Backend/API (packages/api & packages/db)**:
  - Replace `catch (err: any)` with `catch (err: unknown)` and implement safe error logging/handling.
  - Refine tRPC router types to avoid `any` in middleware or helper functions.
- **Verification**: Run `bun run check-types` in `packages/api` and `packages/db`.

### Phase 3: Implementation - Frontend Core (apps/web)

- **Data Hooks & Services**: Migrate `any` in data fetching logic to `unknown` or inferred types from tRPC.
- **Component Props**: Replace `any` in props with interfaces derived from the database schema or API output.
- **Type Assertions**: Audit `as any` usage and replace with proper type narrowing or Zod validation.

### Phase 4: Polish & Verification

- **Global Build Check**: Run `turbo build` to ensure no regressions.
- **Automated Check**: Run `bun run format` and `bun run lint`.
- **Security Audit**: Ensure `unknown` types aren't being cast back to `any` in sensitive areas.

## Risk Assessment

- **High Risk**: Database schema interactions and tRPC responses. Making these too strict without proper narrowing might cause runtime silence if errors aren't handled.
- **Mitigation**: Use `zod` for runtime validation and proper narrowing checks (e.g., `if (err instanceof Error)`).

## Verification Scripts

- `bun run check-types`
- `bun run build`
- `python .agent/scripts/checklist.py .`
