"use client";

import { useEffect, useRef } from "react";

interface WidgetLoaderProps {
  widgetId: string;
}

export default function WidgetLoader({ widgetId }: WidgetLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const timer = setTimeout(() => {
      if (containerRef.current && !containerRef.current.querySelector("script")) {
        const script = document.createElement("script");
        script.src = "/widget.js";
        script.setAttribute("data-id", widgetId);
        script.async = true;
        containerRef.current.appendChild(script);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [widgetId]);

  return <div ref={containerRef} className="min-h-[400px] w-full" />;
}
