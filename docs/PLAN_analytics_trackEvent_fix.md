# PLAN: Fix `trackEvent` Analytics Mutation Not Persisting

**Status:** Ready for approval
**Date:** 2026-04-12
**Agents:** debugger → database-architect → backend-specialist → test-engineer

---

## 🔍 Root Cause Analysis (Debugger Agent)

Three distinct bugs were found, each independently capable of silently failing `trackEvent`.

### Bug 1 (CRITICAL) — CSRF Middleware Blocks All Mutations from the Widget Iframe

**Location:** `packages/api/src/index.ts` lines 51-65

```ts
export const csrfMiddleware = t.middleware(async ({ ctx, next, type }) => {
  if (type === "mutation") {
    const csrfToken = ctx.req.headers.get("x-trpc-csrf");
    const cookieToken = ctx.req.cookies.get("csrf-token")?.value;
    if (!csrfToken || csrfToken !== cookieToken) {
      throw new TRPCError({ code: "FORBIDDEN", message: "CSRF token validation failed" });
    }
  }
  return next();
});
```

**Why it breaks:** The widget's `Widget.tsx` runs inside an `<iframe>` on an **external third-party domain** (e.g., `myshopify.com`). The `csrf-token` cookie is set by the middleware (`proxy.ts` line 50-56) with `sameSite: "lax"` — this means it is **never sent by the browser** when the iframe origin differs from the app origin. So `cookieToken` is always `undefined`, and CSRF check always throws `FORBIDDEN`.

`trackEvent` is declared as `publicProcedure` in `analytics.ts` but `publicProcedure` itself includes `csrfMiddleware` (lines 67-70). So the `public` label doesn't help.

**Collection page** (`/[workspaceSlug]/[projectSlug]`) is loaded directly in the browser (not an iframe), so it _should_ have the cookie — but if the cookie is missing for any reason (first visit, cleared cookies), the mutation also silently fails.

### Bug 2 (MEDIUM) — `eventType` Schema Mismatch

**Location:** `packages/api/src/routers/analytics.ts` line 29 vs `packages/db/src/schema/app.ts` line 159

The router accepts `z.enum(["view", "click"])` but the DB column is `text("event_type").notNull()` — **no DB-level enum constraint**. The schema is fine for insertion, but any future events like `"video_play"` referenced in the todo are silently accepted as untyped strings and break the analytics queries which only filter for `"view"` / `"click"`.

### Bug 3 (LOW) — Silent Failure with No User Feedback

**Location:** `apps/web/src/components/widget.tsx` line 75 and `collection-wizard.tsx` line 127

Both use `.mutate()` (fire-and-forget) with no `onError` handler. When the CSRF check throws, the error is swallowed. There is **no logging** and no way to detect failures in production.

---

## ✅ Fix Plan

### Fix 1 — Exempt `trackEvent` from CSRF Middleware (Backend)

**Strategy:** Create a dedicated `publicAnalyticsProcedure` that uses `tracingMiddleware` + `ratelimitMiddleware` but **skips** `csrfMiddleware`. This is safe because:

- `trackEvent` takes no privileged action (no auth required)
- It is already `publicProcedure` (unauthenticated)
- Rate limiting still protects against abuse
- Origin/referer check in `proxy.ts` (lines 36-41) still guards non-safe methods from truly cross-site forgery on the main app

**File:** `packages/api/src/index.ts`

```ts
// New: A public procedure for analytics that skips CSRF (safe for iframe/widget context)
export const publicAnalyticsProcedure = t.procedure.use(tracingMiddleware).use(ratelimitMiddleware);
```

**File:** `packages/api/src/routers/analytics.ts`
Change `trackEvent` from `publicProcedure` to `publicAnalyticsProcedure`.

### Fix 2 — Add `onError` Logging to Both Call Sites (Frontend)

**Files:** `apps/web/src/components/widget.tsx` and `apps/web/src/app/[workspaceSlug]/[projectSlug]/collection-wizard.tsx`

Replace fire-and-forget `.mutate()` with `.mutate(payload, { onError: (err) => console.error('[Analytics]', err) })`.

### Fix 3 — Add a `pgEnum` for `event_type` (Database)

**File:** `packages/db/src/schema/app.ts`

Create `analyticsEventTypeEnum = pgEnum("analytics_event_type", ["view", "click"])` and apply to the `eventType` column. Generate and run a Drizzle migration.

---

## 📁 Files Changed

| File                                                                   | Change                                                |
| ---------------------------------------------------------------------- | ----------------------------------------------------- |
| `packages/api/src/index.ts`                                            | Add `publicAnalyticsProcedure`                        |
| `packages/api/src/routers/analytics.ts`                                | Switch `trackEvent` to use `publicAnalyticsProcedure` |
| `apps/web/src/components/widget.tsx`                                   | Add `onError` logger to `trackEvent.mutate()`         |
| `apps/web/src/app/[workspaceSlug]/[projectSlug]/collection-wizard.tsx` | Add `onError` logger to `trackEvent.mutate()`         |
| `packages/db/src/schema/app.ts`                                        | Add `analyticsEventTypeEnum` and update column        |
| New migration file                                                     | Drizzle migration for enum type                       |

---

## 🧪 Verification Steps

1. Run `bun run check-types` — must pass with 0 errors
2. Run `bun run build` — must compile
3. Manual test: Open widget in iframe on a test page → Network tab must show `analytics.trackEvent` → 200 OK (not 403)
4. Manual test: Visit a collection page → Network tab must show `analytics.trackEvent` → 200 OK
5. DB query: `SELECT COUNT(*) FROM analytics_event` must increase after each test

---

## ⏱️ Estimate

- Implementation: ~25 min
- Migration: ~5 min
- Verification: ~10 min
