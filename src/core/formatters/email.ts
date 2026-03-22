import type { EmailInput } from "../types.js";

export function formatEmail(input: EmailInput): string {
  const params: string[] = [];
  if (input.subject) params.push(`subject=${encodeURIComponent(input.subject)}`);
  if (input.body) params.push(`body=${encodeURIComponent(input.body)}`);
  const query = params.length > 0 ? `?${params.join("&")}` : "";
  return `mailto:${input.to}${query}`;
}
