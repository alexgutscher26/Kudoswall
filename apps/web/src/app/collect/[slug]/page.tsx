import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import Image from "next/image";
import { db } from "@/lib/server-db";
import { project, testimonial } from "@my-better-t-app/db/schema";
import { eq, or } from "drizzle-orm";
import CollectionWizard from "../../[workspaceSlug]/[projectSlug]/collection-wizard";
import { JsonLd } from "@/components/seo/json-ld";
import { CookieConsentBanner } from "@/components/collection/cookie-consent-banner";
import { CollectionFooter } from "@/components/collection/collection-footer";

interface CollectPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    t?: string;
  }>;
}

const BASE_URL = "https://kudoswall.org";

export async function generateMetadata({ params }: CollectPageProps) {
  const { slug } = await params;
  const projectData = await getProjectData(slug);

  if (!projectData) return {};

  const headline = projectData.settings?.pageContent?.headline || "Share your story";
  const subheading =
    projectData.settings?.pageContent?.subheading ||
    `You're leaving a review for ${projectData.name}`;

  const canonicalUrl = `${BASE_URL}/collect/${slug}`;
  const ogImageUrl = `${BASE_URL}/api/og?slug=${slug}`;

  return {
    title: `${headline} | ${projectData.name} on KudosWall`,
    description: subheading,
    icons: {
      icon: projectData.settings?.faviconUrl || "/favicon.ico",
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${headline} | ${projectData.name}`,
      description: subheading,
      url: canonicalUrl,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Leave a testimonial for ${projectData.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${headline} | ${projectData.name}`,
      description: subheading,
      images: [ogImageUrl],
    },
  };
}

const DEFAULT_SETTINGS = {
  accentColor: "#e8527a",
  backgroundColor: "#fafafa",
  fontFamily: "sans",
  form: {
    fields: {
      fullName: { enabled: true, required: true, label: "Full Name", placeholder: "Jane Doe" },
      email: { enabled: true, required: false, label: "Email", placeholder: "jane@example.com" },
      company: { enabled: true, required: false, label: "Company", placeholder: "Acme Inc." },
      jobTitle: { enabled: true, required: false, label: "Job Title", placeholder: "CEO" },
      linkedin: {
        enabled: false,
        required: false,
        label: "LinkedIn Profile",
        placeholder: "https://linkedin.com/in/jane",
      },
    },
    starRating: { enabled: true },
    minCharCount: 50,
  },
  pageContent: {
    headline: "Share your experience",
    subheading: "We value your feedback and want to know how we did.",
    showTestimonialCount: false,
    thankYou: {
      headline: "You're awesome!",
      body: "Your feedback has been sent. It helps us more than you know.",
      cta: { enabled: false, text: "", url: "" },
    },
  },
  video: {
    enabled: false,
    prompt: "Tell us about your experience",
    maxLength: 30,
  },
  compliance: {
    cookieConsent: {
      enabled: false,
      message: "We use cookies to ensure you get the best experience on our website.",
      buttonText: "Got it!",
    },
    showFooterPrivacy: true,
    footerPrivacyText: "Privacy Policy",
  },
  background: {
    type: "color",
    imageOpacity: 1,
    imageBlur: 0,
    isAnimated: false,
  },
};

export const revalidate = 600; // Cache for 10 minutes, then SWR

