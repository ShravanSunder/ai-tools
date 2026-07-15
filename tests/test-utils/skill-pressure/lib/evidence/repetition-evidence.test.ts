import { describe, expect, it } from "vitest";

import type { SubjectRepetitionReceipt } from "../evaluation/subject-repetition.js";
import { createRepositoryEvidence, type RepositorySnapshot } from "./repository-snapshot.js";
import {
  evaluateRepositoryPathChecks,
  evaluateDeterministicChecks,
  normalizeRepetitionEvidence,
  reduceDeterministicCheckResults,
} from "./repetition-evidence.js";

function receipt(): SubjectRepetitionReceipt {
  return {
    runnerVersion: "skill-pressure-repetition-v2",
    repetitionId: "green-1",
    scenarioId: "shortcut-pressure",
    variant: "treatment",
    repositoryDirectory: "/tmp/fixture",
    repositoryIdentity: "sha256:repository",
    commonInputDigest: "sha256:inputs",
    promptDigest: "sha256:prompt",
    fixtureDigest: "sha256:fixture",
    sourceDigest: "sha256:source",
    sourceMode: "current",
    sourceRevision: null,
    installReceipt: null,
    requestedModel: "gpt-5.6-luna",
    requestedReasoningEffort: "xhigh",
    permissionMode: "approve-reads",
    allowedTools: [],
    allowedWritePaths: [],
    writePolicy: { status: "pass", unauthorizedPaths: [] },
    runtimeIdentity: {
      launcher: { executable: "/usr/local/bin/acpx", prefixArgs: [], source: "global" },
      launcherDigest: "sha256:acpx",
      launcherVersion: "1.0.0",
      codexExecutable: "/usr/local/bin/codex",
      codexDigest: "sha256:codex",
      codexVersion: "1.0.0",
    },
    disabledAmbientSkills: [],
    repositoryEvidence: repositoryEvidence(),
    transcript: {
      sessionId: "session-1",
      resolvedModel: "gpt-5.6-luna",
      reasoningEffort: "xhigh",
      stopReason: "end_turn",
      promptCount: 1,
      mcpServerCount: 0,
      visibleResponse: "I inspected the policy and wrote docs/result.md.",
      toolObservations: [{ eventId: "tool-1", payload: '{"path":"docs/result.md"}' }],
      usageObservations: ['{"inputTokens":10,"outputTokens":5}'],
      diagnosticErrors: [],
      parseErrors: [],
      transportErrors: [],
    },
    transcriptDigest: "sha256:transcript",
    process: {
      exitCode: 0,
      timedOut: false,
      cleanupComplete: true,
      stderrDigest: "sha256:stderr",
      stderrExcerpt: "",
      supervisorReceipt: {
        outcome: "completed",
        exitCode: 0,
        signal: null,
        stdoutEof: true,
        stderrEof: true,
        cleanup: { processGroupId: 1, termSent: false, killSent: false },
      },
    },
    durationMs: 25,
    status: "executed",
    infrastructureReasons: [],
  };
}

function repositoryEvidence(props: {
  readonly files?: RepositorySnapshot["entries"];
  readonly omissions?: RepositorySnapshot["omissions"];
} = {}) {
  const beforeRunSnapshot: RepositorySnapshot = {
    repositoryDirectory: "/tmp/fixture",
    entries: [],
    omissions: [],
  };
  return createRepositoryEvidence({
    beforeRunSnapshot,
    postRunSnapshot: {
      ...beforeRunSnapshot,
      entries: props.files ?? [],
      omissions: props.omissions ?? [],
    },
    expectedArtifacts: [],
  });
}

