import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as schemas from "./schemas.js";
import * as handlers from "./handlers.js";

export function registerTools(server: McpServer): void {
  server.tool(
    "generate_url_qr",
    "Generate a QR code that encodes a URL. When scanned, opens the URL in a browser.",
    schemas.urlSchema.shape,
    handlers.handleUrlQR,
  );

  server.tool(
    "generate_vcard_qr",
    "Generate a QR code containing a contact card (vCard). When scanned, prompts to add the contact.",
    schemas.vcardSchema.shape,
    handlers.handleVCardQR,
  );

  server.tool(
    "generate_wifi_qr",
    "Generate a QR code for WiFi network credentials. When scanned, connects to the WiFi network.",
    schemas.wifiSchema.shape,
    handlers.handleWiFiQR,
  );

  server.tool(
    "generate_event_qr",
    "Generate a QR code for a calendar event. When scanned, adds the event to the calendar.",
    schemas.eventSchema.shape,
    handlers.handleEventQR,
  );

  server.tool(
    "generate_email_qr",
    "Generate a QR code that opens an email compose window with pre-filled fields.",
    schemas.emailSchema.shape,
    handlers.handleEmailQR,
  );

  server.tool(
    "generate_phone_qr",
    "Generate a QR code that dials a phone number when scanned.",
    schemas.phoneSchema.shape,
    handlers.handlePhoneQR,
  );

  server.tool(
    "generate_sms_qr",
    "Generate a QR code that opens an SMS compose window with a pre-filled number and optional message.",
    schemas.smsSchema.shape,
    handlers.handleSmsQR,
  );

  server.tool(
    "generate_geo_qr",
    "Generate a QR code for a geographic location. When scanned, opens the location in a maps app.",
    schemas.geoSchema.shape,
    handlers.handleGeoQR,
  );

  server.tool(
    "generate_text_qr",
    "Generate a QR code that encodes arbitrary text.",
    schemas.textSchema.shape,
    handlers.handleTextQR,
  );

  server.tool(
    "generate_facetime_qr",
    "Generate a QR code that initiates a FaceTime call (video or audio) when scanned on an Apple device.",
    schemas.facetimeSchema.shape,
    handlers.handleFaceTimeQR,
  );
}
