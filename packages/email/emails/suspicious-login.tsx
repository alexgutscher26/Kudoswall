import { Button, Section, Text, Hr } from "@react-email/components";
import { BaseLayout } from "./components/base-layout";

interface SuspiciousLoginEmailProps {
  userName: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
  time: string;
}

export const SuspiciousLoginEmail = ({
  userName,
  ipAddress,
  userAgent,
  location = "Unknown Location",
  time,
}: SuspiciousLoginEmailProps) => {
  return (
    <BaseLayout previewText="New login detected on your KudosWall account.">
      <Section>
        <Text className="text-dark mb-6 font-serif text-[18px]">Hi {userName},</Text>
        <Text className="text-[14px] leading-[24px] text-neutral-700">
          We detected a new login to your KudosWall account from a device or location we haven't seen before.
        </Text>

        <Section className="my-8 rounded-lg border border-solid border-neutral-200 p-6 bg-neutral-50">
          <Text className="m-0 text-[14px] font-bold text-neutral-900">Login Details:</Text>
          <Hr className="my-3 border-neutral-200" />
          
          <div className="space-y-2">
            <Text className="m-0 text-[13px] text-neutral-600">
              <span className="font-semibold text-neutral-800">Time:</span> {time}
            </Text>
            <Text className="m-0 text-[13px] text-neutral-600">
              <span className="font-semibold text-neutral-800">Location:</span> {location}
            </Text>
            <Text className="m-0 text-[13px] text-neutral-600">
              <span className="font-semibold text-neutral-800">IP Address:</span> {ipAddress}
            </Text>
            <Text className="m-0 text-[13px] text-neutral-600">
              <span className="font-semibold text-neutral-800">Device:</span> {userAgent}
            </Text>
          </div>
        </Section>

        <Text className="text-[14px] leading-[24px] text-neutral-700">
          If this was you, you can safely ignore this email. No further action is required.
        </Text>

        <Text className="text-[14px] leading-[24px] text-neutral-700 mt-4">
          <span className="font-bold">If this wasn't you</span>, your account may be compromised. Please click the button below to secure your account by resetting your password and signing out of all active sessions.
        </Text>

        <Section className="mt-[32px] mb-[32px] text-center">
          <Button
            className="bg-neutral-900 rounded-full px-6 py-3 text-center text-[14px] font-bold text-white no-underline"
            href="https://kudoswall.org/dashboard/settings/security"
          >
            Secure My Account
          </Button>
        </Section>

        <Text className="text-[12px] text-neutral-500 italic">
          This is an automated security alert from KudosWall. For your protection, we send these whenever a new login is detected.
        </Text>
      </Section>
    </BaseLayout>
  );
};

export default SuspiciousLoginEmail;
