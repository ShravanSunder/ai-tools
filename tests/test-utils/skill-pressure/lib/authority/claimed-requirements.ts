import { createHash } from "node:crypto";

export interface ClaimedRequirementManifest {
  readonly schemaVersion: 1;
  readonly source: "spec" | "proof_matrix" | "cli_manifest";
  readonly claimedRequirementIds: readonly string[];
}

export interface ClaimedRequirementValidation {
  readonly manifest: ClaimedRequirementManifest;
  readonly manifestDigest: `sha256:${string}`;
  readonly unknownRequirementIds: readonly string[];
  readonly untracedRequirementIds: readonly string[];
  readonly status: "traced" | "not_evaluated";
}

export function calculateClaimedRequirementManifestDigest(manifest: ClaimedRequirementManifest): `sha256:${string}` {
  validateManifestShape(manifest);
  return `sha256:${createHash("sha256").update(JSON.stringify(manifest)).digest("hex")}`;
}

export function validateClaimedRequirementManifest(props: {
  readonly manifest: ClaimedRequirementManifest;
  readonly knownRequirementIds: readonly string[];
  readonly calibratedGateRequirementIds: readonly string[];
}): ClaimedRequirementValidation {
  validateManifestShape(props.manifest);
  const known = new Set(props.knownRequirementIds);
  const calibrated = new Set(props.calibratedGateRequirementIds);
  const unknownRequirementIds = props.manifest.claimedRequirementIds.filter((requirementId) => !known.has(requirementId));
  const untracedRequirementIds = props.manifest.claimedRequirementIds.filter((requirementId) => !calibrated.has(requirementId));
  return {
    manifest: { ...props.manifest, claimedRequirementIds: [...props.manifest.claimedRequirementIds] },
    manifestDigest: calculateClaimedRequirementManifestDigest(props.manifest),
    unknownRequirementIds,
    untracedRequirementIds,
    status: unknownRequirementIds.length === 0 && untracedRequirementIds.length === 0 ? "traced" : "not_evaluated",
  };
}

function validateManifestShape(manifest: ClaimedRequirementManifest): void {
  if (manifest.schemaVersion !== 1) throw new Error("claimed requirement manifest schemaVersion must equal 1");
  if (!["spec", "proof_matrix", "cli_manifest"].includes(manifest.source)) throw new Error("claimed requirement manifest source is invalid");
  if (manifest.claimedRequirementIds.length === 0) throw new Error("claimed requirement manifest must claim at least one requirement id");
  const identifiers = new Set<string>();
  for (const requirementId of manifest.claimedRequirementIds) {
    if (!/^[a-z0-9][a-z0-9-]*$/u.test(requirementId)) throw new Error("claimed requirement manifest contains an invalid requirement id");
    if (identifiers.has(requirementId)) throw new Error("claimed requirement manifest contains duplicate requirement ids");
    identifiers.add(requirementId);
  }
}
