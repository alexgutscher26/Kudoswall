"use client";

import { useUpgradeModal } from "@/components/modals/UpgradeModal";

interface UpgradeToastTriggerProps {
  title: string;
  description: string;
  children: React.ReactNode;
  locked?: boolean;
}

export function UpgradeToastTrigger({
  title,
  description,
  children,
  locked,
}: UpgradeToastTriggerProps) {
  const { openUpgradeModal } = useUpgradeModal();

  if (!locked) return <>{children}</>;

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        openUpgradeModal({
          title,
          description,
        });
      }}
      className="contents cursor-pointer"
    >
      {children}
    </div>
  );
}
