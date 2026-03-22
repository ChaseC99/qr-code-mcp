import { describe, it, expect } from "vitest";
import { generateQR } from "./generator.js";
import { PNG } from "pngjs";
import _jsQR from "jsqr";

// jsqr's UMD bundle exports the function directly but types declare `export default`
const jsQR = _jsQR as unknown as (
  data: Uint8ClampedArray,
  width: number,
  height: number,
) => { data: string } | null;
import type { QRInput } from "./types.js";

/**
 * Round-trip test helper: generates a QR code, decodes the PNG,
 * and returns the decoded text content.
 */
async function decodeQR(input: QRInput): Promise<string> {
  const result = await generateQR(input, { format: "png", width: 400 });
  const pngBuffer = Buffer.from(result.data, "base64");
  const png = PNG.sync.read(pngBuffer);
  const imageData = new Uint8ClampedArray(png.data);
  const decoded = jsQR(imageData, png.width, png.height);

  if (!decoded) {
    throw new Error("Failed to decode QR code");
  }

  return decoded.data;
}

describe("scannability (round-trip QR encode/decode)", () => {
  it("URL: decoded content matches input URL", async () => {
    const text = await decodeQR({
      type: "url",
      data: { url: "https://example.com/path?q=1" },
    });
    expect(text).toBe("https://example.com/path?q=1");
  });

  it("text: decoded content matches input text", async () => {
    const text = await decodeQR({
      type: "text",
      data: { text: "Hello, World! 🌍" },
    });
    expect(text).toBe("Hello, World! 🌍");
  });

  it("phone: decoded content is tel: URI", async () => {
    const text = await decodeQR({
      type: "phone",
      data: { phone: "+15551234567" },
    });
    expect(text).toBe("tel:+15551234567");
  });

  it("email: decoded content is mailto: URI", async () => {
    const text = await decodeQR({
      type: "email",
      data: { to: "user@example.com", subject: "Test" },
    });
    expect(text).toBe("mailto:user@example.com?subject=Test");
  });

  it("SMS: decoded content is smsto: URI", async () => {
    const text = await decodeQR({
      type: "sms",
      data: { phone: "+15551234567", body: "Hi" },
    });
    expect(text).toBe("smsto:+15551234567:Hi");
  });

  it("geo: decoded content is geo: URI", async () => {
    const text = await decodeQR({
      type: "geo",
      data: { latitude: 40.7128, longitude: -74.006 },
    });
    expect(text).toBe("geo:40.7128,-74.006");
  });

  it("WiFi: decoded content matches WiFi format", async () => {
    const text = await decodeQR({
      type: "wifi",
      data: { ssid: "MyNetwork", password: "secret123", encryption: "WPA" },
    });
    expect(text).toBe("WIFI:T:WPA;S:MyNetwork;P:secret123;;");
  });

  it("vCard: decoded content is valid vCard", async () => {
    const text = await decodeQR({
      type: "vcard",
      data: {
        firstName: "Jane",
        lastName: "Doe",
        emails: [{ label: "work", value: "jane@example.com" }],
        phones: [{ label: "cell", value: "+1234567890" }],
      },
    });
    expect(text).toContain("BEGIN:VCARD");
    expect(text).toContain("FN:Jane Doe");
    expect(text).toContain("EMAIL;TYPE=work:jane@example.com");
    expect(text).toContain("TEL;TYPE=cell:+1234567890");
    expect(text).toContain("END:VCARD");
  });

  it("event: decoded content is valid iCal event", async () => {
    const text = await decodeQR({
      type: "event",
      data: {
        title: "Standup",
        start: "2025-03-15T10:00:00Z",
        end: "2025-03-15T10:30:00Z",
        location: "Room 42",
      },
    });
    expect(text).toContain("BEGIN:VEVENT");
    expect(text).toContain("SUMMARY:Standup");
    expect(text).toContain("DTSTART:20250315T100000Z");
    expect(text).toContain("LOCATION:Room 42");
    expect(text).toContain("END:VEVENT");
  });

  it("event with alert: decoded content includes VALARM", async () => {
    const text = await decodeQR({
      type: "event",
      data: {
        title: "Reminder Test",
        start: "2025-03-15T10:00:00Z",
        alert: 30,
      },
    });
    expect(text).toContain("BEGIN:VALARM");
    expect(text).toContain("TRIGGER:-PT30M");
    expect(text).toContain("END:VALARM");
  });

  it("FaceTime: decoded content is facetime: URI", async () => {
    const text = await decodeQR({
      type: "facetime",
      data: { contact: "+14085551234" },
    });
    expect(text).toBe("facetime:+14085551234");
  });

  it("FaceTime audio: decoded content is facetime-audio: URI", async () => {
    const text = await decodeQR({
      type: "facetime",
      data: { contact: "user@icloud.com", audioOnly: true },
    });
    expect(text).toBe("facetime-audio:user@icloud.com");
  });
});
