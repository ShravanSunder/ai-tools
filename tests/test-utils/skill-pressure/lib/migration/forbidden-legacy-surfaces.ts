import { lstat, readdir, readFile } from "node:fs/promises";
import path from "node:path";

export type ForbiddenLegacySurfaceCategory =
  | "scenario-tree"
  | "schema"
  | "parser"
  | "oracle"
  | "shell-authority"
  | "runner"
  | "reducer"
  | "entrypoint";

export interface ForbiddenLegacySurface {
  readonly id: string;
  readonly category: ForbiddenLegacySurfaceCategory;
  readonly relativePath: string;
}

export interface ForbiddenLegacyContentSurface {
  readonly id: string;
  readonly category: "schema" | "oracle";
  readonly pattern: RegExp;
}

export const FORBIDDEN_LEGACY_SURFACES: readonly ForbiddenLegacySurface[] = [
  {
    id: "v2-flat-scenario-tree",
    category: "scenario-tree",
    relativePath: "tests/skills/pressure-scenarios",
  },
  {
    id: "v2-scenario-schema",
    category: "schema",
    relativePath: "tests/skills/lib/scenario-schema.ts",
  },
  {
    id: "v2-result-schema",
    category: "schema",
    relativePath: "tests/skills/lib/result-schema.ts",
  },
  {
    id: "v2-generated-result-schema",
    category: "schema",
    relativePath: "tests/skills/schemas/skill-pressure-result.schema.json",
  },
  {
    id: "v2-scenario-parser",
    category: "parser",
    relativePath: "tests/skills/lib/scenario-parser.ts",
  },
  {
    id: "v2-response-regex-oracle",
    category: "oracle",
    relativePath: "tests/skills/lib/response-regex-oracle.ts",
  },
  {
    id: "v2-self-report-oracle",
    category: "oracle",
    relativePath: "tests/skills/lib/self-report-oracle.ts",
  },
  {
    id: "v2-pressure-assertions-oracle",
    category: "oracle",
    relativePath: "tests/skills/lib/pressure-assertions.ts",
  },
  {
    id: "legacy-shell-authority",
    category: "shell-authority",
    relativePath: "tests/skills/run-skill-pressure-tests.sh",
  },
  {
    id: "v2-competing-runner",
    category: "runner",
    relativePath: "tests/skills/lib/behavioral-scenario-runner.ts",
  },
  {
    id: "v2-skill-pressure-harness-runner",
    category: "runner",
    relativePath: "tests/skills/lib/skill-pressure-harness.ts",
  },
  {
    id: "v2-competing-reducer",
    category: "reducer",
    relativePath: "tests/skills/lib/outcome-reducer.ts",
  },
  {
    id: "v2-competing-entrypoint",
    category: "entrypoint",
    relativePath: "tests/skills/evals/skill-pressure.eval.ts",
  },
  {
    id: "v2-current-contract-schema",
    category: "schema",
    relativePath: "tests/test-utils/skill-pressure/lib/contracts/contract-schema.ts",
  },
  {
    id: "v2-current-blind-review-runner",
    category: "oracle",
    relativePath: "tests/test-utils/skill-pressure/lib/review/acpx-blind-review-runner.ts",
  },
  {
    id: "v2-current-review-result",
    category: "oracle",
    relativePath: "tests/test-utils/skill-pressure/lib/review/acpx-review-result.ts",
  },
  {
    id: "v2-current-review-packet",
    category: "oracle",
    relativePath: "tests/test-utils/skill-pressure/lib/review/review-packet.ts",
  },
  {
    id: "v2-current-live-pair-script",
    category: "runner",
    relativePath: "tests/test-utils/skill-pressure/scripts/run-live-pair.ts",
  },
  {
    id: "v2-current-live-scenario-script",
    category: "runner",
    relativePath: "tests/test-utils/skill-pressure/scripts/run-live-scenario.ts",
  },
];

export const FORBIDDEN_LEGACY_CONTENT_SURFACES: readonly ForbiddenLegacyContentSurface[] = [
  { id: "v2-schema-version-marker", category: "schema", pattern: /^\s*schema_version:\s*2\s*$/mu },
  { id: "v2-hidden-rubric-field", category: "oracle", pattern: /\b(?:hidden_rubric|hiddenRubric)\b/u },
  { id: "v2-response-regex-oracle-field", category: "oracle", pattern: /\b(?:required_response_patterns|response_patterns|responseRegex|response_regex)\b/u },
  { id: "v2-self-report-oracle-field", category: "oracle", pattern: /\b(?:self_report|selfReport|reported_result|reportedResult)\b/u },
];

export interface VerifyForbiddenLegacySurfacesProps {
  readonly repositoryRoot: string;
  readonly sourceOverrides?: Readonly<Record<string, string>>;
  readonly contentOverrides?: Readonly<Record<string, string>>;
}

