import { describe, it, expect } from "vitest";
import { formatSMS } from "../sms.js";

describe("formatSMS", () => {
  it("formats SMS with number only", () => {
    expect(formatSMS({ phone: "+1234567890" })).toBe("smsto:+1234567890");
  });

  it("formats SMS with number and body", () => {
    expect(formatSMS({ phone: "+1234567890", body: "Hi there" })).toBe(
      "smsto:+1234567890:Hi there",
    );
  });
});
