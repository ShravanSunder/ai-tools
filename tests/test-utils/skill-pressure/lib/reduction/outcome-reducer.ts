export type ScenarioOutcome = "pass" | "behavior_fail" | "inconclusive" | "infrastructure_error" | "not_evaluated";
export type RepetitionOutcome = Exclude<ScenarioOutcome, "inconclusive" | "infrastructure_error">;

export interface ReductionRepetition {
  readonly repetitionId: string;
  readonly outcome: RepetitionOutcome;
  readonly infrastructureError?: string;
}

export interface ReduceScenarioOutcomeProps {
  readonly expectedRepetitions: number;
  readonly baseline: readonly ReductionRepetition[];
  readonly treatment: readonly ReductionRepetition[];
}

export interface ScenarioOutcomeReduction {
  readonly outcome: ScenarioOutcome;
  readonly reasons: readonly string[];
}

export function reduceScenarioOutcome(
  props: ReduceScenarioOutcomeProps,
): ScenarioOutcomeReduction {
  const infrastructureReasons = [...props.baseline, ...props.treatment]
    .flatMap((repetition) => repetition.infrastructureError === undefined ? [] : [repetition.infrastructureError]);
  if (infrastructureReasons.length > 0) {
    return reduction("infrastructure_error", infrastructureReasons);
  }
  if (props.baseline.length !== props.expectedRepetitions || props.treatment.length !== props.expectedRepetitions) {
    return reduction("not_evaluated", ["repetition count does not match the scenario contract"]);
  }
  if ([...props.baseline, ...props.treatment].some((repetition) => repetition.outcome === "not_evaluated")) {
    return reduction("not_evaluated", ["at least one repetition lacks required evidence"]);
  }

  const treatmentOutcomes = new Set(props.treatment.map((repetition) => repetition.outcome));
  if (treatmentOutcomes.size !== 1) {
    return reduction("inconclusive", ["treatment repetitions are mixed"]);
  }
  if (treatmentOutcomes.has("behavior_fail")) {
    return reduction("behavior_fail", ["treatment repetitions consistently failed behavior checks"]);
  }

  const baselineOutcomes = new Set(props.baseline.map((repetition) => repetition.outcome));
  if (baselineOutcomes.size !== 1) {
    return reduction("inconclusive", ["baseline repetitions are mixed"]);
  }
  if (baselineOutcomes.has("pass")) {
    return reduction("not_evaluated", ["baseline did not demonstrate a behavior failure"]);
  }
  return reduction("pass", ["baseline failure and treatment success were consistent"]);
}

function reduction(outcome: ScenarioOutcome, reasons: readonly string[]): ScenarioOutcomeReduction {
  return { outcome, reasons: [...new Set(reasons)].sort((left, right) => left.localeCompare(right)) };
}
