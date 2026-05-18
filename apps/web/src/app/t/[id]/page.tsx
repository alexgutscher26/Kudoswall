import { db } from "@/lib/server-db";
import { testimonial as testimonialTable } from "@my-better-t-app/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, Quote, ArrowLeft, ShieldCheck, Heart, Linkedin } from "lucide-react";
import VideoPlayer from "@/components/video-player";
import ShareActions from "./share-actions";
import { generateSignedUrl } from "@/lib/signed-url";
import { getEnvAsync } from "@my-better-t-app/env/server";

interface PageProps {
  params: Promise<{ id: string }>;
}

function getInitialsColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360);
  return `hsl(${h}, 65%, 43%)`;
}

function getInitials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export default async function TestimonialSharePage({ params }: PageProps) {
  const { id } = await params;

  // Fetch approved testimonial along with project & workspace details
  const testimonial = await db.query.testimonial.findFirst({
    where: and(
      eq(testimonialTable.id, id),
      isNull(testimonialTable.deletedAt),
      eq(testimonialTable.status, "approved"),
    ),
    with: {
      project: {
        with: {
          workspace: {
            with: {
              organization: true,
            },
          },
        },
      },
      testimonialToTags: {
        with: {
          tag: true,
        },
      },
    },
  });

  if (!testimonial) {
    notFound();
  }

  const { project } = testimonial;

  // Verify plan features (Single Testimonial Sharing is only available on Agency / LTD plans)
  const { getWorkspacePermissions } = await import("@my-better-t-app/api/logic/billing");
  const permissions = getWorkspacePermissions({
    plan: project?.workspace?.plan || null,
    organization: project?.workspace?.organization || null,
  });

  if (!permissions.features.singleTestimonialShare) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-neutral-950 px-4 py-12 text-white">
        {/* Background Gradients and Glowing Blooms */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-950/20 via-neutral-950 to-neutral-950" />
        <div className="absolute top-1/4 left-1/2 -z-10 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/10 blur-[120px]" />

        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_100%)] bg-[size:24px_24px]" />

        <div className="animate-in fade-in zoom-in-95 w-full max-w-md duration-500">
          <div className="relative overflow-hidden rounded-[32px] border border-white/5 bg-neutral-900/60 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-10">
            {/* Premium ambient glow inside the card */}
            <div className="absolute -top-12 -left-12 size-32 rounded-full bg-pink-500/10 blur-2xl" />

            {/* Locked Icon Badge with Glassmorphism */}
            <div className="mx-auto mb-8 flex size-20 items-center justify-center rounded-[24px] border border-white/10 bg-neutral-800/80 shadow-lg ring-1 ring-white/5">
              <div className="relative">
                <Star className="size-8 animate-pulse fill-pink-500 text-pink-500" />
                <div className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full bg-pink-600 ring-2 ring-neutral-900">
                  <span className="text-[10px] font-black tracking-widest text-white uppercase">
                    ★
                  </span>
                </div>
              </div>
            </div>

            <div className="relative space-y-4">
              <span className="inline-flex items-center rounded-full bg-pink-500/10 px-3.5 py-1 text-[11px] font-bold tracking-widest text-pink-400 uppercase ring-1 ring-pink-500/20">
                Premium Feature
              </span>
              <h1 className="text-2xl leading-tight font-black tracking-tight text-white sm:text-3xl">
                Single Share Link Locked
              </h1>
              <p className="text-[14px] leading-relaxed font-medium text-neutral-400">
                Public single-testimonial share links are exclusive to workspaces on the{" "}
                <span className="font-bold text-neutral-200">Agency</span> or{" "}
                <span className="font-bold text-neutral-200">Lifetime</span> plans.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <Link
                href="/"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-tr from-pink-500 to-rose-600 py-3.5 text-[14px] font-bold text-white shadow-lg shadow-pink-500/25 transition-all hover:opacity-90 active:scale-[0.98]"
              >
                Upgrade Plan
              </Link>
              <Link
                href="/"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-neutral-800 py-3.5 text-[14px] font-bold text-neutral-300 transition-all hover:bg-neutral-700 hover:text-white active:scale-[0.98]"
              >
                Go Back Home
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Credit */}
        <footer className="mt-12 text-[11px] font-medium tracking-widest text-neutral-600 uppercase">
          Powered by{" "}
          <Link href="/" className="font-bold text-neutral-500 hover:text-pink-500">
            KudosWall
          </Link>
        </footer>
      </div>
    );
  }
  const authorName = testimonial.authorName || "Anonymous";
  const authorInitials = getInitials(authorName);
  const initialsBg = getInitialsColor(authorName);

  // Securely sign the video URL if this is a video review hosted in R2
  let signedVideoUrl = testimonial.videoUrl || "";
  const env = await getEnvAsync();
  const secret = env.R2_SIGNING_SECRET;

  if (testimonial.type === "video" && testimonial.videoUrl && secret) {
    if (testimonial.videoUrl.startsWith("/api/videos/")) {
      const key = testimonial.videoUrl.replace(/^\/api\/videos\//, "");
      try {
        signedVideoUrl = await generateSignedUrl(decodeURIComponent(key), secret, 3600);
      } catch (e) {
        console.error("Failed to sign video URL path:", e);
      }
    }
  }

  // Pre-compile JSON-LD schema for search engines (SEO)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "Organization",
      name: project?.name || "KudosWall",
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: testimonial.rating?.toString() || "5",
      bestRating: "5",
    },
    author: {
      "@type": "Person",
      name: authorName,
      image: testimonial.authorImage || undefined,
    },
    reviewBody: testimonial.content || "",
    datePublished: testimonial.createdAt.toISOString(),
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fafafa] text-neutral-900 transition-colors duration-300 dark:bg-neutral-950 dark:text-neutral-50">
      {/* Background Gradients and Glowing Blooms */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-50/40 via-white to-white dark:from-pink-950/10 dark:via-neutral-950 dark:to-neutral-950" />
      <div className="absolute top-0 left-1/4 -z-10 size-[500px] -translate-x-1/2 rounded-full bg-pink-400/5 blur-[120px] dark:bg-pink-500/5" />
      <div className="absolute right-1/4 bottom-10 -z-10 size-[500px] translate-x-1/2 rounded-full bg-amber-400/5 blur-[120px] dark:bg-amber-500/5" />

      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_100%)] bg-[size:24px_24px]" />

      {/* SEO Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-12 sm:px-6 lg:py-20">
        {/* Navigation & Header */}
        <header className="mb-12 flex w-full max-w-2xl items-center justify-between">
          {project?.collectionSlug ? (
            <Link
              href={`/collect/${project.collectionSlug}`}
              className="group flex items-center gap-2 text-xs font-bold tracking-wider text-neutral-400 uppercase transition-all hover:text-neutral-900 dark:hover:text-white"
            >
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
              Back to Collection
            </Link>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 to-rose-600 shadow-md shadow-pink-500/20">
              <Heart className="size-3.5 fill-white text-white" />
            </div>
            <span className="text-xs font-black tracking-widest text-neutral-800 uppercase dark:text-white">
              Kudos<span className="text-pink-500">Wall</span>
            </span>
          </div>
        </header>

        {/* Main Testimonial Showcase Card */}
        <main className="w-full max-w-2xl">
          <article
            id="testimonial-card-main"
            className="animate-in fade-in slide-in-from-bottom-8 relative overflow-hidden rounded-[32px] border border-neutral-100 bg-white p-8 shadow-[0_24px_70px_rgba(0,0,0,0.04)] duration-700 sm:p-12 dark:border-neutral-800/40 dark:bg-neutral-900/60 dark:shadow-[0_24px_70px_rgba(0,0,0,0.3)]"
            style={{ backdropFilter: "blur(20px)" }}
          >
            {/* Ambient inner card glow */}
            <div className="absolute top-0 right-0 size-24 rounded-full bg-pink-500/10 blur-3xl" />

            <div className="relative space-y-8">
              {/* Star Rating & Verification Flag */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className="relative">
                      <Star className="size-5 fill-neutral-100 text-neutral-100 dark:fill-neutral-800 dark:text-neutral-800" />
                      {(testimonial.rating ?? 0) >= s - 0.5 && (testimonial.rating ?? 0) < s && (
                        <div className="absolute inset-0 z-10 w-1/2 overflow-hidden">
                          <Star className="size-5 fill-amber-400 text-amber-400" />
                        </div>
                      )}
                      {(testimonial.rating ?? 0) >= s && (
                        <div className="absolute inset-0 z-10 overflow-hidden">
                          <Star className="size-5 fill-amber-400 text-amber-400" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 rounded-full border border-green-100/50 bg-green-50/50 px-3.5 py-1.5 text-xs font-bold tracking-wide text-green-700 dark:border-green-950/30 dark:bg-green-950/20 dark:text-green-400">
                  <ShieldCheck className="size-4 text-green-500 dark:text-green-400" />
                  KudosWall Verified Review
                </div>
              </div>

              {/* Text content or Custom Video player */}
              {testimonial.type === "video" && signedVideoUrl ? (
                <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5">
                  <VideoPlayer url={signedVideoUrl} className="aspect-video" />
                </div>
              ) : null}

              {testimonial.content ? (
                <div className="relative">
                  <Quote className="absolute -top-3 -left-2 size-12 rotate-180 text-neutral-900 opacity-[0.03] dark:text-white" />
                  <blockquote className="font-serif text-xl leading-relaxed tracking-wide text-neutral-800 italic sm:text-2xl sm:leading-loose dark:text-neutral-100">
                    “{testimonial.content}”
                  </blockquote>
                </div>
              ) : null}

              {/* Tag Badges if present */}
              {testimonial.testimonialToTags && testimonial.testimonialToTags.length > 0 && (
                <div className="flex flex-wrap gap-2 border-t border-neutral-50 pt-2 dark:border-neutral-800/40">
                  {testimonial.testimonialToTags.map(({ tag }) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold tracking-wider uppercase"
                      style={{
                        backgroundColor: `${tag.color}18`,
                        color: tag.color,
                        border: `1px solid ${tag.color}25`,
                      }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Author Biography Footer */}
              <div className="flex items-center justify-between gap-6 border-t border-neutral-100 pt-6 dark:border-neutral-800/40">
                <div className="flex items-center gap-4">
                  {testimonial.authorImage ? (
                    <div className="relative size-14 overflow-hidden rounded-full ring-2 ring-pink-500/10 dark:ring-pink-500/20">
                      <Image
                        src={testimonial.authorImage}
                        alt={authorName}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                  ) : (
                    <div
                      className="flex size-14 items-center justify-center rounded-full text-lg font-bold text-white shadow-inner"
                      style={{ backgroundColor: initialsBg }}
                    >
                      {authorInitials}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h4 className="truncate text-base font-bold text-neutral-900 dark:text-white">
                      {authorName}
                    </h4>
                    <p className="truncate text-xs text-neutral-400 dark:text-neutral-500">
                      {testimonial.authorTagline || "Customer"}
                      {testimonial.authorCompany && (
                        <span>
                          {" "}
                          at{" "}
                          <span className="font-semibold text-neutral-500 dark:text-neutral-400">
                            {testimonial.authorCompany}
                          </span>
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {testimonial.authorLinkedin && (
                    <a
                      href={testimonial.authorLinkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex size-10 items-center justify-center rounded-full bg-neutral-50 text-neutral-400 transition-all hover:bg-neutral-100 hover:text-[#0077b5] dark:bg-neutral-900 dark:hover:bg-neutral-800"
                      title={`${authorName}'s LinkedIn Profile`}
                    >
                      <Linkedin className="size-4 fill-current" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </article>

          {/* Social shares and Clipboard Quick Copy Actions */}
          <ShareActions
            testimonialId={testimonial.id}
            authorName={authorName}
            projectName={project?.name || "KudosWall"}
            collectionSlug={project?.collectionSlug}
          />
        </main>

        {/* Footer Credit & Badging */}
        <footer className="mt-16 text-center text-[11px] font-medium tracking-widest text-neutral-400 uppercase dark:text-neutral-600">
          Powered by{" "}
          <Link
            href="/"
            className="font-bold text-neutral-500 hover:text-pink-500 dark:text-neutral-400"
          >
            KudosWall
          </Link>
        </footer>
      </div>
    </div>
  );
}
