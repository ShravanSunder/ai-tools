import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export type RunnerSemanticClass =
  | "contract_parser"
  | "discovery_registry"
  | "execution_budget"
  | "collection_evidence_installation"
  | "review_runtime_profiles"
  | "reduction"
  | "selection_evals_entrypoint"
  | "reporting"
  | "runner_package_commands";

export interface RunnerSemanticsManifestEntry {
  readonly semanticClass: RunnerSemanticClass;
  readonly path: string;
}

export const RUNNER_SEMANTICS_MANIFEST = [
  { semanticClass: "contract_parser", path: "lib/contracts/contract-json-schema-validator.ts" },
  { semanticClass: "contract_parser", path: "lib/contracts/contract-types.ts" },
  { semanticClass: "contract_parser", path: "lib/contracts/objective-check-types.ts" },
  { semanticClass: "contract_parser", path: "lib/contracts/schema-generation.ts" },
  { semanticClass: "contract_parser", path: "lib/contracts/skill-contracts.ts" },
  { semanticClass: "contract_parser", path: "lib/contracts/v3-behavior-contract.ts" },
  { semanticClass: "contract_parser", path: "schemas/skill-pressure-scenario.schema.json" },
  { semanticClass: "discovery_registry", path: "lib/authority/evaluation-registry.ts" },
  { semanticClass: "discovery_registry", path: "lib/authority/validity-receipts.ts" },
  { semanticClass: "discovery_registry", path: "lib/authority/authority-receipts.ts" },
  { semanticClass: "discovery_registry", path: "lib/authority/claimed-requirements.ts" },
  { semanticClass: "discovery_registry", path: "lib/authority/tracked-authority-receipt-file.ts" },
  { semanticClass: "discovery_registry", path: "lib/discovery/skill-discovery.ts" },
  { semanticClass: "execution_budget", path: "lib/evaluation/behavioral-scenario-runner.ts" },
  { semanticClass: "execution_budget", path: "lib/evaluation/v3-behavioral-scenario-execution.ts" },
  { semanticClass: "execution_budget", path: "lib/evaluation/v3-scenario-preflight.ts" },
  { semanticClass: "execution_budget", path: "lib/evaluation/repetition-coordinator.ts" },
  { semanticClass: "execution_budget", path: "lib/evaluation/scenario-execution-budget.ts" },
  { semanticClass: "execution_budget", path: "lib/evaluation/subject-repetition.ts" },
  { semanticClass: "execution_budget", path: "lib/runtime/acpx-command-executor.ts" },
  { semanticClass: "execution_budget", path: "lib/runtime/process-group-supervisor.ts" },
  { semanticClass: "execution_budget", path: "lib/runtime/runner-semantics.ts" },
  { semanticClass: "collection_evidence_installation", path: "lib/collector/acpx-transcript-collector.ts" },
  { semanticClass: "collection_evidence_installation", path: "lib/collector/stream-redactor.ts" },
  { semanticClass: "collection_evidence_installation", path: "lib/evidence/repetition-evidence.ts" },
  { semanticClass: "collection_evidence_installation", path: "lib/evidence/objective-artifact-checks.ts" },
  { semanticClass: "collection_evidence_installation", path: "lib/evidence/repository-snapshot.ts" },
  { semanticClass: "collection_evidence_installation", path: "lib/installation/codex-repo-skill-installer.ts" },
  { semanticClass: "review_runtime_profiles", path: "lib/review/semantic-review-contract.ts" },
  { semanticClass: "review_runtime_profiles", path: "lib/review/structured-review-runner.ts" },
  { semanticClass: "review_runtime_profiles", path: "lib/runtime/acpx-codex-review-profile.ts" },
  { semanticClass: "review_runtime_profiles", path: "lib/runtime/acpx-review-profile.ts" },
  { semanticClass: "review_runtime_profiles", path: "lib/runtime/acpx-subject-profile.ts" },
  { semanticClass: "review_runtime_profiles", path: "lib/runtime/ambient-skill-discovery.ts" },
  { semanticClass: "review_runtime_profiles", path: "lib/runtime/runtime-profile.ts" },
  { semanticClass: "reduction", path: "lib/reduction/outcome-reducer.ts" },
  { semanticClass: "reduction", path: "lib/evaluation/v3-scenario-authority.ts" },
  { semanticClass: "selection_evals_entrypoint", path: "config/fast-scenario-manifest.yaml" },
  { semanticClass: "selection_evals_entrypoint", path: "evals/skill-pressure.eval.ts" },
  { semanticClass: "selection_evals_entrypoint", path: "lib/evaluation/evaluation-registration.ts" },
  { semanticClass: "selection_evals_entrypoint", path: "lib/evaluation/fast-scenario-manifest.ts" },
  { semanticClass: "selection_evals_entrypoint", path: "lib/evaluation/skill-pressure-eval-harness.ts" },
  { semanticClass: "selection_evals_entrypoint", path: "lib/evaluation/v3-suite-command.ts" },
  { semanticClass: "selection_evals_entrypoint", path: "lib/evaluation/v3-suite-selection.ts" },
  { semanticClass: "reporting", path: "lib/reporting/aggregate-receipt.ts" },
  { semanticClass: "reporting", path: "lib/reporting/attempt-receipt.ts" },
  { semanticClass: "reporting", path: "lib/reporting/owner-coverage.ts" },
  { semanticClass: "runner_package_commands", path: "package.json" },
  { semanticClass: "runner_package_commands", path: "pnpm-lock.yaml" },
  { semanticClass: "runner_package_commands", path: "pnpm-workspace.yaml" },
  { semanticClass: "runner_package_commands", path: "run-skill-pressure-tests.sh" },
  { semanticClass: "runner_package_commands", path: "vitest.config.ts" },
  { semanticClass: "runner_package_commands", path: "vitest.evals.config.ts" },
] as const satisfies readonly RunnerSemanticsManifestEntry[];

