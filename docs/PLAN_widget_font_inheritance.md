# PLAN: Fix Widget Font Inheritance

**Status:** ⏸️ Awaiting approval  
**Date:** 2026-04-12  
**Agents:** debugger → explorer-agent → frontend-specialist → performance-optimizer

---

## 🔍 Root Cause Analysis (3 bugs found across 4 files)

### Bug 1 (CRITICAL) — `embed/[id]/page.tsx` Never Injects the Font

**Location:** `apps/web/src/app/embed/[id]/page.tsx` lines 32, 135-143

`settings = JSON.parse(w.settingsJson)` correctly reads `fontFamily` from the DB. However, the only `<style>` injected into the embed page is:

```tsx
<style dangerouslySetInnerHTML={{ __html: `html, body { background: transparent !important; }` }} />
```

There is **no Google Fonts `@import` or `<link>` tag**. The widget `<Widget>` component inherits from the embed page's DOM — but since no font is loaded, the browser falls back to system sans-serif on first load.

**Why it's worse on carousel/masonry:** Grid renders immediately as HTML — the system font renders _something_. Carousel slides are positioned dynamically by Framer Motion _after_ React hydration, and masonry uses CSS `columns` which re-calculates column heights. Without the font loaded, the first render is in system font, and even if the font loads fractionally later, the column heights don't automatically recalculate, causing text reflow artifacts that look like the font "didn't apply."

### Bug 2 (HIGH) — `widget.tsx` settings interface has no `fontFamily`

**Location:** `apps/web/src/components/widget.tsx` lines 16-46

The `settings` interface prop does not include `fontFamily`. Even if the embed page tries to pass it down, it would be stripped by TypeScript at compile time.

```ts
// Missing from interface:
fontFamily?: string;
```

The `Widget` component also never applies `fontFamily` style to its root container — so even if the font CSS is loaded, the widget text wouldn't pick up the custom font unless `font-family` is set in the container's style.

### Bug 3 (MEDIUM) — `customizer.tsx` has no `fontFamily` in `WidgetSettings` type

**Location:** `apps/web/src/app/dashboard/embed/[id]/customizer.tsx` lines 39-78

No `fontFamily` field exists in the `WidgetSettings` interface. This means:

- The font picker preview in the customizer doesn't inject the font
- The inline `<Widget data={{ settings }}>` in the customizer preview gets system font too
- The `handleSave` function saves settings without `fontFamily`

---

## ✅ Fix Plan (3 targeted changes)

### Fix 1 — Inject font into embed page (Server Component)

**File:** `apps/web/src/app/embed/[id]/page.tsx`

After parsing `settings`, inject a `<link rel="preconnect">` + `<link rel="stylesheet">` for the Google Font into the embed page. This is a **server-rendered** link tag — the font will be in the HTML response, so it starts loading before React hydrates. No FOUF (Flash of Unstyled Font).

```tsx
// Derive font URL server-side — no JS needed
const fontFamily = settings.fontFamily as string | undefined;
const isCustomFont = fontFamily && !["sans", "serif", "mono"].includes(fontFamily);
const fontHref = isCustomFont
  ? `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, "+")}:wght@300;400;500;600;700;800;900&display=swap`
  : null;
```

Then in JSX:

```tsx
{
  fontHref && (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="stylesheet" href={fontHref} />
    </>
  );
}
```

Also update the `<style>` to inject the `font-family` on `:root` so it cascades automatically:

```tsx
<style
  dangerouslySetInnerHTML={{
    __html: `
    html, body { background: transparent !important; }
    ${isCustomFont ? `*, *::before, *::after { font-family: "${fontFamily}", sans-serif !important; }` : ""}
  `,
  }}
/>
```

> Note: Using `* { font-family }` with `!important` is the only reliable way to override Tailwind's `font-sans` utility that is applied at the component level.

### Fix 2 — Add `fontFamily` to `widget.tsx` settings interface and root container

**File:** `apps/web/src/components/widget.tsx`

1. Add `fontFamily?: string` to the settings interface.
2. Apply `fontFamily` style to the root `<div>` container so all child text inherits it:

```tsx
<div
  ref={containerRef}
  className="w-full overflow-hidden pb-12"
  style={{
    backgroundColor: settings.backgroundColor,
    fontFamily:
      settings.fontFamily && !["sans", "serif", "mono"].includes(settings.fontFamily)
        ? `"${settings.fontFamily}", sans-serif`
        : settings.fontFamily === "mono"
          ? "ui-monospace, monospace"
          : settings.fontFamily === "serif"
            ? "ui-serif, serif"
            : undefined,
  }}
>
```

### Fix 3 — Add `fontFamily` to customizer `WidgetSettings` + inject font in preview

**File:** `apps/web/src/app/dashboard/embed/[id]/customizer.tsx`

1. Add `fontFamily?: string` to `WidgetSettings` interface.
2. Add `fontFamily: "sans"` as default.
3. Inject a `<link rel="stylesheet">` via `useEffect` when `settings.fontFamily` changes, so the live preview also uses the correct font.

```ts
// In useEffect when fontFamily changes:
useEffect(() => {
  const fontFamily = settings.fontFamily;
  if (!fontFamily || ["sans", "serif", "mono"].includes(fontFamily)) return;
  const id = `kudos-font-${fontFamily.replace(/\s+/g, "-")}`;
  if (document.getElementById(id)) return; // already loaded
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, "+")}:wght@300;400;500;600;700;800;900&display=swap`;
  document.head.appendChild(link);
}, [settings.fontFamily]);
```

### Fix 4 — Update CSP to allow Google Fonts

**File:** `apps/web/src/proxy.ts`

The current CSP has:

```
font-src 'self' data:;
style-src 'self' 'unsafe-inline';
```

Google Fonts loads CSS from `fonts.googleapis.com` and font files from `fonts.gstatic.com`. Both need to be added:

```
font-src 'self' data: https://fonts.gstatic.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
```

---

## 📁 Files Changed

| File                                                   | Change                                                             |
| ------------------------------------------------------ | ------------------------------------------------------------------ |
| `apps/web/src/app/embed/[id]/page.tsx`                 | Server-side font `<link>` injection + `:root` font-family override |
| `apps/web/src/components/widget.tsx`                   | Add `fontFamily` to interface + apply to root container            |
| `apps/web/src/app/dashboard/embed/[id]/customizer.tsx` | Add `fontFamily` type + preview font loader via `useEffect`        |
| `apps/web/src/proxy.ts`                                | Add Google Fonts to CSP allowlist                                  |

---

## ⏱️ Why This Approach

- **Server-rendered `<link>`** beats `@import` in a `<style>`: the font starts downloading before JS parses, eliminating FOUF on first load.
- **`* { font-family }` override**: Tailwind applies `font-family: var(--font-sans)` via the `font-sans` class on many elements. A CSS specificity override at `*` level is the only reliable fix in an iframe where we can't control parent CSS.
- **`useEffect` + `document.createElement("link")`** in the customizer: idempotent (checks `.id` before adding), doesn't cause FOUF in the preview (deduplication prevents double-loading).
- **CSP fix is mandatory**: without it, the browser silently blocks Google Fonts in production even if the link tag is correct.

---

## 🧪 Verification

1. `bun run check-types` → 0 errors
2. Open embed page with a custom font (e.g., `Inter`, `Playfair Display`) → Network tab must show `fonts.googleapis.com` request in first HTML response (not after hydration)
3. Switch to Carousel layout → font must apply on slide 1, no system-font flash
4. Switch to Masonry → no reflow artifacts after font load
