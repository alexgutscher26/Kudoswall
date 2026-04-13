# Orchestration Plan: Core Web Vitals Optimization

## Task

Optimize Core Web Vitals across the application focusing on:

- **LCP (Largest Contentful Paint)** < 2.5s
- **CLS (Cumulative Layout Shift)** < 0.1
- **INP (Interaction to Next Paint)** < 200ms

## Phase 1: Planning Results

### 1. Analysis of the current situation

- The app uses Next.js app router.
- Marketing pages use standard Next.js layouts, but we need to ensure all hero/header images use `<Image priority />` for LCP optimization.
- The Collection Wizard and Dashboard have interactive elements which may impact INP.
- Fonts are already optimized using `next/font/google` (`Geist`, `Geist_Mono`, `Inter`, `Manrope`).
- We need to verify `width`/`height` on all images to prevent CLS.

### 2. Action Plan

- **Frontend Specialist tasks**:
  1. Audit `next/image` usage in marketing components (e.g. Hero, features) and add `priority` to LCP candidates.
  2. Ensure all `<Image>` tags have explicit dimensions or use `fill` with aspect-ratio parent containers.
  3. Replace any unoptimized third-party scripts with `next/script` (`strategy="lazyOnload"`).

- **Performance Optimizer tasks**:
  1. Implement React `<Suspense>` boundaries for heavy client components and widgets to prevent blocking the main thread (improving INP).
  2. Ensure `next/font` is applied without layout shifts using proper CSS fallback properties if dynamic fonts exist.

- **DevOps/Test Engineer tasks**:
  1. Validate build success after the changes.
  2. Ensure `@vercel/speed-insights/next` is optimally placed within the global layout to track Web Vitals post-deployment.

## Next Steps

Upon approval, I will orchestrate the specialized sub-agents (`frontend-specialist`, `performance-optimizer`, `test-engineer`) to implement and verify these optimizations in parallel.
