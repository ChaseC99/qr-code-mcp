import { describe, it, expect } from "vitest";
import { formatVCard } from "../vcard.js";

describe("formatVCard", () => {
  it("generates vCard with just names", () => {
    const result = formatVCard({ firstName: "John", lastName: "Doe" });
    expect(result).toBe(
      "BEGIN:VCARD\nVERSION:3.0\nN:Doe;John;;;\nFN:John Doe\nEND:VCARD",
    );
  });

  it("generates vCard with no name fields", () => {
    const result = formatVCard({ organization: "Acme Corp" });
    expect(result).toContain("N:;;;;\nFN:");
    expect(result).toContain("ORG:Acme Corp");
  });

  it("generates vCard with only firstName", () => {
    const result = formatVCard({ firstName: "Jane" });
    expect(result).toContain("N:;Jane;;;");
    expect(result).toContain("FN:Jane");
  });

  it("includes multiple emails", () => {
    const result = formatVCard({
      firstName: "Jane",
      lastName: "Doe",
      emails: [
        { label: "work", value: "jane@acme.com" },
        { label: "home", value: "jane@gmail.com" },
      ],
    });
    expect(result).toContain("EMAIL;TYPE=work:jane@acme.com");
    expect(result).toContain("EMAIL;TYPE=home:jane@gmail.com");
  });

  it("includes multiple phones", () => {
    const result = formatVCard({
      phones: [
        { label: "work", value: "+1234567890" },
        { label: "cell", value: "+0987654321" },
        { label: "home", value: "+1112223333" },
      ],
    });
    expect(result).toContain("TEL;TYPE=work:+1234567890");
    expect(result).toContain("TEL;TYPE=cell:+0987654321");
    expect(result).toContain("TEL;TYPE=home:+1112223333");
  });

  it("includes multiple addresses", () => {
    const result = formatVCard({
      addresses: [
        {
          label: "work",
          street: "123 Main St",
          city: "Springfield",
          state: "IL",
          zip: "62701",
          country: "USA",
        },
        {
          label: "home",
          city: "Portland",
          state: "OR",
        },
      ],
    });
    expect(result).toContain(
      "ADR;TYPE=work:;;123 Main St;Springfield;IL;62701;USA",
    );
    expect(result).toContain("ADR;TYPE=home:;;;Portland;OR;;");
  });

  it("includes multiple websites", () => {
    const result = formatVCard({
      websites: [
        { label: "work", value: "https://acme.com" },
        { label: "home", value: "https://janedoe.com" },
      ],
    });
    expect(result).toContain("URL;TYPE=work:https://acme.com");
    expect(result).toContain("URL;TYPE=home:https://janedoe.com");
  });

  it("includes all fields together", () => {
    const result = formatVCard({
      firstName: "Jane",
      lastName: "Smith",
      organization: "Acme Corp",
      title: "CEO",
      emails: [{ label: "work", value: "jane@acme.com" }],
      phones: [{ label: "cell", value: "+1234567890" }],
      addresses: [
        {
          label: "work",
          street: "123 Main St",
          city: "Springfield",
          state: "IL",
          zip: "62701",
          country: "USA",
        },
      ],
      websites: [{ label: "work", value: "https://acme.com" }],
      note: "Important contact",
    });

    expect(result).toContain("N:Smith;Jane;;;");
    expect(result).toContain("FN:Jane Smith");
    expect(result).toContain("ORG:Acme Corp");
    expect(result).toContain("TITLE:CEO");
    expect(result).toContain("EMAIL;TYPE=work:jane@acme.com");
    expect(result).toContain("TEL;TYPE=cell:+1234567890");
    expect(result).toContain(
      "ADR;TYPE=work:;;123 Main St;Springfield;IL;62701;USA",
    );
    expect(result).toContain("URL;TYPE=work:https://acme.com");
    expect(result).toContain("NOTE:Important contact");
  });

  it("escapes special characters in name and note", () => {
    const result = formatVCard({
      firstName: "John;Jr",
      lastName: "O'Brien,III",
      organization: "Widgets\\More",
      note: "Has; commas, and\\backslashes",
    });

    expect(result).toContain("O'Brien\\,III;John\\;Jr");
    expect(result).toContain("ORG:Widgets\\\\More");
    expect(result).toContain("NOTE:Has\\; commas\\, and\\\\backslashes");
  });

  it("includes prefix, middle name, suffix in N and FN", () => {
    const result = formatVCard({
      namePrefix: "Dr",
      firstName: "Jane",
      middleName: "Marie",
      lastName: "Smith",
      nameSuffix: "PhD",
    });

    expect(result).toContain("N:Smith;Jane;Marie;Dr;PhD");
    expect(result).toContain("FN:Dr Jane Marie Smith PhD");
  });

  it("includes nickname", () => {
    const result = formatVCard({
      firstName: "Robert",
      nickname: "Bob",
    });

    expect(result).toContain("NICKNAME:Bob");
  });

  it("includes birthday with year", () => {
    const result = formatVCard({
      firstName: "Jane",
      birthday: "1990-06-15",
    });

    expect(result).toContain("BDAY:19900615");
  });

  it("includes birthday without year", () => {
    const result = formatVCard({
      firstName: "Jane",
      birthday: "--06-15",
    });

    expect(result).toContain("BDAY:0615");
  });
});
