"use client";

import { useState } from "react";
import { Copy, Check, Twitter, Linkedin, Sparkles, ExternalLink } from "lucide-react";
import { gooeyToast as toast } from "goey-toast";

interface ShareActionsProps {
  testimonialId: string;
  authorName: string;
  projectName: string;
  collectionSlug?: string | null;
}

export default function ShareActions({
  testimonialId,
  authorName,
  projectName,
  collectionSlug,
}: ShareActionsProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/t/${testimonialId}`;
    }
    return "";
  };

  const handleCopy = () => {
    const url = getShareUrl();
    if (!url) return;

    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Share link copied!", {
      description: url,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTwitterShare = () => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(
      `Check out this amazing testimonial from ${authorName} about ${projectName}! 🚀`,
    );
    window.open(
      `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleLinkedInShare = () => {
    const url = encodeURIComponent(getShareUrl());
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="mt-10 w-full max-w-2xl space-y-6">
      {/* Social and Quick Actions Container */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={handleCopy}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-6 text-[14px] font-bold text-neutral-800 shadow-sm transition-all hover:bg-neutral-50 hover:text-neutral-900 active:scale-[0.98] sm:w-auto dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          {copied ? (
            <>
              <Check className="animate-in zoom-in size-4 text-green-500 duration-200" />
              Copied Share Link!
            </>
          ) : (
            <>
              <Copy className="size-4 text-neutral-400" />
              Copy Share Link
            </>
          )}
        </button>

        <div className="flex w-full items-center gap-3 sm:w-auto">
          <button
            onClick={handleTwitterShare}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-sky-50 px-5 text-[14px] font-bold text-sky-600 transition-all hover:bg-sky-100 active:scale-[0.98] sm:flex-initial dark:bg-sky-950/20 dark:text-sky-400 dark:hover:bg-sky-950/30"
            title="Share on X / Twitter"
          >
            <Twitter className="size-4 fill-current" />
            Share on X
          </button>

          <button
            onClick={handleLinkedInShare}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-50 px-5 text-[14px] font-bold text-blue-600 transition-all hover:bg-blue-100 active:scale-[0.98] sm:flex-initial dark:bg-blue-950/20 dark:text-blue-400 dark:hover:bg-blue-950/30"
            title="Share on LinkedIn"
          >
            <Linkedin className="size-4 fill-current" />
            Share on LinkedIn
          </button>
        </div>
      </div>

      {/* Understated but high-converting viral CTA */}
      <div className="rounded-3xl border border-neutral-100 bg-neutral-50/50 p-6 text-center dark:border-neutral-800/40 dark:bg-neutral-900/30">
        <h5 className="flex items-center justify-center gap-1.5 text-sm font-bold text-neutral-900 dark:text-white">
          <Sparkles className="size-4 fill-pink-500/20 text-pink-500" />
          Collect testimonials like this one
        </h5>
        <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
          KudosWall helps you collect high-fidelity text and video reviews that close deals.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {collectionSlug && (
            <a
              href={`/collect/${collectionSlug}`}
              className="flex items-center gap-1 text-xs font-bold text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            >
              Submit your own review <ExternalLink className="size-3" />
            </a>
          )}
          {collectionSlug && <span className="text-neutral-200 dark:text-neutral-800">|</span>}
          <a
            href="/"
            className="flex items-center gap-1 text-xs font-bold text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300"
          >
            Create your KudoxWall for free
          </a>
        </div>
      </div>
    </div>
  );
}
