import { describe, it, expect } from "vitest";
import { formatPhone } from "../phone.js";

describe("formatPhone", () => {
  it("formats phone number as tel: URI", () => {
    expect(formatPhone({ phone: "+1234567890" })).toBe("tel:+1234567890");
  });
});
