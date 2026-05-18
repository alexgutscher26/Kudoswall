import React from "react";
import { cn } from "@my-better-t-app/ui/lib/utils";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 32, showText = false, className, ...props }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        {...props}
      >
        <rect width="32" height="32" rx="10" fill="#e8527a" />
        {/* Vertical Stem */}
        <rect x="9" y="8" width="4" height="16" rx="1.5" fill="white" />
        {/* Upper Diagonal */}
        <path
          d="M14 15.5L20.5 9.5C21.1 8.95 22.05 9 22.6 9.6L22.9 9.95C23.45 10.55 23.4 11.5 22.8 12.05L17 17.5V15.5Z"
          fill="white"
        />
        {/* Lower Diagonal */}
        <path
          d="M14 16.5L21 22.5C21.6 23.05 21.65 24 21.1 24.6L20.75 25C20.2 25.6 19.25 25.65 18.65 25.1L14 21.1V16.5Z"
          fill="white"
        />
      </svg>
      {showText && (
        <span
          className="text-xl font-bold tracking-tight text-neutral-900 select-none"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          KudosWall
        </span>
      )}
    </div>
  );
}
