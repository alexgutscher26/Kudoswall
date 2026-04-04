# TestimonialWall Code Standards

This project follows strict code quality standards to ensure a maintainable, type-safe, and high-performance monorepo.

## Quick Reference

- **Format code**: `bun run format` (Uses Prettier with Tailwind CSS plugin)
- **Type check**: `bun run check-types`
- **Build check**: `bun run build`

Formatting is handled by Prettier. Automated git hooks via Lefthook ensure that all code is formatted and type-checked before being committed or pushed.

---

## Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**. Focus on clarity and explicit intent over brevity.

### Type Safety & Explicitness

- Use explicit types for function parameters and return values when they enhance clarity.
- Prefer `unknown` over `any` for uncertain types.
- Leverage `zod` for runtime validation and type inference.
- Avoid type assertions (`as T`) unless the type cannot be inferred or narrowed.
- Extract constants with descriptive names instead of using magic numbers/strings.

### Modern JavaScript/TypeScript

- Use arrow functions for callbacks and simple functional components.
- Prefer `for...of` loops or functional methods (`map`, `filter`, `reduce`) over traditional `for` loops.
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safe property access.
- Use template literals for all string concatenations.
- Use `const` by default; only use `let` when reassignment is required.

### Async & Promises

- Always `await` promises in async functions.
- Handle potential errors with `try-catch` blocks, especially in server actions and API routes.
- Use `Promise.all` or `Promise.allSettled` for parallel execution of independent promises.

### React & JSX (Next.js 16+)

- Use **React Server Components (RSC)** by default. Only use `'use client'` when state or interactivity is required.
- Maintain clear boundaries between client and server components.
- Specify all dependencies in hook dependency arrays (React Compiler will handle many of these, but explicit intent is still preferred).
- Use the `key` prop for elements in iterables (prefer unique IDs over array indices).
- Utilize semantic HTML and ARIA attributes for accessibility:
  - Meaningful `alt` text for images.
  - Correct heading hierarchy (`h1` -> `h2` -> `h3`).
  - Native elements (`<button>`, `<nav>`) over interactive `<div>`s.

### Error Handling

- Implementation-specific errors should be thrown as `Error` objects with descriptive messages.
- Use `toast.error` for user-facing error notifications.
- Implement error boundaries for critical UI sections.

### Performance

- Favor server-side data fetching (tRPC/RSC) to reduce client-side bundle size.
- Use Next.js `<Image />` for optimized asset delivery.
- Avoid large barrel files (`index.ts`) that re-export everything, as they can impact tree-shaking.

---

## Workspace Architecture

- `apps/web`: Next.js 16 application (Dashboard & Marketing).
- `packages/api`: tRPC router and business logic.
- `packages/db`: Drizzle ORM schema and database client.
- `packages/ui`: Shared design system and shadcn/ui primitives.

## Testing & Verification

- Verify that your changes compile and pass type checks before pushing.
- Run `bun run build` in the relevant app directory OR the root to ensure deployment readiness.
- Ensure Prettier formatting is applied to maintain a consistent style across the monorepo.
