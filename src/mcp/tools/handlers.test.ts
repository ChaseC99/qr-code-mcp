import { describe, it, expect } from "vitest";
import { handleUrlQR, handleTextQR } from "./handlers.js";

describe("MCP tool handlers", () => {
  it("returns image content for PNG format", async () => {
    const result = await handleUrlQR({
      url: "https://example.com",
      format: "png",
    });

    expect(result.content).toHaveLength(1);
    expect(result.content[0]).toMatchObject({
      type: "image",
      mimeType: "image/png",
    });
    expect((result.content[0] as { data: string }).data).toMatch(
      /^[A-Za-z0-9+/]+=*$/,
    );
  });

  it("returns text content for SVG format", async () => {
    const result = await handleUrlQR({
      url: "https://example.com",
      format: "svg",
    });

    expect(result.content).toHaveLength(1);
    expect(result.content[0]).toMatchObject({ type: "text" });
    expect((result.content[0] as { text: string }).text).toContain("<svg");
  });

  it("separates QR options from type-specific data", async () => {
    // foregroundColor/backgroundColor should be applied, not passed as data
    const result = await handleTextQR({
      text: "test",
      format: "svg",
      foregroundColor: "#ff0000",
      backgroundColor: "#00ff00",
      errorCorrection: "H",
      width: 200,
      margin: 2,
    });

    const svg = (result.content[0] as { text: string }).text;
    expect(svg).toContain("#ff0000");
    expect(svg).toContain("#00ff00");
  });

  it("returns isError on failure", async () => {
    // Pass an absurdly large input that exceeds QR capacity
    const hugeText = "x".repeat(10000);
    const result = await handleTextQR({ text: hugeText });

    expect(result.isError).toBe(true);
    expect((result.content[0] as { text: string }).text).toContain("Error:");
  });
});
