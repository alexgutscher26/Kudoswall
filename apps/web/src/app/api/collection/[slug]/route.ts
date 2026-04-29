import { db } from "@/lib/server-db";
import { project, testimonial } from "@my-better-t-app/db/schema";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { notifyOwnerNewTestimonial } from "@/lib/email-helpers";
import { revalidatePath } from "next/cache";
import { getPusherServer } from "@/lib/pusher-server";

import { z } from "zod";

const testimonialSchema = z.object({
  rating: z.number().min(1).max(5),
  content: z.string().min(1, "Content is required").max(5000),
  authorName: z.string().min(1, "Name is required").max(100),
  authorEmail: z.string().email("Invalid email").max(100),
  authorImage: z.string().optional(),
  authorCompany: z.string().max(100).optional(),
  authorLinkedin: z.string().url("Invalid URL").max(200).optional().or(z.literal("")),
  authorTagline: z.string().max(100).optional(),
  videoUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

// Upstash Redis Rate Limiting (5 submissions per IP per 24h)
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "24h"),
  analytics: true,
  prefix: "@upstash/ratelimit:collection-submission",
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Robust IP detection (Cloudflare-friendly)
  const ip =
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown";

  // 1. Rate Limiting Logic (5 submissions per IP per 24h)
  const { success, limit, remaining, reset } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again in 24 hours." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      },
    );
  }

  try {
    const rawBody = await req.json();
    const validated = testimonialSchema.safeParse(rawBody);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validated.error.format() },
        { status: 400 },
      );
    }

    const body = validated.data;

    // 2. Fetch Project by collectionSlug
    const proj = await db.query.project.findFirst({
      where: eq(project.collectionSlug, slug),
      with: {
        workspace: true,
      },
    });

    if (!proj) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    // 3. Insert Testimonial
    const id = `tst_${nanoid()}`;
    await db.insert(testimonial).values({
      id,
      workspaceId: proj.workspaceId,
      projectId: proj.id,
      rating: body.rating,
      content: body.content,
      authorName: body.authorName,
      authorEmail: body.authorEmail,
      authorImage: body.authorImage, // Base64 or URL
      authorCompany: body.authorCompany,
      authorLinkedin: body.authorLinkedin,
      authorTagline: body.authorTagline,
      type: body.videoUrl ? "video" : "text",
      videoUrl: body.videoUrl,
      status: "pending",
    });

    // 4. Trigger Real-time Update
    try {
      const pusher = await getPusherServer();
      if (pusher) {
        await pusher.trigger(`private-inbox-${proj.workspaceId}`, "new-testimonial", {
          testimonialId: id,
          projectId: proj.id,
          authorName: body.authorName,
          rating: body.rating,
        });
      }
    } catch (err) {
      // Don't fail the submission if Pusher fails
      console.error("Failed to trigger Pusher event:", err);
    }

    // 4. Rate limit is automatically managed by Upstash on .limit() call.

    void notifyOwnerNewTestimonial(proj.id, {
      authorName: body.authorName,
      content: body.content,
      rating: body.rating,
    });

    // 6. Revalidate the collection page to update testimonial counts etc.
    revalidatePath(`/collect/${slug}`);

    return NextResponse.json({
      success: true,
      message: proj.thankYouMessage || "Thank you for your feedback!",
    });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json({ error: "Failed to submit testimonial" }, { status: 500 });
  }
}
