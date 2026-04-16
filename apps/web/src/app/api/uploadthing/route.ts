import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";
import { env } from "@my-better-t-app/env/server";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    token: env.UPLOADTHING_TOKEN,
  },
});
