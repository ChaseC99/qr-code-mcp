import { describe, it, expect } from "vitest";
import { formatEvent } from "../event.js";

describe("formatEvent", () => {
  it("formats basic event with title and start", () => {
    const result = formatEvent({
      title: "Meeting",
      start: "2025-03-15T10:00:00Z",
    });

    expect(result).toBe(
      "BEGIN:VEVENT\nSUMMARY:Meeting\nDTSTART:20250315T100000Z\nEND:VEVENT",
    );
  });

  it("includes end time, location, and description", () => {
    const result = formatEvent({
      title: "Conference",
      start: "2025-06-01T09:00:00Z",
      end: "2025-06-01T17:00:00Z",
      location: "Convention Center",
      description: "Annual tech conference",
    });

    expect(result).toContain("SUMMARY:Conference");
    expect(result).toContain("DTSTART:20250601T090000Z");
    expect(result).toContain("DTEND:20250601T170000Z");
    expect(result).toContain("LOCATION:Convention Center");
    expect(result).toContain("DESCRIPTION:Annual tech conference");
  });

  it("formats all-day event with DATE only", () => {
    const result = formatEvent({
      title: "Holiday",
      start: "2025-12-25",
      allDay: true,
    });

    expect(result).toContain("DTSTART;VALUE=DATE:20251225");
    expect(result).not.toContain("DTSTART:2025");
  });

  it("formats all-day event with end date", () => {
    const result = formatEvent({
      title: "Vacation",
      start: "2025-07-01",
      end: "2025-07-05",
      allDay: true,
    });

    expect(result).toContain("DTSTART;VALUE=DATE:20250701");
    expect(result).toContain("DTEND;VALUE=DATE:20250705");
  });

  it("includes VALARM when alert is set", () => {
    const result = formatEvent({
      title: "Meeting",
      start: "2025-03-15T10:00:00Z",
      alert: 15,
    });

    expect(result).toContain("BEGIN:VALARM");
    expect(result).toContain("TRIGGER:-PT15M");
    expect(result).toContain("ACTION:DISPLAY");
    expect(result).toContain("END:VALARM");
  });

  it("supports 0-minute alert", () => {
    const result = formatEvent({
      title: "Now",
      start: "2025-03-15T10:00:00Z",
      alert: 0,
    });

    expect(result).toContain("TRIGGER:-PT0M");
  });

  it("omits VALARM when alert is not set", () => {
    const result = formatEvent({
      title: "No Alert",
      start: "2025-03-15T10:00:00Z",
    });

    expect(result).not.toContain("VALARM");
  });
});
