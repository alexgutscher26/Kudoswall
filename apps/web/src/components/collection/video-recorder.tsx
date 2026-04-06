"use client";

import { useState, useRef, useEffect } from "react";
import { RotateCcw, Lock, Sparkles } from "lucide-react";

interface VideoRecorderProps {
  isPro: boolean;
  onConfirm: (blob: Blob) => void;
  accentColor?: string;
  maxLength?: number;
  prompt?: string;
}

export default function VideoRecorder({
  isPro,
  onConfirm,
  accentColor = "#e8527a",
  maxLength = 60,
  prompt,
}: VideoRecorderProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recording, setRecording] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(maxLength);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Initialize Stream
  const initStream = async () => {
    try {
      const constraints: MediaStreamConstraints = {
        video: isMobile
          ? { facingMode: "user", height: { ideal: 1080 }, width: { ideal: 1920 } }
          : { width: 1280, height: 720, facingMode: "user" },
        audio: true,
      };
      const s = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    } catch (err) {
      setError("Camera & Microphone access is required to record video.");
    }
  };

  useEffect(() => {
    if (isPro && !recordedBlob) {
      initStream();
    }
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [isPro, recordedBlob]);

  // 2. Handle Countdown
  const startRecordingFlow = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          startRecording();
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  // 3. Start/Stop Recording
  const startRecording = () => {
    if (!stream) return;

    chunksRef.current = [];
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setRecordedBlob(blob);
      setPreviewUrl(url);
    };

    recorder.start();
    setRecording(true);
    setTimeLeft(maxLength);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const reset = () => {
    setRecordedBlob(null);
    setPreviewUrl(null);
    setTimeLeft(maxLength);
    initStream();
  };

  // ─── Free Tier UI ───────────────────────────────────────────────────────────
  if (!isPro) {
    return (
      <div className="group relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden rounded-[32px] border border-neutral-100 bg-white p-8 text-center">
        <div className="absolute inset-0 z-10 bg-white/20 backdrop-blur-[6px]" />
        <div className="relative z-20 flex flex-col items-center gap-4">
          <div className="mb-2 flex size-16 items-center justify-center rounded-2xl bg-neutral-900 shadow-xl">
            <Lock className="size-8 text-pink-500" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900">
            Video Testimonials are a Pro Feature
          </h3>
          <p className="max-w-[280px] text-[13px] text-neutral-500">
            The owner needs to upgrade their plan to enable video recordings. Text reviews are still
            available!
          </p>
          <div className="mt-2 flex items-center gap-2 rounded-full bg-pink-50 px-4 py-1.5 text-[11px] font-bold text-pink-600">
            <Sparkles className="size-3" /> UPGRADE PRO TO ENABLE
          </div>
        </div>
      </div>
    );
  }

  // ─── Preview UI ─────────────────────────────────────────────────────────────
  if (recordedBlob && previewUrl) {
    return (
      <div className="flex w-full flex-col gap-4">
        <div
          className={`relative w-full overflow-hidden rounded-[24px] border border-neutral-100 bg-black shadow-2xl sm:rounded-[32px] ${isMobile ? "aspect-3/4" : "aspect-video"}`}
        >
          <video src={previewUrl} controls className="size-full object-cover" playsInline />
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={reset}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-neutral-200 py-3.5 text-[13px] font-bold text-neutral-600 transition-all hover:bg-neutral-50 sm:rounded-2xl sm:py-4 sm:text-[14px]"
          >
            <RotateCcw className="size-4" /> Re-record
          </button>
          <button
            type="button"
            onClick={() => onConfirm(recordedBlob)}
            className="flex-2 rounded-xl py-3.5 text-[13px] font-bold text-white shadow-xl transition-all hover:opacity-90 active:scale-[0.98] sm:rounded-2xl sm:py-4 sm:text-[14px]"
            style={{ backgroundColor: accentColor }}
          >
            Use this video
          </button>
        </div>
      </div>
    );
  }

  // ─── Recording UI ───────────────────────────────────────────────────────────
  return (
    <div className="flex w-full flex-col gap-4">
      <div
        className={`relative w-full overflow-hidden rounded-[24px] border border-neutral-100 bg-neutral-900 shadow-2xl sm:rounded-[32px] ${isMobile ? "aspect-3/4" : "aspect-video"}`}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="mirror size-full object-cover"
          style={{ transform: "scaleX(-1)" }}
        />

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-neutral-900/90 p-6 text-center text-white">
            <p className="mb-4 text-lg font-bold">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-xl bg-white px-6 py-2 text-[13px] font-bold text-neutral-900"
            >
              Try again
            </button>
          </div>
        )}

        {/* Countdown Overlay */}
        {countdown !== null && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <span className="animate-ping text-8xl font-black text-white">{countdown}</span>
          </div>
        )}

        {/* Timer / REC Indicator */}
        {recording && (
          <div className="absolute top-6 left-6 z-30 flex items-center gap-3">
            <div className="flex animate-pulse items-center gap-1.5 rounded-full bg-red-500/90 px-3 py-1 shadow-lg">
              <div className="size-2 rounded-full bg-white" />
              <span className="text-[11px] font-black tracking-wider text-white">REC</span>
            </div>
            <div className="rounded-full bg-black/60 px-3 py-1 backdrop-blur-md">
              <span className="font-mono text-[11px] font-black text-white">
                0:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
              </span>
            </div>
          </div>
        )}

        {/* Action Button */}
        {!countdown && !error && (
          <div className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2">
            {recording ? (
              <button
                type="button"
                onClick={stopRecording}
                className="group flex size-16 items-center justify-center rounded-full bg-white text-red-500 shadow-2xl transition-all hover:scale-105 active:scale-95"
              >
                <div className="size-6 rounded-sm bg-red-500 transition-transform group-hover:scale-110" />
              </button>
            ) : (
              <button
                type="button"
                onClick={startRecordingFlow}
                className="group flex size-16 items-center justify-center rounded-full bg-white text-red-500 shadow-2xl transition-all hover:scale-105 active:scale-95"
              >
                <div className="flex size-8 items-center justify-center rounded-full border-4 border-red-500 transition-transform group-hover:scale-110">
                  <div className="size-3 rounded-full bg-red-500" />
                </div>
              </button>
            )}
          </div>
        )}

        {/* Guide Prompts Overlays could go here */}
      </div>

      <p className="px-4 text-center text-[10px] font-bold tracking-widest text-neutral-400 uppercase sm:px-0 sm:text-[11px]">
        {recording
          ? "Recording... Keep talking! 🎙️"
          : prompt || "Smile and share your story for 30-60 seconds"}
      </p>
    </div>
  );
}
