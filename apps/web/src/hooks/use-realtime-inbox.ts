import { useEffect } from "react";
import { getPusherClient } from "@/lib/pusher-client";
import { queryClient, trpc } from "@/utils/trpc";
import { gooeyToast as toast } from "goey-toast";

export function useRealtimeInbox(workspaceId: string | undefined, projectId: string | undefined) {
  useEffect(() => {
    if (!workspaceId) {
      return;
    }

    const pusher = getPusherClient();
    if (!pusher) return;

    const channelName = `private-inbox-${workspaceId}`;
    const channel = pusher.subscribe(channelName);

    channel.bind(
      "new-testimonial",
      (data: { testimonialId: string; projectId: string; authorName: string; rating: number }) => {
        console.log("🔔 Real-time notification received:", data);

        // Only invalidate if the new testimonial belongs to the currently viewed project
        if (projectId && data.projectId === projectId) {
          // Invalidate the testimonials list query
          queryClient.invalidateQueries(
            trpc.dashboard.getProjectTestimonials.queryOptions({ projectId }),
          );

          toast.success(`New ${data.rating}★ testimonial from ${data.authorName}!`, {
            description: "Your inbox has been updated instantly.",
          });
        } else {
          // Optionally notify even if it's a different project in the same workspace
          toast.info(`New testimonial received in another project!`, {
            description: `A new ${data.rating}★ testimonial from ${data.authorName} just arrived.`,
          });
        }

        // Also invalidate global dashboard stats
        queryClient.invalidateQueries(trpc.dashboard.getData.queryOptions({ workspaceId }));
      },
    );

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
    };
  }, [workspaceId, projectId]);
}
