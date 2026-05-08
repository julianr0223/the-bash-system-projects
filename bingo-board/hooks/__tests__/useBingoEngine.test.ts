import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useBingoEngine } from "../useBingoEngine";

beforeEach(() => {
  vi.useFakeTimers();
  window.localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
});

function flushDraw() {
  act(() => {
    vi.advanceTimersByTime(1000);
  });
}

describe("useBingoEngine", () => {
  it("draws all 75 numbers without repeats", () => {
    const { result } = renderHook(() => useBingoEngine());

    for (let i = 0; i < 75; i++) {
      act(() => {
        result.current.draw();
      });
      flushDraw();
    }

    expect(result.current.drawn).toHaveLength(75);
    const unique = new Set(result.current.drawn);
    expect(unique.size).toBe(75);
    for (let n = 1; n <= 75; n++) expect(unique.has(n)).toBe(true);
    expect(result.current.remaining).toBe(0);
  });

  it("undo removes the last drawn number and restores latest", () => {
    const { result } = renderHook(() => useBingoEngine());

    act(() => {
      result.current.draw();
    });
    flushDraw();
    act(() => {
      result.current.draw();
    });
    flushDraw();

    expect(result.current.drawn).toHaveLength(2);
    const first = result.current.drawn[0];

    act(() => {
      result.current.undo();
    });

    expect(result.current.drawn).toEqual([first]);
    expect(result.current.latest?.n).toBe(first);

    act(() => {
      result.current.undo();
    });

    expect(result.current.drawn).toHaveLength(0);
    expect(result.current.latest).toBeNull();
  });

  it("undo on empty history is a noop", () => {
    const { result } = renderHook(() => useBingoEngine());

    act(() => {
      result.current.undo();
    });

    expect(result.current.drawn).toHaveLength(0);
    expect(result.current.latest).toBeNull();
  });

  it("reset clears drawn and latest", () => {
    const { result } = renderHook(() => useBingoEngine());

    for (let i = 0; i < 3; i++) {
      act(() => {
        result.current.draw();
      });
      flushDraw();
    }

    expect(result.current.drawn).toHaveLength(3);

    act(() => {
      result.current.reset();
    });

    expect(result.current.drawn).toHaveLength(0);
    expect(result.current.latest).toBeNull();
    expect(result.current.showResetModal).toBe(false);
  });

  it("ignores draw while another draw is in progress", () => {
    const { result } = renderHook(() => useBingoEngine());

    act(() => {
      result.current.draw();
    });
    expect(result.current.drawing).toBe(true);

    act(() => {
      result.current.draw();
    });
    flushDraw();

    expect(result.current.drawn).toHaveLength(1);
  });
});
