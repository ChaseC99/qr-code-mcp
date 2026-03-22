# qr-code-mcp

An MCP server for generating QR codes. Supports 10 QR code types with customizable output options. The core generation library is decoupled from the MCP layer so it can be reused independently (e.g. in a web app).

Runs locally via stdio or deployed to Cloudflare Workers via streamable HTTP.

## Tools

All tools accept these shared options:

| Option | Type | Default | Description |
|---|---|---|---|
| `format` | `"png" \| "svg"` | `"png"` | Output format |
| `errorCorrection` | `"L" \| "M" \| "Q" \| "H"` | `"M"` | Error correction level |
| `width` | `number` | `400` | Image width in pixels (PNG only) |
| `margin` | `number` | `4` | Quiet zone margin |
| `foregroundColor` | `string` | `"#000000"` | Foreground color (hex) |
| `backgroundColor` | `string` | `"#ffffff"` | Background color (hex) |

### `generate_url_qr`

Generate a QR code that encodes a URL. When scanned, opens the URL in a browser.

| Param | Type | Required |
|---|---|---|
| `url` | `string` | Yes |

### `generate_vcard_qr`

Generate a QR code containing a contact card (vCard 3.0). When scanned, prompts to add the contact. All fields are optional.

| Param | Type | Description |
|---|---|---|
| `namePrefix` | `string` | e.g. Mr, Mrs, Dr |
| `firstName` | `string` | First name |
| `middleName` | `string` | Middle name |
| `lastName` | `string` | Last name |
| `nameSuffix` | `string` | e.g. Jr, III, PhD |
| `nickname` | `string` | Nickname |
| `birthday` | `string` | `YYYY-MM-DD` or `--MM-DD` (no year) |
| `organization` | `string` | Company or organization |
| `title` | `string` | Job title |
| `emails` | `{label, value}[]` | Email addresses with labels |
| `phones` | `{label, value}[]` | Phone numbers with labels |
| `addresses` | `{label, street?, city?, state?, zip?, country?}[]` | Mailing addresses |
| `websites` | `{label, value}[]` | Website URLs with labels |
| `note` | `string` | Additional notes |

### `generate_wifi_qr`

Generate a QR code for WiFi credentials. When scanned, connects to the network.

| Param | Type | Required |
|---|---|---|
| `ssid` | `string` | Yes |
| `password` | `string` | No |
| `encryption` | `"WPA" \| "WEP" \| "nopass"` | Yes |
| `hidden` | `boolean` | No |

### `generate_event_qr`

Generate a QR code for a calendar event (iCal format). When scanned, adds the event.

| Param | Type | Required |
|---|---|---|
| `title` | `string` | Yes |
| `start` | `string` (ISO 8601) | Yes |
| `end` | `string` (ISO 8601) | No |
| `location` | `string` | No |
| `description` | `string` | No |
| `allDay` | `boolean` | No |
| `alert` | `number` | No, minutes before event |

### `generate_email_qr`

Generate a QR code that opens an email compose window.

| Param | Type | Required |
|---|---|---|
| `to` | `string` | Yes |
| `subject` | `string` | No |
| `body` | `string` | No |

### `generate_phone_qr`

Generate a QR code that dials a phone number.

| Param | Type | Required |
|---|---|---|
| `phone` | `string` | Yes |

### `generate_sms_qr`

Generate a QR code that opens an SMS compose window.

| Param | Type | Required |
|---|---|---|
| `phone` | `string` | Yes |
| `body` | `string` | No |

### `generate_geo_qr`

Generate a QR code for a geographic location. When scanned, opens in a maps app.

| Param | Type | Required |
|---|---|---|
| `latitude` | `number` | Yes |
| `longitude` | `number` | Yes |

### `generate_text_qr`

Generate a QR code that encodes arbitrary text.

| Param | Type | Required |
|---|---|---|
| `text` | `string` | Yes |

### `generate_facetime_qr`

Generate a QR code that initiates a FaceTime call on Apple devices.

| Param | Type | Required |
|---|---|---|
| `contact` | `string` | Yes, phone number or email |
| `audioOnly` | `boolean` | No, default is video |

## Setup

```bash
npm install
npm run build
```

### Local (stdio)

```bash
node dist/index.js
```

Or configure in your MCP client:

```json
{
  "mcpServers": {
    "qr-code": {
      "command": "node",
      "args": ["/path/to/qr-code-mcp/dist/index.js"]
    }
  }
}
```

### Cloudflare Workers

```bash
npx wrangler dev     # local dev server
npx wrangler deploy  # deploy to production
```

Then configure your MCP client with the remote URL:

```json
{
  "mcpServers": {
    "qr-code": {
      "url": "https://qr-code-mcp.<your-account>.workers.dev/mcp"
    }
  }
}
```

### Testing with MCP Inspector

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

## Tests

```bash
npm test          # run once
npm run test:watch  # watch mode
```

Tests include unit tests for all formatters, generator output verification, round-trip scannability tests (encode a QR code, decode it, verify the content matches), and MCP handler tests.

## Using the Core Library

The QR generation logic can be imported independently without the MCP server:

```typescript
import { generateQR } from "qr-code-mcp";

const result = await generateQR(
  { type: "wifi", data: { ssid: "MyNetwork", password: "secret", encryption: "WPA" } },
  { format: "png", width: 300 }
);

// result.data = base64-encoded PNG
// result.mimeType = "image/png"
```

## License

MIT
