import { NextResponse } from "next/server";
import { createDb } from "@my-better-t-app/db";
import { videoTranscodingJob, testimonial } from "@my-better-t-app/db/schema";
import { env } from "@my-better-t-app/env/server";
import { eq } from "drizzle-orm";

/**
 * CRON: Video Transcoding Queue Processor
 * This endpoint should be called frequently (e.g., every minute) by a Cron trigger.
 * It simulates a job queue processor for video transcoding.
 *
 * In a real production environment, this is where you would dispatch a job to
 * an external FFmpeg service (like AWS Elemental MediaConvert, Mux, or a
 * long-running container task) to process the R2 asset (`sourceKey`) into
 * 360p, 720p, and 1080p outputs.
 */

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  // Verify CRON_SECRET if it's set in the environment
  const authHeader = req.headers.get("authorization");
  if (env.CRON_SECRET && authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const db = createDb();

  try {
    // 1. Fetch up to 5 pending jobs
    const pendingJobs = await db.query.videoTranscodingJob.findMany({
      where: eq(videoTranscodingJob.status, "pending"),
      limit: 5,
    });

    if (pendingJobs.length === 0) {
      return NextResponse.json({ success: true, processed: 0 });
    }

    const results = [];

    // 2. Process each job
    // (Simulating the dispatch and completion of the FFmpeg transcoding process)
    for (const job of pendingJobs) {
      // Mark as processing
      await db
        .update(videoTranscodingJob)
        .set({ status: "processing", attempts: job.attempts + 1 })
        .where(eq(videoTranscodingJob.id, job.id));

      await db
        .update(testimonial)
        .set({ videoProcessingStatus: "processing" })
        .where(eq(testimonial.id, job.testimonialId));

      try {
        // ---- 🎬 SIMULATED TRANSCODING DISPATCH ----
        // 1. Download `job.sourceKey` from env.VIDEOS_BUCKET
        // 2. Run FFmpeg or dispatch to AWS MediaConvert
        // 3. Upload encoded outputs back to R2
        // 4. Record new keys in `outputKeysJson`
        // ------------------------------------------

        const mockOutputKeys = {
          "360p": job.sourceKey.replace(/\.([a-z0-9]+)$/i, "_360p.$1"),
          "720p": job.sourceKey.replace(/\.([a-z0-9]+)$/i, "_720p.$1"),
          "1080p": job.sourceKey.replace(/\.([a-z0-9]+)$/i, "_1080p.$1"),
        };

        // Mark as done
        await db
          .update(videoTranscodingJob)
          .set({
            status: "done",
            processedAt: new Date(),
            outputKeysJson: JSON.stringify(mockOutputKeys),
          })
          .where(eq(videoTranscodingJob.id, job.id));

        await db
          .update(testimonial)
          .set({
            videoProcessingStatus: "done",
            videoTranscodesJson: JSON.stringify(mockOutputKeys),
          })
          .where(eq(testimonial.id, job.testimonialId));

        results.push({ id: job.id, status: "done" });
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Unknown error";
        console.error(`[TRANSCODE_FAILURE] Job ${job.id}:`, errorMsg);

        await db
          .update(videoTranscodingJob)
          .set({ status: "failed", error: errorMsg })
          .where(eq(videoTranscodingJob.id, job.id));

        await db
          .update(testimonial)
          .set({ videoProcessingStatus: "failed" })
          .where(eq(testimonial.id, job.testimonialId));

        results.push({ id: job.id, status: "failed", error: errorMsg });
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      processed: results.length,
      details: results,
    });
  } catch (error) {
    console.error("[VIDEO_CRON_FAILURE]", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
