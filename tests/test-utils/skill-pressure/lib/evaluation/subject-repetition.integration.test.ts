import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, readdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import type { AcpxProcessExecution, ExecutableAcpxCommand } from "../runtime/acpx-command-executor.js";
import {
  assertComparablePair,
  readMaterializedPrompt,
  runSubjectRepetition,
  type RunSubjectRepetitionProps,
} from "./subject-repetition.js";

async function createFixture(): Promise<{
  readonly runRoot: string;
  readonly skillDirectory: string;
}> {
  const root = await mkdtemp(path.join(tmpdir(), "subject-repetition-"));
  const runRoot = path.join(root, "runs");
  const skillDirectory = path.join(root, "skill");
  await mkdir(path.join(skillDirectory, "references"), { recursive: true });
  await writeFile(path.join(skillDirectory, "SKILL.md"), "# Test skill\n\nReject the shortcut.\n");
  await writeFile(path.join(skillDirectory, "references", "detail.md"), "Detailed rule.\n");
  return { runRoot, skillDirectory };
}

function successfulExecution(sessionId: string): AcpxProcessExecution {
  return {
    exitCode: 0,
    timedOut: false,
    cleanupComplete: true,
    stderr: "",
    supervisorReceipt: {
      outcome: "completed",
      exitCode: 0,
      signal: null,
      stdoutEof: true,
      stderrEof: true,
      cleanup: { processGroupId: 123, termSent: false, killSent: false },
    },
    stdout: [
      { method: "session/new", params: { mcpServers: [] } },
      { result: { sessionId, models: { currentModelId: "gpt-5.6-luna[xhigh]" } } },
      { method: "session/prompt" },
      { method: "session/update", params: { update: { sessionUpdate: "agent_message_chunk", content: { text: "Operator-facing answer" } } } },
      { method: "session/update", params: { update: { sessionUpdate: "usage_update", _meta: { usage: { input_tokens: 10, output_tokens: 5 } } } } },
      { result: { stopReason: "end_turn" } },
    ].map((message) => JSON.stringify(message)).join("\n"),
  };
}

function baseProps(fixture: Awaited<ReturnType<typeof createFixture>>): Omit<RunSubjectRepetitionProps, "variant" | "selectedSkillSource" | "execute"> {
  return {
    runRoot: fixture.runRoot,
    scenarioId: "shortcut-pressure",
    prompt: "Finish the task without taking the requested shortcut.",
    fixtureFiles: [{ path: "src/input.txt", contents: "fixture\n" }],
    expectedArtifacts: [],
    allowedTools: [],
    allowedWritePaths: [],
    skillName: "test-skill",
    launcher: { executable: "/opt/homebrew/bin/acpx", prefixArgs: [], source: "global" },
    codexExecutable: "/opt/homebrew/bin/codex",
    runtimeIdentity: {
      launcher: { executable: "/opt/homebrew/bin/acpx", prefixArgs: [], source: "global" },
      launcherDigest: "sha256:acpx",
      launcherVersion: "0.12.0",
      codexExecutable: "/opt/homebrew/bin/codex",
      codexDigest: "sha256:codex",
      codexVersion: "codex-cli 0.144.3",
    },
    model: "gpt-5.6-luna",
    reasoningEffort: "xhigh",
    permissionMode: "approve-reads",
    disabledAmbientSkillPaths: [],
    timeoutSeconds: 120,
    redactionSecrets: [],
  };
}

