import { NextRequest, NextResponse } from "next/server";
import { getEnvAsync } from "@my-better-t-app/env/server";

export const runtime = "edge";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  try {
    const env = await getEnvAsync();
    const { key } = await params;

    if (!env.VIDEOS_BUCKET) {
      return new NextResponse("Storage not configured", { status: 500 });
    }

    const object = await env.VIDEOS_BUCKET.get(key);

    if (!object) {
      return new NextResponse("Not found", { status: 404 });
    }

    const headers = new Headers();
    if (object.httpMetadata) {
      if (object.httpMetadata.contentType)
        headers.set("content-type", object.httpMetadata.contentType);
    }

    headers.set("etag", object.etag);

    const blob = await object.blob();
    return new NextResponse(blob, {
      headers,
    });
  } catch (error) {
    console.error("Video fetch error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
