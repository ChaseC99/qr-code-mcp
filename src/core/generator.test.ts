import { describe, it, expect } from "vitest";
import { generateQR } from "./generator.js";

describe("generateQR", () => {
  it("generates PNG with correct metadata", async () => {
    const result = await generateQR({
      type: "text",
      data: { text: "hello" },
    });

    expect(result.format).toBe("png");
    expect(result.mimeType).toBe("image/png");
    expect(result.data).toMatch(/^[A-Za-z0-9+/]+=*$/); // valid base64
  });

  it("generates SVG with correct metadata", async () => {
    const result = await generateQR(
      { type: "text", data: { text: "hello" } },
      { format: "svg" },
    );

    expect(result.format).toBe("svg");
    expect(result.mimeType).toBe("image/svg+xml");
    expect(result.data).toContain("<svg");
    expect(result.data).toContain("</svg>");
  });

  it("respects color options in SVG", async () => {
    const result = await generateQR(
      { type: "text", data: { text: "test" } },
      { format: "svg", foregroundColor: "#ff0000", backgroundColor: "#00ff00" },
    );

    expect(result.data).toContain("#ff0000");
    expect(result.data).toContain("#00ff00");
  });
});
