"use client";

import { gooeyToast as toast } from "goey-toast";

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
  if (!locked) return <>{children}</>;

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toast.error(title, {
          description,
        });
      }}
      className="contents cursor-pointer"
    >
      {children}
    </div>
  );
}
