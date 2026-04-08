# PLAN: Workspace Onboarding System

Implement a "5 Steps to Your First Testimonial" onboarding checklist to guide new users through the core value loop of KudosWall.

## 🏁 Goals

- [ ] **Onboarding State Persistence**: Store onboarding progress in the database per workspace.
- [ ] **Premium UI**: Match the existing "Premium Segmented Progress Bar" aesthetic.
- [ ] **Automatic Progression**: Trigger step completion based on user actions (e.g., creating a project).
- [ ] **Dashboard Integration**: Display the checklist prominently for new workspaces until completion.

## 🛠️ Implementation Phases

### Phase 1: Database & API (database-architect & backend-specialist)

1. **Schema Update**:
   - Add `onboarding_status` (JSONB) to the `workspace` table in `packages/db/src/schema/app.ts`.
   - Structure: `{ step1: boolean, step2: boolean, ... }`.
2. **API Router**:
   - Update `dashboardRouter.getData` to return the `onboarding_status`.
   - Add `completeOnboardingStep` mutation in `packages/api/src/routers/dashboard.ts`.

### Phase 2: UI Components (frontend-specialist)

1. **New Component**: Create `apps/web/src/components/dashboard/OnboardingChecklist.tsx`.
2. **Step Definitions**:
   - **Step 1**: "Create your first Space" (Redirect to creation modal).
   - **Step 2**: "Customize your Collection Page" (Change colors/logo).
   - **Step 3**: "Share your link" (Copy collection URL).
   - **Step 4**: "Approve a testimonial" (Set status to 'approved').
   - **Step 5**: "Embed your widget" (Create first widget).
3. **Animations**: Use Framer Motion for checklist item completion and the progress bar transition.

### Phase 3: Logic & Integration (project-planner)

1. **Auto-Complete Triggers**:
   - Hook into `createProject` to auto-complete Step 1.
   - Hook into `updateProjectSettings` for Step 2.
   - Hook into `approveTestimonial` for Step 4.
2. **Conditional Rendering**: Only show the checklist if the workspace is < 14 days old or not all steps are done.

### Phase 4: Verification (test-engineer)

1. **End-to-End**: Follow the onboarding flow as a new user.
2. **Data Consistency**: Ensure progress persists across sessions.

---

## 📝 Next Steps

1. Approve this plan.
2. Update the Drizzle schema.
3. Build the Dashboard Checklist UI.
