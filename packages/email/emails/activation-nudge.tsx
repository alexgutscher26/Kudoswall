import { Button, Section, Text, Img } from "@react-email/components";
import { BaseLayout } from "./components/base-layout";

interface ActivationNudgeEmailProps {
  userName: string;
}

export const ActivationNudgeEmail = ({ userName }: ActivationNudgeEmailProps) => {
  return (
    <BaseLayout previewText="Don't leave your social proof on the table 📈">
      <Section>
        <Text className="text-dark mb-6 font-serif text-[18px]">Still there, {userName}?</Text>
        <Text className="text-[14px] leading-[24px] text-neutral-700">
          I noticed you signed up for KudosWall yesterday but haven't created your first collection
          link yet.
        </Text>

        <Text className="mt-4 text-[14px] leading-[24px] text-neutral-700">
          Every day you wait is a day of customer praise that isn't being captured and turned into
          revenue. It takes less than 60 seconds to get your link live.
        </Text>

        <Section className="my-8 rounded-2xl border border-solid border-neutral-100 bg-neutral-50 p-6 text-center">
          <Text className="text-brand mb-4 font-mono text-[12px] font-bold uppercase">
            WHAT YOU'RE BUILDING
          </Text>
          <Img
            src="https://kudoswall.org/images/empty-state-preview.png"
            width="300"
            alt="Wall of Love Preview"
            className="mx-auto rounded-lg shadow-sm"
          />
          <Text className="mt-4 text-[13px] text-neutral-500 italic">
            "We added KudosWall and saw a 14% lift in signup conversion in the first week."
          </Text>
        </Section>

        <Section className="mb-[32px] text-center">
          <Button
            className="bg-dark rounded-full px-6 py-3 text-center text-[14px] font-bold text-white no-underline"
            href="https://kudoswall.org/dashboard"
          >
            Create my collection link
          </Button>
        </Section>

        <Text className="text-[13px] text-neutral-500 italic">
          Alex here — if you're stuck on anything, just reply to this email and I'll jump in to
          help.
        </Text>
      </Section>
    </BaseLayout>
  );
};

export default ActivationNudgeEmail;
