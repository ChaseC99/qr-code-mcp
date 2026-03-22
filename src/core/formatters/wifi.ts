import type { WiFiInput } from "../types.js";

function escapeSpecial(value: string): string {
  return value.replace(/([\\;,":])/g, "\\$1");
}

export function formatWiFi(input: WiFiInput): string {
  const parts = [`WIFI:T:${input.encryption}`];
  parts.push(`S:${escapeSpecial(input.ssid)}`);
  if (input.password) parts.push(`P:${escapeSpecial(input.password)}`);
  if (input.hidden) parts.push("H:true");
  return parts.join(";") + ";;";
}