export interface ForbiddenLegacySurfaceCheck {
  readonly id: string;
  readonly category: ForbiddenLegacySurfaceCategory;
  readonly relativePath: string;
  readonly checkedPath: string;
  readonly present: boolean;
}

export interface ForbiddenLegacySurfaceReceipt {
  readonly absent: true;
  readonly checked: readonly ForbiddenLegacySurfaceCheck[];
  readonly contentChecked: readonly {
    readonly id: string;
    readonly category: "schema" | "oracle";
    readonly presentInPaths: readonly string[];
  }[];
}

export async function verifyForbiddenLegacySurfacesAbsent(
  props: VerifyForbiddenLegacySurfacesProps,
): Promise<ForbiddenLegacySurfaceReceipt> {
  const repositoryRoot = path.resolve(props.repositoryRoot);
  const checked = await Promise.all(FORBIDDEN_LEGACY_SURFACES.map(async (surface) => {
    const override = props.sourceOverrides?.[surface.id] ?? props.sourceOverrides?.[surface.relativePath];
    const checkedPath = override === undefined
      ? path.resolve(repositoryRoot, surface.relativePath)
      : path.resolve(repositoryRoot, override);
    return {
      id: surface.id,
      category: surface.category,
      relativePath: surface.relativePath,
      checkedPath,
      present: await pathExists(checkedPath),
    } satisfies ForbiddenLegacySurfaceCheck;
  }));
  const violations = checked.filter((surface) => surface.present);
  if (violations.length > 0) {
    throw new Error(
      `forbidden legacy v2 surfaces are present: ${violations.map((surface) => `${surface.id} (${surface.checkedPath})`).join(", ")}`,
    );
  }
  const authoritySources = await readAuthoritySources(repositoryRoot);
  const contentChecked = FORBIDDEN_LEGACY_CONTENT_SURFACES.map((surface) => {
    const override = props.contentOverrides?.[surface.id];
    const sources = override === undefined
      ? authoritySources
      : new Map([[`fixture:${surface.id}`, override]]);
    return {
      id: surface.id,
      category: surface.category,
      presentInPaths: [...sources]
        .filter(([, source]) => surface.pattern.test(source))
        .map(([sourcePath]) => sourcePath)
        .sort((left, right) => left.localeCompare(right)),
    };
  });
  const contentViolations = contentChecked.filter((surface) => surface.presentInPaths.length > 0);
  if (contentViolations.length > 0) {
    throw new Error(
      `forbidden legacy v2 content is present: ${contentViolations.map((surface) => `${surface.id} (${surface.presentInPaths.join(", ")})`).join("; ")}`,
    );
  }
  return { absent: true, checked, contentChecked };
}

export const assertForbiddenLegacySurfacesAbsent = verifyForbiddenLegacySurfacesAbsent;

async function pathExists(candidatePath: string): Promise<boolean> {
  try {
    await lstat(candidatePath);
    return true;
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

async function readAuthoritySources(repositoryRoot: string): Promise<ReadonlyMap<string, string>> {
  const sourceRoots = [
    "tests/test-utils/skill-pressure/lib/contracts",
    "tests/test-utils/skill-pressure/lib/evaluation",
    "tests/test-utils/skill-pressure/lib/reduction",
    "tests/test-utils/skill-pressure/lib/review",
    "tests/test-utils/skill-pressure/evals",
  ];
  const sourcePaths = (await Promise.all(sourceRoots.map((root) => findFiles(path.resolve(repositoryRoot, root)))))
    .flat()
    .filter((sourcePath) => sourcePath.endsWith(".ts") && !sourcePath.endsWith(".test.ts"));
  const scenarioPaths = (await findFiles(path.resolve(repositoryRoot, "tests"))).filter((sourcePath) => {
    const relativePath = path.relative(repositoryRoot, sourcePath).split(path.sep).join("/");
    return /^tests\/[^/]+\/[^/]+\/scenarios\/[^/]+\.md$/u.test(relativePath);
  });
  const sources = new Map<string, string>();
  for (const sourcePath of [...sourcePaths, ...scenarioPaths].sort()) {
    const relativePath = path.relative(repositoryRoot, sourcePath).split(path.sep).join("/");
    sources.set(relativePath, await readFile(sourcePath, "utf8"));
  }
  return sources;
}

async function findFiles(root: string): Promise<readonly string[]> {
  let entries;
  try {
    entries = await readdir(root, { withFileTypes: true });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") return [];
    throw error;
  }
  const files: string[] = [];
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const entryPath = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...await findFiles(entryPath));
    if (entry.isFile()) files.push(entryPath);
  }
  return files;
}
