import type { FaceTimeInput } from "../types.js";

export function formatFaceTime(input: FaceTimeInput): string {
  const scheme = input.audioOnly ? "facetime-audio" : "facetime";
  return `${scheme}:${input.contact}`;
}
