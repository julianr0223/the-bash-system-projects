"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { getLetter } from "@/lib/columns";
import { loadState, saveState } from "@/lib/storage";
import type { Latest } from "@/lib/types";

import { useVoiceCallout } from "./useVoiceCallout";

const TOTAL = 75;
const DRAW_DELAY_MS = 900;
const TOAST_MS = 1800;

export type BingoEngine = {
  drawn: number[];
  drawnSet: Set<number>;
  latest: Latest | null;
  drawing: boolean;
  voiceOn: boolean;
  remaining: number;
  progress: number;
  toast: string | null;
  showResetModal: boolean;
  draw: () => void;
  undo: () => void;
  reset: () => void;
  toggleVoice: () => void;
  openResetModal: () => void;
  closeResetModal: () => void;
};

export function useBingoEngine(): BingoEngine {
  const [drawn, setDrawn] = useState<number[]>([]);
  const [latest, setLatest] = useState<Latest | null>(null);
  const [voiceOn, setVoiceOn] = useState(true);
  const [drawing, setDrawing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const drawTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSpokenRef = useRef<number | null>(null);

  const { speak, cancel: cancelVoice } = useVoiceCallout();

  // Hydrate from localStorage once on mount. Effect-based on purpose: lazy
  // useState initializers would run on the server with `null` and then again
  // on the client with the persisted value, causing hydration mismatch.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setDrawn(saved.drawn);
      setLatest(saved.latest);
      setVoiceOn(saved.voiceOn);
      lastSpokenRef.current = saved.latest?.n ?? null;
    }
    setHydrated(true);
    return () => {
      if (drawTimerRef.current) clearTimeout(drawTimerRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Persist changes (after hydration to avoid stomping with default state).
  useEffect(() => {
    if (!hydrated) return;
    saveState({ drawn, latest, voiceOn });
  }, [drawn, latest, voiceOn, hydrated]);

  // Speak when a new latest appears (and is not the one we hydrated with).
  useEffect(() => {
    if (!hydrated) return;
    if (!latest) return;
    if (lastSpokenRef.current === latest.n) return;
    lastSpokenRef.current = latest.n;
    if (voiceOn) speak(latest.letter, latest.n);
  }, [latest, voiceOn, speak, hydrated]);

  const drawnSet = useMemo(() => new Set(drawn), [drawn]);
  const remaining = TOTAL - drawn.length;
  const progress = drawn.length / TOTAL;

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), TOAST_MS);
  }, []);

  const draw = useCallback(() => {
    if (drawing) return;
    if (drawn.length >= TOTAL) {
      showToast("¡Tablero completo!");
      return;
    }
    setDrawing(true);
    drawTimerRef.current = setTimeout(() => {
      const available: number[] = [];
      for (let i = 1; i <= TOTAL; i++) if (!drawnSet.has(i)) available.push(i);
      const pick = available[Math.floor(Math.random() * available.length)];
      const letter = getLetter(pick);
      setDrawn((prev) => [...prev, pick]);
      setLatest({ n: pick, letter });
      setDrawing(false);
    }, DRAW_DELAY_MS);
  }, [drawing, drawn.length, drawnSet, showToast]);

  const undo = useCallback(() => {
    if (drawing) return;
    if (drawn.length === 0) return;
    const next = drawn.slice(0, -1);
    setDrawn(next);
    if (next.length > 0) {
      const last = next[next.length - 1];
      const restored = { n: last, letter: getLetter(last) };
      setLatest(restored);
      // Mark restored latest as already spoken — undoing shouldn't re-announce older numbers.
      lastSpokenRef.current = restored.n;
    } else {
      setLatest(null);
      lastSpokenRef.current = null;
    }
    showToast("Último número eliminado");
  }, [drawing, drawn, showToast]);

  const reset = useCallback(() => {
    cancelVoice();
    setDrawn([]);
    setLatest(null);
    setShowResetModal(false);
    lastSpokenRef.current = null;
    showToast("Partida reiniciada");
  }, [cancelVoice, showToast]);

  const toggleVoice = useCallback(() => setVoiceOn((v) => !v), []);
  const openResetModal = useCallback(() => setShowResetModal(true), []);
  const closeResetModal = useCallback(() => setShowResetModal(false), []);

  return {
    drawn,
    drawnSet,
    latest,
    drawing,
    voiceOn,
    remaining,
    progress,
    toast,
    showResetModal,
    draw,
    undo,
    reset,
    toggleVoice,
    openResetModal,
    closeResetModal,
  };
}
