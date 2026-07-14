export type ObjectiveCheckOutcome = "pass" | "behavior_fail" | "not_evaluated";

export interface ObjectiveArtifactDeclaration {
  readonly artifactId: string;
  readonly path: string;
  readonly fileType: "file" | "directory";
}

export type ObjectiveCheckOwner =
  | { readonly kind: "artifact_id"; readonly artifactId: string }
  | { readonly kind: "direct_path"; readonly path: string }
  | { readonly kind: "tool_observations" };

export type ObjectiveCheckOperator =
  | "exists"
  | "absent"
  | "kind_equals"
  | "content_equals"
  | "content_contains"
  | "content_matches"
  | "content_excludes"
  | "content_excludes_pattern"
  | "equals"
  | "contains"
  | "excludes"
  | "matches"
  | "not_matches";

export interface ObjectiveCheckDefinition {
  readonly checkId: string;
  readonly owner: ObjectiveCheckOwner;
  readonly operator: ObjectiveCheckOperator;
  readonly expected?: string | "file" | "directory";
}

export interface ObjectiveCheckPlan {
  readonly declaredArtifacts: readonly ObjectiveArtifactDeclaration[];
  readonly checks: readonly ObjectiveCheckDefinition[];
}
