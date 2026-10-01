import type { McpServer } from "@modelcontextprotocol/server";
import * as schemas from "./schemas.js";
import * as handlers from "./handlers.js";
import { cacheJsonSchema } from "./cachedSchema.js";

// Built once per isolate and shared by every per-request server.
const inputSchemas = {
  urlSchema: cacheJsonSchema(schemas.urlSchema),
  vcardSchema: cacheJsonSchema(schemas.vcardSchema),
  wifiSchema: cacheJsonSchema(schemas.wifiSchema),
  eventSchema: cacheJsonSchema(schemas.eventSchema),
  emailSchema: cacheJsonSchema(schemas.emailSchema),
  phoneSchema: cacheJsonSchema(schemas.phoneSchema),
  smsSchema: cacheJsonSchema(schemas.smsSchema),
  geoSchema: cacheJsonSchema(schemas.geoSchema),
  textSchema: cacheJsonSchema(schemas.textSchema),
  facetimeSchema: cacheJsonSchema(schemas.facetimeSchema),
};

export function registerTools(server: McpServer): void {
  server.registerTool(
    "generate_url_qr",
    {
      description:
        "Generate a QR code that encodes a URL. When scanned, opens the URL in a browser.",
      inputSchema: inputSchemas.urlSchema,
    },
    handlers.handleUrlQR,
  );

  server.registerTool(
    "generate_vcard_qr",
    {
      description:
        "Generate a QR code containing a contact card (vCard). When scanned, prompts to add the contact.",
      inputSchema: inputSchemas.vcardSchema,
    },
    handlers.handleVCardQR,
  );

  server.registerTool(
    "generate_wifi_qr",
    {
      description:
        "Generate a QR code for WiFi network credentials. When scanned, connects to the WiFi network.",
      inputSchema: inputSchemas.wifiSchema,
    },
    handlers.handleWiFiQR,
  );

  server.registerTool(
    "generate_event_qr",
    {
      description:
        "Generate a QR code for a calendar event. When scanned, adds the event to the calendar.",
      inputSchema: inputSchemas.eventSchema,
    },
    handlers.handleEventQR,
  );

  server.registerTool(
    "generate_email_qr",
    {
      description:
        "Generate a QR code that opens an email compose window with pre-filled fields.",
      inputSchema: inputSchemas.emailSchema,
    },
    handlers.handleEmailQR,
  );

  server.registerTool(
    "generate_phone_qr",
    {
      description:
        "Generate a QR code that dials a phone number when scanned.",
      inputSchema: inputSchemas.phoneSchema,
    },
    handlers.handlePhoneQR,
  );

  server.registerTool(
    "generate_sms_qr",
    {
      description:
        "Generate a QR code that opens an SMS compose window with a pre-filled number and optional message.",
      inputSchema: inputSchemas.smsSchema,
    },
    handlers.handleSmsQR,
  );

  server.registerTool(
    "generate_geo_qr",
    {
      description:
        "Generate a QR code for a geographic location. When scanned, opens the location in a maps app.",
      inputSchema: inputSchemas.geoSchema,
    },
    handlers.handleGeoQR,
  );

  server.registerTool(
    "generate_text_qr",
    {
      description:
        "Generate a QR code that encodes arbitrary text.",
      inputSchema: inputSchemas.textSchema,
    },
    handlers.handleTextQR,
  );

  server.registerTool(
    "generate_facetime_qr",
    {
      description:
        "Generate a QR code that initiates a FaceTime call (video or audio) when scanned on an Apple device.",
      inputSchema: inputSchemas.facetimeSchema,
    },
    handlers.handleFaceTimeQR,
  );
}
