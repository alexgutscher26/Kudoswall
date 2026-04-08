import { ImageResponse } from "next/og";
import { createDb } from "@my-better-t-app/db";
import { project } from "@my-better-t-app/db/schema";
import { eq, or } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Get params
    const slug = searchParams.get("slug");
    if (!slug) {
      return new Response("Missing slug", { status: 400 });
    }

    const db = createDb();
    const projectData = await db.query.project.findFirst({
      where: or(eq(project.collectionSlug, slug), eq(project.slug, slug)),
      with: {
        workspace: true,
      },
    });

    if (!projectData) {
      return new Response("Project not found", { status: 404 });
    }

    const name = projectData.name;
    const logoUrl = projectData.workspace.logoUrl;
    const accentColor = "#e8527a"; // Default accent

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #f1f1f1 2%, transparent 0%), radial-gradient(circle at 75px 75px, #f1f1f1 2%, transparent 0%)",
          backgroundSize: "100px 100px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
            borderRadius: "32px",
            backgroundColor: "white",
            border: "1px solid #f0f0f0",
            boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
          }}
        >
          {logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt="Logo"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "24px",
                marginBottom: "24px",
              }}
            />
          )}
          <div
            style={{
              fontSize: "60px",
              fontWeight: "bold",
              color: "#1a1a1a",
              textAlign: "center",
              marginBottom: "12px",
              letterSpacing: "-0.04em",
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#666",
              textAlign: "center",
              marginBottom: "32px",
            }}
          >
            Share your experience on KudosWall
          </div>
          <div
            style={{
              backgroundColor: accentColor,
              color: "white",
              padding: "16px 32px",
              borderRadius: "16px",
              fontSize: "24px",
              fontWeight: "600",
            }}
          >
            Leave a Testimonial
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    console.error(`${e.message}`);
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
