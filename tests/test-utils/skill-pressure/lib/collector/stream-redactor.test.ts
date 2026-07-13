import { describe, expect, it } from "vitest";

import { createStreamRedactor } from "./stream-redactor.js";

describe("stream redactor", () => {
  it("redacts a secret split across chunks before the persistence sink receives it", () => {
    const persistedChunks: string[] = [];
    const redactor = createStreamRedactor({
      secrets: ["seeded-secret-value"],
      sink: { appendRedacted: (chunk) => persistedChunks.push(chunk) },
    });

    redactor.write("before seeded-");
    redactor.write("secret-value after");
    redactor.end();

    expect(persistedChunks.join("")).toBe("before [REDACTED] after");
    expect(persistedChunks.join("")).not.toContain("seeded-secret-value");
  });
});
