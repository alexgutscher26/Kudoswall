# PLAN: Widget Redesign to Match Marketing Preview

The goal is to align the default widget design and its implementation with the "Live Preview" shown on the marketing page. This ensures that what users see before signing up is exactly what they get by default.

## 🎨 Proposed Style Changes

| Element               | Current Style                 | New Style (Marketing Match)                   |
| :-------------------- | :---------------------------- | :-------------------------------------------- |
| **Card Padding**      | `p-7`                         | `p-4`                                         |
| **Card Rounding**     | `32px` (`large`)              | `12px` (`small`)                              |
| **Font (Content)**    | `text-[14px]`, `italic`       | `text-xs`, no italic                          |
| **Font (Name/Role)**  | `text-[14px]` / `text-[11px]` | `text-xs` / `text-[10px]`                     |
| **Avatar Size**       | `size-10`                     | `size-6`                                      |
| **Quote Icon**        | None (in text cards)          | `Quote` icon at top-left                      |
| **Video Style**       | Top-right Play icon           | Pink BG placeholder with centered Play button |
| **Star Size**         | `size-3`                      | `size-3.5`                                    |
| **Card Background**   | `white`                       | `#fafafa` (default for light theme)           |
| **Preview Container** | Generic grid                  | Premium Browser Chrome Mock                   |

## 🛠️ Implementation Steps

### Phase 1: API & Schema Defaults

1.  **Update `packages/api/src/routers/widget.ts`**:
    - Change `defaultSettings` in `create` mutation to use `cardBorderRadius: "small"`.
    - Update `widgetSettingsSchema` defaults if necessary.

### Phase 2: Component Refactor

2.  **Modify `apps/web/src/components/widget.tsx`**:
    - Update `renderCard` to use the new padding and font sizes.
    - Implement the `Quote` icon for text testimonials.
    - Redesign the video testimonial preview.
    - Update Avatar and Star sizes.

### Phase 3: Customizer & Preview Overhaul

3.  **Update `apps/web/src/app/dashboard/embed/[id]/customizer.tsx`**:
    - Sync the default state with the new API defaults.
    - Update `MOCK_DATA` to reflect the marketing page's content for a premium feel.
    - **Encase the Widget preview in the "Browser Mock"** (bar with dots, URL, etc.) from the marketing page.
    - Adjust the dot grid background to match the marketing page's spacing (`20px 20px`).

## ✅ Verification

- [ ] Create a new widget and verify defaults.
- [ ] Inspect the live preview against the marketing page's `WidgetPreviewSection`.
- [ ] Test Dark mode compatibility (ensure `#fafafa` handles dark mode correctly).
- [ ] Verify responsiveness (mobile vs desktop).
