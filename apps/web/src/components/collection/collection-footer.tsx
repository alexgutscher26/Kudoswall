import { Shield } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";

interface CollectionFooterProps {
  workspaceName: string;
  projectName: string;
  projectSlug: string;
  showPrivacy: boolean;
  privacyText: string;
  privacyUrl?: string;
  hasInternalPrivacy?: boolean;
}

export function CollectionFooter({
  workspaceName,
  projectName,
  projectSlug,
  showPrivacy,
  privacyText,
  privacyUrl,
  hasInternalPrivacy,
}: CollectionFooterProps) {
  return (
    <footer className="mt-12 py-8 text-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
          <span>Powered by</span>
          <a
            href="https://kudoswall.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-900 transition-opacity hover:opacity-70"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            KudosWall
          </a>
        </div>

        {showPrivacy && (
          <div className="flex items-center gap-4">
            {privacyUrl ? (
              <a
                href={privacyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-400 transition-colors hover:text-neutral-600"
              >
                <Shield className="size-3" />
                {privacyText}
              </a>
            ) : hasInternalPrivacy ? (
              <Link
                href={`/collect/${projectSlug}/privacy` as Route}
                className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-400 transition-colors hover:text-neutral-600"
              >
                <Shield className="size-3" />
                {privacyText}
              </Link>
            ) : (
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-400">
                <Shield className="size-3" />
                {privacyText} (Not configured)
              </span>
            )}
            <span className="h-3 w-px bg-neutral-200" />
            <span className="text-[11px] font-medium text-neutral-400">
              © {new Date().getFullYear()} {workspaceName}
            </span>
          </div>
        )}

        {!showPrivacy && (
          <p className="text-[11px] font-medium text-neutral-400">
            © {new Date().getFullYear()} {workspaceName}
          </p>
        )}
      </div>
    </footer>
  );
}
