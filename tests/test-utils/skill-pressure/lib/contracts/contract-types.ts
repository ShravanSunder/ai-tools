export interface SkillOwner {
  readonly plugin: string;
  readonly skill: string;
}

export type SkillType = "discipline" | "technique" | "pattern" | "reference";
export type ScenarioRisk = "standard" | "high";
export type ScenarioBaseline = "no_skill" | "previous_revision";
export type ComparisonIntent = "improvement" | "non_regression";

export interface ExpectedArtifact {
  readonly artifactId: string;
  readonly path: string;
  readonly fileType: "file" | "directory";
  readonly contentContract: string;
}

export interface DeterministicCheck {
  readonly checkId: string;
  readonly fact:
    | "tool_observations"
    | `path:${string}`
    | `artifact:${string}`;
  readonly operator: "equals" | "contains" | "excludes" | "matches" | "not_matches" | "exists" | "absent";
  readonly expected?: unknown;
}

export interface ScenarioContract extends SkillOwner {
  readonly schemaVersion: 2;
  readonly scenarioId: string;
  readonly skillType: SkillType;
  readonly prompt: string;
  readonly hiddenRubric: string;
  readonly baseline: ScenarioBaseline;
  readonly baselineRevision: string | null;
  readonly comparisonIntent: ComparisonIntent;
  readonly repetitions: number;
  readonly risk: ScenarioRisk;
  readonly fixtureRequirements: readonly string[];
  readonly allowedTools: readonly string[];
  readonly allowedWritePaths: readonly string[];
  readonly deterministicChecks: readonly DeterministicCheck[];
  readonly expectedArtifacts: readonly ExpectedArtifact[];
  readonly scenarioPath: string;
  readonly contractDigest: string;
}