const getProjectByCollectionSlug = unstable_cache(
  async (slug: string) => {
    const result = await db.query.project.findFirst({
      where: or(eq(project.collectionSlug, slug), eq(project.slug, slug)),
      with: {
        workspace: {
          with: { organization: true },
        },
        testimonials: {
          where: eq(testimonial.status, "approved"),
        },
      },
    });

    if (!result) return null;

    const parsed = result.collectionSettingsJson ? JSON.parse(result.collectionSettingsJson) : {};

    // Deep merge basics for consistency
    const settings = {
      ...DEFAULT_SETTINGS,
      ...parsed,
      form: {
        ...DEFAULT_SETTINGS.form,
        ...(parsed.form || {}),
        fields: {
          ...DEFAULT_SETTINGS.form.fields,
          ...(parsed.form?.fields || {}),
        },
      },
      pageContent: {
        ...DEFAULT_SETTINGS.pageContent,
        ...(parsed.pageContent || {}),
      },
      compliance: {
        ...DEFAULT_SETTINGS.compliance,
        ...(parsed.compliance || {}),
        cookieConsent: {
          ...DEFAULT_SETTINGS.compliance.cookieConsent,
          ...(parsed.compliance?.cookieConsent || {}),
        },
      },
      background: {
        ...DEFAULT_SETTINGS.background,
        ...(parsed.background || {}),
      },
    };

    // Enhance with branding logic and permissions
    const effectivePlan = result.workspace.organization?.plan || result.workspace.plan;
    const isPro = effectivePlan !== "free" && effectivePlan !== null;
    const isAgency = effectivePlan === "plan_2" || effectivePlan === "ltd";

    const { getWorkspacePermissions } = await import("@my-better-t-app/api/logic/billing");
    const permissions = getWorkspacePermissions({
      plan: effectivePlan,
      organization: result.workspace.organization,
      testimonialsCount: result.testimonials.length,
    });

    return {
      ...result,
      settings,
      permissions,
      workspace: {
        ...result.workspace,
        isPro,
        isAgency,
        branding: result.workspace.brandingJson
          ? JSON.parse(result.workspace.brandingJson)
          : {
              accentColor: "#e8527a",
              font: "sans",
              logoUrl: result.workspace.logoUrl,
            },
      },
    };
  },
  ["collection-project"],
  { revalidate: 600, tags: ["collection"] },
);

async function getProjectData(slug: string) {
  return getProjectByCollectionSlug(slug);
}

