import { access, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import type {
  AcpxProcessExecution,
  ExecutableAcpxCommand,
} from "../runtime/acpx-command-executor.js";
import type { StructuredSemanticReviewPacket } from "./semantic-review-contract.js";
import { executeStructuredReview } from "./structured-review-runner.js";

const launcher = { executable: "/usr/local/bin/acpx", prefixArgs: [], source: "global" } as const;
const packet: StructuredSemanticReviewPacket = {
  instructions: {
    task: "classify_each_semantic_assertion",
    assertions: [
      {
        assertionId: "behavior",
        criterion: "The behavior is present.",
        evidenceSurface: "response",
      },
    ],
    outputContract: "strict_json_assertion_results",
  },
  untrustedEvidence: {
    boundary: "untrusted_quoted_evidence",
    repetitions: [
      {
        repetitionId: "treatment-1",
        variant: "treatment",
        response: { kind: "response", evidenceId: "response", text: "The behavior is present." },
        tools: [],
        artifacts: [],
        rationalizations: [],
      },
    ],
  },
};

function execution(
  stdout = "",
  overrides: Partial<AcpxProcessExecution> = {},
): AcpxProcessExecution {
  return {
    exitCode: 0,
    timedOut: false,
    cleanupComplete: true,
    stdout,
    stderr: "",
    supervisorReceipt: {
      outcome: "completed",
      exitCode: 0,
      signal: null,
      stdoutEof: true,
      stderrEof: true,
      cleanup: { processGroupId: 1, termSent: false, killSent: false },
    },
    ...overrides,
  };
}

function transcript(model: string): string {
  return [
    { result: { models: { currentModelId: model } } },
    {
      method: "session/update",
      params: { update: { sessionUpdate: "agent_message_chunk", content: { text: "reviewed" } } },
    },
    { result: { stopReason: "end_turn" } },
  ]
    .map((message) => JSON.stringify(message))
    .join("\n");
}

describe("structured ACPX semantic-review runner", () => {
  it("uses one fresh Luna/xhigh command for standard review", async () => {
    const commands: ExecutableAcpxCommand[] = [];
    const controller = new AbortController();
    let neutralInstructions = "";
    let mcpConfiguration = "";
    const reviewCommands: string[] = [];

    const result = await executeStructuredReview({
      disabledAmbientSkillPaths: [
        "/tmp/codex-home/plugins/cache/example/SKILL.md",
        "/tmp/codex-home/skills/ambient/SKILL.md",
      ],
      beforeCommand: ({ commandType }) => reviewCommands.push(commandType),
      packet,
      risk: "standard",
      launcher,
      codexExecutable: "/usr/local/bin/codex",
      timeoutSeconds: 120,
      signal: controller.signal,
      execute: async (command) => {
        commands.push(command);
        neutralInstructions = await readFile(path.join(command.cwd, "AGENTS.md"), "utf8");
        mcpConfiguration = await readFile(path.join(command.cwd, "mcp.json"), "utf8");
        return execution(transcript("gpt-5.6-luna[xhigh]"));
      },
    });

    expect(commands).toHaveLength(1);
    expect(commands[0]?.args).toEqual(
      expect.arrayContaining(["--model", "gpt-5.6-luna[xhigh]", "codex", "exec"]),
    );
    expect(commands[0]?.signal).toBe(controller.signal);
    expect(JSON.parse(commands[0]?.environment?.CODEX_CONFIG ?? "null")).toEqual({
      skills: {
        config: [
          { path: "/tmp/codex-home/plugins/cache/example/SKILL.md", enabled: false },
          { path: "/tmp/codex-home/skills/ambient/SKILL.md", enabled: false },
        ],
      },
    });
    expect(commands[0]?.cwd.startsWith(tmpdir())).toBe(true);
    expect(neutralInstructions).toContain("Semantic Review Workspace");
    expect(mcpConfiguration).toBe('{"mcpServers":[]}\n');
    expect(reviewCommands).toEqual(["reviewer_prompt"]);
    expect(result.runtimeProfile.verification.status).toBe("verified");
    expect(result.lifecycle).toMatchObject({
      risk: "standard",
      state: "completed",
      lifecycleComplete: true,
      failureCommandType: null,
    });
    expect(result.lifecycle.commandReceipts.map(({ commandType }) => commandType)).toEqual([
      "reviewer_prompt",
    ]);
    await expect(access(commands[0]?.cwd ?? "")).rejects.toThrow();
  });

  it("runs and closes a named Claude Opus/xhigh session for high-risk review", async () => {
    const commands: ExecutableAcpxCommand[] = [];
    const reviewCommands: string[] = [];

    const result = await executeStructuredReview({
      disabledAmbientSkillPaths: [],
      beforeCommand: ({ commandType }) => reviewCommands.push(commandType),
      packet,
      risk: "high",
      launcher,
      codexExecutable: "/usr/local/bin/codex",
      timeoutSeconds: 120,
      signal: new AbortController().signal,
      execute: async (command) => {
        commands.push(command);
        return execution(
          command.args.includes("--file") ? transcript("claude-opus-4-7[xhigh]") : "",
        );
      },
    });

    expect(commands.map((command) => command.args)).toEqual([
      expect.arrayContaining(["sessions", "new", "--name"]),
      expect.arrayContaining(["set", "effort", "xhigh"]),
      expect.arrayContaining(["claude", expect.stringMatching(/^pressure-review-/u), "--file"]),
      expect.arrayContaining(["sessions", "close"]),
    ]);
    expect(result.runtimeProfile.verification.status).toBe("verified");
    expect(reviewCommands).toEqual([
      "reviewer_session_create",
      "reviewer_effort_config",
      "reviewer_prompt",
      "reviewer_close",
    ]);
    expect(result.lifecycle).toMatchObject({
      risk: "high",
      state: "completed",
      lifecycleComplete: true,
      failureCommandType: null,
      namedSessionIdentity: expect.stringMatching(/^pressure-review-/u),
    });
  });

  it("closes the Claude session when its prompt fails", async () => {
    const commands: ExecutableAcpxCommand[] = [];

    const result = await executeStructuredReview({
      disabledAmbientSkillPaths: [],
      beforeCommand: () => undefined,
      packet,
      risk: "high",
      launcher,
      codexExecutable: "/usr/local/bin/codex",
      timeoutSeconds: 120,
      signal: new AbortController().signal,
      execute: async (command) => {
        commands.push(command);
        return execution("", command.args.includes("--file") ? { exitCode: 1 } : {});
      },
    });

    expect(commands.at(-1)?.args).toEqual(expect.arrayContaining(["sessions", "close"]));
    expect(result.lifecycle).toMatchObject({
      state: "failed",
      lifecycleComplete: false,
      failureCommandType: "reviewer_prompt",
    });
    expect(result.lifecycle.commandReceipts.map(({ commandType }) => commandType)).toEqual([
      "reviewer_session_create",
      "reviewer_effort_config",
      "reviewer_prompt",
      "reviewer_close",
    ]);
  });

  it("closes the Claude session when effort configuration fails", async () => {
    const commands: ExecutableAcpxCommand[] = [];

    const result = await executeStructuredReview({
      disabledAmbientSkillPaths: [],
      beforeCommand: () => undefined,
      packet,
      risk: "high",
      launcher,
      codexExecutable: "/usr/local/bin/codex",
      timeoutSeconds: 120,
      signal: new AbortController().signal,
      execute: async (command) => {
        commands.push(command);
        return execution("", command.args.includes("effort") ? { exitCode: 1 } : {});
      },
    });

    expect(commands).toHaveLength(3);
    expect(commands.at(-1)?.args).toEqual(expect.arrayContaining(["sessions", "close"]));
    expect(result.lifecycle).toMatchObject({
      state: "failed",
      lifecycleComplete: false,
      failureCommandType: "reviewer_effort_config",
    });
  });

  it("attempts named-session cleanup when session creation fails", async () => {
    const commands: ExecutableAcpxCommand[] = [];

    const result = await executeStructuredReview({
      disabledAmbientSkillPaths: [],
      beforeCommand: () => undefined,
      packet,
      risk: "high",
      launcher,
      codexExecutable: "/usr/local/bin/codex",
      timeoutSeconds: 120,
      signal: new AbortController().signal,
      execute: async (command) => {
        commands.push(command);
        return execution("", command.args.includes("new") ? { timedOut: true } : {});
      },
    });

    expect(commands).toHaveLength(2);
    expect(commands.at(-1)?.args).toEqual(expect.arrayContaining(["sessions", "close"]));
    expect(result.lifecycle).toMatchObject({
      state: "failed",
      lifecycleComplete: false,
      failureCommandType: "reviewer_session_create",
    });
  });

  it("executes mandatory close even when the accounting hook rejects it", async () => {
    const commands: ExecutableAcpxCommand[] = [];

    const result = await executeStructuredReview({
      disabledAmbientSkillPaths: [],
      beforeCommand: ({ commandType }) => {
        if (commandType === "reviewer_close") throw new Error("accounting unavailable");
      },
      packet,
      risk: "high",
      launcher,
      codexExecutable: "/usr/local/bin/codex",
      timeoutSeconds: 120,
      signal: new AbortController().signal,
      execute: async (command) => {
        commands.push(command);
        return execution(
          command.args.includes("--file") ? transcript("claude-opus-4-7[xhigh]") : "",
        );
      },
    });

    expect(commands).toHaveLength(4);
    expect(commands.at(-1)?.args).toEqual(expect.arrayContaining(["sessions", "close"]));
    expect(result.lifecycle).toMatchObject({ state: "completed", lifecycleComplete: true });
  });

  it("fails closed for unsuccessful standard review execution", async () => {
    const result = await executeStructuredReview({
      disabledAmbientSkillPaths: [],
      beforeCommand: () => undefined,
      packet,
      risk: "standard",
      launcher,
      codexExecutable: "/usr/local/bin/codex",
      timeoutSeconds: 120,
      signal: new AbortController().signal,
      execute: async () => execution("", { timedOut: true }),
    });

    expect(result.lifecycle).toMatchObject({
      risk: "standard",
      state: "failed",
      lifecycleComplete: false,
      failureCommandType: "reviewer_prompt",
    });
  });
});
