import { Button, Section, Text, Hr } from "@react-email/components";
import { BaseLayout } from "./components/base-layout";

interface ReEngagementEmailProps {
  userName: string;
}

export const ReEngagementEmail = ({ userName }: ReEngagementEmailProps) => {
  return (
    <BaseLayout previewText="Is your Wall of Love getting lonely? 🥺">
      <Section>
        <Text className="text-dark mb-6 font-serif text-[18px]">Long time no see, {userName}!</Text>
        <Text className="text-[14px] leading-[24px] text-neutral-700">
          It's been a couple of weeks since you last checked in on KudosWall.
        </Text>

        <Text className="mt-4 text-[14px] leading-[24px] text-neutral-700">
          Did you know that websites with live social proof can see up to a 67% increase in trust
          signals? It's the easiest lever you can pull for your conversion rate.
        </Text>

        <Section className="my-8 rounded-2xl border border-solid border-neutral-100 bg-neutral-50 p-6">
          <Text className="text-brand mb-4 font-mono text-[12px] font-bold uppercase">
            QUICK WIN CHECKLIST
          </Text>
          <div className="space-y-3">
            <div className="flex gap-2">
              <span className="text-neutral-300">☐</span>
              <Text className="text-dark m-0 text-[14px]">Add 1 more testimonial</Text>
            </div>
            <div className="flex gap-2">
              <span className="text-neutral-300">☐</span>
              <Text className="text-dark m-0 text-[14px]">Refresh your widget colors</Text>
            </div>
            <div className="flex gap-2">
              <span className="text-neutral-300">☐</span>
              <Text className="text-dark m-0 text-[14px]">Share your magic link on Twitter</Text>
            </div>
          </div>
        </Section>

        <Section className="mb-[32px] text-center">
          <Button
            className="bg-dark rounded-full px-6 py-3 text-center text-[14px] font-bold text-white no-underline"
            href="https://kudoswall.org/dashboard"
          >
            Jump back into your dashboard
          </Button>
        </Section>

        <Hr className="my-6 border-neutral-100" />

        <Text className="text-[13px] text-neutral-500 italic">
          If you're having trouble getting testimonials, just reply. I have a 3-email sequence I can
          share with you that works like a charm. — Alex
        </Text>
      </Section>
    </BaseLayout>
  );
};

export default ReEngagementEmail;
