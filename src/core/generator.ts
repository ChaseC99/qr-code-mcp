// Import the server-side module directly to avoid wrangler resolving the browser entry
// (the browser entry lacks toBuffer/PNG support)
// @ts-expect-error — no type declarations for internal path
import QRCode from "qrcode/lib/server.js";
import { formatPayload } from "./formatters/index.js";
import type { QRInput, QROptions, QRResult } from "./types.js";

export async function generateQR(
  input: QRInput,
  options: QROptions = {},
): Promise<QRResult> {
  const payload = formatPayload(input);
  const {
    format = "png",
    errorCorrection = "M",
    width = 400,
    margin = 4,
    foregroundColor = "#000000",
    backgroundColor = "#ffffff",
  } = options;

  const qrOptions = {
    errorCorrectionLevel: errorCorrection,
    width,
    margin,
    color: { dark: foregroundColor, light: backgroundColor },
  };

  if (format === "svg") {
    const svg: string = await QRCode.toString(payload, {
      ...qrOptions,
      type: "svg",
    });
    return { data: svg, format: "svg", mimeType: "image/svg+xml" };
  }

  const buffer: Buffer = await QRCode.toBuffer(payload, {
    ...qrOptions,
    type: "png",
  });
  return {
    data: buffer.toString("base64"),
    format: "png",
    mimeType: "image/png",
  };
}
