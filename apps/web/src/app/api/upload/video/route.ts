import { NextRequest, NextResponse } from "next/server";
import { auth } from "@my-better-t-app/auth";
import { getEnvAsync } from "@my-better-t-app/env/server";
import { getDb } from "@my-better-t-app/db";
import {
  workspaceMember,
  workspace,
  testimonial,
  videoTranscodingJob,
  project,
} from "@my-better-t-app/db/schema/app";
import { eq, and, isNull } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getPlanConfig } from "@my-better-t-app/api/config/plans";
import { scanFileHash } from "@/lib/virustotal";

export const runtime = "edge";

/** Allowed video MIME types and their magic byte signatures. */
const ALLOWED_VIDEO_TYPES = new Map<string, Uint8Array[]>([
  // WebM: 1A 45 DF A3
  ["video/webm", [new Uint8Array([0x1a, 0x45, 0xdf, 0xa3])]],
  // MP4 / QuickTime: check ftyp box at offset 4 — simplified: first 4 bytes are size, bytes 4-7 are 'ftyp'
  [
    "video/mp4",
    [
      new Uint8Array([0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70]), // ftyp mp41
      new Uint8Array([0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70]), // ftyp isom
      new Uint8Array([0x00, 0x00, 0x00, 0x1c, 0x66, 0x74, 0x79, 0x70]), // ftyp M4V
    ],
  ],
  // MOV (QuickTime): bytes 4-7 = 'ftyp' or 'mdat' or 'moov' — check for 'ftyp' at offset 4
  ["video/quicktime", [new Uint8Array([0x00, 0x00, 0x00, 0x14, 0x66, 0x74, 0x79, 0x70])]],
  // OGG: 4F 67 67 53
  ["video/ogg", [new Uint8Array([0x4f, 0x67, 0x67, 0x53])]],
]);

const MAX_MAGIC_BYTES = 16;

/**
 * Sniffs the first bytes of a buffer against known video magic byte signatures.
 * Returns the detected MIME type, or null if unrecognised.
 */
function sniffVideoMime(bytes: Uint8Array): string | null {
  for (const [mime, signatures] of ALLOWED_VIDEO_TYPES.entries()) {
    for (const sig of signatures) {
      const slice = bytes.slice(0, sig.length);
      let match = true;
      for (let i = 0; i < sig.length; i++) {
        if (slice[i] !== sig[i]) {
          match = false;
          break;
        }
      }
      // MP4/MOV: bytes 4-7 must spell 'ftyp' (0x66 0x74 0x79 0x70)
      if (match && (mime === "video/mp4" || mime === "video/quicktime")) {
        const ftypCheck = bytes.slice(4, 8);
        if (
          ftypCheck[0] === 0x66 &&
          ftypCheck[1] === 0x74 &&
          ftypCheck[2] === 0x79 &&
          ftypCheck[3] === 0x70
        ) {
          return mime;
        }
        continue;
      }
      if (match) return mime;
    }
  }
  return null;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // ── Auth & Resolution ──────────────────────────────────────────────────
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const testimonialId = searchParams.get("testimonialId");

    let wsId: string;
    let plan: string;
    let uploaderId: string | null = null;

    const session = await auth.api.getSession({ headers: req.headers });
    if (session?.user) {
      uploaderId = session.user.id;
    }

    const { db } = getDb();

    if (projectId) {
      const p = await db.query.project.findFirst({
        where: eq(project.id, projectId),
        with: { workspace: true },
      });
      if (!p) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }
      wsId = p.workspace.id;
      plan = p.workspace.plan;
    } else if (uploaderId) {
      const membership = await db.query.workspaceMember.findFirst({
        where: and(eq(workspaceMember.userId, uploaderId), isNull(workspaceMember.deletedAt)),
        with: { workspace: true },
      });
      if (!membership) {
        return NextResponse.json({ error: "No workspace found" }, { status: 403 });
      }
      wsId = membership.workspace.id;
      plan = membership.workspace.plan;
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const env = await getEnvAsync();

    if (!env.VIDEOS_BUCKET) {
      return NextResponse.json(
        { error: "Storage not configured", message: "VIDEOS_BUCKET binding is missing." },
        { status: 500 },
      );
    }

    const planConfig = getPlanConfig(plan);

    // Check video feature gate
    if (!planConfig.features.video) {
      return NextResponse.json(
        {
          error: "Plan limit",
          message: "Video uploads require a paid plan. Please upgrade to enable this feature.",
        },
        { status: 403 },
      );
    }

    // ── Read & validate body ───────────────────────────────────────────────────
    const buffer = await req.arrayBuffer();

    if (buffer.byteLength === 0) {
      return NextResponse.json({ error: "Request body is empty" }, { status: 400 });
    }

    // Enforce plan-based max file size
    const maxBytes = planConfig.limits.maxVideoSizeMb * 1024 * 1024;
    if (buffer.byteLength > maxBytes) {
      return NextResponse.json(
        {
          error: "File too large",
          message: `Maximum video upload size for your plan is ${planConfig.limits.maxVideoSizeMb} MB.`,
        },
        { status: 413 },
      );
    }

    // ── MIME sniffing (server-side) ────────────────────────────────────────────
    const magicBytes = new Uint8Array(buffer, 0, Math.min(MAX_MAGIC_BYTES, buffer.byteLength));
    const sniffedMime = sniffVideoMime(magicBytes);

    if (!sniffedMime) {
      return NextResponse.json(
        {
          error: "Unsupported media type",
          message: "Only video files (WebM, MP4, MOV, OGG) are allowed.",
        },
        { status: 415 },
      );
    }

    // ── VirusTotal Scan ────────────────────────────────────────────────────────
    const scanResult = await scanFileHash(buffer, env.VIRUSTOTAL_API_KEY);

    if (scanResult.status === "infected") {
      return NextResponse.json(
        {
          error: "Malware detected",
          message: "The uploaded file was flagged as malicious by our security scanners.",
        },
        { status: 400 },
      );
    }

    // ── Upload to R2 ──────────────────────────────────────────────────────────
    const ext = searchParams.get("ext") ?? "webm";
    const id = `vid_${nanoid()}`;
    const key = `${id}.${ext}`;

    const putOptions: R2PutOptions = {
      httpMetadata: {
        contentType: sniffedMime,
        cacheControl: "private, no-store",
      },
      customMetadata: {
        ...(uploaderId ? { uploadedBy: uploaderId } : {}),
        workspaceId: wsId,
        scanHash: scanResult.hash,
        scanStatus: scanResult.status,
      },
    };

    await env.VIDEOS_BUCKET.put(key, buffer, putOptions);

    // ── Update DB (If Testimonial ID is provided) ──────────────────────────────
    if (testimonialId) {
      await db.transaction(async (tx) => {
        await tx
          .update(testimonial)
          .set({
            videoUrl: `/api/videos/${key}`,
            virusScanStatus: scanResult.status,
            virusScanHash: scanResult.hash,
            videoProcessingStatus: "pending",
          })
          .where(eq(testimonial.id, testimonialId));

        await tx.insert(videoTranscodingJob).values({
          id: `vtj_${nanoid()}`,
          testimonialId,
          sourceKey: key,
          status: "pending",
        });
      });
    }

    // Return the R2 key
    return NextResponse.json({ key, scanHash: scanResult.hash, scanStatus: scanResult.status });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Video upload error:", error);
    return NextResponse.json({ error: "Internal Server Error", message }, { status: 500 });
  }
}
