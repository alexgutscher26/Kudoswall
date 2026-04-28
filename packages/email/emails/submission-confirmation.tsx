import { Button, Section, Text } from "@react-email/components";
import { BaseLayout } from "./components/base-layout";

interface SubmissionConfirmationEmailProps {
  authorName: string;
  projectName: string;
  thankYouMessage?: string | null;
}

export const SubmissionConfirmationEmail = ({
  authorName,
  projectName,
  thankYouMessage,
}: SubmissionConfirmationEmailProps) => {
  return (
    <BaseLayout previewText={`Thank you for your testimonial for ${projectName}!`}>
      <Section>
        <Text className="text-dark mb-6 font-serif text-[18px]">Hi {authorName},</Text>
        <Text className="text-[14px] leading-[24px] text-neutral-700">
          Thank you so much for sharing your feedback for <strong>{projectName}</strong>. 
          Your support means a lot!
        </Text>

        {thankYouMessage && (
          <Section className="mt-6 border-l-4 border-neutral-200 pl-4">
            <Text className="text-[14px] italic text-neutral-600">
              "{thankYouMessage}"
            </Text>
          </Section>
        )}

        <Text className="text-[14px] leading-[24px] text-neutral-700 mt-6">
          We've received your testimonial and it has been sent to the team for review.
        </Text>

        <Section className="mt-[32px] mb-[32px] text-center">
          <Button
            className="bg-dark rounded-full px-6 py-3 text-center text-[14px] font-bold text-white no-underline"
            href="https://kudoswall.org"
          >
            Powered by KudosWall
          </Button>
        </Section>

        <Text className="text-[13px] text-neutral-500 italic">
          If you didn't mean to submit this testimonial, you can ignore this email.
        </Text>
      </Section>
    </BaseLayout>
  );
};

export default SubmissionConfirmationEmail;
