import type { GeoInput } from "../types.js";

export function formatGeo(input: GeoInput): string {
  return `geo:${input.latitude},${input.longitude}`;
}
