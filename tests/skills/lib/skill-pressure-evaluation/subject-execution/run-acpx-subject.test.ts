import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import type { AcpxAgentRunRequest } from "../agent-execution/acpx-codex-agent-runner.js";
import type { AcpxCodexAgentSetup } from "../runtime-configuration/skill-pressure-runtime-configuration.js";
import { parseScenarioMarkdown } from "../scenario-cases/parse-scenario-fixture.js";
import { runAcpxPressureCase } from "./run-acpx-subject.js";

const scenario = parseScenarioMarkdown({
  filePath: "/repo/tests/skills/pressure-scenarios/backend.md",
  markdown: `scenario_id: backend
skill_under_test: shravan-dev-workflow:test-skill

## Prompt

Use the skill.
`,
});
const input = {
  scenarioId: scenario.scenarioId,
  skillUnderTest: scenario.skillUnderTest,
  mode: scenario.mode,
  prompt: scenario.prompt,
};
const subjectSetup = {
  model: "gpt-test",
  reasoningEffort: "high",
  timeoutSeconds: 123,
  permissionMode: "approve-reads",
} satisfies AcpxCodexAgentSetup;

describe("runAcpxPressureCase", () => {
  test("executes the scenario once through the injected ACPX runner", async () => {
    const repoRoot = mkdtempSync(join(tmpdir(), "skill-pressure-repo-"));
    const requests: AcpxAgentRunRequest[] = [];
    const controller = new AbortController();

    const result = await runAcpxPressureCase({
      input,
      renderedPrompt: "rendered prompt",
      repoRoot,
      signal: controller.signal,
      setup: subjectSetup,
      runner: async (request) => {
        requests.push(request);
        return {
          finalText: '{"scenario_id":"backend"}',
          rawEvents: '{"method":"session/update"}\n',
          stderr: "",
        };
      },
    });

    expect(requests).toEqual([
      {
        namePrefix: "pressure-subject-backend",
        prompt: "rendered prompt",
        signal: controller.signal,
        setup: subjectSetup,
      },
    ]);
    expect(readFileSync(result.promptPath, "utf8")).toBe("rendered prompt");
    expect(readFileSync(result.finalJsonPath, "utf8")).toBe(
      '{"scenario_id":"backend"}',
    );
    expect(readFileSync(result.eventsPath, "utf8")).toContain(
      "session/update",
    );
    expect(result.readOnlyRequested).toBe(true);
  });
});
