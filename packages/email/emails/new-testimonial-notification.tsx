import { Button, Section, Text, Hr } from "@react-email/components";
import * as React from "react";
import { BaseLayout } from "./components/base-layout";

interface NewTestimonialNotificationEmailProps {
  workspaceName: string;
  projectName: string;
  authorName: string;
  content: string;
  rating: number;
}

export const NewTestimonialNotificationEmail = ({
  workspaceName,
  projectName,
  authorName,
  content,
  rating,
}: NewTestimonialNotificationEmailProps) => {
  return (
    <BaseLayout previewText={`New testimonial for ${projectName}!`}>
      <Section>
        <Text className="text-dark mb-6 font-serif text-[18px]">
          Great news for {workspaceName}!
        </Text>
        <Text className="text-[14px] leading-[24px] text-neutral-700">
          {authorName} just submitted a {rating}-star testimonial for the project "{projectName}".
        </Text>

        <Section className="my-8 rounded-2xl border border-solid border-neutral-100 bg-neutral-50 p-6">
          <Text className="text-brand mb-2 font-mono text-[12px] font-bold uppercase">
            TESTIMONIAL CONTENT
          </Text>
          <Text className="text-dark text-[15px] leading-[24px] italic">"{content}"</Text>
          <div className="mt-4 flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < rating ? "text-amber-400" : "text-neutral-200"}>
                ★
              </span>
            ))}
          </div>
        </Section>

        <Section className="mb-[32px] text-center">
          <Button
            className="bg-dark rounded-full px-6 py-3 text-center text-[14px] font-bold text-white no-underline"
            href="https://kudoswall.org/dashboard"
          >
            Review it in dashboard
          </Button>
        </Section>
      </Section>
    </BaseLayout>
  );
};

export default NewTestimonialNotificationEmail;
