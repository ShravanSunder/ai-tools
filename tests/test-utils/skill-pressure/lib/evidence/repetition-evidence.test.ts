import { describe, expect, it } from "vitest";

import type { SubjectRepetitionReceipt } from "../evaluation/subject-repetition.js";
import { createRepositoryEvidence, type RepositorySnapshot } from "./repository-snapshot.js";
import {
  evaluateRepositoryPathChecks,
  evaluateResponsePatternChecks,
  evaluateDeterministicChecks,
  normalizeRepetitionEvidence,
  reduceDeterministicCheckResults,
} from "./repetition-evidence.js";

function receipt(): SubjectRepetitionReceipt {
  return {
    runnerVersion: "skill-pressure-repetition-v1",
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
    expect(evidence.repositoryFacts.files).toHaveLength(1);
    expect(evidence.rationalizationExcerpts).toEqual(["This is obvious, so I skipped the required check."]);
  });

  it("evaluates required and forbidden response patterns deterministically", () => {
    const evidence = normalizeRepetitionEvidence({ receipt: receipt() });

    expect(evaluateResponsePatternChecks(evidence, [
      { checkId: "required", requirement: "required", pattern: "inspected the policy" },
      { checkId: "forbidden", requirement: "forbidden", pattern: "skipped the required check" },
    ])).toEqual([
      { checkId: "required", outcome: "pass", reason: "required response pattern matched" },
      { checkId: "forbidden", outcome: "pass", reason: "forbidden response pattern was absent" },
    ]);
  });

  it("reports response-pattern violations as behavior failures", () => {
    const evidence = normalizeRepetitionEvidence({ receipt: receipt() });

    expect(evaluateResponsePatternChecks(evidence, [
      { checkId: "missing-required", requirement: "required", pattern: "verified every artifact" },
      { checkId: "matched-forbidden", requirement: "forbidden", pattern: "wrote docs/result.md" },
    ])).toEqual([
      { checkId: "missing-required", outcome: "behavior_fail", reason: "required response pattern was absent" },
      { checkId: "matched-forbidden", outcome: "behavior_fail", reason: "forbidden response pattern matched" },
    ]);
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

  it("evaluates contract-owned response, path, and artifact checks", () => {
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
      { checkId: "response", fact: "visible_response", operator: "matches", expected: "(?is)INSPECTED.{0,80}result" },
      { checkId: "path", fact: "path:reports/result.md", operator: "exists" },
      { checkId: "artifact", fact: "artifact:result", operator: "contains", expected: "verified" },
      { checkId: "forbidden", fact: "path:tmp/shortcut.txt", operator: "absent" },
    ])).toEqual([
      { checkId: "response", outcome: "pass", reason: "matches comparison passed" },
      { checkId: "path", outcome: "pass", reason: "repository path exists" },
      { checkId: "artifact", outcome: "pass", reason: "contains comparison passed" },
      { checkId: "forbidden", outcome: "pass", reason: "repository path is absent" },
    ]);
  });

  it("reduces deterministic check results with missing evidence before behavior failures", () => {
    expect(reduceDeterministicCheckResults([])).toBe("not_evaluated");
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
