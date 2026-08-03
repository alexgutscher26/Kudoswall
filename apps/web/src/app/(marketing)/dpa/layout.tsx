import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Processing Agreement | KudosWall",
  description:
    "KudosWall's Data Processing Agreement (DPA) ensures GDPR and CCPA compliance for enterprise customers.",
  alternates: {
    canonical: "https://kudoswall.org/dpa",
  },
  openGraph: {
    title: "Data Processing Agreement | KudosWall",
    description: "KudosWall's DPA ensures GDPR and CCPA compliance.",
    url: "https://kudoswall.org/dpa",
    type: "website",
  },
};

export default function DPALayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
