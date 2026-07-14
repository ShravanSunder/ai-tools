import { createHash } from "node:crypto";

export interface ClaimedRequirementManifest {
  readonly schemaVersion: 1;
  readonly source: "spec" | "proof_matrix" | "cli_manifest";
  readonly claimedRequirementIds: readonly string[];
}

interface ClaimedRequirementValidationShape {
  readonly manifest: ClaimedRequirementManifest;
  readonly manifestDigest: `sha256:${string}`;
  readonly unknownRequirementIds: readonly string[];
  readonly untracedRequirementIds: readonly string[];
  readonly status: "traced" | "not_evaluated";
}

const claimedRequirementValidationBrand = Symbol("claimed-requirement-validation");
export type ClaimedRequirementValidation = ClaimedRequirementValidationShape & {
  readonly [claimedRequirementValidationBrand]: true;
};

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
  const validation = {
    manifest: { ...props.manifest, claimedRequirementIds: [...props.manifest.claimedRequirementIds] },
    manifestDigest: calculateClaimedRequirementManifestDigest(props.manifest),
    unknownRequirementIds,
    untracedRequirementIds,
    status: unknownRequirementIds.length === 0 && untracedRequirementIds.length === 0 ? "traced" : "not_evaluated",
  } satisfies ClaimedRequirementValidationShape;
  Object.defineProperty(validation, claimedRequirementValidationBrand, { value: true });
  return deepFreeze(validation) as unknown as ClaimedRequirementValidation;
}

export function assertClaimedRequirementValidationIntegrity(
  validation: ClaimedRequirementValidation,
): void {
  if (!Object.hasOwn(validation, claimedRequirementValidationBrand) || validation[claimedRequirementValidationBrand] !== true) {
    throw new Error("claimed requirement validation was not produced by the manifest validator");
  }
  validateManifestShape(validation.manifest);
  if (calculateClaimedRequirementManifestDigest(validation.manifest) !== validation.manifestDigest) {
    throw new Error("claimed requirement manifest digest does not match its content");
  }
  const claimedRequirementIds = new Set(validation.manifest.claimedRequirementIds);
  assertTraceSetIntegrity(validation.unknownRequirementIds, claimedRequirementIds, "unknown");
  assertTraceSetIntegrity(validation.untracedRequirementIds, claimedRequirementIds, "untraced");
  const untracedRequirementIds = new Set(validation.untracedRequirementIds);
  if (validation.unknownRequirementIds.some((requirementId) => !untracedRequirementIds.has(requirementId))) {
    throw new Error("unknown claimed requirements must also be untraced");
  }
  const expectedStatus = validation.unknownRequirementIds.length === 0 && validation.untracedRequirementIds.length === 0
    ? "traced"
    : "not_evaluated";
  if (validation.status !== expectedStatus) {
    throw new Error("claimed requirement validation status is inconsistent with its trace sets");
  }
}

function deepFreeze<TValue>(value: TValue): TValue {
  if (typeof value !== "object" || value === null || Object.isFrozen(value)) return value;
  for (const nested of Object.values(value)) deepFreeze(nested);
  return Object.freeze(value);
}

function assertTraceSetIntegrity(
  requirementIds: readonly string[],
  claimedRequirementIds: ReadonlySet<string>,
  label: string,
): void {
  if (new Set(requirementIds).size !== requirementIds.length) {
    throw new Error(`${label} claimed requirement ids contain duplicates`);
  }
  if (requirementIds.some((requirementId) => !claimedRequirementIds.has(requirementId))) {
    throw new Error(`${label} claimed requirement id is not present in the manifest`);
  }
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