describe("ACPX subject repetition", () => {
  it("creates comparable fresh baseline and treatment repositories", async () => {
    const fixture = await createFixture();
    let sessionNumber = 0;
    const execute = async (command: ExecutableAcpxCommand): Promise<AcpxProcessExecution> => {
      sessionNumber += 1;
      expect(command.cwd).toContain(fixture.runRoot);
      expect(await readFile(command.args.at(-1) ?? "", "utf8")).toBe(
        "Finish the task without taking the requested shortcut.",
      );
      return successfulExecution(`session-${sessionNumber}`);
    };
    const baseline = await runSubjectRepetition({
      ...baseProps(fixture),
      variant: "baseline",
      selectedSkillSource: { mode: "none" },
      execute,
    });
    const treatment = await runSubjectRepetition({
      ...baseProps(fixture),
      variant: "treatment",
      selectedSkillSource: { mode: "current", directory: fixture.skillDirectory },
      execute,
    });

    expect(() => assertComparablePair(baseline, treatment)).not.toThrow();
    expect(baseline.status).toBe("executed");
    expect(treatment.status).toBe("executed");
    expect(baseline.repositoryDirectory).not.toBe(treatment.repositoryDirectory);
    expect(baseline.sourceDigest).toBeNull();
    expect(treatment.installReceipt?.files.map((file) => file.relativePath)).toEqual([
      "SKILL.md",
      "references/detail.md",
    ]);
    expect(await readMaterializedPrompt(treatment)).not.toContain("Reject the shortcut");
  });

  it("classifies model drift, timeout, and incomplete cleanup as infrastructure errors", async () => {
    const fixture = await createFixture();
    const receipt = await runSubjectRepetition({
      ...baseProps(fixture),
      variant: "baseline",
      selectedSkillSource: { mode: "none" },
      execute: async () => ({
        ...successfulExecution("session-timeout"),
        exitCode: 3,
        timedOut: true,
        cleanupComplete: false,
        supervisorReceipt: {
          outcome: "timed_out",
          exitCode: null,
          signal: "SIGKILL",
          stdoutEof: true,
          stderrEof: true,
          cleanup: { processGroupId: 456, termSent: true, killSent: true },
        },
        stdout: successfulExecution("session-timeout").stdout.replace("gpt-5.6-luna[xhigh]", "gpt-5.6-luna[medium]"),
      }),
    });

    expect(receipt.status).toBe("infrastructure_error");
    expect(receipt.infrastructureReasons).toEqual(expect.arrayContaining([
      "ACPX exited 3",
      "ACPX timed out",
      "process cleanup is incomplete",
      "runtime profile is unverified: provider-reported reasoning effort does not match the accepted profile",
    ]));
    expect(receipt.process.supervisorReceipt).toMatchObject({
      outcome: "timed_out",
      stdoutEof: true,
      stderrEof: true,
      cleanup: { processGroupId: 456, termSent: true, killSent: true },
    });
  });

  it("captures model-created repository files and declared artifact facts", async () => {
    const fixture = await createFixture();
    const receipt = await runSubjectRepetition({
      ...baseProps(fixture),
      expectedArtifacts: [{
        artifactId: "result",
        path: "reports/result.md",
        fileType: "file",
        contentContract: "operator report",
      }],
      variant: "treatment",
      selectedSkillSource: { mode: "current", directory: fixture.skillDirectory },
      execute: async (command) => {
        await mkdir(path.join(command.cwd, "reports"), { recursive: true });
        await writeFile(path.join(command.cwd, "reports", "result.md"), "verified report\n");
        return successfulExecution("artifact-session");
      },
    });

    expect(receipt.repositoryEvidence.changes.files).toEqual([
      expect.objectContaining({
        path: "reports/result.md",
        change: "added",
        contentExcerpt: "verified report\n",
        contentDigest: expect.stringMatching(/^sha256:/u),
      }),
    ]);
    expect(receipt.repositoryEvidence.artifacts).toEqual([
      expect.objectContaining({
        artifactId: "result",
        path: "reports/result.md",
        status: "observed",
        kind: "file",
      }),
    ]);
  });

  it("materializes path-bounded write instructions and receipts unauthorized writes", async () => {
    const fixture = await createFixture();
    const receipt = await runSubjectRepetition({
      ...baseProps(fixture),
      allowedTools: ["write"],
      allowedWritePaths: ["reports/result.md"],
      permissionMode: "approve-all",
      variant: "treatment",
      selectedSkillSource: { mode: "current", directory: fixture.skillDirectory },
      execute: async (command) => {
        const materializedPrompt = await readFile(command.args.at(-1) ?? "", "utf8");
        expect(materializedPrompt).toContain("You may write only these repository-relative paths:");
        expect(materializedPrompt).toContain("- reports/result.md");
        await mkdir(path.join(command.cwd, "reports"), { recursive: true });
        await writeFile(path.join(command.cwd, "reports", "result.md"), "allowed\n");
        await writeFile(path.join(command.cwd, "unexpected.md"), "not allowed\n");
        return successfulExecution("write-policy-session");
      },
    });

    expect(receipt.allowedTools).toEqual(["write"]);
    expect(receipt.allowedWritePaths).toEqual(["reports/result.md"]);
    expect(receipt.writePolicy).toEqual({
      status: "behavior_fail",
      unauthorizedPaths: ["unexpected.md"],
    });
  });

  it("records an ambient skill that disappears after discovery without crashing", async () => {
    const fixture = await createFixture();
    const missingSkillPath = path.join(fixture.runRoot, "removed-skill", "SKILL.md");
    const receipt = await runSubjectRepetition({
      ...baseProps(fixture),
      disabledAmbientSkillPaths: [missingSkillPath],
      variant: "baseline",
      selectedSkillSource: { mode: "none" },
      execute: async () => successfulExecution("missing-ambient-session"),
    });

    expect(receipt.status).toBe("executed");
    expect(receipt.disabledAmbientSkills).toEqual([
      { path: missingSkillPath, status: "missing", digest: null },
    ]);
  });

  it("rejects transport diagnostics even when ACPX exits zero and ends the turn", async () => {
    const fixture = await createFixture();
    const execution = successfulExecution("diagnostic-session");
    const receipt = await runSubjectRepetition({
      ...baseProps(fixture),
      variant: "baseline",
      selectedSkillSource: { mode: "none" },
      execute: async () => ({
        ...execution,
        stdout: execution.stdout.replace(
          "Operator-facing answer",
          "stream disconnected before completion: error sending request for url",
        ),
      }),
    });

    expect(receipt.status).toBe("infrastructure_error");
    expect(receipt.infrastructureReasons).toContain("operator response contains transport diagnostics");
  });

  it("never exposes configured secrets in a persistable repetition receipt", async () => {
    const fixture = await createFixture();
    const secret = "token-persisted-secret-value";
    const execution = successfulExecution("redaction-session");
    const receipt = await runSubjectRepetition({
      ...baseProps(fixture),
      redactionSecrets: [secret],
      variant: "baseline",
      selectedSkillSource: { mode: "none" },
      execute: async () => ({
        ...execution,
        stderr: `provider diagnostic ${secret}`,
        stdout: execution.stdout.replace("Operator-facing answer", `answer ${secret}`),
      }),
    });

    expect(JSON.stringify(receipt)).not.toContain(secret);
    expect(receipt.transcript.visibleResponse).toContain("[REDACTED]");
    expect(receipt.process.stderrExcerpt).toContain("[REDACTED]");
  });

  it("rejects reused ACPX sessions even when every other pair input matches", async () => {
    const fixture = await createFixture();
    const execute = async (): Promise<AcpxProcessExecution> => successfulExecution("reused-session");
    const baseline = await runSubjectRepetition({ ...baseProps(fixture), variant: "baseline", selectedSkillSource: { mode: "none" }, execute });
    const treatment = await runSubjectRepetition({ ...baseProps(fixture), variant: "treatment", selectedSkillSource: { mode: "current", directory: fixture.skillDirectory }, execute });

    expect(() => assertComparablePair(baseline, treatment)).toThrow(/reused an ACPX session/);
  });

  it("rejects execution inputs that do not match the measured runtime identity", async () => {
    const fixture = await createFixture();
    await expect(runSubjectRepetition({
      ...baseProps(fixture),
      launcher: { executable: "/different/acpx", prefixArgs: [], source: "global" },
      variant: "baseline",
      selectedSkillSource: { mode: "none" },
      execute: async () => successfulExecution("unused"),
    })).rejects.toThrow(/runtime identity does not match/);
  });

  it("rejects fixture paths that escape the disposable repository", async () => {
    const fixture = await createFixture();
    await expect(runSubjectRepetition({
      ...baseProps(fixture),
      fixtureFiles: [{ path: "../outside.txt", contents: "nope" }],
      variant: "baseline",
      selectedSkillSource: { mode: "none" },
      execute: async () => successfulExecution("unused"),
    })).rejects.toThrow(/escapes repository/);
  });

  it("installs an immutable previous Git revision when skill content is unchanged", async () => {
    const fixture = await createFixture();
    const sourceRepository = path.join(fixture.runRoot, "source-repository");
    const skillRelativePath = "plugins/workflow/skills/changed-skill";
    const skillDirectory = path.join(sourceRepository, skillRelativePath);
    await mkdir(skillDirectory, { recursive: true });
    execFileSync("git", ["init", "--quiet"], { cwd: sourceRepository });
    execFileSync("git", ["config", "user.email", "pressure@example.invalid"], { cwd: sourceRepository });
    execFileSync("git", ["config", "user.name", "Pressure Test"], { cwd: sourceRepository });
    execFileSync("git", ["config", "commit.gpgsign", "false"], { cwd: sourceRepository });
    await writeFile(path.join(skillDirectory, "SKILL.md"), "# Previous guidance\n");
    execFileSync("git", ["add", "."], { cwd: sourceRepository });
    execFileSync("git", ["commit", "--quiet", "-m", "previous"], { cwd: sourceRepository });
    const previousRevision = execFileSync("git", ["rev-parse", "HEAD"], { cwd: sourceRepository, encoding: "utf8" }).trim();
    await writeFile(path.join(skillDirectory, "SKILL.md"), "# Previous guidance\n");

    let sessionNumber = 0;
    const execute = async (): Promise<AcpxProcessExecution> => successfulExecution(`revision-session-${++sessionNumber}`);
    const baseline = await runSubjectRepetition({
      ...baseProps(fixture),
      variant: "baseline",
      selectedSkillSource: {
        mode: "previous_revision",
        repositoryRoot: sourceRepository,
        revision: previousRevision,
        skillRelativePath,
      },
      execute,
    });
    const treatment = await runSubjectRepetition({
      ...baseProps(fixture),
      variant: "treatment",
      selectedSkillSource: { mode: "current", directory: skillDirectory },
      execute,
    });

    expect(() => assertComparablePair(baseline, treatment)).not.toThrow();
    expect(baseline.sourceMode).toBe("previous_revision");
    expect(baseline.sourceRevision).toBe(previousRevision);
    expect(baseline.sourceDigest).toBe(treatment.sourceDigest);
  });

  it("does not leak a temporary source when historical extraction fails", async () => {
    const fixture = await createFixture();
    const sourceRepository = path.join(fixture.runRoot, "missing-source-repository");
    await mkdir(sourceRepository, { recursive: true });
    execFileSync("git", ["init", "--quiet"], { cwd: sourceRepository });
    execFileSync("git", ["config", "user.email", "pressure@example.invalid"], { cwd: sourceRepository });
    execFileSync("git", ["config", "user.name", "Pressure Test"], { cwd: sourceRepository });
    execFileSync("git", ["config", "commit.gpgsign", "false"], { cwd: sourceRepository });
    await writeFile(path.join(sourceRepository, "README.md"), "fixture\n");
    execFileSync("git", ["add", "."], { cwd: sourceRepository });
    execFileSync("git", ["commit", "--quiet", "-m", "fixture"], { cwd: sourceRepository });

    await expect(runSubjectRepetition({
      ...baseProps(fixture),
      variant: "baseline",
      selectedSkillSource: {
        mode: "previous_revision",
        repositoryRoot: sourceRepository,
        revision: "HEAD",
        skillRelativePath: "missing/skill",
      },
      execute: async () => successfulExecution("unused"),
    })).rejects.toThrow(/skill path is missing/);
    expect((await readdir(fixture.runRoot)).filter((entry) => entry.startsWith(".previous-source-"))).toEqual([]);
  });
});