export default async function CollectPage({ params, searchParams }: CollectPageProps) {
  const { slug } = await params;
  const { t } = await searchParams;
  const projectData = await getProjectData(slug);

  if (!projectData) {
    notFound();
  }

  const settings = projectData.settings;
  const accentColor =
    settings?.accentColor || projectData.workspace?.branding.accentColor || "#e8527a";
  const backgroundColor = settings?.backgroundColor || "#fafafa";
  const logoUrl = settings?.logoUrl || projectData.workspace?.branding.logoUrl;
  const headline = settings?.pageContent?.headline || "Share your story";
  const subheading =
    settings?.pageContent?.subheading || `You're leaving a review for ${projectData.name}`;

  // Dark mode: only auto-apply when the project owner has not set a custom background
  const hasExplicitBg = Boolean(settings?.backgroundColor);

  // SEO: Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: projectData.name,
    description: projectData.description || subheading,
    image: projectData.workspace.logoUrl || logoUrl,
    brand: {
      "@type": "Brand",
      name: projectData.workspace.name,
    },
    aggregateRating:
      projectData.testimonials.length > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: (
              projectData.testimonials.reduce((acc, current) => acc + (current.rating || 5), 0) /
              projectData.testimonials.length
            ).toFixed(1),
            reviewCount: projectData.testimonials.length,
            bestRating: "5",
            worstRating: "1",
          }
        : undefined,
    review: projectData.testimonials.map((t) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: t.authorName || "Anonymous",
      },
      datePublished: t.createdAt.toISOString(),
      reviewBody: t.content || "",
      reviewRating: {
        "@type": "Rating",
        ratingValue: t.rating || 5,
        bestRating: "5",
        worstRating: "1",
      },
      publisher: {
        "@type": "Organization",
        name: projectData.workspace.name,
      },
    })),
  };

  // Also provide an ItemList for the page itself
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: projectData.testimonials.length,
    itemListElement: projectData.testimonials.map((t, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: t.authorName || "Anonymous",
        },
        datePublished: t.createdAt.toISOString(),
        reviewBody: t.content || "",
        reviewRating: {
          "@type": "Rating",
          ratingValue: t.rating || 5,
        },
      },
    })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={itemListJsonLd} />
      {projectData.customCss && (
        <style dangerouslySetInnerHTML={{ __html: projectData.customCss }} />
      )}
      {settings?.fontFamily === "custom" && settings.customFontUrl && (
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @font-face {
                font-family: 'CustomFont';
                src: url('${settings.customFontUrl}') format('woff2');
                font-weight: 300 900;
                font-style: normal;
                font-display: swap;
              }
            `,
          }}
        />
      )}
      {settings?.fontFamily &&
        !["sans", "serif", "mono", "custom"].includes(settings.fontFamily) && (
          <style
            dangerouslySetInnerHTML={{
              __html: `@import url('https://fonts.googleapis.com/css2?family=${settings.fontFamily.replace(/\s+/g, "+")}:wght@300;400;500;600;700;800;900&display=swap');`,
            }}
          />
        )}
      {settings?.background?.type === "gradient" && settings.background.isAnimated && (
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @keyframes gradient-shift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
              .animate-gradient {
                background-size: 400% 400% !important;
                animation: gradient-shift 15s ease infinite !important;
              }
            `,
          }}
        />
      )}
      <main
        className={`collect-main relative flex min-h-screen items-center justify-center overflow-hidden px-4 transition-colors duration-300 sm:px-6 ${
          settings?.background?.type === "gradient" && settings.background.isAnimated
            ? "animate-gradient"
            : ""
        }`}
        style={{
          backgroundColor: settings?.background?.type === "color" ? backgroundColor : undefined,
          backgroundImage:
            settings?.background?.type === "gradient" ? settings.background.gradient : undefined,
          fontFamily:
            settings?.fontFamily === "custom" && settings.customFontUrl
              ? "'CustomFont', sans-serif"
              : settings?.fontFamily && !["sans", "serif", "mono"].includes(settings.fontFamily)
                ? `"${settings.fontFamily}", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`
                : settings?.fontFamily === "mono"
                  ? "monospace"
                  : settings?.fontFamily === "serif"
                    ? "serif"
                    : "var(--font-sans), sans-serif",
        }}
      >
        {settings?.background?.type === "image" && settings.background.imageUrl && (
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${settings.background.imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: settings.background.imageOpacity ?? 1,
              filter: `blur(${settings.background.imageBlur ?? 0}px)`,
            }}
          />
        )}
        {/* Background patterns - Only show if not using a custom image or gradient */}
        {!settings?.background || settings.background.type === "color" ? (
          <div className="absolute inset-0 z-0">
            <div
              className="absolute -top-[10%] -right-[5%] size-[600px] animate-pulse rounded-full blur-[120px]"
              style={{ backgroundColor: `${accentColor}10` }}
            />
            <div className="absolute -bottom-[10%] -left-[5%] size-[700px] rounded-full bg-indigo-500/5 blur-[150px]" />
            <div className="absolute top-1/4 left-1/3 size-[500px] rounded-full bg-blue-500/3 blur-[130px]" />
            {/* Dot pattern: bg moved to inline style so CSS @media can override it */}
            <div
              className="collect-dot absolute inset-0 mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] bg-size-[32px_32px] opacity-40"
              style={{ backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)" }}
            />
          </div>
        ) : null}

        <div className="z-10 mx-auto w-full max-w-4xl origin-center scale-95 lg:scale-100">
          <div className="mb-6 space-y-4 text-center">
            {logoUrl && (
              <div className="group relative inline-block">
                <div
                  className="absolute -inset-2 rounded-[24px] opacity-20 blur-xl transition-opacity group-hover:opacity-40"
                  style={{ backgroundColor: accentColor }}
                />
                <Image
                  src={logoUrl as string}
                  alt={projectData.workspace.name}
                  width={56}
                  height={56}
                  priority
                  className="relative mx-auto size-14 rounded-[18px] border border-neutral-100 bg-white object-cover p-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                />
              </div>
            )}
            <div className="space-y-1">
              <h1 className="collect-heading text-3xl leading-tight font-black tracking-tighter text-neutral-900 transition-colors duration-300 sm:text-5xl">
                {headline}
              </h1>
              <p className="collect-subheading mx-auto max-w-xl text-lg font-medium text-neutral-500 transition-colors duration-300">
                {subheading}
              </p>
            </div>
          </div>

          <CollectionWizard
            project={projectData as any}
            initialType={t === "v" ? "video" : t === "t" ? "text" : null}
          />

          <CollectionFooter
            workspaceName={projectData.workspace.name}
            projectName={projectData.name}
            projectSlug={slug}
            showPrivacy={settings?.compliance?.showFooterPrivacy ?? true}
            privacyText={settings?.compliance?.footerPrivacyText || "Privacy Policy"}
            privacyUrl={settings?.privacyPolicyUrl}
            hasInternalPrivacy={!!settings?.compliance?.privacyPolicyContent}
            isPro={projectData.workspace.isPro}
          />
        </div>
      </main>

      <CookieConsentBanner
        enabled={true}
        message={
          settings?.compliance?.cookieConsent?.message ||
          "We use cookies to ensure you get the best experience on our website."
        }
        buttonText={settings?.compliance?.cookieConsent?.buttonText || "Got it!"}
        accentColor={accentColor}
      />
    </>
  );
}
