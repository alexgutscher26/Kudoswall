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
      console.warn(
        "VIDEOS_BUCKET binding is missing. Ensure you are running with proper bindings.",
      );
      return NextResponse.json({ error: "Storage not configured." }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const ext = searchParams.get("ext") || "webm";
    const id = `vid_${nanoid()}`;
    const key = `${id}.${ext}`;
    const contentType = req.headers.get("content-type") || "video/webm";

    const contentLength = req.headers.get("content-length");

    if (!req.body) {
      return NextResponse.json({ error: "No request body" }, { status: 400 });
    }

    try {
      const putOptions: any = {
        httpMetadata: {
          contentType,
        },
      };

      if (contentLength) {
        putOptions.contentLength = parseInt(contentLength);
      }

      await env.VIDEOS_BUCKET.put(key, req.body, putOptions);
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
