import { eq } from "drizzle-orm";
import { workspace } from "@my-better-t-app/db/schema";
import { EmailService } from "@my-better-t-app/email";
import { getEnvAsync } from "@my-better-t-app/env/server";

export async function triggerUpgradePrompt({
  db,
  workspaceId,
  type,
  userName,
  userEmail,
}: {
  db: any;
  workspaceId: string;
  type: "badge-removal" | "testimonial-milestone" | "analytics-access" | "tag-filtering";
  userName: string;
  userEmail: string;
}) {
  const ws = await db.query.workspace.findFirst({
    where: eq(workspace.id, workspaceId),
  });

  if (!ws || ws.plan !== "free") return;

  let settings: any = {};
  try {
    settings = ws.notificationSettingsJson ? JSON.parse(ws.notificationSettingsJson) : {};
  } catch (e) {
    settings = {};
  }
  
  const promptsSent = settings.promptsSent || [];

  if (promptsSent.includes(type)) return;

  try {
    const env = await getEnvAsync();
    const emailService = new EmailService(env.RESEND_API_KEY || "");
    await emailService.sendUpgradePrompt(userEmail, userName, type);

    // Update settings
    await db
      .update(workspace)
      .set({
        notificationSettingsJson: JSON.stringify({
          ...settings,
          promptsSent: [...promptsSent, type],
        }),
      })
      .where(eq(workspace.id, workspaceId));
      
    console.log(`[UPGRADE_PROMPT] Sent ${type} prompt to ${userEmail}`);
  } catch (err) {
    console.error(`[UPGRADE_PROMPT] Failed to send ${type} prompt:`, err);
  }
}
