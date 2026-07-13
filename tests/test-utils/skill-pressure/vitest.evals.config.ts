import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["evals/**/*.eval.ts"],
    reporters: ["vitest-evals/reporter"],
    testTimeout: 2_400_000,
  },
});
