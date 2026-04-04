import { db } from "@/lib/server-db";
import { project, testimonial } from "@my-better-t-app/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

// TODO: Implement resend

// Simple in-memory rate limiting (Note: In production with multiple instances, use Redis/KV)
const rateLimitMap = new Map<string, { count: number; reset: number }>();

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ip = req.headers.get("x-forwarded-for") || "unknown";

  // 1. Rate Limiting Logic (5 submissions per IP per 24h)
  const now = Date.now();
  const limit = 5;
  const window = 24 * 60 * 60 * 1000;

  const current = rateLimitMap.get(ip) || { count: 0, reset: now + window };

  if (now > current.reset) {
    current.count = 0;
    current.reset = now + window;
  }

  if (current.count >= limit) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again in 24 hours." },
      { status: 429 },
    );
  }

  try {
    const body = (await req.json()) as {
      rating: number;
      content: string;
      authorName: string;
      authorEmail: string;
      authorImage?: string;
      authorCompany?: string;
      authorLinkedin?: string;
      authorTagline?: string;
      videoUrl?: string;
    };

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

    // 4. Update rate limit
    current.count++;
    rateLimitMap.set(ip, current);

    // 5. Fire non-blocking email notification (Placeholder for Resend integration)
    // resend.emails.send(...)

    return NextResponse.json({
      success: true,
      message: proj.thankYouMessage || "Thank you for your feedback!",
    });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json({ error: "Failed to submit testimonial" }, { status: 500 });
  }
}
