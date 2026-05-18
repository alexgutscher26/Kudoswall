import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
  Font,
} from "@react-email/components";
interface BaseLayoutProps {
  previewText: string;
  children: React.ReactNode;
}

export const BaseLayout = ({ previewText, children }: BaseLayoutProps) => {
  return (
    <Html>
      <Head>
        <Font fontFamily="Georgia" fallbackFontFamily="serif" fontWeight={400} fontStyle="normal" />
      </Head>
      <Preview>{previewText}</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#e8527a",
                dark: "#171717",
              },
              fontFamily: {
                serif: ["Georgia", "serif"],
                mono: ["monospace"],
              },
            },
          },
        }}
      >
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            {/* Header */}
            <Section className="mt-[32px] mb-[32px]">
              <div className="bg-brand mb-4 h-[4px] w-[40px]" />
              <Heading className="text-dark m-0 p-0 font-serif text-[24px] font-normal">
                KudosWall
              </Heading>
            </Section>

            {children}

            {/* Footer / Signature */}
            <Section className="mt-[32px] border-t border-solid border-[#eaeaea] pt-[32px]">
              <div className="flex items-center gap-4">
                <div>
                  <Text className="text-dark m-0 p-0 text-[14px] font-bold">Alex</Text>
                  <Text className="m-0 p-0 text-[12px] text-neutral-500">Founder, KudosWall</Text>
                </div>
              </div>
              <Text className="mt-8 text-[12px] text-neutral-400">
                If you have any questions, just reply to this email. I'm here to help!
              </Text>
              <Text className="mt-4 text-[10px] text-neutral-400">
                <Link href="{{unsubscribe_url}}" className="text-neutral-400 underline">
                  Unsubscribe
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
