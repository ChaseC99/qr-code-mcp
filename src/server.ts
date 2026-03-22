import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerTools } from "./mcp/tools/index.js";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "qr-code-mcp",
    version: "0.1.0",
  });

  registerTools(server);

  return server;
}
