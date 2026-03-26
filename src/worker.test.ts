import { describe, expect, it } from "vitest";
import worker from "./worker.js";

describe("worker /mcp", () => {
  it("rejects GET requests for the MCP endpoint", async () => {
    const response = await worker.fetch(new Request("http://localhost/mcp", {
      method: "GET",
      headers: {
        accept: "text/event-stream",
      },
    }));

    expect(response.status).toBe(405);
    expect(response.headers.get("allow")).toBe("POST");
  });

  it("returns JSON for initialize requests", async () => {
    const response = await worker.fetch(new Request("http://localhost/mcp", {
      method: "POST",
      headers: {
        accept: "application/json, text/event-stream",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2025-03-26",
          capabilities: {},
          clientInfo: {
            name: "vitest",
            version: "1.0.0",
          },
        },
      }),
    }));

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(response.headers.get("mcp-session-id")).toBeNull();
  });
});
