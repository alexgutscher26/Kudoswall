"use client";

import { Copy } from "lucide-react";
import { gooeyToast as toast } from "goey-toast";

export function CopyButton({ slug, workspaceSlug }: { slug: string; workspaceSlug: string }) {
  const handleCopy = () => {
    const url = `https://kudoswall.org/${workspaceSlug}/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied!");
  };

  return (
    <button
      onClick={handleCopy}
      className="rounded-full p-2 text-neutral-300 transition-all hover:bg-white hover:text-neutral-600 hover:shadow-sm"
      title="Copy link"
    >
      <Copy className="size-4" />
    </button>
  );
}
