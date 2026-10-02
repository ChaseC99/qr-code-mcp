import { McpServer } from "@modelcontextprotocol/server";
import { registerTools } from "./mcp/tools/index.js";

// The tool list never changes at runtime, so let clients (and shared caches)
// reuse tools/list results for a day instead of re-fetching them.
const TOOLS_LIST_TTL_MS = 24 * 60 * 60 * 1000;

export function createServer(): McpServer {
  const server = new McpServer(
    {
      name: "qr-code-mcp",
      version: "0.2.0",
    },
    {
      cacheHints: {
        "tools/list": { ttlMs: TOOLS_LIST_TTL_MS, cacheScope: "public" },
      },
    },
  );

  registerTools(server);

  return server;
}
