import { defineConfig } from "vitest/config";

import { resolveSkillPressureEvaluationConfiguration } from "./lib/evaluation/evaluation-registration.js";

const configuration = resolveSkillPressureEvaluationConfiguration(process.env);

export default defineConfig({
  test: {
    include: ["evals/**/*.eval.ts"],
    reporters: ["vitest-evals/reporter"],
    maxConcurrency: configuration.jobs,
  },
});
