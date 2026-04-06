# PLAN: Premium Segmented Progress Bar

Implement a high-fidelity, segmented progress bar for multi-step forms to improve UX and provide clear task progression feedback.

## 🏁 Goals

- [ ] **Reusable Component**: Create a `ProgressBar` in `@my-better-t-app/ui` that can handle any number of steps.
- [ ] **Visual Clarity**: Show total steps as discrete segments or a clear percentage block.
- [ ] **Smooth Motion**: Use Framer Motion for fluid transitions between steps.
- [ ] **Project Integration**: Integrate the new component into `CollectionWizard` first.

---

## 🛠️ Implementation Phases

### Phase 1: UI Component (frontend-specialist)

1. **Creation**: Build `packages/ui/src/components/progress.tsx` using a Radix-like pattern but optimized for a premium look (glassmorphism/glow).
2. **Features**: Support `maxSteps`, `currentStep`, and custom `accentColor`.

### Phase 2: Integration (project-planner)

1. **Migration**: Replace the hardcoded `h-1` div in `CollectionWizard.tsx` with the new `@my-better-t-app/ui/Progress` component.
2. **Step Mapping**: Ensure the `steps` dictionary in the wizard correctly maps to the progress bar's indices.

### Phase 3: Verification (test-engineer)

1. **Navigation Test**: Verify progress bar updates correctly when clicking "Next" and "Back".
2. **Snapshot Test**: Ensure the progress bar doesn't cause layout shifts (CLS) on step transitions.

---

## 📝 Next Steps

1. Approve this plan.
2. Create the reusable UI component.
3. Update the Collection Wizard.
