import type { Scenario } from "../contracts/scenario.ts";
import type { CheckTree } from "../contracts/check-tree.ts";
import type { Observation } from "../contracts/observation.ts";
import type { CheckResult, JudgeAudit } from "../contracts/check-result.ts";
import type { RunOutcome } from "../contracts/run.ts";
import {
  aggregateRunVerdict,
  type RunVerdict,
} from "../contracts/run-verdict.ts";
import { evaluateCodeStep } from "./code-steps.ts";
import type { JevAnswer, JevDecisionPort } from "../jev/jev-port.ts";
import type { JudgePort } from "../judge/judge-port.ts";

export type EvaluatePorts = { jev: JevDecisionPort; judge: JudgePort };
const terminals = new Set(["pass", "fail", "inconclusive"]);
const evidenceFor = (source: unknown, obs: Observation): string | undefined => {
  if (source === "finalMessage") return obs.finalMessage;
  if (source === "conversation") {
    return obs.turns.map((t) =>
      `user: ${t.userText}\nassistant: ${t.assistantText}`
    ).join("\n");
  }
  if (source === "toolCalls") {
    return obs.toolCalls.map((t) =>
      `${t.kind ?? "tool"}: ${t.title} (${t.status})`
    ).join("\n");
  }
  if (typeof source === "object" && source !== null && "file" in source) {
    return `file:${String((source as { file: string }).file)}`;
  }
  return undefined;
};
const evidenceList = (
  sources: readonly unknown[],
  obs: Observation,
): { values: string[]; missing: boolean } => {
  const values: string[] = [];
  let missing = false;
  for (const s of sources) {
    const v = evidenceFor(s, obs);
    if (v === undefined) missing = true;
    else values.push(v);
  }
  return { values, missing };
};
const band = (
  answer: JevAnswer,
  cardType: "yes_no" | "choice",
  calibration?: { bands: Record<string, number> },
): string => {
  if (answer.kind !== "answered") return "uncertain";
  if (!calibration) return "uncertain";
  if (cardType === "yes_no") {
    const yes = calibration.bands.yes ?? 0.9, no = calibration.bands.no ?? 0.1;
    return answer.score >= yes
      ? "yes"
      : answer.score <= no
      ? "no"
      : "uncertain";
  }
  return answer.value;
};
async function evaluateCheck(
  check: CheckTree,
  scenario: Scenario,
  obs: Observation,
  ports: EvaluatePorts,
): Promise<CheckResult> {
  let ref = check.root;
  const path: Array<CheckResult["path"][number]> = [];
  let decidedBy: CheckResult["decidedBy"] = "terminal";
  for (let guard = 0; guard < 100 && !terminals.has(ref); guard++) {
    const node = check.nodes[ref];
    if (!node) {
      return {
        checkId: check.id,
        result: "inconclusive",
        decidedBy: "terminal",
        path,
      };
    }
    if (node.kind === "code") {
      const r = evaluateCodeStep(node.step, obs, scenario.frontmatter.skill);
      path.push({
        nodeId: ref,
        kind: node.kind,
        outcome: r.kind,
        evidence: r.evidence,
      });
      if (r.kind === "unavailable") {
        return {
          checkId: check.id,
          result: "inconclusive",
          decidedBy: "code",
          path,
        };
      }
      decidedBy = "code";
      ref = r.kind === "true" ? node.onTrue : node.onFalse;
      continue;
    }
    if (node.kind === "jev" || node.kind === "jev-choice") {
      const card = scenario.cards.find((c) => c.id === node.card);
      if (!card) {
        return {
          checkId: check.id,
          result: "inconclusive",
          decidedBy: "jev",
          path,
        };
      }
      const ev = evidenceList(card.evidence, obs);
      if (ev.missing) {
        path.push({
          nodeId: ref,
          kind: node.kind,
          outcome: "unavailable",
          evidence: ev.values,
        });
        return {
          checkId: check.id,
          result: "inconclusive",
          decidedBy: "jev",
          path,
        };
      }
      const answer = await ports.jev.ask(card, ev.values);
      const outcome = band(answer, card.type, card.calibration);
      path.push({ nodeId: ref, kind: node.kind, outcome, evidence: ev.values });
      decidedBy = "jev";
      ref = node.kind === "jev"
        ? (node.branches[outcome as "yes" | "no" | "uncertain"] ??
          node.branches.uncertain)
        : (node.branches[outcome] ?? node.uncertain);
      continue;
    }
    const ev = evidenceList(node.evidence, obs);
    path.push({
      nodeId: ref,
      kind: node.kind,
      outcome: ev.missing ? "unavailable" : "judge",
      evidence: ev.values,
      ...(ev.missing
        ? {
          judge: { undecidable: "evidence-insufficient" } satisfies JudgeAudit,
        }
        : {}),
    });
    if (ev.missing) {
      return {
        checkId: check.id,
        result: "inconclusive",
        decidedBy: "judge",
        path,
      };
    }
    const verdict = await ports.judge.judge({
      criterion: node.criterion ?? check.criterion,
      request: [scenario.prompt, ...scenario.frontmatter.followUps].join("\n"),
      evidence: ev.values,
    });
    decidedBy = "judge";
    if (verdict.kind === "undecidable") {
      path[path.length - 1] = {
        ...path[path.length - 1],
        judge: { undecidable: verdict.reason },
      };
      return { checkId: check.id, result: "inconclusive", decidedBy, path };
    }
    if (verdict.kind === "malformed") {
      path[path.length - 1] = {
        ...path[path.length - 1],
        judge: { malformed: verdict.raw.slice(0, 300) },
      };
      return { checkId: check.id, result: "inconclusive", decidedBy, path };
    }
    path[path.length - 1] = {
      ...path[path.length - 1],
      judge: {
        result: verdict.result,
        evidenceQuote: verdict.evidenceQuote,
        rationale: verdict.rationale,
      },
    };
    return { checkId: check.id, result: verdict.result, decidedBy, path };
  }
  const result = terminals.has(ref)
    ? ref as "pass" | "fail" | "inconclusive"
    : "inconclusive";
  return {
    checkId: check.id,
    result,
    decidedBy: path.length === 0 ? "terminal" : decidedBy,
    path,
  };
}
export async function evaluateRun(
  scenario: Scenario,
  outcome: RunOutcome,
  ports: EvaluatePorts,
): Promise<{ checks: readonly CheckResult[]; verdict: RunVerdict }> {
  if (outcome.kind !== "observed") {
    return { checks: [], verdict: "execution-failed" };
  }
  const checks: CheckResult[] = [];
  for (const check of scenario.checks) {
    checks.push(
      await evaluateCheck(check, scenario, outcome.observation, ports),
    );
  }
  return { checks, verdict: aggregateRunVerdict(checks.map((c) => c.result)) };
}
