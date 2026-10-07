export type DoneBarResult = {
  kind: "met";
  bar: "new-from-intent" | "fix-for-recorded-failure";
  runs: readonly string[];
} | {
  kind: "not-met";
  reason:
    | "check-failed"
    | "lint-failed"
    | "failure-not-reproduced"
    | "fewer-than-3-passes";
} | {
  kind: "not-evaluable";
  reason:
    | "execution-failed-run"
    | "inconclusive-run"
    | "no-active-scenario"
    | "jev-lint-unavailable";
};
