# PLAN: Viral Badge Copy Optimization

## Goal
Optimize the viral "Powered by" badge on embedded widgets to increase click-through rates (CTR) and viral signups. We will transition from a static "Powered by KudosWall" to a dynamic system that rotates between high-performing copy variants.

## Target File
- `apps/web/src/components/widget.tsx`

## Proposed Copy Variants
1. **Control**: "Powered by KudosWall"
2. **Action-Oriented**: "Get a wall like this"
3. **Benefit-Oriented**: "Social proof by KudosWall"
4. **Direct Utility**: "Free Testimonial Wall"
5. **Emotional/Viral**: "Love this? Get yours free"

## Implementation Steps

### 1. Define Badge Constants
Create a `BADGE_VARIANTS` array near the top of `widget.tsx` containing these strings.

### 2. Selection Logic
In the `Widget` component:
- Use the `data.id` (widgetId) to deterministically select a variant.
- *Logic*: `BADGE_VARIANTS[hash(data.id) % BADGE_VARIANTS.length]` or a simple character code sum.

### 3. UI Update
Update the badge rendering logic (found in both the header and footer sections of `widget.tsx`) to use the selected variant.

### 4. Tracking & Analytics
Ensure the `trackEvent` call for `click_powered_by` includes the `variant` text in its metadata so we can analyze performance in the database.

## Verification Criteria
- [ ] Badge renders with one of the new variants.
- [ ] Variant is consistent for the same widget ID across refreshes.
- [ ] Clicks are tracked with the variant name in metadata.
- [ ] Layout remains aesthetic and doesn't break on longer variants.

## Agents
- **Frontend Specialist**: Implement logic and UI changes.
- **SEO Specialist**: Refine variants for maximum conversion.
- **Test Engineer**: Verify tracking and rendering.
