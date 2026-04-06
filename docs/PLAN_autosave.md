# Plan: Auto-save Draft in LocalStorage

This plan outlines the implementation of an auto-save feature for the `CollectionWizard` to prevent data loss if the browser crashes or the page is reloaded.

## 🎯 Objectives

- Automatically save user input (rating, content, name, email, company, linkedin, tagline, and photo) to `localStorage`.
- Recover the saved draft on page load.
- Clear the saved draft upon successful submission.
- Ensure the storage is scoped to the specific project/wall using the `projectId`.

## 🛠️ Proposed Changes

### 1. `apps/web/src/app/[workspaceSlug]/[projectSlug]/collection-wizard.tsx`

- **Draft Persistence Logic**:
  - Add a `useEffect` that runs whenever key state variables change (`rating`, `content`, `photo`, `name`, `email`, `company`, `linkedin`, `tagline`, `mode`, `step`).
  - Save the state to `localStorage` with a project-specific key: `t-wall-draft-${project.id}`.
- **Draft Recovery Logic**:
  - Add a `useEffect` on mount (or initial state) to read from `localStorage`.
  - Populate all state variables from the saved draft if it exists.
  - Show a small "Recovered your progress!" toast if data was loaded.
- **Cleanup**:
  - Clear `localStorage` on successful testimonial submission.

### 2. `apps/web/src/components/collection/video-recorder.tsx`

- (Note): Video blobs are too large for `localStorage`. Only the "fact" that a text draft exists will be saved. If the user recorded a video and it crashed, they will have to re-record, but their text details (name, email, etc.) will be recovered.

## 🧪 Verification Plan

### Manual Verification

1.  **Partial Entry**: Fill in the rating and part of the text testimonial.
2.  **Restart**: Reload the browser page.
3.  **Check Recovery**: Verify that the rating and text are restored and the step is correct.
4.  **Complete Submission**: Finish the form and submit.
5.  **Check Cleanup**: Reload again and verify the form starts fresh.

### Automated Verification

- Create a Playwright test to automate the reload/recovery flow.

## 📅 Timeline

- **Foundation**: Set up the `useEffect` for saving and initial loading.
- **Polish**: Add the recovery toast and edge case handling (e.g., outdated drafts).
- **Final Checks**: Run security and lint checks.

---

**Status**: 🕒 Awaiting Approval
