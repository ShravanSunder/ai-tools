import { assertEquals } from "jsr:@std/assert@1";
import { assessDoneBar } from "./assess-done-bar.ts";
const observed = {
  kind: "observed" as const,
  runId: "r",
  observation: {} as never,
};
Deno.test("new bar is not evaluable without Jev lint", () =>
  assertEquals(
    assessDoneBar({
      kind: "new-from-intent",
      lintClean: true,
      jevLintAvailable: false,
      runs: [{ id: "r", outcome: observed, verdict: "pass" }],
    }),
    { kind: "not-evaluable", reason: "jev-lint-unavailable" },
  ));
Deno.test("fix bar needs base fail and three passes", () => {
  const pass = Array.from(
    { length: 3 },
    (_, i) => ({ id: `r${i}`, outcome: observed, verdict: "pass" as const }),
  );
  assertEquals(
    assessDoneBar({
      kind: "fix-for-recorded-failure",
      lintClean: true,
      jevLintAvailable: true,
      runs: pass,
      baseVerdict: "fail",
    }).kind,
    "met",
  );
});
