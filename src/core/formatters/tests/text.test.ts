import { describe, it, expect } from "vitest";
import { formatText } from "../text.js";

describe("formatText", () => {
  it("passes text through unchanged", () => {
    expect(formatText({ text: "Hello, world!" })).toBe("Hello, world!");
  });

  it("preserves special characters", () => {
    expect(formatText({ text: "line1\nline2\ttab" })).toBe(
      "line1\nline2\ttab",
    );
  });
});
