import { z } from "zod";

export const qrOptionsSchema = {
  format: z
    .enum(["png", "svg"])
    .default("png")
    .describe("Output format: base64 PNG or SVG string"),
  errorCorrection: z
    .enum(["L", "M", "Q", "H"])
    .default("M")
    .describe("Error correction level: L(7%), M(15%), Q(25%), H(30%)"),
  width: z
    .number()
    .int()
    .min(100)
    .max(2000)
    .default(400)
    .describe("Image width in pixels (PNG only)"),
  margin: z
    .number()
    .int()
    .min(0)
    .max(20)
    .default(4)
    .describe("Quiet zone margin in modules"),
  foregroundColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .default("#000000")
    .describe("Foreground color (hex, e.g. #000000)"),
  backgroundColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .default("#ffffff")
    .describe("Background color (hex, e.g. #ffffff)"),
};

export const urlSchema = z.object({
  url: z.string().url().describe("The URL to encode (must include protocol, e.g. https://example.com)"),
  ...qrOptionsSchema,
});

const labelValueSchema = z.object({
  label: z.string().describe("Label/type (e.g. work, home, or a custom label)"),
  value: z.string().describe("The value"),
});

const addressSchema = z.object({
  label: z.string().describe("Label/type (e.g. work, home, or a custom label)"),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
});

export const vcardSchema = z.object({
  namePrefix: z.string().optional().describe("Name prefix (e.g. Mr, Mrs, Dr)"),
  firstName: z.string().optional().describe("First name"),
  middleName: z.string().optional().describe("Middle name"),
  lastName: z.string().optional().describe("Last name"),
  nameSuffix: z.string().optional().describe("Name suffix (e.g. Jr, III, PhD)"),
  nickname: z.string().optional().describe("Nickname"),
  birthday: z
    .string()
    .optional()
    .describe("Birthday in YYYY-MM-DD format, or --MM-DD if year is unknown"),
  organization: z.string().optional().describe("Company or organization"),
  title: z.string().optional().describe("Job title"),
  emails: z
    .array(labelValueSchema)
    .optional()
    .describe("Email addresses with labels (e.g. work, home)"),
  phones: z
    .array(labelValueSchema)
    .optional()
    .describe("Phone numbers with labels (e.g. work, home, cell)"),
  addresses: z
    .array(addressSchema)
    .optional()
    .describe("Mailing addresses with labels (e.g. home, work, school)"),
  websites: z
    .array(labelValueSchema)
    .optional()
    .describe("Website URLs with labels (e.g. homepage, work)"),
  note: z.string().optional().describe("Additional notes"),
  ...qrOptionsSchema,
});

export const wifiSchema = z.object({
  ssid: z.string().describe("WiFi network name"),
  password: z.string().optional().describe("WiFi password"),
  encryption: z
    .enum(["WPA", "WEP", "nopass"])
    .describe("Encryption type"),
  hidden: z
    .boolean()
    .optional()
    .describe("Whether the network is hidden"),
  ...qrOptionsSchema,
});

export const eventSchema = z.object({
  title: z.string().describe("Event title"),
  start: z.string().describe("Start date/time in ISO 8601 format"),
  end: z.string().optional().describe("End date/time in ISO 8601 format"),
  location: z.string().optional().describe("Event location"),
  description: z.string().optional().describe("Event description"),
  allDay: z.boolean().optional().describe("Whether this is an all-day event"),
  alert: z
    .number()
    .int()
    .min(0)
    .optional()
    .describe("Reminder alert in minutes before the event (e.g. 15 for 15 minutes before)"),
  ...qrOptionsSchema,
});

export const emailSchema = z.object({
  to: z.string().email().describe("Recipient email address"),
  subject: z.string().optional().describe("Email subject line"),
  body: z.string().optional().describe("Email body text"),
  ...qrOptionsSchema,
});

export const phoneSchema = z.object({
  phone: z.string().describe("Phone number (e.g. +1234567890)"),
  ...qrOptionsSchema,
});

export const smsSchema = z.object({
  phone: z.string().describe("Phone number (e.g. +1234567890)"),
  body: z.string().optional().describe("Pre-filled message text"),
  ...qrOptionsSchema,
});

export const geoSchema = z.object({
  latitude: z.number().min(-90).max(90).describe("Latitude"),
  longitude: z.number().min(-180).max(180).describe("Longitude"),
  ...qrOptionsSchema,
});

export const textSchema = z.object({
  text: z.string().describe("Text to encode"),
  ...qrOptionsSchema,
});

export const facetimeSchema = z.object({
  contact: z
    .string()
    .describe("Phone number or email address to call"),
  audioOnly: z
    .boolean()
    .optional()
    .describe("If true, initiates audio-only FaceTime call instead of video"),
  ...qrOptionsSchema,
});
