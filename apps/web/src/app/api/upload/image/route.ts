import { NextRequest, NextResponse } from "next/server";
import { auth } from "@my-better-t-app/auth";
import { getEnvAsync } from "@my-better-t-app/env/server";
import { getDb } from "@my-better-t-app/db";
import { workspaceMember, workspace } from "@my-better-t-app/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getPlanConfig } from "@my-better-t-app/api/config/plans";
import { scanFileHash } from "@/lib/virustotal";

export const runtime = "edge";

/** Allowed image MIME types and their magic byte signatures. */
const ALLOWED_IMAGE_TYPES = new Map<string, { sig: Uint8Array; offset?: number }[]>([
  // JPEG: FF D8 FF
  ["image/jpeg", [{ sig: new Uint8Array([0xff, 0xd8, 0xff]) }]],
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  ["image/png", [{ sig: new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]) }]],
  // WebP: 52 49 46 46 ?? ?? ?? ?? 57 45 42 50 (RIFF....WEBP)
  [
    "image/webp",
    [
      {
        sig: new Uint8Array([0x52, 0x49, 0x46, 0x46]),
        // offset 0: RIFF; offset 8: WEBP — checked separately below
      },
    ],
  ],
  // GIF: 47 49 46 38 (GIF8)
  [
    "image/gif",
    [
      { sig: new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x37, 0x61]) }, // GIF87a
      { sig: new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]) }, // GIF89a
    ],
  ],
  // AVIF: looks like MP4 ftyp box with 'avif' brand — simplified check
  ["image/avif", [{ sig: new Uint8Array([0x66, 0x74, 0x79, 0x70, 0x61, 0x76, 0x69, 0x66]) }]],
]);

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

const MAX_MAGIC_BYTES = 16;

function sniffImageMime(bytes: Uint8Array): string | null {
  // WebP special case: RIFF at offset 0 + WEBP at offset 8
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }

  // AVIF: ftyp brand at offset 4
  if (
    bytes[4] === 0x66 &&
    bytes[5] === 0x74 &&
    bytes[6] === 0x79 &&
    bytes[7] === 0x70 &&
    bytes[8] === 0x61 &&
    bytes[9] === 0x76 &&
    bytes[10] === 0x69 &&
    bytes[11] === 0x66
  ) {
    return "image/avif";
  }

  for (const [mime, checks] of ALLOWED_IMAGE_TYPES.entries()) {
    if (mime === "image/webp" || mime === "image/avif") continue; // handled above
    for (const { sig } of checks) {
      const slice = bytes.slice(0, sig.length);
      let match = true;
      for (let i = 0; i < sig.length; i++) {
        if (slice[i] !== sig[i]) {
          match = false;
          break;
        }
      }
      if (match) return mime;
    }
  }

  return null;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // ── Auth ──────────────────────────────────────────────────────────────────
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const env = await getEnvAsync();

    if (!env.IMAGES_BUCKET) {
      return NextResponse.json(
        { error: "Storage not configured", message: "IMAGES_BUCKET binding is missing." },
        { status: 500 },
      );
    }

    // ── Resolve workspace & plan ───────────────────────────────────────────────
    const { db } = getDb();
    const membership = await db.query.workspaceMember.findFirst({
      where: and(eq(workspaceMember.userId, session.user.id), isNull(workspaceMember.deletedAt)),
      with: { workspace: true },
    });

    if (!membership) {
      return NextResponse.json({ error: "No workspace found" }, { status: 403 });
    }

    const ws = membership.workspace as typeof workspace.$inferSelect;
    const planConfig = getPlanConfig(ws.plan);

    // ── Read & validate body ───────────────────────────────────────────────────
    const buffer = await req.arrayBuffer();

    if (buffer.byteLength === 0) {
      return NextResponse.json({ error: "Request body is empty" }, { status: 400 });
    }

    // Enforce plan-based max image size
    const maxBytes = planConfig.limits.maxImageSizeMb * 1024 * 1024;
    if (buffer.byteLength > maxBytes) {
      return NextResponse.json(
        {
          error: "File too large",
          message: `Maximum image size for your plan is ${planConfig.limits.maxImageSizeMb} MB.`,
        },
        { status: 413 },
      );
    }

    // ── MIME sniffing (server-side) ────────────────────────────────────────────
    const magicBytes = new Uint8Array(buffer, 0, Math.min(MAX_MAGIC_BYTES, buffer.byteLength));
    const sniffedMime = sniffImageMime(magicBytes);

    if (!sniffedMime) {
      return NextResponse.json(
        {
          error: "Unsupported media type",
          message: "Only image files (JPEG, PNG, WebP, GIF, AVIF) are allowed.",
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

    // ── Upload to R2 (IMAGES_BUCKET — public) ─────────────────────────────────
    const ext = MIME_TO_EXT[sniffedMime] ?? "bin";
    const key = `img_${nanoid()}.${ext}`;

    const putOptions: R2PutOptions = {
      httpMetadata: {
        contentType: sniffedMime,
        // Public images are safe to CDN-cache (logos, avatars)
        cacheControl: "public, max-age=86400, s-maxage=86400",
      },
      customMetadata: {
        uploadedBy: session.user.id,
        workspaceId: ws.id,
        scanHash: scanResult.hash,
        scanStatus: scanResult.status,
      },
    };

    await env.IMAGES_BUCKET.put(key, buffer, putOptions);

    // Images are served from a public bucket — return the direct key.
    // The caller constructs the URL as /api/images/{key}
    // Optionally served via Cloudflare Image Resizing:
    //   /cdn-cgi/image/format=webp,quality=80,w=400/<key>
    return NextResponse.json({
      key,
      url: `/api/images/${key}`,
      scanHash: scanResult.hash,
      scanStatus: scanResult.status,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Image upload error:", error);
    return NextResponse.json({ error: "Internal Server Error", message }, { status: 500 });
  }
}
