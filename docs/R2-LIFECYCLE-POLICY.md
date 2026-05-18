# Cloudflare R2 Lifecycle Policies

Since the Cloudflare API (and Alchemy bindings by extension) does not currently support programmatic configuration of Object Lifecycle rules during deployment, you **must configure these rules manually** via the Cloudflare Dashboard.

This document details the exact retention policies we need to implement for our scalable storage architecture.

## 1. Archiving Old Videos (Cost Optimization)

High-definition video storage builds up quickly. To optimize costs, we transition original high-res video assets that are older than 12 months to infrequent access / cold archival.

### Goal

Move original video uploads (`VIDEOS_BUCKET`) to a cold-storage tier after 1 year.

### Steps to Implement:

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com).
2. Navigate to **R2**.
3. Select your `<prefix>-videos` bucket.
4. Click on the **Settings** tab.
5. Scroll down to **Object lifecycle rules** and click **Add rule**.
6. Set the rule details:
   - **Rule name:** `Archive old original videos`
   - **Prefix:** _(Leave blank, applies to all objects)_
   - **Rule effect:** `Transition to Infrequent Access`
   - **Age:** `365` days (1 year)
7. Click **Save**.

---

## 2. Abort Incomplete Multipart Uploads (Cleanup)

When users upload very large files, clients use multipart uploads. Sometimes these are abandoned or fail mid-way, leaving "orphan" parts that consume storage indefinitely and cost money.

### Goal

Automatically clean up incomplete multipart chunks that are older than 7 days.

### Steps to Implement:

1. In the same **Settings** tab of your R2 bucket.
2. In the **Object lifecycle rules** section, click **Add rule**.
3. Set the rule details:
   - **Rule name:** `Clean up abandoned multipart uploads`
   - **Prefix:** _(Leave blank, applies to all objects)_
   - **Rule effect:** `Abort incomplete multipart uploads`
   - **Age:** `7` days
4. Click **Save**.

> **Note:** Repeat this process for the `IMAGES_BUCKET` as well to ensure total cleanup of aborted uploads across all our storage locations.

---

## Architecture Context

Because we now use short-lived HMAC-signed URLs for videos (1-hour TTL), Cloudflare R2 will not cache the videos on its CDN edges long-term. This means original video requests will always hit the bucket directly.

Archiving objects to Infrequent Access is safe because the typical lifespan of a testimonial video's "heavy traffic" phase is within the first few months. After a year, most testimonials are no longer featured on the primary marketing page, making lower-cost Infrequent Access the perfect target tier.
