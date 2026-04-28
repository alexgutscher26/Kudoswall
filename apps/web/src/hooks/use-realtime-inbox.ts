import { useEffect } from "react";
import Pusher from "pusher-js";
import { env } from "@my-better-t-app/env/web";
import { queryClient, trpc } from "@/utils/trpc";
import { gooeyToast as toast } from "goey-toast";

export function useRealtimeInbox(workspaceId: string | undefined, projectId: string | undefined) {
  useEffect(() => {
    if (!workspaceId || !env.NEXT_PUBLIC_PUSHER_KEY || !env.NEXT_PUBLIC_PUSHER_CLUSTER) {
      return;
    }

    const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
      authEndpoint: "/api/pusher/auth",
    });

    const channelName = `private-inbox:${workspaceId}`;
    const channel = pusher.subscribe(channelName);

    channel.bind("new-testimonial", (data: { testimonialId: string; projectId: string; authorName: string; rating: number }) => {
      console.log("🔔 Real-time notification received:", data);

      // Only invalidate if the new testimonial belongs to the currently viewed project
      if (projectId && data.projectId === projectId) {
        // Invalidate the testimonials list query
        queryClient.invalidateQueries(
          trpc.dashboard.getProjectTestimonials.queryOptions({ projectId })
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
    });

    return () => {
      pusher.unsubscribe(channelName);
      pusher.disconnect();
    };
  }, [workspaceId, projectId]);
}
