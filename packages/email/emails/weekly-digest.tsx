import { Button, Section, Text, Hr, Row, Column } from "@react-email/components";
import { BaseLayout } from "./components/base-layout";

interface WeeklyDigestEmailProps {
  userName: string;
  newTestimonials: number;
  totalViews: number;
  conversionRate: string;
  topTestimonial?: {
    content: string;
    author: string;
  };
}

export const WeeklyDigestEmail = ({
  userName,
  newTestimonials,
  totalViews,
  conversionRate,
  topTestimonial,
}: WeeklyDigestEmailProps) => {
  return (
    <BaseLayout previewText="Your week on KudosWall: Statistics and highlights 📊">
      <Section>
        <Text className="text-dark mb-6 font-serif text-[18px]">Weekly Digest, {userName}</Text>
        <Text className="text-[14px] leading-[24px] text-neutral-700">
          Here is how your social proof performed over the last 7 days.
        </Text>

        <Section className="my-8">
          <Row>
            <Column className="text-center">
              <Text className="text-dark m-0 text-[24px] font-bold">{newTestimonials}</Text>
              <Text className="m-0 font-mono text-[12px] text-neutral-500 uppercase">NEW</Text>
            </Column>
            <Column className="text-center">
              <Text className="text-dark m-0 text-[24px] font-bold">{totalViews}</Text>
              <Text className="m-0 font-mono text-[12px] text-neutral-500 uppercase">VIEWS</Text>
            </Column>
            <Column className="text-center">
              <Text className="text-dark m-0 text-[24px] font-bold">{conversionRate}</Text>
              <Text className="m-0 font-mono text-[12px] text-neutral-500 uppercase">CONV.</Text>
            </Column>
          </Row>
        </Section>

        {topTestimonial && (
          <Section className="my-8 rounded-2xl border border-solid border-neutral-100 bg-neutral-50 p-6">
            <Text className="text-brand mb-2 font-mono text-[12px] font-bold uppercase">
              HIGHLIGHT OF THE WEEK
            </Text>
            <Text className="text-dark text-[15px] leading-[24px] italic">
              "{topTestimonial.content}"
            </Text>
            <Text className="mt-2 text-[13px] text-neutral-500">— {topTestimonial.author}</Text>
          </Section>
        )}

        <Section className="mb-[32px] text-center">
          <Button
            className="bg-dark rounded-full px-6 py-3 text-center text-[14px] font-bold text-white no-underline"
            href="https://kudoswall.org/dashboard/analytics"
          >
            View full analytics
          </Button>
        </Section>

        <Hr className="my-6 border-neutral-100" />

        <Text className="text-[13px] text-neutral-500 italic">
          Tip: You can use these stats in your next investor update or social media post!
        </Text>
      </Section>
    </BaseLayout>
  );
};

export default WeeklyDigestEmail;
