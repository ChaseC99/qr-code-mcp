import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { createServer } from "./server.js";

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname !== "/mcp") {
      return new Response("QR Code MCP Server", { status: 200 });
    }

    // Create a stateless transport per request (no session persistence needed)
    const transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    const server = createServer();
    await server.connect(transport);

    return transport.handleRequest(request);
  },
};
