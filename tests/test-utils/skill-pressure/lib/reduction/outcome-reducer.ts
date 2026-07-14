export type ScenarioOutcome = "pass" | "behavior_fail" | "inconclusive" | "infrastructure_error" | "not_evaluated";
export type RepetitionOutcome = Exclude<ScenarioOutcome, "inconclusive" | "infrastructure_error">;
export type ScenarioOutcomeReasonCode =
  | "improvement_baseline_already_passed"
  | "invalid_non_regression_control"
  | "missing_evidence"
  | "mixed_baseline"
  | "mixed_treatment"
  | "repetition_count_mismatch"
  | "runtime_profile_unverified"
  | "treatment_behavior_failed"
  | "infrastructure_error";

export interface ReductionRepetition {
  readonly repetitionId: string;
  readonly outcome: RepetitionOutcome;
  readonly infrastructureError?: string;
  readonly infrastructureReasonCode?: "runtime_profile_unverified";
}

export interface ReduceScenarioOutcomeProps {
  readonly comparisonIntent: "improvement" | "non_regression";
  readonly expectedRepetitions: number;
  readonly baseline: readonly ReductionRepetition[];
  readonly treatment: readonly ReductionRepetition[];
}

export interface ScenarioOutcomeReduction {
  readonly outcome: ScenarioOutcome;
  readonly reasonCode?: ScenarioOutcomeReasonCode | null;
  readonly reasons: readonly string[];
}

export function reduceScenarioOutcome(
  props: ReduceScenarioOutcomeProps,
): ScenarioOutcomeReduction {
  const infrastructureReasons = [...props.baseline, ...props.treatment]
    .flatMap((repetition) => repetition.infrastructureError === undefined ? [] : [repetition.infrastructureError]);
  if (infrastructureReasons.length > 0) {
    const infrastructureReasonCode = [...props.baseline, ...props.treatment]
      .some((repetition) => repetition.infrastructureReasonCode === "runtime_profile_unverified")
      ? "runtime_profile_unverified"
      : "infrastructure_error";
    return reduction("infrastructure_error", infrastructureReasonCode, infrastructureReasons);
  }
  if (props.baseline.length !== props.expectedRepetitions || props.treatment.length !== props.expectedRepetitions) {
    return reduction("not_evaluated", "repetition_count_mismatch", ["repetition count does not match the scenario contract"]);
  }
  if ([...props.baseline, ...props.treatment].some((repetition) => repetition.outcome === "not_evaluated")) {
    return reduction("not_evaluated", "missing_evidence", ["at least one repetition lacks required evidence"]);
  }

  const treatmentOutcomes = new Set(props.treatment.map((repetition) => repetition.outcome));
  if (treatmentOutcomes.size !== 1) {
    return reduction("inconclusive", "mixed_treatment", ["treatment repetitions are mixed"]);
  }

  const baselineOutcomes = new Set(props.baseline.map((repetition) => repetition.outcome));
  if (baselineOutcomes.size !== 1) {
    return reduction("inconclusive", "mixed_baseline", ["baseline repetitions are mixed"]);
  }
  if (treatmentOutcomes.has("behavior_fail")) {
    return reduction("behavior_fail", "treatment_behavior_failed", ["treatment repetitions consistently failed behavior checks"]);
  }
  if (props.comparisonIntent === "improvement") {
    if (baselineOutcomes.has("pass")) {
      return reduction("not_evaluated", "improvement_baseline_already_passed", ["baseline already passed the improvement comparison"]);
    }
    return reduction("pass", null, ["baseline failure and treatment success were consistent"]);
  }
  if (baselineOutcomes.has("behavior_fail")) {
    return reduction("not_evaluated", "invalid_non_regression_control", ["baseline did not establish a passing non-regression control"]);
  }
  return reduction("pass", null, ["previous-revision control and treatment both passed"]);
}

function reduction(
  outcome: ScenarioOutcome,
  reasonCode: ScenarioOutcomeReasonCode | null,
  reasons: readonly string[],
): ScenarioOutcomeReduction {
  return { outcome, reasonCode, reasons: [...new Set(reasons)].sort((left, right) => left.localeCompare(right)) };
}
