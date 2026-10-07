export type RunVerdict = "execution-failed" | "inconclusive" | "fail" | "pass";
export const aggregateRunVerdict = (
  outcomes: readonly ("pass" | "fail" | "inconclusive")[],
): RunVerdict =>
  outcomes.includes("fail")
    ? "fail"
    : outcomes.includes("inconclusive")
    ? "inconclusive"
    : "pass";
