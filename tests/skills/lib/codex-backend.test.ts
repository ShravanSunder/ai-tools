import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { parseScenarioMarkdown } from "./scenario-parser.js";
import {
  runCodexPressureCase,
  type ProcessRunRequest,
} from "./codex-backend.js";

const scenario = parseScenarioMarkdown({
  filePath: "/repo/tests/skills/pressure-scenarios/backend.md",
  markdown: `scenario_id: backend
skill_under_test: shravan-dev-workflow:test-skill

## Prompt

Use the skill.
`,
});

describe("runCodexPressureCase", () => {
  test("invokes codex with read-only sandbox and schema output arguments", async () => {
    const repoRoot = mkdtempSync(join(tmpdir(), "skill-pressure-repo-"));
    const requests: ProcessRunRequest[] = [];

    const result = await runCodexPressureCase({
      scenario,
      renderedPrompt: "rendered prompt",
      repoRoot,
      model: "gpt-test",
      reasoningEffort: "low",
      timeoutSeconds: 123,
      processRunner: async (request) => {
        requests.push(request);
        const finalFile =
          request.args[request.args.indexOf("--output-last-message") + 1];
        if (!finalFile) {
          throw new Error("missing final file arg");
        }
        writeFileSync(finalFile, "{}");
        writeFileSync(request.stdoutFile, "{}\n");
        return { exitCode: 0, stderr: "", timedOut: false };
      },
    });

    expect(requests).toHaveLength(1);
    expect(requests[0]?.command).toBe("codex");
    expect(requests[0]?.args).toEqual(
      expect.arrayContaining([
        "exec",
        "-C",
        repoRoot,
        "-m",
        "gpt-test",
        "--sandbox",
        "read-only",
        "--output-schema",
        join(repoRoot, "tests/skills/schemas/skill-pressure-result.schema.json"),
        "--output-last-message",
        result.finalJsonPath,
        "--json",
        "-",
      ]),
    );
    expect(requests[0]?.timeoutMs).toBe(123_000);
    expect(readFileSync(result.promptPath, "utf8")).toBe("rendered prompt");
    expect(result.readOnlyRequested).toBe(true);
    expect(result.artifactPaths).toEqual(
      expect.arrayContaining([
        result.promptPath,
        result.finalJsonPath,
        result.eventsPath,
      ]),
    );
    expect(result.artifactDirectory.startsWith(join(repoRoot, "tmp/skill-pressure-evals/"))).toBe(true);
  });

  test("records classified timeout results", async () => {
    const repoRoot = mkdtempSync(join(tmpdir(), "skill-pressure-repo-"));

    const result = await runCodexPressureCase({
      scenario,
      renderedPrompt: "rendered prompt",
      repoRoot,
      model: "gpt-test",
      reasoningEffort: "low",
      timeoutSeconds: 1,
      processRunner: async (request) => {
        writeFileSync(request.stdoutFile, "");
        return { exitCode: 124, stderr: "timed out", timedOut: true };
      },
    });

    expect(result.timedOut).toBe(true);
    expect(result.exitCode).toBe(124);
    expect(result.stderr).toContain("timed out");
  });
});
