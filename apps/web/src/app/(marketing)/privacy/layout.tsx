import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | KudosWall",
  description:
    "Learn how KudosWall collects, uses, and protects your data. Your privacy matters to us.",
  alternates: {
    canonical: "https://kudoswall.org/privacy",
  },
  openGraph: {
    title: "Privacy Policy | KudosWall",
    description: "Learn how KudosWall collects, uses, and protects your data.",
    url: "https://kudoswall.org/privacy",
    type: "website",
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
