import { describe, expect, it } from "vitest";

import type { ExpectedArtifactFact, RepositoryEvidence } from "./repository-snapshot.js";
import {
  createObjectiveCheckPlan,
  evaluateObjectiveCheckPlan,
} from "./objective-artifact-checks.js";

function artifact(props: Partial<ExpectedArtifactFact> & Pick<ExpectedArtifactFact, "artifactId" | "path">): ExpectedArtifactFact {
  const { artifactId, path, ...overrides } = props;
  return {
    artifactId,
    path,
    expectedKind: "file",
    status: "observed",
    kind: "file",
    contentDigest: "sha256:artifact",
    contentExcerpt: "safe content",
    contentByteLength: 12,
    contentUnavailableReason: null,
    contentForEvaluation: "safe content",
    reason: null,
    ...overrides,
  };
}

function evidence(props: {
  readonly artifacts?: readonly ExpectedArtifactFact[];
  readonly files?: RepositoryEvidence["files"];
} = {}): RepositoryEvidence {
  return {
    files: props.files ?? [],
    changes: { files: [], pathChanges: [], deletedPaths: [], omissions: [] },
    artifacts: props.artifacts ?? [],
    omissions: [],
  };
}

describe("objective artifact checks", () => {
  it("compares exact content only within its declared artifact", () => {
    const plan = createObjectiveCheckPlan({
      declaredArtifacts: [{ artifactId: "target", path: "reports/target.md", fileType: "file" }],
      checks: [{ checkId: "exact", owner: { kind: "artifact_id", artifactId: "target" }, operator: "content_equals", expected: "exact content" }],
    });

    expect(evaluateObjectiveCheckPlan({
      plan,
      repositoryEvidence: evidence({
        artifacts: [artifact({ artifactId: "target", path: "reports/target.md", contentForEvaluation: "exact content" })],
      }),
      toolObservations: [],
    })).toEqual([expect.objectContaining({ outcome: "pass" })]);
  });

  it("resolves content only through the declared artifact id, never a response-adjacent artifact", () => {
    const plan = createObjectiveCheckPlan({
      declaredArtifacts: [{ artifactId: "target", path: "reports/target.md", fileType: "file" }],
      checks: [{ checkId: "target-content", owner: { kind: "artifact_id", artifactId: "target" }, operator: "content_contains", expected: "required" }],
    });

    expect(evaluateObjectiveCheckPlan({
      plan,
      repositoryEvidence: evidence({
        artifacts: [
          artifact({ artifactId: "target", path: "reports/target.md", contentForEvaluation: "safe content" }),
          artifact({ artifactId: "other", path: "reports/other.md", contentForEvaluation: "required" }),
        ],
      }),
      toolObservations: [],
    })).toEqual([expect.objectContaining({ outcome: "behavior_fail" })]);

    expect(evaluateObjectiveCheckPlan({
      plan,
      repositoryEvidence: evidence({
        artifacts: [artifact({ artifactId: "target", path: "reports/other.md", contentForEvaluation: "required" })],
      }),
      toolObservations: [],
    })).toEqual([expect.objectContaining({ outcome: "not_evaluated", reason: "artifact fact does not match its declared artifact identity" })]);
  });

  it("fails forbidden content and wrong artifact kind", () => {
    const plan = createObjectiveCheckPlan({
      declaredArtifacts: [{ artifactId: "result", path: "reports/result.md", fileType: "file" }],
      checks: [
        { checkId: "no-shortcut", owner: { kind: "artifact_id", artifactId: "result" }, operator: "content_excludes", expected: "shortcut" },
        { checkId: "is-file", owner: { kind: "artifact_id", artifactId: "result" }, operator: "kind_equals", expected: "file" },
      ],
    });

    expect(evaluateObjectiveCheckPlan({
      plan,
      repositoryEvidence: evidence({
        artifacts: [artifact({
          artifactId: "result",
          path: "reports/result.md",
          kind: "directory",
          contentForEvaluation: null,
          contentUnavailableReason: "artifact is not a regular file",
        })],
      }),
      toolObservations: [],
    })).toEqual([
      expect.objectContaining({ checkId: "no-shortcut", outcome: "not_evaluated" }),
      expect.objectContaining({ checkId: "is-file", outcome: "behavior_fail" }),
    ]);
  });

  it("evaluates complete artifact content beyond the persisted excerpt boundary", () => {
    const plan = createObjectiveCheckPlan({
      declaredArtifacts: [{ artifactId: "result", path: "reports/result.md", fileType: "file" }],
      checks: [{ checkId: "tail", owner: { kind: "artifact_id", artifactId: "result" }, operator: "content_contains", expected: "required tail" }],
    });
    const completeContent = `${"x".repeat(2_000)}required tail`;

    expect(evaluateObjectiveCheckPlan({
      plan,
      repositoryEvidence: evidence({
        artifacts: [artifact({
          artifactId: "result",
          path: "reports/result.md",
          contentExcerpt: completeContent.slice(0, 2_000),
          contentForEvaluation: completeContent,
        })],
      }),
      toolObservations: [],
    })).toEqual([expect.objectContaining({ outcome: "pass" })]);
  });

  it("fails closed for unavailable oversized content", () => {
    const plan = createObjectiveCheckPlan({
      declaredArtifacts: [{ artifactId: "result", path: "reports/result.md", fileType: "file" }],
      checks: [{ checkId: "content", owner: { kind: "artifact_id", artifactId: "result" }, operator: "content_contains", expected: "required" }],
    });

    expect(evaluateObjectiveCheckPlan({
      plan,
      repositoryEvidence: evidence({
        artifacts: [artifact({
          artifactId: "result",
          path: "reports/result.md",
          contentForEvaluation: null,
          contentByteLength: 1_000_001,
          contentUnavailableReason: "artifact content exceeds the 1000000-byte evaluation ceiling",
        })],
      }),
      toolObservations: [],
    })).toEqual([expect.objectContaining({ outcome: "not_evaluated" })]);

    expect(evaluateObjectiveCheckPlan({
      plan,
      repositoryEvidence: evidence({
        artifacts: [artifact({
          artifactId: "result",
          path: "reports/result.md",
          contentForEvaluation: "required",
          contentByteLength: 1_000_001,
          contentUnavailableReason: null,
        })],
      }),
      toolObservations: [],
    })).toEqual([expect.objectContaining({ outcome: "not_evaluated" })]);
  });

  it("allows direct paths only for undeclared state or absence", () => {
    const plan = createObjectiveCheckPlan({
      declaredArtifacts: [{ artifactId: "result", path: "reports/result.md", fileType: "file" }],
      checks: [{ checkId: "no-shortcut", owner: { kind: "direct_path", path: "tmp/shortcut.txt" }, operator: "absent" }],
    });

    expect(evaluateObjectiveCheckPlan({
      plan,
      repositoryEvidence: evidence({ files: [{ path: "tmp/shortcut.txt", kind: "file", contentDigest: "sha256:shortcut", contentExcerpt: null }] }),
      toolObservations: [],
    })).toEqual([expect.objectContaining({ outcome: "behavior_fail" })]);

    expect(() => createObjectiveCheckPlan({
      declaredArtifacts: [{ artifactId: "result", path: "reports/result.md", fileType: "file" }],
      checks: [{ checkId: "wrong-owner", owner: { kind: "direct_path", path: "reports/result.md" }, operator: "exists" }],
    })).toThrow(/declared artifact path/u);
  });

  it.each([
    {
      name: "traversal path",
      declaredArtifacts: [{ artifactId: "result", path: "../outside.md", fileType: "file" }],
    },
    {
      name: "artifact path collision",
      declaredArtifacts: [
        { artifactId: "first", path: "reports/result.md", fileType: "file" },
        { artifactId: "second", path: "reports/result.md", fileType: "file" },
      ],
    },
  ] as const)("rejects $name", ({ declaredArtifacts }) => {
    expect(() => createObjectiveCheckPlan({ declaredArtifacts, checks: [] })).toThrow();
  });

  it("fails forbidden tool observations as objective facts", () => {
    const plan = createObjectiveCheckPlan({
      declaredArtifacts: [],
      checks: [{ checkId: "no-shell", owner: { kind: "tool_observations" }, operator: "excludes", expected: "shell_exec" }],
    });

    expect(evaluateObjectiveCheckPlan({
      plan,
      repositoryEvidence: evidence(),
      toolObservations: [{ eventId: "tool-1", payload: '{"tool":"shell_exec"}' }],
    })).toEqual([expect.objectContaining({ outcome: "behavior_fail" })]);
  });

  it("rejects contradictory artifact operators before evaluation", () => {
    expect(() => createObjectiveCheckPlan({
      declaredArtifacts: [{ artifactId: "result", path: "reports/result.md", fileType: "file" }],
      checks: [{ checkId: "exists", owner: { kind: "artifact_id", artifactId: "result" }, operator: "exists", expected: "unused" }],
    })).toThrow(/does not accept expected/u);
    expect(() => createObjectiveCheckPlan({
      declaredArtifacts: [{ artifactId: "result", path: "reports", fileType: "directory" }],
      checks: [{ checkId: "content", owner: { kind: "artifact_id", artifactId: "result" }, operator: "content_contains", expected: "text" }],
    })).toThrow(/directory.*content/u);
  });

  it("fails closed when an unvalidated negative regex reaches evaluation", () => {
    expect(evaluateObjectiveCheckPlan({
      plan: {
        declaredArtifacts: [{ artifactId: "result", path: "reports/result.md", fileType: "file" }],
        checks: [{
          checkId: "invalid-pattern",
          owner: { kind: "artifact_id", artifactId: "result" },
          operator: "content_excludes_pattern",
          expected: "[",
        }],
      },
      repositoryEvidence: evidence({ artifacts: [artifact({ artifactId: "result", path: "reports/result.md" })] }),
      toolObservations: [],
    })).toEqual([expect.objectContaining({ outcome: "not_evaluated" })]);
  });

  it("rejects duplicate collected artifact ids and paths instead of using map order", () => {
    const plan = createObjectiveCheckPlan({
      declaredArtifacts: [{ artifactId: "result", path: "reports/result.md", fileType: "file" }],
      checks: [{ checkId: "content", owner: { kind: "artifact_id", artifactId: "result" }, operator: "content_contains", expected: "required" }],
    });
    expect(() => evaluateObjectiveCheckPlan({
      plan,
      repositoryEvidence: evidence({
        artifacts: [
          artifact({ artifactId: "result", path: "reports/result.md", contentForEvaluation: "safe" }),
          artifact({ artifactId: "result", path: "reports/result.md", contentForEvaluation: "required" }),
        ],
      }),
      toolObservations: [],
    })).toThrow(/duplicate collected artifact/u);
    expect(() => evaluateObjectiveCheckPlan({
      plan,
      repositoryEvidence: evidence({
        artifacts: [
          artifact({ artifactId: "result", path: "reports/result.md" }),
          artifact({ artifactId: "other", path: "reports/result.md" }),
        ],
      }),
      toolObservations: [],
    })).toThrow(/duplicate collected artifact/u);
  });
});
