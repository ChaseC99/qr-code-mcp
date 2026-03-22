import type { EventInput } from "../types.js";

function toICalDate(iso: string, allDay: boolean): string {
  if (allDay) {
    return iso.replace(/[-]/g, "").slice(0, 8);
  }
  return iso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function formatEvent(input: EventInput): string {
  const allDay = input.allDay ?? false;
  const lines: string[] = [
    "BEGIN:VEVENT",
    `SUMMARY:${input.title}`,
  ];

  if (allDay) {
    lines.push(`DTSTART;VALUE=DATE:${toICalDate(input.start, true)}`);
    if (input.end) lines.push(`DTEND;VALUE=DATE:${toICalDate(input.end, true)}`);
  } else {
    lines.push(`DTSTART:${toICalDate(input.start, false)}`);
    if (input.end) lines.push(`DTEND:${toICalDate(input.end, false)}`);
  }

  if (input.location) lines.push(`LOCATION:${input.location}`);
  if (input.description) lines.push(`DESCRIPTION:${input.description}`);

  if (input.alert != null) {
    lines.push("BEGIN:VALARM");
    lines.push(`TRIGGER:-PT${input.alert}M`);
    lines.push("ACTION:DISPLAY");
    lines.push("DESCRIPTION:Reminder");
    lines.push("END:VALARM");
  }

  lines.push("END:VEVENT");

  return lines.join("\n");
}
