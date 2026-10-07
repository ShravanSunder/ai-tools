import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    chaiConfig: {
      truncateThreshold: 0,
    },
    globals: true,
    include: ["lib/**/*.test.ts"],
  },
});
