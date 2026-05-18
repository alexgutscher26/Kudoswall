import { Button, Section, Text, Heading } from "@react-email/components";
import { BaseLayout } from "./components/base-layout";

interface TeamInviteEmailProps {
  inviterName: string;
  workspaceName: string;
  inviteLink: string;
}

export const TeamInviteEmail = ({
  inviterName,
  workspaceName,
  inviteLink,
}: TeamInviteEmailProps) => {
  return (
    <BaseLayout previewText={`You've been invited to join ${workspaceName} on KudosWall.`}>
      <Section>
        <Heading className="text-dark mb-6 font-serif text-[20px] font-normal">
          You're invited!
        </Heading>
        <Text className="text-[14px] leading-[24px] text-neutral-700">Hi there,</Text>
        <Text className="text-[14px] leading-[24px] text-neutral-700">
          <strong>{inviterName}</strong> has invited you to join the{" "}
          <strong>{workspaceName}</strong> workspace on KudosWall.
        </Text>
        <Text className="text-[14px] leading-[24px] text-neutral-700">
          KudosWall is the easiest way for teams to capture, manage, and showcase customer love. By
          joining this workspace, you'll be able to help manage testimonials and build a wall of
          love.
        </Text>

        <Section className="mt-[32px] mb-[32px] text-center">
          <Button
            className="bg-dark rounded-full px-8 py-3 text-center text-[14px] font-bold text-white no-underline"
            href={inviteLink}
          >
            Join the workspace
          </Button>
        </Section>

        <Text className="text-[12px] text-neutral-500">
          If you weren't expecting this invitation, you can safely ignore this email. This
          invitation link will expire in 7 days.
        </Text>
      </Section>
    </BaseLayout>
  );
};

export default TeamInviteEmail;
