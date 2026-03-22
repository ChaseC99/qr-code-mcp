import { generateQR } from "../../core/index.js";
import type { QRInput, QROptions } from "../../core/types.js";

const QR_OPTION_KEYS = [
  "format",
  "errorCorrection",
  "width",
  "margin",
  "foregroundColor",
  "backgroundColor",
] as const;

function extractOptions(args: Record<string, unknown>): {
  options: QROptions;
  data: Record<string, unknown>;
} {
  const options: Record<string, unknown> = {};
  const data: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(args)) {
    if ((QR_OPTION_KEYS as readonly string[]).includes(key)) {
      options[key] = value;
    } else {
      data[key] = value;
    }
  }

  return { options: options as QROptions, data };
}

function createHandler(qrType: QRInput["type"]) {
  return async (args: Record<string, unknown>) => {
    const { options, data } = extractOptions(args);

    try {
      const result = await generateQR(
        { type: qrType, data } as unknown as QRInput,
        options,
      );

      if (result.format === "svg") {
        return { content: [{ type: "text" as const, text: result.data }] };
      }

      return {
        content: [
          {
            type: "image" as const,
            data: result.data,
            mimeType: result.mimeType,
          },
        ],
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "QR code generation failed";
      return {
        content: [{ type: "text" as const, text: `Error: ${message}` }],
        isError: true,
      };
    }
  };
}

export const handleUrlQR = createHandler("url");
export const handleVCardQR = createHandler("vcard");
export const handleWiFiQR = createHandler("wifi");
export const handleEventQR = createHandler("event");
export const handleEmailQR = createHandler("email");
export const handlePhoneQR = createHandler("phone");
export const handleSmsQR = createHandler("sms");
export const handleGeoQR = createHandler("geo");
export const handleTextQR = createHandler("text");
export const handleFaceTimeQR = createHandler("facetime");
