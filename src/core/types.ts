export type OutputFormat = "png" | "svg";

export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export interface QROptions {
  format?: OutputFormat;
  errorCorrection?: ErrorCorrectionLevel;
  width?: number;
  margin?: number;
  foregroundColor?: string;
  backgroundColor?: string;
}

export interface URLInput {
  url: string;
}

export interface VCardInput {
  namePrefix?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  nameSuffix?: string;
  nickname?: string;
  birthday?: string;
  organization?: string;
  title?: string;
  emails?: Array<{ label: string; value: string }>;
  phones?: Array<{ label: string; value: string }>;
  addresses?: Array<{
    label: string;
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  }>;
  websites?: Array<{ label: string; value: string }>;
  note?: string;
}

export interface WiFiInput {
  ssid: string;
  password?: string;
  encryption: "WPA" | "WEP" | "nopass";
  hidden?: boolean;
}

export interface EventInput {
  title: string;
  start: string;
  end?: string;
  location?: string;
  description?: string;
  allDay?: boolean;
  alert?: number;
}

export interface EmailInput {
  to: string;
  subject?: string;
  body?: string;
}

export interface PhoneInput {
  phone: string;
}

export interface SMSInput {
  phone: string;
  body?: string;
}

export interface GeoInput {
  latitude: number;
  longitude: number;
}

export interface TextInput {
  text: string;
}

export interface FaceTimeInput {
  contact: string;
  audioOnly?: boolean;
}

export type QRInput =
  | { type: "url"; data: URLInput }
  | { type: "vcard"; data: VCardInput }
  | { type: "wifi"; data: WiFiInput }
  | { type: "event"; data: EventInput }
  | { type: "email"; data: EmailInput }
  | { type: "phone"; data: PhoneInput }
  | { type: "sms"; data: SMSInput }
  | { type: "geo"; data: GeoInput }
  | { type: "text"; data: TextInput }
  | { type: "facetime"; data: FaceTimeInput };

export interface QRResult {
  data: string;
  format: OutputFormat;
  mimeType: "image/png" | "image/svg+xml";
}
