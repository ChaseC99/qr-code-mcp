import type { QRInput } from "../types.js";
import { formatURL } from "./url.js";
import { formatVCard } from "./vcard.js";
import { formatWiFi } from "./wifi.js";
import { formatEvent } from "./event.js";
import { formatEmail } from "./email.js";
import { formatPhone } from "./phone.js";
import { formatSMS } from "./sms.js";
import { formatGeo } from "./geo.js";
import { formatText } from "./text.js";
import { formatFaceTime } from "./facetime.js";

export {
  formatURL,
  formatVCard,
  formatWiFi,
  formatEvent,
  formatEmail,
  formatPhone,
  formatSMS,
  formatGeo,
  formatText,
  formatFaceTime,
};

export function formatPayload(input: QRInput): string {
  switch (input.type) {
    case "url":
      return formatURL(input.data);
    case "vcard":
      return formatVCard(input.data);
    case "wifi":
      return formatWiFi(input.data);
    case "event":
      return formatEvent(input.data);
    case "email":
      return formatEmail(input.data);
    case "phone":
      return formatPhone(input.data);
    case "sms":
      return formatSMS(input.data);
    case "geo":
      return formatGeo(input.data);
    case "text":
      return formatText(input.data);
    case "facetime":
      return formatFaceTime(input.data);
  }
}
