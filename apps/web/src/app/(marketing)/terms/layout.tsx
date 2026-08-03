import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | KudosWall",
  description:
    "Read the terms and conditions for using KudosWall's testimonial collection and display services.",
  alternates: {
    canonical: "https://kudoswall.org/terms",
  },
  openGraph: {
    title: "Terms of Service | KudosWall",
    description: "Read the terms and conditions for using KudosWall.",
    url: "https://kudoswall.org/terms",
    type: "website",
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
