import { eq, isNull, and } from "drizzle-orm";
import { widget, project } from "@my-better-t-app/db/schema";
import type { Database } from "@my-better-t-app/db";

/**
 * Purges the cache for all widgets in a workspace.
 * Invalidates both Cloudflare KV and Cloudflare CDN (HTTP Cache).
 */
export async function purgeWidgetCache({
  db,
  workspaceId,
  env,
}: {
  db: Database;
  workspaceId: string;
  env: Env;
}) {
  console.log(`[Purge] Starting cache purge for workspace: ${workspaceId}`);

  // 1. Find all widgets for this workspace
  const widgets = await db.query.widget.findMany({
    where: and(eq(widget.workspaceId, workspaceId), isNull(widget.deletedAt)),
  });

  if (widgets.length === 0) {
    console.log(`[Purge] No widgets found for workspace: ${workspaceId}`);
    return;
  }

  const widgetIds = widgets.map((w) => w.id);

  // 2. Purge Cloudflare KV (Sub-10ms metadata store)
  if (env.WIDGET_KV) {
    try {
      await Promise.all(widgetIds.map((id) => env.WIDGET_KV!.delete(`widget:${id}`)));
      console.log(`[Purge] KV keys deleted for ${widgetIds.length} widgets`);
    } catch (err) {
      console.error("[Purge] KV deletion error:", err);
    }
  }

  // 3. Purge Cloudflare CDN (Edge HTTP Cache)
  const apiToken = env.CLOUDFLARE_API_TOKEN;
  const zoneId = env.CLOUDFLARE_ZONE_ID;

  if (apiToken && zoneId) {
    const baseUrl = "https://kudoswall.org";

    // Construct URLs to purge on the main domain
    const urlsToPurge = widgetIds.flatMap((id) => [
      `${baseUrl}/api/widget/${id}`,
      `${baseUrl}/embed/${id}`,
    ]);

    // Also find custom domains to purge those as well
    const projects = await db.query.project.findMany({
      where: and(eq(project.workspaceId, workspaceId), isNull(project.deletedAt)),
    });

    for (const p of projects) {
      if (p.customDomain) {
        widgetIds.forEach((id) => {
          urlsToPurge.push(`https://${p.customDomain}/api/widget/${id}`);
          urlsToPurge.push(`https://${p.customDomain}/embed/${id}`);
        });
      }
    }

    try {
      // Cloudflare API allows up to 30 URLs per request on some plans,
      // but usually 500-1000. We'll send them in one go for now.
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            files: urlsToPurge,
          }),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        console.error("[Purge] Cloudflare CDN Purge Failed:", error);
      } else {
        console.log(`[Purge] Cloudflare CDN Purge Success for ${urlsToPurge.length} URLs`);
      }
    } catch (err) {
      console.error("[Purge] Cloudflare CDN Purge Error:", err);
    }
  } else {
    console.warn("[Purge] Skipping CDN purge: CLOUDFLARE_API_TOKEN or CLOUDFLARE_ZONE_ID missing");
  }
}
