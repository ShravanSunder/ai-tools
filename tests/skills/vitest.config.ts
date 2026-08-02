import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    chaiConfig: {
      truncateThreshold: 0,
    },
    globals: true,
    include: ["lib/**/*.test.ts", "evals/**/*.eval.ts"],
    maxConcurrency: 4,
    reporters: ["vitest-evals/reporter"],
    testTimeout: 900_000,
  },
});
