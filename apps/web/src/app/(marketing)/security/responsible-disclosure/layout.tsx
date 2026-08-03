import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Responsible Disclosure Policy | KudosWall",
  description:
    "KudosWall's responsible disclosure policy for security researchers. Report vulnerabilities safely.",
  alternates: {
    canonical: "https://kudoswall.org/security/responsible-disclosure",
  },
  openGraph: {
    title: "Responsible Disclosure Policy | KudosWall",
    description: "Report security vulnerabilities safely to KudosWall.",
    url: "https://kudoswall.org/security/responsible-disclosure",
    type: "website",
  },
};

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
