import { Button, Section, Text, Hr } from "@react-email/components";
import { BaseLayout } from "./components/base-layout";

interface FirstTestimonialEmailProps {
  userName: string;
  authorName: string;
  content: string;
  rating: number;
}

export const FirstTestimonialEmail = ({
  userName,
  authorName,
  content,
  rating,
}: FirstTestimonialEmailProps) => {
  return (
    <BaseLayout previewText="Your first testimonial just came in 👀">
      <Section>
        <Text className="text-dark mb-6 font-serif text-[18px]">Amazing news, {userName}!</Text>
        <Text className="text-[14px] leading-[24px] text-neutral-700">
          {authorName} just submitted a {rating}-star testimonial for you. This is a huge milestone!
        </Text>

        <Section className="my-8 rounded-2xl border border-solid border-neutral-100 bg-neutral-50 p-6">
          <Text className="text-brand mb-2 font-mono text-[12px] font-bold uppercase">PREVIEW</Text>
          <Text className="text-dark text-[15px] leading-[24px] italic">"{content}"</Text>
          <div className="mt-4 flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < rating ? "text-amber-400" : "text-neutral-200"}>
                ★
              </span>
            ))}
          </div>
        </Section>

        <Text className="mb-8 text-[14px] leading-[24px] text-neutral-700">
          Now it's time to show it off to the world. You can embed this testimonial (and your future
          ones) on your landing page in less than 60 seconds.
        </Text>

        <Section className="mb-[32px] text-center">
          <Button
            className="bg-dark rounded-full px-6 py-3 text-center text-[14px] font-bold text-white no-underline"
            href="https://kudoswall.org/dashboard/embed"
          >
            Now embed it on your page
          </Button>
        </Section>

        <Hr className="my-6 border-neutral-100" />

        <Text className="text-dark mb-2 text-[14px] font-bold">How to embed:</Text>
        <Text className="text-[13px] leading-[20px] text-neutral-500">
          1. Go to the "Embed Widget" tab in your dashboard.
          <br />
          2. Customize your widget's look.
          <br />
          3. Copy the single-line script tag and paste it before your body tag ends.
        </Text>
      </Section>
    </BaseLayout>
  );
};

export default FirstTestimonialEmail;
