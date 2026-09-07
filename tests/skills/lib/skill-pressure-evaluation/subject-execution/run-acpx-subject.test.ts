import { mkdtempSync, readFileSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import type { AcpxAgentRunRequest } from "../agent-execution/acpx-codex-agent-runner.js";
import type { AcpxCodexAgentSetup } from "../runtime-configuration/skill-pressure-runtime-configuration.js";
import { parseScenarioMarkdown } from "../scenario-cases/parse-scenario-fixture.js";
import { runAcpxPressureCase } from "./run-acpx-subject.js";
import { validateAcpxTurnResults } from "./create-skill-pressure-subject-harness.js";

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
  test("keeps the failed runner diagnostic beside the scenario prompt", async () => {
    const repoRoot = mkdtempSync(join(tmpdir(), "skill-pressure-repo-"));
    const failure = new Error("ACPX exited with code 5: permission denied");

    await expect(runAcpxPressureCase({
      input,
      renderedPrompt: "rendered prompt",
      repoRoot,
      setup: subjectSetup,
      runner: async () => { throw failure; },
    })).rejects.toBe(failure);

    const artifactRoot = join(repoRoot, "tmp/skill-pressure-evals");
    const artifactName = readdirSync(artifactRoot)[0] ?? "";
    expect(readFileSync(join(artifactRoot, artifactName, "stderr.txt"), "utf8"))
      .toContain(failure.message);
  });

  test("strictly rejects an invalid earlier final message from the same request", () => {
    const validLastResponse = JSON.stringify({
      scenario_id: "backend",
      skill_under_test: "shravan-dev-workflow:test-skill",
      skill_invoked: true,
      mode: "fast",
      read_only: true,
      artifact_expected: false,
      artifact_created: false,
      decision: "Valid latest response.",
      coverage_evidence: [],
      shortcut_resisted: true,
      rationalizations_rejected: [],
      open_questions: [],
      next_action: "none",
    });

    expect(() =>
      validateAcpxTurnResults({
        turnTexts: [validLastResponse],
        turnMessageTexts: [['{"scenario_id":"backend"', validLastResponse]],
      }),
    ).toThrow("request 1 response 1");
  });

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
          turnTexts: ['{"scenario_id":"backend"}'],
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

  test("sends follow-up turns to the same run and keeps per-turn artifacts", async () => {
    const repoRoot = mkdtempSync(join(tmpdir(), "skill-pressure-repo-"));
    const requests: AcpxAgentRunRequest[] = [];

    const result = await runAcpxPressureCase({
      input,
      renderedPrompt: "rendered prompt",
      renderedFollowUpPrompts: ["rendered follow-up"],
      repoRoot,
      setup: subjectSetup,
      runner: async (request) => {
        requests.push(request);
        return {
          finalText: '{"scenario_id":"backend","turn":2}',
          turnTexts: [
            '{"scenario_id":"backend","turn":1}',
            '{"scenario_id":"backend","turn":2}',
          ],
          turnMessageTexts: [
            [
              '{"scenario_id":"backend","turn":1,"part":1}',
              '{"scenario_id":"backend","turn":1}',
            ],
            ['{"scenario_id":"backend","turn":2}'],
          ],
          rawEvents: '{"method":"session/update"}\n',
          stderr: "",
        };
      },
    });

    expect(requests).toEqual([
      {
        namePrefix: "pressure-subject-backend",
        prompt: "rendered prompt",
        followUpPrompts: ["rendered follow-up"],
        setup: subjectSetup,
      },
    ]);
    expect(result.turnTexts).toEqual([
      '{"scenario_id":"backend","turn":1}',
      '{"scenario_id":"backend","turn":2}',
    ]);
    expect(result.turnMessageTexts).toEqual([
      [
        '{"scenario_id":"backend","turn":1,"part":1}',
        '{"scenario_id":"backend","turn":1}',
      ],
      ['{"scenario_id":"backend","turn":2}'],
    ]);
    expect(readFileSync(result.finalJsonPath, "utf8")).toBe(
      '{"scenario_id":"backend","turn":2}',
    );
    const followUpPromptPath = result.artifactPaths.find((artifactPath) =>
      artifactPath.endsWith("follow-up-1.md"),
    );
    const firstTurnPath = result.artifactPaths.find((artifactPath) =>
      artifactPath.endsWith("turn-1.json"),
    );
    expect(followUpPromptPath).toBeDefined();
    expect(firstTurnPath).toBeDefined();
    expect(readFileSync(followUpPromptPath ?? "", "utf8")).toBe(
      "rendered follow-up",
    );
    expect(readFileSync(firstTurnPath ?? "", "utf8")).toBe(
      '{"scenario_id":"backend","turn":1}',
    );
  });
});
