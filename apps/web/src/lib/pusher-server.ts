import Pusher from "pusher";
import { getEnvAsync } from "@my-better-t-app/env/server";

export async function getPusherServer() {
  const env = await getEnvAsync();

  if (!env.PUSHER_APP_ID || !env.PUSHER_KEY || !env.PUSHER_SECRET || !env.PUSHER_CLUSTER) {
    // In development, we might not have these set yet. 
    // We log a warning but don't crash, to allow the app to run.
    if (process.env.NODE_ENV === "development") {
      console.warn("⚠️ Pusher environment variables are missing. Real-time updates will be disabled.");
      return null;
    }
    throw new Error("Missing Pusher environment variables");
  }

  return new Pusher({
    appId: env.PUSHER_APP_ID,
    key: env.PUSHER_KEY,
    secret: env.PUSHER_SECRET,
    cluster: env.PUSHER_CLUSTER,
    useTLS: true,
  });
}
