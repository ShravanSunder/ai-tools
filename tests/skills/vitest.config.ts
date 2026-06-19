import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: ["lib/**/*.test.ts", "evals/**/*.eval.ts"],
    reporters: ["vitest-evals/reporter"],
    testTimeout: 900_000,
  },
});
