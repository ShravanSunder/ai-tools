import type { TreeNode } from "./check-tree.ts";
export type CheckResult = {
  checkId: string;
  result: "pass" | "fail" | "inconclusive";
  decidedBy: "code" | "jev" | "judge" | "terminal";
  path: readonly {
    nodeId: string;
    kind: TreeNode["kind"] | "terminal";
    outcome: string;
    evidence: readonly string[];
    judge?: JudgeAudit;
  }[];
};
export type JudgeAudit =
  | { result: "pass" | "fail"; evidenceQuote: string; rationale: string }
  | {
    undecidable:
      | "evidence-insufficient"
      | "criterion-ambiguous"
      | "judge-credential-exposure";
  }
  | { malformed: readonly string[] };
