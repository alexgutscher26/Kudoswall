import { Button, Section, Text } from "@react-email/components";
import { BaseLayout } from "./components/base-layout";

interface CancellationEmailProps {
  userName: string;
}

export const CancellationEmail = ({ userName }: CancellationEmailProps) => {
  return (
    <BaseLayout previewText="Your KudosWall subscription has been canceled.">
      <Section>
        <Text className="text-dark mb-6 font-serif text-[18px]">
          We're sorry to see you go, {userName}.
        </Text>
        <Text className="text-[14px] leading-[24px] text-neutral-700">
          This email confirms that your KudosWall Pro subscription has been canceled. Your account
          has been reverted to our base Free plan.
        </Text>

        <Text className="mt-4 text-[14px] leading-[24px] text-neutral-700">
          Your existing testimonials are still safe and will continue to be displayed, but some
          premium features like removal of branding and advanced analytics are now disabled.
        </Text>

        <Section className="my-8 rounded-2xl border border-solid border-neutral-100 bg-neutral-50 p-6">
          <Text className="text-brand mb-4 font-mono text-[12px] font-bold uppercase">
            Wait, I didn't mean to cancel!
          </Text>
          <Text className="text-[13px] text-neutral-600">
            No problem at all. You can easily restart your subscription anytime from your dashboard
            settings to regain full access to all features.
          </Text>
        </Section>

        <Section className="mb-[32px] text-center">
          <Button
            className="bg-dark rounded-full px-6 py-3 text-center text-[14px] font-bold text-white no-underline"
            href="https://kudoswall.org/dashboard/settings"
          >
            Manage Subscription
          </Button>
        </Section>

        <Text className="text-[13px] text-neutral-500 italic">
          We'd love to know if there's anything we could have done better. Just reply to this email
          if you're open to sharing your feedback!
        </Text>
      </Section>
    </BaseLayout>
  );
};

export default CancellationEmail;
