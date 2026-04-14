# Video Collection Implementation Plan

## Problem Statement

The current implementation of video collection in the widget (`collection-wizard.tsx`) encodes the captured video as a base64 Data URL and submits it directly to the Next.js server action `submitTestimonial`. This is broken because:

1. Videos are too large to be encoded as base64 strings and sent in JSON payloads.
2. PostgreSQL `text` columns shouldn't be used to store massive base64 video payloads.
3. This approach crashes the application or hits server payload limits immediately.

## Proposed Architecture

We will introduce Cloudflare R2 as our Object Storage provider using our existing Alchemy infrastructure.

### Phase 2: Implementation (Required Agents)

**1. `database-architect` & `devops-engineer` (Data & Ops)**

- Add `alchemy.bucket("videos")` to `packages/infra/alchemy.run.ts`.
- Expose the bucket in the Next.js bindings.

**2. `backend-specialist` (Server & API)**

- Create a dedicated API route/tRPC endpoint (e.g., `/api/upload/presign`) to generate S3/R2 presigned upload URLs (or handle the upload using `@aws-sdk/client-s3` or Cloudflare Worker bindings).
- Update `packages/db/src/schema/app.ts` if any tracking fields are needed for video metadata (optional, since `videoUrl` already exists).

**3. `frontend-specialist` (UI/UX)**

- Update `collection-wizard.tsx` and `video-recorder.tsx` to handle the upload flow.
- The flow: Instead of encoding to base64, the client requests a presigned URL, PUTs the video blob to that URL, and then passes the resulting public URL to the `submitTestimonial` action.
- Enhance loading states to show upload progress.

**4. `test-engineer` (Verification)**

- Run `security_scan.py` to ensure upload URLs are secured and rate-limited.
- Verify linting and TypeScript checks pass.
