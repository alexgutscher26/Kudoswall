# Antigravity Project Rules

This document outlines the core behavioral and technical rules that Antigravity (IA assistant) must follow when working on the KudosWall project.

## General Behavior

- **Proactive Problem Solving**: Anticipate next steps and potential issues (e.g., build errors, performance bottlenecks).
- **Explain Rationale**: Briefly explain "why" when refactoring or simplifying code.
- **Aesthetic Excellence**: Prioritize premium, modern design with smooth transitions and consistent spacing.

## Technical Stack & Standards

### Core Technologies

- **Framework**: Next.js 16 (App Router)
- **UI Logic**: React 19 (Functional Components)
- **Styling**: Tailwind CSS 4.0 using utility classes and CSS variables.
- **Icons**: `lucide-react`

### Code Quality

- **TypeScript**: Strict typing required. Avoid `any` - use `unknown` for uncertain data.
- **Real-time Data**: Use tRPC with polling (`refetchInterval`) for "live-time" dashboard features.
- **State Management**: Favor React Server Components (RSC) for data fetching. Use `'use client'` only for interactive components.
- **Error Handling**: Use `try-catch` blocks in server actions/API routes and provide user feedback via `toast.error`.

### Formatting & Tooling

- **Formatter**: Prettier (Workspace standard). Run `bun run format`.
- **Git Hooks**: Lefthook manages pre-commit validation (Formatting & Type Checking).
- **Build**: Ensure successful `bun run build` before final hand-off.

## Workspace Architecture

- **Monorepo**: Turborepo manages the workspace.
- **apps/web**: Primary Next.js application.
- **packages/api**: tRPC backend logic.
- **packages/db**: Drizzle ORM and PostgreSQL schema.
- **packages/ui**: Shared Design System.

## Persistence

These rules are recognized by Antigravity as the project's source of truth. Any deviation must be justified.
