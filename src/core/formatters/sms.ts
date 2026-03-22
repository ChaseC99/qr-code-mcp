import type { SMSInput } from "../types.js";

export function formatSMS(input: SMSInput): string {
  if (input.body) {
    return `smsto:${input.phone}:${input.body}`;
  }
  return `smsto:${input.phone}`;
}
