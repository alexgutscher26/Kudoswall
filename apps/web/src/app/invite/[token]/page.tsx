import { Suspense } from "react";
import InvitePage from "./invite-page";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Join Workspace — KudosWall",
  description: "Accept your invitation to join a KudosWall workspace.",
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-6">
          <div className="w-full max-w-md rounded-[40px] border border-neutral-100 bg-white p-12 text-center shadow-2xl">
            <div className="space-y-6">
              <div className="flex justify-center">
                <Loader2 className="size-16 animate-spin text-pink-500" />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-neutral-900">
                Loading Invitation...
              </h1>
              <p className="text-neutral-400">Please wait while we initialize.</p>
            </div>
          </div>
        </div>
      }
    >
      <InvitePage />
    </Suspense>
  );
}
