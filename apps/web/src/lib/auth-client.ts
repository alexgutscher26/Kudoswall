import { createAuthClient } from "better-auth/react";
import { magicLinkClient, emailOTPClient, lastLoginMethodClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : undefined,
  user: {
    additionalFields: {
      referralCode: { type: "string" },
      referredById: { type: "string" },
      referralActivatedAt: { type: "date" },
    },
  },
  plugins: [magicLinkClient(), emailOTPClient(), lastLoginMethodClient()],
});
