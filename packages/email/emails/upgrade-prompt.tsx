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
        <Text className="text-dark mb-6 font-serif text-[18px]">
          Nice work on the momentum, {userName}!
        </Text>
        <Text className="text-[14px] leading-[24px] text-neutral-700">
          You've just approved your **{approvedCount}th testimonial**. Your wall of love is starting
          to look incredible!
        </Text>

        <Text className="mt-4 text-[14px] leading-[24px] text-neutral-700">
          On the Free Plan, you can display up to 5 testimonials. To keep the momentum going and
          unlock the full power of your social proof, it's time to go Pro.
        </Text>

        <Section className="border-brand/20 bg-brand/5 my-8 rounded-2xl border border-solid p-6">
          <Text className="text-brand mb-4 font-mono text-[12px] font-bold uppercase">
            PRO BENEFITS
          </Text>
          <div className="space-y-3">
            <div className="flex gap-2">
              <span className="text-brand">✓</span>
              <Text className="text-dark m-0 text-[14px]">Unlimited testimonials (No caps)</Text>
            </div>
            <div className="flex gap-2">
              <span className="text-brand">✓</span>
              <Text className="text-dark m-0 text-[14px]">Video testimonial recording</Text>
            </div>
            <div className="flex gap-2">
              <span className="text-brand">✓</span>
              <Text className="text-dark m-0 text-[14px]">Remove KudosWall branding</Text>
            </div>
            <div className="flex gap-2">
              <span className="text-brand">✓</span>
              <Text className="text-dark m-0 text-[14px]">Weekly performance digests</Text>
            </div>
          </div>
        </Section>

        <Section className="mb-[32px] text-center">
          <Button
            className="bg-dark rounded-full px-6 py-3 text-center text-[14px] font-bold text-white no-underline"
            href="https://kudoswall.org/dashboard/billing"
          >
            Upgrade to Pro for $29/mo
          </Button>
        </Section>

        <Hr className="my-6 border-neutral-100" />

        <Text className="text-[13px] text-neutral-500 italic">
          "Best $29 I spend every month. It's automated my entire social proof workflow." — Sarah,
          Founder of SaaSFlow
        </Text>
      </Section>
    </BaseLayout>
  );
};

export default UpgradePromptEmail;
