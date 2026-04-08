import { Button, Section, Text } from "@react-email/components";
import * as React from "react";
import { BaseLayout } from "./components/base-layout";

interface WelcomeEmailProps {
  userName: string;
}

export const WelcomeEmail = ({ userName }: WelcomeEmailProps) => {
  return (
    <BaseLayout previewText="Welcome to KudosWall! Here is your 3-step onboarding path.">
      <Section>
        <Text className="text-dark mb-6 font-serif text-[18px]">Hi {userName},</Text>
        <Text className="text-[14px] leading-[24px] text-neutral-700">
          I'm Alex, and I'm thrilled to have you here. KudosWall was built to help you capture the
          love your customers have for your product and turn it into your most powerful marketing
          asset.
        </Text>

        <Text className="text-dark mt-8 mb-4 text-[14px] font-bold">
          Your 3-step path to social proof:
        </Text>

        <div className="space-y-4">
          <div className="flex gap-3">
            <span className="text-brand font-mono font-bold">01</span>
            <Text className="m-0 text-[14px] text-neutral-700">
              Create your first collection link
            </Text>
          </div>
          <div className="flex gap-3">
            <span className="text-brand font-mono font-bold">02</span>
            <Text className="m-0 text-[14px] text-neutral-700">
              Share it with your happiest customers
            </Text>
          </div>
          <div className="flex gap-3">
            <span className="text-brand font-mono font-bold">03</span>
            <Text className="m-0 text-[14px] text-neutral-700">
              Embed the wall-of-love on your site
            </Text>
          </div>
        </div>

        <Section className="mt-[32px] mb-[32px] text-center">
          <Button
            className="bg-dark rounded-full px-6 py-3 text-center text-[14px] font-bold text-white no-underline"
            href="https://kudoswall.org/dashboard"
          >
            Share your collection link
          </Button>
        </Section>

        <Text className="text-[13px] text-neutral-500 italic">
          Tip: Most users get their first testimonial within 24 hours of sharing their link.
        </Text>
      </Section>
    </BaseLayout>
  );
};

export default WelcomeEmail;
