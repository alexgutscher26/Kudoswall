"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";

interface CookieConsentBannerProps {
  enabled: boolean;
  message: string;
  buttonText: string;
  accentColor: string;
}

export function CookieConsentBanner({
  enabled,
  message,
  buttonText,
  accentColor,
}: CookieConsentBannerProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const consent = localStorage.getItem("kudoswall_cookie_consent");
    if (!consent) {
      // Show with a slight delay for better UX
      const timer = setTimeout(() => setShow(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [enabled]);

  const handleAccept = () => {
    localStorage.setItem("kudoswall_cookie_consent", "true");
    setShow(false);
  };

  if (!enabled) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed right-6 bottom-6 left-6 z-100 mx-auto max-w-2xl sm:right-8 sm:left-auto sm:w-[400px]"
        >
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-xl md:p-6">
            <div className="flex items-start gap-4">
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${accentColor}15` }}
              >
                <Cookie className="size-5" style={{ color: accentColor }} />
              </div>
              <div className="flex-1">
                <p className="text-sm leading-relaxed font-medium text-neutral-600">{message}</p>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={handleAccept}
                    className="rounded-lg px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: accentColor }}
                  >
                    {buttonText}
                  </button>
                  <button
                    onClick={() => setShow(false)}
                    className="text-xs font-bold text-neutral-400 hover:text-neutral-600"
                  >
                    Decline
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShow(false)}
                className="rounded-lg p-1 text-neutral-300 transition-colors hover:bg-neutral-50 hover:text-neutral-500"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
