import { createAuthClient } from "better-auth/react";
import { magicLinkClient, emailOTPClient, lastLoginMethodClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [magicLinkClient(), emailOTPClient(), lastLoginMethodClient()],
});
