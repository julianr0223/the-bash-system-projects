"use client";

import { useCallback, useEffect, useRef } from "react";

import type { Letter } from "@/lib/types";

export function useVoiceCallout() {
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const es = voices.find((v) => v.lang.startsWith("es"));
      voiceRef.current = es ?? null;
    };

    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = useCallback((letter: Letter, n: number) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(`${letter}, ${n}`);
      u.lang = "es-ES";
      u.rate = 0.85;
      u.pitch = 1.0;
      u.volume = 1.0;
      if (voiceRef.current) u.voice = voiceRef.current;
      window.speechSynthesis.speak(u);
    } catch {
      /* noop */
    }
  }, []);

  const cancel = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* noop */
    }
  }, []);

  return { speak, cancel };
}
