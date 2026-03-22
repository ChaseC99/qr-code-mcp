import { describe, it, expect } from "vitest";
import { formatFaceTime } from "../facetime.js";

describe("formatFaceTime", () => {
  it("formats video call with phone number", () => {
    expect(formatFaceTime({ contact: "+14085551234" })).toBe(
      "facetime:+14085551234",
    );
  });

  it("formats video call with email", () => {
    expect(formatFaceTime({ contact: "user@icloud.com" })).toBe(
      "facetime:user@icloud.com",
    );
  });

  it("formats audio-only call", () => {
    expect(
      formatFaceTime({ contact: "+14085551234", audioOnly: true }),
    ).toBe("facetime-audio:+14085551234");
  });
});
