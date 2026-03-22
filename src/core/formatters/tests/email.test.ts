import { describe, it, expect } from "vitest";
import { formatEmail } from "../email.js";

describe("formatEmail", () => {
  it("formats email with only recipient", () => {
    expect(formatEmail({ to: "user@example.com" })).toBe(
      "mailto:user@example.com",
    );
  });

  it("includes subject and body", () => {
    const result = formatEmail({
      to: "user@example.com",
      subject: "Hello",
      body: "How are you?",
    });

    expect(result).toBe(
      "mailto:user@example.com?subject=Hello&body=How%20are%20you%3F",
    );
  });

  it("URL-encodes special characters in subject", () => {
    const result = formatEmail({
      to: "test@test.com",
      subject: "Re: Meeting & Agenda",
    });

    expect(result).toContain("subject=Re%3A%20Meeting%20%26%20Agenda");
  });
});
