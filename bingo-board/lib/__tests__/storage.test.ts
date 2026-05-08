import { afterEach, describe, expect, it } from "vitest";

import { loadState, saveState, STORAGE_KEY } from "../storage";
import type { BingoState } from "../types";

afterEach(() => {
  window.localStorage.clear();
});

describe("storage", () => {
  it("roundtrips a valid state", () => {
    const state: BingoState = {
      drawn: [1, 17, 50],
      latest: { n: 50, letter: "G" },
      voiceOn: false,
    };
    saveState(state);
    expect(loadState()).toEqual(state);
  });

  it("returns null when nothing is stored", () => {
    expect(loadState()).toBeNull();
  });

  it("returns null when stored value is not valid JSON", () => {
    window.localStorage.setItem(STORAGE_KEY, "{not valid");
    expect(loadState()).toBeNull();
  });

  it("returns null when stored value has wrong shape", () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ foo: "bar" }));
    expect(loadState()).toBeNull();
  });

  it("returns null when latest has invalid letter", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ drawn: [1], latest: { n: 1, letter: "X" }, voiceOn: true }),
    );
    expect(loadState()).toBeNull();
  });
});
