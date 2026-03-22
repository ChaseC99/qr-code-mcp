import { describe, it, expect } from "vitest";
import { formatPayload } from "../index.js";

describe("formatPayload", () => {
  it("dispatches url type", () => {
    expect(
      formatPayload({ type: "url", data: { url: "https://example.com" } }),
    ).toBe("https://example.com");
  });

  it("dispatches text type", () => {
    expect(formatPayload({ type: "text", data: { text: "hello" } })).toBe(
      "hello",
    );
  });

  it("dispatches phone type", () => {
    expect(
      formatPayload({ type: "phone", data: { phone: "+1234567890" } }),
    ).toBe("tel:+1234567890");
  });

  it("dispatches email type", () => {
    expect(
      formatPayload({ type: "email", data: { to: "a@b.com" } }),
    ).toBe("mailto:a@b.com");
  });

  it("dispatches sms type", () => {
    expect(
      formatPayload({ type: "sms", data: { phone: "+1" } }),
    ).toBe("smsto:+1");
  });

  it("dispatches geo type", () => {
    expect(
      formatPayload({ type: "geo", data: { latitude: 0, longitude: 0 } }),
    ).toBe("geo:0,0");
  });

  it("dispatches wifi type", () => {
    const result = formatPayload({
      type: "wifi",
      data: { ssid: "Net", encryption: "nopass" },
    });
    expect(result).toContain("WIFI:");
  });

  it("dispatches vcard type", () => {
    const result = formatPayload({
      type: "vcard",
      data: { organization: "Test" },
    });
    expect(result).toContain("BEGIN:VCARD");
  });

  it("dispatches event type", () => {
    const result = formatPayload({
      type: "event",
      data: { title: "Test", start: "2025-01-01T00:00:00Z" },
    });
    expect(result).toContain("BEGIN:VEVENT");
  });

  it("dispatches facetime type", () => {
    const result = formatPayload({
      type: "facetime",
      data: { contact: "+1234" },
    });
    expect(result).toBe("facetime:+1234");
  });
});
