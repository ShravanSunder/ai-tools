import type { DoneBarResult } from "../contracts/done-bar.ts";
import type { RunOutcome } from "../contracts/run.ts";
import type { RunVerdict } from "../contracts/run-verdict.ts";
export type DoneBarInput = {
  kind: "new-from-intent" | "fix-for-recorded-failure";
  lintClean: boolean;
  jevLintAvailable: boolean;
  runs: readonly { id: string; outcome: RunOutcome; verdict: RunVerdict }[];
  baseVerdict?: RunVerdict;
};
export function assessDoneBar(input: DoneBarInput): DoneBarResult {
  if (input.kind === "new-from-intent") {
    if (!input.lintClean) return { kind: "not-met", reason: "lint-failed" };
    if (input.runs.some((r) => r.outcome.kind === "execution-failed")) {
      return { kind: "not-evaluable", reason: "execution-failed-run" };
    }
    if (input.runs.some((r) => r.verdict === "inconclusive")) {
      return { kind: "not-evaluable", reason: "inconclusive-run" };
    }
    if (!input.jevLintAvailable) {
      return { kind: "not-evaluable", reason: "jev-lint-unavailable" };
    }
    return input.runs.every((r) => r.verdict === "pass")
      ? { kind: "met", bar: input.kind, runs: input.runs.map((r) => r.id) }
      : { kind: "not-met", reason: "check-failed" };
  }
  // A base Run that broke or could not be settled says nothing about reproduction.
  if (input.baseVerdict === "execution-failed") {
    return { kind: "not-evaluable", reason: "execution-failed-run" };
  }
  if (input.baseVerdict === "inconclusive") {
    return { kind: "not-evaluable", reason: "inconclusive-run" };
  }
  if (input.baseVerdict !== "fail") {
    return { kind: "not-met", reason: "failure-not-reproduced" };
  }
  if (input.runs.some((r) => r.outcome.kind === "execution-failed")) {
    return { kind: "not-evaluable", reason: "execution-failed-run" };
  }
  if (input.runs.some((r) => r.verdict === "inconclusive")) {
    return { kind: "not-evaluable", reason: "inconclusive-run" };
  }
  const passCount = input.runs.filter((r) => r.verdict === "pass").length;
  return passCount >= 3 && input.runs.length >= 3 &&
      input.runs.every((run) => run.verdict === "pass")
    ? { kind: "met", bar: input.kind, runs: input.runs.map((r) => r.id) }
    : { kind: "not-met", reason: "fewer-than-3-passes" };
}
