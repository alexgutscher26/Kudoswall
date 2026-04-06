# PLAN: Implementing Drizzle Kit Migrations

This plan outlines the steps to implement a robust database migration strategy for TestimonialWall using Drizzle Kit.

## 🎯 Objectives

- Transition from `db:push` (development only) to versioned migrations.
- Ensure automated migration execution in CI/CD and local environments.
- Verify migration integrity and schema-code alignment.

## 🛠️ Architecture

- **Schema Source**: `packages/db/src/schema`
- **Migration Output**: `packages/db/src/migrations`
- **Database**: PostgreSQL
- **Orchestration**: Bun scripts within `@my-better-t-app/db`

---

## 📅 Roadmap

### PHASE 1: Foundation (Current Session)

- [ ] **Step 1: Codebase Discovery** (`explorer-agent`)
  - Verify schema files for potential issues that might break migrations (circular refs, missing exports).
  - Check current `.env` state for migration connectivity.
- [ ] **Step 2: Generate Initial Migrations**
  - Execute `bun run db:generate` in `packages/db`.
  - Inspect generated SQL files for correctness.
- [ ] **Step 3: Verification Script**
  - Create a migration verification script in `packages/db/scripts/verify-migrations.ts`.

### PHASE 2: Implementation (After Approval)

- [ ] **Step 4: Execute Migrations** (`database-architect`)
  - Run `bun run db:migrate` to push schema to the live database.
  - Verify the `drizzle.__migrations` metadata table.
- [ ] **Step 5: Security & Audit** (`security-auditor`)
  - Review migration permissions (Principle of Least Privilege).
  - Ensure `DATABASE_URL` is managed securely via environment variables.
- [ ] **Step 6: CI/CD Integration** (`devops-engineer`)
  - Add a pre-deploy migration step to Turborepo/Cloudflare.

### PHASE 3: Testing & Polish

- [ ] **Step 7: Automated Testing** (`test-engineer`)
  - Implement a "Dry Run" test to ensure future schema changes generate valid SQL.
- [ ] **Step 8: Documentation** (`documentation-writer`)
  - Update `packages/db/README.md` with instructions on how to handle schema changes.

---

## ✅ Verification Criteria

- [ ] All schema changes are captured in `.sql` files in `src/migrations`.
- [ ] Running `db:migrate` results in no differences between schema and DB.
- [ ] No `db:push` was used for the final deployment.

---

## 📂 Logical Dependencies

1. Schema files must be error-free for `db:generate` to succeed.
2. `DATABASE_URL` must have sufficient privileges (CREATE, ALTER, DROP) for the migration runner.