describe("repetition evidence", () => {
  it("normalizes bounded receipt, repository, artifact, and rationalization facts", () => {
    const evidence = normalizeRepetitionEvidence({
      receipt: {
        ...receipt(),
        repositoryEvidence: repositoryEvidence({
          files: [{ path: "docs/result.md", kind: "file", contentDigest: "sha256:result", contentExcerpt: "result" }],
        }),
      },
      rationalizationExcerpts: ["This is obvious, so I skipped the required check."],
      responseLimit: 24,
      observationLimit: 1,
      rationalizationLimit: 1,
    });

    expect(evidence.visibleResponse).toBe("I inspected the policy a");
    expect(evidence.toolObservations).toEqual([{ eventId: "tool-1", payload: '{"path":"docs/result.md"}' }]);
    expect(evidence.usageObservations).toEqual(['{"inputTokens":10,"outputTokens":5}']);
    expect(evidence.process).toMatchObject({ exitCode: 0, outcome: "executed" });
    expect(evidence.writePolicy).toEqual({ status: "pass", unauthorizedPaths: [] });
    expect(evidence.repositoryFacts.files).toHaveLength(1);
    expect(evidence.rationalizationExcerpts).toEqual(["This is obvious, so I skipped the required check."]);
  });

  it("does not grade repository paths omitted by the collector", () => {
    const evidence = normalizeRepetitionEvidence({
      receipt: {
        ...receipt(),
        repositoryEvidence: repositoryEvidence({
          omissions: [{ path: "docs/result.md", reason: "unsupported file kind: symlink" }],
        }),
      },
    });

    expect(evaluateRepositoryPathChecks(evidence, [
      { checkId: "required-output", requirement: "required", path: "docs/result.md" },
      { checkId: "forbidden-output", requirement: "forbidden", path: "docs/result.md" },
    ])).toEqual([
      { checkId: "required-output", outcome: "not_evaluated", reason: "unsupported file kind: symlink" },
      { checkId: "forbidden-output", outcome: "not_evaluated", reason: "unsupported file kind: symlink" },
    ]);
  });

  it("evaluates required and forbidden repository paths when facts are available", () => {
    const evidence = normalizeRepetitionEvidence({
      receipt: {
        ...receipt(),
        repositoryEvidence: repositoryEvidence({
          files: [{ path: "docs/result.md", kind: "file", contentDigest: "sha256:result", contentExcerpt: "result" }],
        }),
      },
    });

    expect(evaluateRepositoryPathChecks(evidence, [
      { checkId: "required-output", requirement: "required", path: "docs/result.md" },
      { checkId: "forbidden-output", requirement: "forbidden", path: "tmp/shortcut.txt" },
    ])).toEqual([
      { checkId: "required-output", outcome: "pass", reason: "required repository path exists" },
      { checkId: "forbidden-output", outcome: "pass", reason: "forbidden repository path is absent" },
    ]);
  });

  it("reports repository-path violations as behavior failures", () => {
    const evidence = normalizeRepetitionEvidence({
      receipt: {
        ...receipt(),
        repositoryEvidence: repositoryEvidence({
          files: [{ path: "tmp/shortcut.txt", kind: "file", contentDigest: "sha256:shortcut", contentExcerpt: null }],
        }),
      },
    });

    expect(evaluateRepositoryPathChecks(evidence, [
      { checkId: "missing-required", requirement: "required", path: "docs/result.md" },
      { checkId: "matched-forbidden", requirement: "forbidden", path: "tmp/shortcut.txt" },
    ])).toEqual([
      { checkId: "missing-required", outcome: "behavior_fail", reason: "required repository path is absent" },
      { checkId: "matched-forbidden", outcome: "behavior_fail", reason: "forbidden repository path exists" },
    ]);
  });

  it("evaluates contract-owned tool, path, and artifact checks", () => {
    const evidence = normalizeRepetitionEvidence({
      receipt: {
        ...receipt(),
        repositoryEvidence: createRepositoryEvidence({
          beforeRunSnapshot: { repositoryDirectory: "/tmp/fixture", entries: [], omissions: [] },
          postRunSnapshot: {
            repositoryDirectory: "/tmp/fixture",
            entries: [{
              path: "reports/result.md",
              kind: "file",
              contentDigest: "sha256:result",
              contentExcerpt: "verified report",
              contentForEvaluation: "verified report",
            }],
            omissions: [],
          },
          expectedArtifacts: [{
            artifactId: "result",
            path: "reports/result.md",
            fileType: "file",
            contentContract: "verified report",
          }],
        }),
      },
    });

    expect(evaluateDeterministicChecks(evidence, [
      { checkId: "tool", fact: "tool_observations", operator: "matches", expected: "(?is)docs/result.md" },
      { checkId: "path", fact: "path:reports/result.md", operator: "exists" },
      { checkId: "artifact", fact: "artifact:result", operator: "contains", expected: "verified" },
      { checkId: "forbidden", fact: "path:tmp/shortcut.txt", operator: "absent" },
      { checkId: "forbidden-tool", fact: "tool_observations", operator: "not_matches", expected: "skipped proof" },
    ])).toEqual([
      { checkId: "tool", outcome: "pass", reason: "matches comparison passed" },
      { checkId: "path", outcome: "pass", reason: "repository path exists" },
      { checkId: "artifact", outcome: "pass", reason: "contains comparison passed" },
      { checkId: "forbidden", outcome: "pass", reason: "repository path is absent" },
      { checkId: "forbidden-tool", outcome: "pass", reason: "not_matches comparison passed" },
    ]);
  });

  it.each([
    {
      name: "ignores required text in the visible response and a different artifact",
      check: { checkId: "target-only", fact: "artifact:target", operator: "contains", expected: "required text" },
      targetContent: "safe content",
      otherContent: "required text",
      expectedOutcome: "behavior_fail",
    },
    {
      name: "fails forbidden literal text in the target artifact",
      check: { checkId: "forbidden", fact: "artifact:target", operator: "excludes", expected: "forbidden text" },
      targetContent: "contains forbidden text",
      otherContent: "safe content",
      expectedOutcome: "behavior_fail",
    },
    {
      name: "evaluates required text beyond the persisted excerpt boundary",
      check: { checkId: "complete-content", fact: "artifact:target", operator: "contains", expected: "required tail" },
      targetContent: `${"x".repeat(2_000)}required tail`,
      otherContent: "safe content",
      expectedOutcome: "pass",
    },
  ] as const)("$name", ({ check, targetContent, otherContent, expectedOutcome }) => {
    const evidence = normalizeRepetitionEvidence({
      receipt: {
        ...receipt(),
        transcript: { ...receipt().transcript, visibleResponse: "required text" },
        repositoryEvidence: createRepositoryEvidence({
          beforeRunSnapshot: { repositoryDirectory: "/tmp/fixture", entries: [], omissions: [] },
          postRunSnapshot: {
            repositoryDirectory: "/tmp/fixture",
            entries: [
              {
                path: "reports/other.md",
                kind: "file",
                contentDigest: "sha256:other",
                contentExcerpt: otherContent.slice(0, 2_000),
                contentForEvaluation: otherContent,
              },
              {
                path: "reports/target.md",
                kind: "file",
                contentDigest: "sha256:target",
                contentExcerpt: targetContent.slice(0, 2_000),
                contentForEvaluation: targetContent,
              },
            ],
            omissions: [],
          },
          expectedArtifacts: [
            { artifactId: "other", path: "reports/other.md", fileType: "file", contentContract: "other" },
            { artifactId: "target", path: "reports/target.md", fileType: "file", contentContract: "target" },
          ],
        }),
      },
    });

    expect(evaluateDeterministicChecks(evidence, [check])).toEqual([
      expect.objectContaining({ checkId: check.checkId, outcome: expectedOutcome }),
    ]);
    expect(evidence.repositoryFacts.artifacts.find((artifact) => artifact.artifactId === "target")?.contentExcerpt)
      .not.toContain("required tail");
  });

  it("fails closed when target content is unavailable above the evaluation ceiling", () => {
    const evidence = normalizeRepetitionEvidence({
      receipt: {
        ...receipt(),
        repositoryEvidence: createRepositoryEvidence({
          beforeRunSnapshot: { repositoryDirectory: "/tmp/fixture", entries: [], omissions: [] },
          postRunSnapshot: {
            repositoryDirectory: "/tmp/fixture",
            entries: [{
              path: "reports/target.md",
              kind: "file",
              contentDigest: "sha256:target",
              contentExcerpt: "x".repeat(2_000),
              contentForEvaluation: null,
              contentByteLength: 1_000_001,
              contentUnavailableReason: "artifact content exceeds the 1000000-byte evaluation ceiling",
            }],
            omissions: [],
          },
          expectedArtifacts: [
            { artifactId: "target", path: "reports/target.md", fileType: "file", contentContract: "target" },
          ],
        }),
      },
    });

    expect(evaluateDeterministicChecks(evidence, [
      { checkId: "complete-content", fact: "artifact:target", operator: "contains", expected: "required tail" },
    ])).toEqual([
      expect.objectContaining({ outcome: "not_evaluated", reason: "artifact content exceeds the 1000000-byte evaluation ceiling" }),
    ]);
  });

  it("reduces deterministic check results with missing evidence before behavior failures", () => {
    expect(reduceDeterministicCheckResults([])).toBe("pass");
    expect(reduceDeterministicCheckResults([
      { checkId: "pass", outcome: "pass", reason: "ok" },
      { checkId: "fail", outcome: "behavior_fail", reason: "missing" },
    ])).toBe("behavior_fail");
    expect(reduceDeterministicCheckResults([
      { checkId: "fail", outcome: "behavior_fail", reason: "missing" },
      { checkId: "unknown", outcome: "not_evaluated", reason: "omitted" },
    ])).toBe("not_evaluated");
  });
});
