import { Button, Section, Text } from "@react-email/components";
import { BaseLayout } from "./components/base-layout";

interface TrialExpiringEmailProps {
  userName: string;
  expiryDate: string;
}

export const TrialExpiringEmail = ({ userName, expiryDate }: TrialExpiringEmailProps) => {
  return (
    <BaseLayout previewText="Your Pro trial is ending soon! Don't lose your premium features.">
      <Section>
        <Text className="text-dark mb-6 font-serif text-[18px]">
          7 days of social proof magic, {userName}.
        </Text>
        <Text className="text-[14px] leading-[24px] text-neutral-700">
          Your Pro trial on KudosWall is set to expire on <strong>{expiryDate}</strong>.
        </Text>

        <Text className="mt-4 text-[14px] leading-[24px] text-neutral-700">
          We hope you’ve enjoyed features like unlimited testimonials, custom branding, and detailed
          analytics. Once your trial ends, your account will revert to the Free plan, and some of
          these features will be restricted.
        </Text>

        <Section className="my-8 rounded-2xl border border-solid border-neutral-100 bg-neutral-50 p-6">
          <Text className="text-brand mb-4 font-mono text-[12px] font-bold uppercase">
            Keep the momentum going:
          </Text>
          <ul className="space-y-2 text-[13px] text-neutral-600">
            <li>✅ Unlimited testimonials collection</li>
            <li>✅ Remove KudosWall branding</li>
            <li>✅ Detailed analytics & export</li>
            <li>✅ Custom domain support</li>
          </ul>
        </Section>

        <Section className="mb-[32px] text-center">
          <Button
            className="bg-dark rounded-full px-6 py-3 text-center text-[14px] font-bold text-white no-underline"
            href="https://kudoswall.org/dashboard/settings"
          >
            Upgrade to Pro
          </Button>
        </Section>

        <Text className="text-[13px] text-neutral-500 italic">
          If you have any questions about which plan is right for you, just hit reply. I'm here to
          help!
        </Text>
      </Section>
    </BaseLayout>
  );
};

export default TrialExpiringEmail;
