"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Play, Loader2 } from "lucide-react";

interface VideoPlayerProps {
  url: string;
  thumbnail?: string;
  accentColor?: string;
  className?: string;
}

export default function VideoPlayer({
  url,
  thumbnail,
  accentColor = "#e8527a",
  className = "",
}: VideoPlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <div
      ref={containerRef}
      className={`relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-100 ring-1 ring-black/5 transition-all duration-500 ${className}`}
      style={{ backgroundColor: `${accentColor}11` }}
    >
      {!isPlaying ? (
        <div className="group relative size-full cursor-pointer" onClick={handlePlay}>
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt="Video thumbnail"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <div
                className="size-16 rounded-full opacity-10"
                style={{ backgroundColor: accentColor }}
              />
            </div>
          )}

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/20">
            <div
              className="flex size-14 items-center justify-center rounded-full text-white shadow-2xl transition-all duration-300 group-hover:scale-110 active:scale-95"
              style={{ backgroundColor: accentColor }}
            >
              <Play className="ml-1 size-6 fill-current" />
            </div>
          </div>

          {/* Video Badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">
            <div className="size-1.5 animate-pulse rounded-full bg-red-500" />
            VIDEO
          </div>
        </div>
      ) : (
        <>
          {isInView ? (
            <video
              src={url}
              controls
              autoPlay
              className="size-full object-cover"
              onLoadedData={() => setIsLoaded(true)}
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <Loader2 className="size-8 animate-spin text-neutral-300" />
            </div>
          )}
          {!isLoaded && isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
              <Loader2 className="size-8 animate-spin text-neutral-300" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
