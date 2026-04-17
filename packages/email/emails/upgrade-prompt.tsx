import { Button, Section, Text, Hr } from "@react-email/components";
import * as React from "react";
import { BaseLayout } from "./components/base-layout";

interface UpgradePromptEmailProps {
  userName: string;
  approvedCount: number;
}

export const UpgradePromptEmail = ({ userName, approvedCount }: UpgradePromptEmailProps) => {
  return (
    <BaseLayout previewText="You're crushing it! (And hitting your limit) 🚀">
      <Section>
        <Text className="text-dark mb-6 font-serif text-[24px]">
          Nice work on the momentum, {userName}!
        </Text>
        <Text className="text-[14px] leading-[24px] text-neutral-700">
          You've just approved your **{approvedCount}th testimonial**. Your Wall of Love is starting
          to look incredible!
        </Text>

        <Text className="mt-4 text-[14px] leading-[24px] text-neutral-700">
          On the Free Plan, you can display up to 5 testimonials. To keep the momentum going and
          unlock the full power of your social proof, it's time to upgrade.
        </Text>

        <Section className="border-brand/20 bg-brand/5 my-8 rounded-2xl border border-solid p-6">
          <Text className="text-brand mb-4 font-mono text-[11px] font-bold tracking-wider uppercase">
            PRO BENEFITS
          </Text>
          <Section className="space-y-4">
            <Text className="m-0 flex items-center gap-2 py-1 text-[14px] text-neutral-800">
              <span className="text-brand font-bold">✓</span> Unlimited testimonials & storage
            </Text>
            <Text className="m-0 flex items-center gap-2 py-1 text-[14px] text-neutral-800">
              <span className="text-brand font-bold">✓</span> Premium collection widgets
            </Text>
            <Text className="m-0 flex items-center gap-2 py-1 text-[14px] text-neutral-800">
              <span className="text-brand font-bold">✓</span> Remove "Powered by KudosWall" badge
            </Text>
            <Text className="m-0 flex items-center gap-2 py-1 text-[14px] text-neutral-800">
              <span className="text-brand font-bold">✓</span> Custom domains & white-label pages
            </Text>
            <Text className="m-0 flex items-center gap-2 py-1 text-[14px] text-neutral-800">
              <span className="text-brand font-bold">✓</span> Advanced analytics & CSV exports
            </Text>
          </Section>
        </Section>

        <Section className="mb-[32px] text-center">
          <Button
            className="bg-dark rounded-full px-8 py-4 text-center text-[14px] font-bold text-white no-underline shadow-lg"
            href="https://kudoswall.org/dashboard/billing"
          >
            Upgrade to Pro — $29/mo
          </Button>
          <Text className="mt-4 text-[12px] text-neutral-400">
            No long-term contracts. Cancel anytime.
          </Text>
        </Section>

        <Hr className="my-8 border-neutral-100" />

        <Section className="rounded-xl bg-neutral-50 p-4">
          <Text className="m-0 text-[13px] leading-[20px] text-neutral-500 italic">
            "KudosWall has completely automated our social proof. We saw a 14% increase in
            conversion within the first week of adding the wall."
          </Text>
          <Text className="m-0 mt-2 text-[12px] font-bold text-neutral-900">
            — David, CMO at GrowthLabs
          </Text>
        </Section>
      </Section>
    </BaseLayout>
  );
};

export default UpgradePromptEmail;
