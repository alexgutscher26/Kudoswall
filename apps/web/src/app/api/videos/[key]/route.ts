import { NextRequest, NextResponse } from "next/server";
import { getEnvAsync } from "@my-better-t-app/env/server";
import { verifySignedUrl } from "@/lib/signed-url";

export const runtime = "edge";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> },
): Promise<NextResponse> {
  try {
    const env = await getEnvAsync();
    const { key } = await params;

    if (!env.VIDEOS_BUCKET) {
      return new NextResponse("Storage not configured", { status: 500 });
    }

    // Validate signed URL token
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const exp = searchParams.get("exp");

    if (!token || !exp) {
      return new NextResponse("Forbidden: Missing token", { status: 403 });
    }

    const secret = env.R2_SIGNING_SECRET;
    if (!secret) {
      console.error("R2_SIGNING_SECRET is not configured");
      return new NextResponse("Storage misconfigured", { status: 500 });
    }

    const valid = await verifySignedUrl(key, token, exp, secret);
    if (!valid) {
      return new NextResponse("Forbidden: Invalid or expired token", { status: 403 });
    }

    const object = await env.VIDEOS_BUCKET.get(key);

    if (!object) {
      return new NextResponse("Not found", { status: 404 });
    }

    const headers = new Headers();
    if (object.httpMetadata?.contentType) {
      headers.set("content-type", object.httpMetadata.contentType);
    }
    headers.set("etag", object.etag);
    // Private asset — must not be cached by CDN or shared caches
    headers.set("cache-control", "private, no-store");

    const blob = await object.blob();
    return new NextResponse(blob, { headers });
  } catch (error) {
    console.error("Video fetch error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
