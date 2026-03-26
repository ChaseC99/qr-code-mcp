import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { createServer } from "./server.js";

const defaultHeader = {
  "content-type": "text/plain; charset=utf-8",
};

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // ROOT PATH
    // Serve a simple landing page
    if (url.pathname === "/") {
      if (request.method !== "GET" && request.method !== "HEAD") {
        return methodNotAllowed("GET, HEAD");
      }

      const body = request.method === "HEAD" ? null : LANDING_PAGE;
      return new Response(body, { status: 200, headers: { "content-type": "text/html; charset=utf-8" } });
    }


    // HEALTH CHECK
    // Respond to health checks with a simple "OK"
    if (url.pathname === "/health") {
      if (request.method !== "GET" && request.method !== "HEAD") {
        return methodNotAllowed("GET, HEAD");
      }

      const body = request.method === "HEAD" ? null : "OK";
      return new Response(body, { status: 200, headers: defaultHeader });
    }


    // MCP ENDPOINT
    // Handle MCP connections at
    if (url.pathname === "/mcp") {
      const transport = new WebStandardStreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
      });

      const server = createServer();
      await server.connect(transport);

      return transport.handleRequest(request);
    }


    // DEFAULT - NOT FOUND
    // 404 for any other paths
    return new Response("Not Found", {
      status: 404,
      headers: defaultHeader,
    });
  },
};

function methodNotAllowed(allowed: string): Response {
  return new Response("Method Not Allowed", {
    status: 405,
    headers: {
      Allow: allowed,
      ...defaultHeader,
    },
  });
}

const LANDING_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>qr-code-mcp</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #0f0f0f;
      color: #e8e8e8;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .container { max-width: 640px; width: 100%; }
    h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.5rem; }
    .subtitle { color: #888; margin-bottom: 2rem; font-size: 0.95rem; }
    .endpoint {
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 8px;
      padding: 1rem 1.25rem;
      margin-bottom: 2rem;
      font-family: monospace;
      font-size: 0.9rem;
    }
    .endpoint span { color: #888; display: block; margin-bottom: 0.35rem; font-family: sans-serif; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; }
    h2 { font-size: 1rem; font-weight: 600; color: #aaa; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem; }
    .tools { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 0.5rem; margin-bottom: 2rem; }
    .tool {
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 6px;
      padding: 0.6rem 0.75rem;
      font-family: monospace;
      font-size: 0.8rem;
      color: #c9d1d9;
    }
    .config {
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 8px;
      padding: 1rem 1.25rem;
      font-family: monospace;
      font-size: 0.85rem;
      white-space: pre;
      overflow-x: auto;
      color: #c9d1d9;
      margin-bottom: 2rem;
    }
    .privacy { color: #888; font-size: 0.85rem; line-height: 1.5; margin-bottom: 0; }
    .footer { margin-top: 2.5rem; font-size: 0.8rem; color: #555; text-align: center; }
    .footer a { color: #666; text-decoration: none; display: inline-flex; }
    .footer a:hover { color: #aaa; }
  </style>
</head>
<body>
  <div class="container">
    <h1>qr-code-mcp</h1>
    <p class="subtitle">An MCP server for generating QR codes. 10 types, fully customizable.</p>

    <div class="endpoint">
      <span>MCP endpoint</span>
      /mcp
    </div>

    <h2>Tools</h2>
    <div class="tools">
      <div class="tool">generate_url_qr</div>
      <div class="tool">generate_vcard_qr</div>
      <div class="tool">generate_wifi_qr</div>
      <div class="tool">generate_event_qr</div>
      <div class="tool">generate_email_qr</div>
      <div class="tool">generate_phone_qr</div>
      <div class="tool">generate_sms_qr</div>
      <div class="tool">generate_geo_qr</div>
      <div class="tool">generate_text_qr</div>
      <div class="tool">generate_facetime_qr</div>
    </div>

    <h2>Connect</h2>
    <div class="config">{
  "mcpServers": {
    "qr-code": {
      "url": "https://qr-code-mcp.&lt;your-account&gt;.workers.dev/mcp"
    }
  }
}</div>

    <h2>Privacy</h2>
    <p class="privacy">No user data is stored. Your input is used to generate a QR code and the image is returned directly - none of your personal information is logged or saved.</p>

    <p class="footer">
      <a href="https://github.com/ChaseC99/qr-code-mcp">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="display: inline; margin-right: 0.4rem; vertical-align: -2px;">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
        </svg>
        github.com/ChaseC99/qr-code-mcp
      </a>
    </p>
  </div>
</body>
</html>`;