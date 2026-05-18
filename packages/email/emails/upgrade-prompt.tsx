import { Button, Section, Text, Hr } from "@react-email/components";
import { BaseLayout } from "./components/base-layout";

interface UpgradePromptEmailProps {
  userName: string;
  type?:
    | "limit-hit"
    | "badge-removal"
    | "testimonial-milestone"
    | "analytics-access"
    | "tag-filtering";
  approvedCount?: number;
}

export const UpgradePromptEmail = ({
  userName,
  type = "limit-hit",
  approvedCount,
}: UpgradePromptEmailProps) => {
  const getContent = () => {
    switch (type) {
      case "badge-removal":
        return {
          title: "Want a cleaner look?",
          description:
            "We noticed you tried to remove the KudosWall badge. It's a great way to make the wall feel like a native part of your site!",
          feature: "Remove 'Powered by KudosWall' badge",
          cta: "Remove Badge with Pro",
        };
      case "testimonial-milestone":
        return {
          title: "10 testimonials and counting!",
          description:
            "Your Wall of Love is growing fast! Now that you have 10 testimonials, have you considered using a custom domain for your collection page?",
          feature: "Custom domain for collection page",
          cta: "Get Custom Domain",
        };
      case "analytics-access":
        return {
          title: "Unlock your insights",
          description:
            "You tried to view your analytics. Want to see which testimonials are converting best and how many people are viewing your wall?",
          feature: "Advanced Analytics Dashboard",
          cta: "Unlock Analytics",
        };
      case "tag-filtering":
        return {
          title: "Organize with Tags",
          description:
            "Nice job adding tags! Did you know you can let your visitors filter testimonials by tag directly in your widget?",
          feature: "Dynamic Tag Filtering in Widgets",
          cta: "Enable Tag Filtering",
        };
      default:
        return {
          title: `Nice work on the momentum, ${userName}!`,
          description: approvedCount
            ? `You've just approved your **${approvedCount}th testimonial**. Your Wall of Love is starting to look incredible!`
            : "Your Wall of Love is starting to look incredible! To keep the momentum going, it's time to unlock the full power of your social proof.",
          feature: "Unlimited testimonials & storage",
          cta: "Upgrade to Pro",
        };
    }
  };

  const content = getContent();

  return (
    <BaseLayout previewText={content.title}>
      <Section>
        <Text className="text-dark mb-6 font-serif text-[24px]">{content.title}</Text>
        <Text className="text-[14px] leading-[24px] text-neutral-700">{content.description}</Text>

        <Section className="border-brand/20 bg-brand/5 my-8 rounded-2xl border border-solid p-6">
          <Text className="text-brand mb-4 font-mono text-[11px] font-bold tracking-wider uppercase">
            PRO BENEFIT HIGHLIGHT
          </Text>
          <Section className="space-y-4">
            <Text className="m-0 flex items-center gap-2 py-1 text-[14px] text-neutral-800">
              <span className="text-brand font-bold">✓</span> {content.feature}
            </Text>
            <Text className="m-0 flex items-center gap-2 py-1 text-[14px] text-neutral-800">
              <span className="text-brand font-bold">✓</span> Unlimited testimonials & storage
            </Text>
            <Text className="m-0 flex items-center gap-2 py-1 text-[14px] text-neutral-800">
              <span className="text-brand font-bold">✓</span> Premium collection widgets
            </Text>
          </Section>
        </Section>

        <Section className="mb-[32px] text-center">
          <Button
            className="bg-dark rounded-full px-8 py-4 text-center text-[14px] font-bold text-white no-underline shadow-lg"
            href="https://kudoswall.org/dashboard/billing"
          >
            {content.cta} — $19/mo
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
