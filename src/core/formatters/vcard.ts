import type { VCardInput } from "../types.js";

function escapeValue(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

export function formatVCard(input: VCardInput): string {
  const prefix = input.namePrefix ? escapeValue(input.namePrefix) : "";
  const firstName = input.firstName ? escapeValue(input.firstName) : "";
  const middleName = input.middleName ? escapeValue(input.middleName) : "";
  const lastName = input.lastName ? escapeValue(input.lastName) : "";
  const suffix = input.nameSuffix ? escapeValue(input.nameSuffix) : "";

  // N: last;first;middle;prefix;suffix
  const fullName = [prefix, firstName, middleName, lastName, suffix]
    .filter(Boolean)
    .join(" ");

  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${lastName};${firstName};${middleName};${prefix};${suffix}`,
    `FN:${fullName}`,
  ];

  if (input.nickname) lines.push(`NICKNAME:${escapeValue(input.nickname)}`);

  if (input.birthday) {
    // Support YYYY-MM-DD or --MM-DD (no year)
    const bd = input.birthday.replace(/-/g, "");
    lines.push(`BDAY:${bd}`);
  }

  if (input.organization) lines.push(`ORG:${escapeValue(input.organization)}`);
  if (input.title) lines.push(`TITLE:${escapeValue(input.title)}`);

  if (input.emails) {
    for (const email of input.emails) {
      lines.push(`EMAIL;TYPE=${email.label}:${email.value}`);
    }
  }

  if (input.phones) {
    for (const phone of input.phones) {
      lines.push(`TEL;TYPE=${phone.label}:${phone.value}`);
    }
  }

  if (input.addresses) {
    for (const addr of input.addresses) {
      const parts = [
        "",
        "",
        addr.street ? escapeValue(addr.street) : "",
        addr.city ? escapeValue(addr.city) : "",
        addr.state ? escapeValue(addr.state) : "",
        addr.zip || "",
        addr.country ? escapeValue(addr.country) : "",
      ];
      lines.push(`ADR;TYPE=${addr.label}:${parts.join(";")}`);
    }
  }

  if (input.websites) {
    for (const website of input.websites) {
      lines.push(`URL;TYPE=${website.label}:${website.value}`);
    }
  }

  if (input.note) lines.push(`NOTE:${escapeValue(input.note)}`);
  lines.push("END:VCARD");

  return lines.join("\n");
}