const SEMANTIC_SOURCE_ROOTS = [
  "lib/authority",
  "lib/collector",
  "lib/contracts",
  "lib/discovery",
  "lib/evaluation",
  "lib/evidence",
  "lib/installation",
  "lib/reduction",
  "lib/reporting",
  "lib/review",
  "lib/runtime",
  "evals",
  "scripts",
] as const;

const NAMED_SEMANTIC_SURFACES = RUNNER_SEMANTICS_MANIFEST
  .filter((entry) => !SEMANTIC_SOURCE_ROOTS.some((root) => entry.path.startsWith(`${root}/`)))
  .map((entry) => entry.path);

export interface CalculateRunnerSemanticsProps {
  readonly repositoryRoot: string;
  readonly sourceOverrides?: ReadonlyMap<string, string>;
}

export interface RunnerSemanticsReceipt {
  readonly manifestEntries: typeof RUNNER_SEMANTICS_MANIFEST;
  readonly runnerSemanticsDigest: string;
}

export async function calculateRunnerSemantics(
  props: CalculateRunnerSemanticsProps,
): Promise<RunnerSemanticsReceipt> {
  const packageRoot = path.resolve(props.repositoryRoot, "tests/test-utils/skill-pressure");
  const discoveredSemanticPaths = await discoverSemanticPaths(packageRoot);
  const manifestPaths = RUNNER_SEMANTICS_MANIFEST.map((entry) => entry.path);
  assertRunnerSemanticsManifestClosure({ discoveredSemanticPaths, manifestPaths });

  const sourceReceipts = [];
  for (const entry of RUNNER_SEMANTICS_MANIFEST) {
    const source = props.sourceOverrides?.get(entry.path) ?? await readFile(path.resolve(packageRoot, entry.path), "utf8");
    sourceReceipts.push({
      semanticClass: entry.semanticClass,
      path: entry.path,
      sourceDigest: digest(source),
    });
  }
  return {
    manifestEntries: RUNNER_SEMANTICS_MANIFEST,
    runnerSemanticsDigest: digest(JSON.stringify(sourceReceipts)),
  };
}

export interface AssertRunnerSemanticsManifestClosureProps {
  readonly discoveredSemanticPaths: readonly string[];
  readonly manifestPaths: readonly string[];
}

export function assertRunnerSemanticsManifestClosure(
  props: AssertRunnerSemanticsManifestClosureProps,
): void {
  const discovered = new Set(props.discoveredSemanticPaths);
  const manifested = new Set(props.manifestPaths);
  for (const semanticPath of [...discovered].sort()) {
    if (!manifested.has(semanticPath)) {
      throw new Error(`unmanifested semantic module: ${semanticPath}`);
    }
  }
  for (const manifestPath of [...manifested].sort()) {
    if (!discovered.has(manifestPath)) {
      throw new Error(`runner-semantics manifest entry does not exist: ${manifestPath}`);
    }
  }
}

async function discoverSemanticPaths(packageRoot: string): Promise<readonly string[]> {
  const discovered = new Set<string>(NAMED_SEMANTIC_SURFACES);
  for (const sourceRoot of SEMANTIC_SOURCE_ROOTS) {
    const absoluteRoot = path.resolve(packageRoot, sourceRoot);
    for (const sourcePath of await findSourceFiles(absoluteRoot)) {
      const relativePath = path.relative(packageRoot, sourcePath).split(path.sep).join("/");
      if (isSemanticImplementationPath(relativePath)) discovered.add(relativePath);
    }
  }
  return [...discovered].sort();
}

async function findSourceFiles(root: string): Promise<readonly string[]> {
  let entries;
  try {
    entries = await readdir(root, { withFileTypes: true });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") return [];
    throw error;
  }
  const paths: string[] = [];
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const entryPath = path.join(root, entry.name);
    if (entry.isDirectory()) paths.push(...await findSourceFiles(entryPath));
    if (entry.isFile()) paths.push(entryPath);
  }
  return paths;
}

function isSemanticImplementationPath(relativePath: string): boolean {
  if (!relativePath.endsWith(".ts") || relativePath.endsWith(".test.ts")) return false;
  if (relativePath === "lib/test-fixtures.ts" || relativePath.startsWith("lib/migration/")) return false;
  return true;
}

function digest(value: string): string {
  return `sha256:${createHash("sha256").update(value).digest("hex")}`;
}
