import type { PhoneInput } from "../types.js";

export function formatPhone(input: PhoneInput): string {
  return `tel:${input.phone}`;
}
