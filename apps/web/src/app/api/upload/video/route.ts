import { NextRequest, NextResponse } from "next/server";
import { getEnvAsync } from "@my-better-t-app/env/server";
import { nanoid } from "nanoid";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const env = await getEnvAsync();

    // During local Node.js development without wrangler/miniflare,
    // the R2 binding may be missing. We check for it.
    if (!env.VIDEOS_BUCKET) {
      return NextResponse.json(
        {
          error: "Storage not configured.",
          message:
            "The VIDEOS_BUCKET binding is missing in the production environment. Please ensure the R2 bucket is correctly bound to your Cloudflare Worker.",
        },
        { status: 500 },
      );
    }

    const { searchParams } = new URL(req.url);
    const ext = searchParams.get("ext") || "webm";
    const id = `vid_${nanoid()}`;
    const key = `${id}.${ext}`;

    // Simplify content type (e.g., "video/webm;codecs=vp8" -> "video/webm")
    const rawContentType = req.headers.get("content-type") || "video/webm";
    const contentType = rawContentType.split(";")[0].trim();

    const buffer = await req.arrayBuffer();

    if (buffer.byteLength === 0) {
      return NextResponse.json({ error: "Request body is empty" }, { status: 400 });
    }

    try {
      const putOptions: any = {
        httpMetadata: {
          contentType,
        },
      };

      await env.VIDEOS_BUCKET.put(key, buffer, putOptions);
    } catch (putError: any) {
      console.error("R2 Put Error:", putError);
      return NextResponse.json(
        {
          error: "Failed to write to storage",
          message: putError?.message || "Unknown R2 error",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: `/api/videos/${key}` });
  } catch (error: any) {
    console.error("Video upload error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error?.message || "Unknown error",
      },
      { status: 500 },
    );
  }
}
