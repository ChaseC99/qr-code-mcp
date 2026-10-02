import { describe, expect, it } from "vitest";
import { z } from "zod";
import { cacheJsonSchema } from "./cachedSchema.js";

const target = "draft-2020-12";

describe("cacheJsonSchema", () => {
  const source = z.object({ text: z.string().describe("Text to encode") });

  it("converts once and returns the same frozen JSON Schema afterwards", () => {
    const cached = cacheJsonSchema(source);
    const first = cached["~standard"].jsonSchema.input({ target });
    const second = cached["~standard"].jsonSchema.input({ target });

    expect(second).toBe(first);
    expect(first).toEqual(source["~standard"].jsonSchema.input({ target }));
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.properties)).toBe(true);
  });

  it("delegates validation to the wrapped schema", async () => {
    const cached = cacheJsonSchema(source);

    expect(await cached["~standard"].validate({ text: "hi" })).toEqual({ value: { text: "hi" } });
    expect(await cached["~standard"].validate({ text: 1 })).toHaveProperty("issues");
  });
});
