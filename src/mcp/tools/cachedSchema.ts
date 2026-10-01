import type { StandardSchemaWithJSON } from "@modelcontextprotocol/server";

type JSONSchemaOptions = Parameters<StandardSchemaWithJSON["~standard"]["jsonSchema"]["input"]>[0];

/**
 * Wraps a schema so its JSON Schema conversion runs once instead of on every
 * request. The worker builds a fresh McpServer per request, and the SDK
 * converts each tool's input schema while registering it and again for every
 * tools/list — for zod that conversion was ~90% of server construction time.
 *
 * Validation is delegated to the wrapped schema unchanged. Cached results are
 * frozen so any accidental mutation by a caller fails loudly instead of
 * leaking into later requests.
 */
export function cacheJsonSchema<Input, Output>(
  schema: StandardSchemaWithJSON<Input, Output>,
): StandardSchemaWithJSON<Input, Output> {
  const std = schema["~standard"];
  const cache = new Map<string, Record<string, unknown>>();

  const convert = (io: "input" | "output", options: JSONSchemaOptions) => {
    const key = `${io}:${options.target}`;
    let json = cache.get(key);
    if (!json) {
      json = deepFreeze(std.jsonSchema[io](options));
      cache.set(key, json);
    }
    return json;
  };

  return {
    "~standard": {
      version: std.version,
      vendor: std.vendor,
      validate: std.validate,
      jsonSchema: {
        input: (options: JSONSchemaOptions) => convert("input", options),
        output: (options: JSONSchemaOptions) => convert("output", options),
      },
    },
  };
}

function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}
