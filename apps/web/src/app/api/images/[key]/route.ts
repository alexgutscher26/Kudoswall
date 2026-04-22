import { NextRequest, NextResponse } from "next/server";
import { getEnvAsync } from "@my-better-t-app/env/server";

export const runtime = "edge";

/**
 * Serves public images (avatars, logos) from the IMAGES_BUCKET.
 * These assets have public cache headers set at upload time.
 *
 * For WebP/AVIF optimization on Cloudflare Pro plans, requests can be
 * proxied through Cloudflare Image Resizing:
 *   /cdn-cgi/image/format=webp,quality=80,w=400/{key}
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string }> },
): Promise<NextResponse> {
  try {
    const env = await getEnvAsync();
    const { key } = await params;

    if (!env.IMAGES_BUCKET) {
      return new NextResponse("Storage not configured", { status: 500 });
    }

    const object = await env.IMAGES_BUCKET.get(key);

    if (!object) {
      return new NextResponse("Not found", { status: 404 });
    }

    const headers = new Headers();
    if (object.httpMetadata?.contentType) {
      headers.set("content-type", object.httpMetadata.contentType);
    }
    if (object.httpMetadata?.cacheControl) {
      headers.set("cache-control", object.httpMetadata.cacheControl);
    } else {
      // Safe default: public, 1-day CDN cache
      headers.set("cache-control", "public, max-age=86400, s-maxage=86400");
    }
    headers.set("etag", object.etag);

    const blob = await object.blob();
    return new NextResponse(blob, { headers });
  } catch (error) {
    console.error("Image fetch error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
