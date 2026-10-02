import { describe, expect, it } from "vitest";
import worker from "./worker.js";

const MODERN_VERSION = "2026-07-28";
const MODERN_META = {
  "io.modelcontextprotocol/protocolVersion": MODERN_VERSION,
  "io.modelcontextprotocol/clientInfo": { name: "vitest", version: "1.0.0" },
  "io.modelcontextprotocol/clientCapabilities": {},
};

function postMcp(headers: Record<string, string>, body: unknown): Promise<Response> {
  return worker.fetch(new Request("http://localhost/mcp", {
    method: "POST",
    headers: {
      accept: "application/json, text/event-stream",
      "content-type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  }));
}

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
  it("serves tools/call for 2025-era clients over JSON", async () => {
    const response = await postMcp(
      { "mcp-protocol-version": "2025-11-25" },
      {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/call",
        params: { name: "generate_text_qr", arguments: { text: "hello", format: "svg" } },
      },
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
    const body = await response.json();
    expect(body.result.content[0].text).toContain("<svg");
  });

  it("serves 2026-07-28 tools/call without an initialize handshake", async () => {
    const response = await postMcp(
      {
        "mcp-protocol-version": MODERN_VERSION,
        "mcp-method": "tools/call",
        "mcp-name": "generate_text_qr",
      },
      {
        jsonrpc: "2.0",
        id: 3,
        method: "tools/call",
        params: {
          name: "generate_text_qr",
          arguments: { text: "hello", format: "svg" },
          _meta: MODERN_META,
        },
      },
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(response.headers.get("mcp-session-id")).toBeNull();
    const body = await response.json();
    expect(body.result.content[0].text).toContain("<svg");
  });

  it("marks 2026-07-28 tools/list results as cacheable", async () => {
    const response = await postMcp(
      { "mcp-protocol-version": MODERN_VERSION, "mcp-method": "tools/list" },
      { jsonrpc: "2.0", id: 4, method: "tools/list", params: { _meta: MODERN_META } },
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.result.tools).toHaveLength(10);
    expect(body.result.ttlMs).toBe(24 * 60 * 60 * 1000);
    expect(body.result.cacheScope).toBe("public");
  });
});
