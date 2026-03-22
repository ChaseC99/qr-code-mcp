import { describe, it, expect } from "vitest";
import { formatURL } from "../url.js";

describe("formatURL", () => {
  it("passes URL through unchanged", () => {
    expect(formatURL({ url: "https://example.com" })).toBe(
      "https://example.com",
    );
  });

  it("preserves query parameters and fragments", () => {
    expect(formatURL({ url: "https://example.com/path?q=1&b=2#section" })).toBe(
      "https://example.com/path?q=1&b=2#section",
    );
  });
});
