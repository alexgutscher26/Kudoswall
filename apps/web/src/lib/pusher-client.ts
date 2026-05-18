import Pusher from "pusher-js";
import { env } from "@my-better-t-app/env/web";

let pusherInstance: Pusher | null = null;

export function getPusherClient() {
  if (!env.NEXT_PUBLIC_PUSHER_KEY || !env.NEXT_PUBLIC_PUSHER_CLUSTER) {
    return null;
  }

  if (!pusherInstance) {
    pusherInstance = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
      authEndpoint: "/api/pusher/auth",
    });
  }

  return pusherInstance;
}
