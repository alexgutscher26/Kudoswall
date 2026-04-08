# 📈 SEO Strategy Implementation Plan

This plan outlines the systematic implementation of advanced SEO features for KudosWall to maximize search visibility and click-through rates via Google Rich Results.

## 🛠️ Objectives

- [ ] **Dynamic Sitemaps**: Ensure every public collection and widget page is discoverable.
- [ ] **JSON-LD Structured Data**: Implement `AggregateRating` and `Review` schemas for widgets.
- [ ] **Canonical URL Management**: Prevent duplicate content issues across subdomains/aliases.
- [ ] **Meta Tag & OG Generator**: Create dynamic, high-conversion social previews.

---

## 🏗️ Architecture & Deliverables

### 1. Dynamic Sitemap Expansion (`@[backend-specialist]`)

- **File**: `apps/web/src/app/sitemap.ts`
- **Action**: Update the current fetch logic to include not just `/collect/[slug]` but also any future public "Wall" or "Project" pages.
- **Logic**: Use Drizzle to fetch all active projects and workspaces.

### 2. JSON-LD for Testimonial Widgets (`@[seo-specialist]`)

- **Files**: `apps/web/src/app/embed/[id]/page.tsx`, `apps/web/src/app/collect/[slug]/page.tsx`
- **Schema**:
  - `AggregateRating`: Show overall stars (e.g., "4.9/5 based on 128 reviews").
  - `Review`: Individual snippets for each featured testimonial.
  - `Organization`: Branding and logo associations.

### 3. Canonical & Meta Tag System (`@[frontend-specialist]`)

- **Global**: Update `apps/web/src/app/layout.tsx` to handle base canonicals.
- **Dynamic**: Implement specialized `generateMetadata` in:
  - `/collect/[slug]`
  - `/embed/[id]`
- **OG Strategy**: Use Next.js `ImageResponse` to generate dynamic images showing:
  - Project/Workspace Logo
  - Title: "Share your experience with [Name]"
  - Stats: "[X] Testimonials collected"

### 4. Automated Verification (`@[test-engineer]`)

- Run `seo_checker.py` to validate meta tags.
- Run `security_scan.py` to ensure no data leaks via dynamic OG metadata.

---

## 📅 Task Breakdown

### Phase 1: Foundation (Sitemaps & Canonicals)

- Update `sitemap.ts` with comprehensive URL mapping.
- Implement canonical logic in root layout and dynamic segments.

### Phase 2: Rich Results (JSON-LD)

- Create a reusable `JsonLd` component.
- Inject `AggregateRating` and `Review` schemas into `EmbedPage`.

### Phase 3: Visual SEO (OG:Image)

- Create `/api/og` route for dynamic image generation.
- Link `generateMetadata` to the dynamic OG endpoint.

---

## ✅ Verification Criteria

1. `curl https://kudoswall.org/sitemap.xml` returns all public collection slugs.
2. Google Rich Results Test (Mocked or Local) confirms valid `AggregateRating`.
3. Social previews (Twitter/LinkedIn) display dynamic project branding.
4. `bun run build` passes with no metadata serialization errors.
