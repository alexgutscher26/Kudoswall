"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Camera, 
  Video, 
  RotateCcw, 
  Trash2, 
  Play, 
  Square,
  Lock,
  Sparkles,
  Loader2 
} from "lucide-react";

interface VideoRecorderProps {
  isPro: boolean;
  onConfirm: (blob: Blob) => void;
  accentColor?: string;
}

export default function VideoRecorder({ isPro, onConfirm, accentColor = "#e8527a" }: VideoRecorderProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recording, setRecording] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(90);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Initialize Stream
  const initStream = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720, facingMode: "user" }, 
        audio: true 
      });
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
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [isPro, recordedBlob]);

  // 2. Handle Countdown
  const startRecordingFlow = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown(prev => {
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
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    mediaRecorderRef.current = recorder;
    
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setRecordedBlob(blob);
      setPreviewUrl(url);
    };
    
    recorder.start();
    setRecording(true);
    setTimeLeft(90);
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
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
    setTimeLeft(90);
    initStream();
  };

  // ─── Free Tier UI ───────────────────────────────────────────────────────────
  if (!isPro) {
    return (
      <div className="relative group w-full aspect-video rounded-[32px] overflow-hidden border border-neutral-100 bg-neutral-50 flex flex-col items-center justify-center p-8 text-center bg-white">
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[6px] z-10" />
        <div className="relative z-20 flex flex-col items-center gap-4">
          <div className="size-16 rounded-2xl bg-neutral-900 flex items-center justify-center shadow-xl mb-2">
            <Lock className="size-8 text-pink-500" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900">Video Testimonials are a Pro Feature</h3>
          <p className="text-[13px] text-neutral-500 max-w-[280px]">
            The owner needs to upgrade their plan to enable video recordings. Text reviews are still available!
          </p>
          <div className="mt-2 text-[11px] font-bold text-pink-600 bg-pink-50 px-4 py-1.5 rounded-full flex items-center gap-2">
            <Sparkles className="size-3" /> UPGRADE PRO TO ENABLE
          </div>
        </div>
      </div>
    );
  }

  // ─── Preview UI ─────────────────────────────────────────────────────────────
  if (recordedBlob && previewUrl) {
    return (
      <div className="w-full flex flex-col gap-4">
        <div className="relative w-full aspect-video rounded-[32px] overflow-hidden border border-neutral-100 shadow-2xl bg-black">
          <video src={previewUrl} controls className="size-full object-cover" />
        </div>
        <div className="flex gap-3">
          <button 
            type="button"
            onClick={reset}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border border-neutral-200 font-bold text-[14px] text-neutral-600 hover:bg-neutral-50 transition-all font-medium"
          >
            <RotateCcw className="size-4" /> Re-record
          </button>
          <button 
            type="button"
            onClick={() => onConfirm(recordedBlob)}
            className="flex-[2] py-4 rounded-2xl font-bold text-[14px] text-white shadow-xl transition-all hover:opacity-90 active:scale-[0.98]"
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
    <div className="w-full flex flex-col gap-4">
      <div className="relative w-full aspect-video rounded-[32px] overflow-hidden border border-neutral-100 shadow-2xl bg-neutral-900">
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          playsInline 
          className="size-full object-cover mirror" 
          style={{ transform: 'scaleX(-1)' }} 
        />
        
        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 bg-neutral-900/90 text-white text-center">
            <p className="font-bold text-lg mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-white text-neutral-900 rounded-xl font-bold text-[13px]"
            >
              Try again
            </button>
          </div>
        )}

        {/* Countdown Overlay */}
        {countdown !== null && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <span className="text-8xl font-black text-white animate-ping">
              {countdown}
            </span>
          </div>
        )}

        {/* Timer / REC Indicator */}
        {recording && (
          <div className="absolute top-6 left-6 z-30 flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-red-500/90 px-3 py-1 rounded-full animate-pulse shadow-lg">
              <div className="size-2 rounded-full bg-white" />
              <span className="text-[11px] font-black text-white tracking-wider">REC</span>
            </div>
            <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full">
              <span className="text-[11px] font-black text-white font-mono">
                0:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
              </span>
            </div>
          </div>
        )}

        {/* Action Button */}
        {!countdown && !error && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
            {recording ? (
              <button 
                type="button"
                onClick={stopRecording}
                className="size-16 rounded-full bg-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all text-red-500 group"
              >
                <div className="size-6 rounded-sm bg-red-500 group-hover:scale-110 transition-transform" />
              </button>
            ) : (
              <button 
                type="button"
                onClick={startRecordingFlow}
                className="size-16 rounded-full bg-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all text-red-500 group"
              >
                <div className="size-8 rounded-full border-4 border-red-500 group-hover:scale-110 transition-transform flex items-center justify-center">
                  <div className="size-3 rounded-full bg-red-500" />
                </div>
              </button>
            )}
          </div>
        )}

        {/* Guide Prompts Overlays could go here */}
      </div>

      <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest text-center">
        {recording ? "Recording... Keep talking! 🎙️" : "Smile and share your story for 30-60 seconds"}
      </p>
    </div>
  );
}
