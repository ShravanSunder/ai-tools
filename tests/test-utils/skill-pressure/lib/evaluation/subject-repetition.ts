import { createHash, randomUUID } from "node:crypto";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

import { collectAcpxTranscript, type AcpxTranscriptFacts } from "../collector/acpx-transcript-collector.js";
import {
  installCodexRepoSkill,
  type CodexRepoSkillInstallReceipt,
} from "../installation/codex-repo-skill-installer.js";
import type { ExpectedArtifact } from "../contracts/contract-types.js";
import {
  collectRepositorySnapshot,
  createRepositoryEvidence,
  type RepositoryEvidence,
} from "../evidence/repository-snapshot.js";
import {
  executeAcpxCommand,
  type AcpxLauncher,
  type AcpxProcessExecution,
  type ExecutableAcpxCommand,
  type RuntimeExecutableIdentity,
} from "../runtime/acpx-command-executor.js";
import {
  buildAcpxCodexSubjectCommand,
  type AcpxPermissionMode,
} from "../runtime/acpx-subject-profile.js";
import {
  createAcpxCodexRuntimeProfile,
  verifyRuntimeProfile,
  type RuntimeProfileReceipt,
} from "../runtime/runtime-profile.js";

const execFileAsync = promisify(execFile);
const RUNNER_VERSION = "skill-pressure-repetition-v1";
const NEUTRAL_INSTRUCTIONS = `# Pressure Test Workspace

Complete the operator request using only this disposable repository. Do not
inspect files outside the repository. Return the normal operator-facing answer.
`;

export interface SubjectFixtureFile {
  readonly path: string;
  readonly contents: string;
}

export type SelectedSkillSource =
  | { readonly mode: "none" }
  | { readonly mode: "current"; readonly directory: string }
  | {
      readonly mode: "previous_revision";
      readonly repositoryRoot: string;
      readonly revision: string;
      readonly skillRelativePath: string;
    };

export interface RunSubjectRepetitionProps {
  readonly runRoot: string;
  readonly scenarioId: string;
  readonly variant: "baseline" | "treatment";
  readonly prompt: string;
  readonly fixtureFiles: readonly SubjectFixtureFile[];
  readonly expectedArtifacts: readonly ExpectedArtifact[];
  readonly skillName: string;
  readonly selectedSkillSource: SelectedSkillSource;
  readonly launcher: AcpxLauncher;
  readonly codexExecutable: string;
  readonly runtimeIdentity: RuntimeExecutableIdentity;
  readonly model: string;
  readonly reasoningEffort: string;
  readonly permissionMode: AcpxPermissionMode;
  readonly disabledAmbientSkillPaths: readonly string[];
  readonly timeoutSeconds: number;
  readonly redactionSecrets: readonly string[];
  readonly execute?: (command: ExecutableAcpxCommand) => Promise<AcpxProcessExecution>;
}

export interface SubjectRepetitionReceipt {
  readonly runnerVersion: typeof RUNNER_VERSION;
  readonly repetitionId: string;
  readonly scenarioId: string;
  readonly variant: "baseline" | "treatment";
  readonly repositoryDirectory: string;
  readonly repositoryIdentity: string;
  readonly commonInputDigest: string;
  readonly promptDigest: string;
  readonly fixtureDigest: string;
  readonly sourceDigest: string | null;
  readonly sourceMode: SelectedSkillSource["mode"];
  readonly sourceRevision: string | null;
  readonly installReceipt: CodexRepoSkillInstallReceipt | null;
  readonly requestedModel: string;
  readonly requestedReasoningEffort: string;
  readonly permissionMode: AcpxPermissionMode;
  readonly runtimeIdentity: RuntimeExecutableIdentity;
  readonly disabledAmbientSkills: readonly {
    readonly path: string;
    readonly status: "present" | "missing";
    readonly digest: string | null;
  }[];
  readonly repositoryEvidence: RepositoryEvidence;
  readonly transcript: AcpxTranscriptFacts;
  readonly runtimeProfile?: RuntimeProfileReceipt;
  readonly transcriptDigest: string;
  readonly process: {
    readonly exitCode: number;
    readonly timedOut: boolean;
    readonly cleanupComplete: boolean;
    readonly stderrDigest: string;
    readonly stderrExcerpt: string;
    readonly supervisorReceipt: AcpxProcessExecution["supervisorReceipt"];
  };
  readonly durationMs: number;
  readonly status: "executed" | "infrastructure_error";
  readonly infrastructureReasons: readonly string[];
}

export async function runSubjectRepetition(
  props: RunSubjectRepetitionProps,
): Promise<SubjectRepetitionReceipt> {
  validateProps(props);
  await mkdir(path.resolve(props.runRoot), { recursive: true });
  const repositoryDirectory = await mkdtemp(
    path.join(path.resolve(props.runRoot), `${props.scenarioId}-${props.variant}-`),
  );
  await execFileAsync("git", ["init", "--quiet"], { cwd: repositoryDirectory });
  await writeFile(path.join(repositoryDirectory, "AGENTS.md"), NEUTRAL_INSTRUCTIONS, { flag: "wx" });
  await materializeFixture(repositoryDirectory, props.fixtureFiles);
  const promptPath = path.join(repositoryDirectory, ".skill-pressure-prompt.md");
  const mcpConfigPath = path.join(repositoryDirectory, ".skill-pressure-mcp.json");
  await writeFile(promptPath, props.prompt, { flag: "wx" });
  await writeFile(mcpConfigPath, '{"mcpServers":[]}\n', { flag: "wx" });

  const selectedSource = await resolveSelectedSource(props.selectedSkillSource, props.runRoot);
  let installReceipt: CodexRepoSkillInstallReceipt | null = null;
  try {
    installReceipt = selectedSource.directory === null
      ? null
      : installCodexRepoSkill({
          sourceSkillDirectory: selectedSource.directory,
          repositoryDirectory,
          skillName: props.skillName,
        });
  } finally {
    if (selectedSource.temporary) {
      await rm(selectedSource.directory ?? "", { recursive: true, force: true });
    }
  }
  const sourceDigest = installReceipt?.closureDigest ?? null;
  const disabledAmbientSkills = await Promise.all(
    [...props.disabledAmbientSkillPaths].sort().map(readDisabledAmbientSkill),
  );
  const fixtureDigest = digestFixture(props.fixtureFiles);
  const promptDigest = digest(props.prompt);
  const commonInputDigest = digest(JSON.stringify({
    runnerVersion: RUNNER_VERSION,
    scenarioId: props.scenarioId,
    promptDigest,
    fixtureDigest,
    model: props.model,
    reasoningEffort: props.reasoningEffort,
    permissionMode: props.permissionMode,
    runtimeIdentity: props.runtimeIdentity,
    disabledAmbientSkills,
    timeoutSeconds: props.timeoutSeconds,
    mcpConfig: "empty",
  }));
  const command = buildAcpxCodexSubjectCommand({
    launcher: props.launcher,
    codexExecutable: path.resolve(props.codexExecutable),
    cwd: repositoryDirectory,
    mcpConfigPath,
    promptPath,
    model: props.model,
    reasoningEffort: props.reasoningEffort,
    permissionMode: props.permissionMode,
    disabledSkillPaths: props.disabledAmbientSkillPaths,
    timeoutSeconds: props.timeoutSeconds,
  });
  const beforeRunSnapshot = await collectRepositorySnapshot({ repositoryDirectory });
  const startedAt = performance.now();
  const execution = await (props.execute ?? executeAcpxCommand)(command);
  const durationMs = Math.round(performance.now() - startedAt);
  const postRunSnapshot = await collectRepositorySnapshot({ repositoryDirectory });
  const repositoryEvidence = createRepositoryEvidence({
    beforeRunSnapshot,
    postRunSnapshot,
    expectedArtifacts: props.expectedArtifacts,
  });
  const transcript = collectAcpxTranscript(execution.stdout, {
    secrets: props.redactionSecrets,
    excerptLimit: 8_000,
    observationLimit: 200,
  });
  const runtimeProfile = verifyRuntimeProfile({
    profile: createAcpxCodexRuntimeProfile({ model: props.model, reasoningEffort: props.reasoningEffort }),
    providerReported: {
      model: transcript.resolvedModel,
      reasoningEffort: transcript.reasoningEffort,
    },
  });
  const infrastructureReasons = collectInfrastructureReasons({ props, execution, transcript, runtimeProfile });

  return {
    runnerVersion: RUNNER_VERSION,
    repetitionId: randomUUID(),
    scenarioId: props.scenarioId,
    variant: props.variant,
    repositoryDirectory,
    repositoryIdentity: digest(repositoryDirectory),
    commonInputDigest,
    promptDigest,
    fixtureDigest,
    sourceDigest,
    sourceMode: props.selectedSkillSource.mode,
    sourceRevision: selectedSource.revision,
    installReceipt,
    requestedModel: props.model,
    requestedReasoningEffort: props.reasoningEffort,
    permissionMode: props.permissionMode,
    runtimeIdentity: props.runtimeIdentity,
    disabledAmbientSkills,
    repositoryEvidence,
    transcript,
    runtimeProfile,
    transcriptDigest: digest(execution.stdout),
    process: {
      exitCode: execution.exitCode,
      timedOut: execution.timedOut,
      cleanupComplete: execution.cleanupComplete,
      stderrDigest: digest(execution.stderr),
      stderrExcerpt: redactDiagnosticText(execution.stderr, props.redactionSecrets).slice(0, 2_000),
      supervisorReceipt: execution.supervisorReceipt,
    },
    durationMs,
    status: infrastructureReasons.length === 0 ? "executed" : "infrastructure_error",
    infrastructureReasons,
  };
}

async function readDisabledAmbientSkill(skillPath: string): Promise<{
  readonly path: string;
  readonly status: "present" | "missing";
  readonly digest: string | null;
}> {
  const resolvedPath = path.resolve(skillPath);
  try {
    return {
      path: resolvedPath,
      status: "present",
      digest: digest((await readFile(resolvedPath)).toString("utf8")),
    };
  } catch (error) {
    if (isMissingPathError(error)) {
      return { path: resolvedPath, status: "missing", digest: null };
    }
    throw error;
  }
}

function isMissingPathError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}

export function assertComparablePair(
  baseline: SubjectRepetitionReceipt,
  treatment: SubjectRepetitionReceipt,
): void {
  if (baseline.variant !== "baseline" || treatment.variant !== "treatment") {
    throw new Error("pair must contain baseline then treatment");
  }
  if (baseline.status !== "executed" || treatment.status !== "executed") {
    throw new Error("pair contains an infrastructure error");
  }
  if (baseline.commonInputDigest !== treatment.commonInputDigest) {
    throw new Error("baseline and treatment common inputs differ");
  }
  if (baseline.repositoryIdentity === treatment.repositoryIdentity) {
    throw new Error("baseline and treatment reused a repository");
  }
  if (baseline.transcript.sessionId === null || treatment.transcript.sessionId === null) {
    throw new Error("baseline and treatment require observed session ids");
  }
  if (baseline.transcript.sessionId === treatment.transcript.sessionId) {
    throw new Error("baseline and treatment reused an ACPX session");
  }
  if (treatment.sourceMode !== "current" || treatment.sourceDigest === null) {
    throw new Error("treatment must use an installed current skill source");
  }
  if (baseline.sourceMode === "none") {
    if (baseline.sourceDigest !== null || baseline.sourceRevision !== null) {
      throw new Error("no-skill baseline contains selected skill source evidence");
    }
  } else if (baseline.sourceMode === "previous_revision") {
    if (baseline.sourceDigest === null || baseline.sourceRevision === null) {
      throw new Error("previous-revision baseline lacks immutable source evidence");
    }
  } else {
    throw new Error("baseline must use no skill or an immutable previous revision");
  }
}

function collectInfrastructureReasons(props: {
  readonly props: RunSubjectRepetitionProps;
  readonly execution: AcpxProcessExecution;
  readonly transcript: AcpxTranscriptFacts;
  readonly runtimeProfile: RuntimeProfileReceipt;
}): readonly string[] {
  const reasons: string[] = [];
  if (props.execution.exitCode !== 0) reasons.push(`ACPX exited ${props.execution.exitCode}`);
  if (props.execution.timedOut) reasons.push("ACPX timed out");
  if (!props.execution.cleanupComplete) reasons.push("process cleanup is incomplete");
  if (props.transcript.parseErrors.length > 0) reasons.push("ACPX transcript is malformed");
  if (props.transcript.transportErrors.length > 0) reasons.push("ACPX transport reported errors");
  if (props.transcript.promptCount !== 1) reasons.push("ACPX execution was not one prompt");
  if (props.transcript.sessionId === null) reasons.push("ACPX session id is missing");
  if (props.runtimeProfile.verification.status !== "verified") {
    reasons.push(`runtime profile is unverified: ${props.runtimeProfile.verification.reasons.join(", ")}`);
  }
  if (props.transcript.mcpServerCount !== 0) reasons.push("ACPX MCP configuration is not empty");
  if (props.transcript.stopReason !== "end_turn") reasons.push("ACPX turn did not end successfully");
  if (props.transcript.visibleResponse.trim() === "") reasons.push("operator response is empty");
  if (!hasMeaningfulUsage(props.transcript.usageObservations)) reasons.push("ACPX usage evidence is missing");
  if (props.transcript.diagnosticErrors.length > 0) reasons.push("operator response contains transport diagnostics");
  return reasons;
}

function hasMeaningfulUsage(observations: readonly string[]): boolean {
  return observations.some((observation) => {
    try {
      const parsed: unknown = JSON.parse(observation);
      return typeof parsed === "object" && parsed !== null &&
        Object.values(parsed).some((value) => typeof value === "number" && Number.isFinite(value));
    } catch {
      return false;
    }
  });
}

async function materializeFixture(
  repositoryDirectory: string,
  fixtureFiles: readonly SubjectFixtureFile[],
): Promise<void> {
  for (const fixtureFile of [...fixtureFiles].sort((left, right) => left.path.localeCompare(right.path))) {
    const destination = containedFixturePath(repositoryDirectory, fixtureFile.path);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, fixtureFile.contents, { flag: "wx" });
  }
}

function containedFixturePath(repositoryDirectory: string, relativePath: string): string {
  if (path.isAbsolute(relativePath) || relativePath.includes("\\")) {
    throw new Error(`fixture path must be a POSIX relative path: ${relativePath}`);
  }
  const destination = path.resolve(repositoryDirectory, relativePath);
  const fromRoot = path.relative(repositoryDirectory, destination);
  if (fromRoot === "" || fromRoot === ".." || fromRoot.startsWith(`..${path.sep}`)) {
    throw new Error(`fixture path escapes repository: ${relativePath}`);
  }
  return destination;
}

function digestFixture(fixtureFiles: readonly SubjectFixtureFile[]): string {
  return digest(JSON.stringify([...fixtureFiles]
    .sort((left, right) => left.path.localeCompare(right.path))
    .map((file) => ({ path: file.path, digest: digest(file.contents) }))));
}

function digest(value: string): string {
  return `sha256:${createHash("sha256").update(value).digest("hex")}`;
}

function redactDiagnosticText(value: string, secrets: readonly string[]): string {
  let redacted = value;
  for (const secret of [...new Set(secrets.filter(Boolean))].sort((left, right) => right.length - left.length)) {
    redacted = redacted.replaceAll(secret, "[REDACTED]");
  }
  return redacted
    .replace(/Bearer\s+[A-Za-z0-9._~+/=-]+/giu, "Bearer [REDACTED]")
    .replace(/\b(?:sk|key|token)-[A-Za-z0-9_-]{12,}\b/giu, "[REDACTED]");
}

function validateProps(props: RunSubjectRepetitionProps): void {
  if (
    props.runtimeIdentity.launcher.executable !== props.launcher.executable ||
    JSON.stringify(props.runtimeIdentity.launcher.prefixArgs) !== JSON.stringify(props.launcher.prefixArgs) ||
    props.runtimeIdentity.launcher.source !== props.launcher.source ||
    path.resolve(props.runtimeIdentity.codexExecutable) !== path.resolve(props.codexExecutable)
  ) {
    throw new Error("runtime identity does not match execution inputs");
  }
  if (props.prompt.trim() === "") throw new Error("prompt must be non-empty");
  if (props.variant === "treatment" && props.selectedSkillSource.mode !== "current") {
    throw new Error("treatment requires a selected skill source");
  }
  if (props.variant === "baseline" && props.selectedSkillSource.mode === "current") {
    throw new Error("baseline may not install the current skill source");
  }
  if (!Number.isInteger(props.timeoutSeconds) || props.timeoutSeconds <= 0) {
    throw new Error("timeoutSeconds must be positive");
  }
}

async function resolveSelectedSource(
  source: SelectedSkillSource,
  runRoot: string,
): Promise<{ readonly directory: string | null; readonly revision: string | null; readonly temporary: boolean }> {
  if (source.mode === "none") {
    return { directory: null, revision: null, temporary: false };
  }
  if (source.mode === "current") {
    return { directory: path.resolve(source.directory), revision: null, temporary: false };
  }
  const repositoryRoot = path.resolve(source.repositoryRoot);
  const skillRelativePath = normalizeGitRelativePath(source.skillRelativePath);
  const { stdout: resolvedRevisionOutput } = await execFileAsync(
    "git",
    ["rev-parse", "--verify", `${source.revision}^{commit}`],
    { cwd: repositoryRoot },
  );
  const revision = resolvedRevisionOutput.trim();
  const { stdout: treeOutput } = await execFileAsync(
    "git",
    ["ls-tree", "-r", "-z", revision, "--", skillRelativePath],
    { cwd: repositoryRoot, maxBuffer: 10 * 1024 * 1024 },
  );
  const entries = treeOutput.split("\0").filter(Boolean);
  if (entries.length === 0) {
    throw new Error(`previous-revision skill path is missing: ${skillRelativePath}`);
  }
  const sourceDirectory = await mkdtemp(path.join(path.resolve(runRoot), ".previous-source-"));
  try {
    for (const entry of entries) {
      const match = /^(?<mode>\d+) (?<type>\w+) (?<hash>[a-f0-9]+)\t(?<filePath>.+)$/u.exec(entry);
      const mode = match?.groups?.mode;
      const type = match?.groups?.type;
      const hash = match?.groups?.hash;
      const filePath = match?.groups?.filePath;
      if (mode === undefined || type !== "blob" || hash === undefined || filePath === undefined || mode === "120000") {
        throw new Error(`previous-revision skill contains an unsupported entry: ${entry}`);
      }
      const relativeFilePath = path.posix.relative(skillRelativePath, filePath);
      const destination = containedFixturePath(sourceDirectory, relativeFilePath);
      const contents = await execFileBuffer("git", ["cat-file", "blob", hash], repositoryRoot);
      await mkdir(path.dirname(destination), { recursive: true });
      await writeFile(destination, contents, { flag: "wx" });
    }
  } catch (error) {
    await rm(sourceDirectory, { recursive: true, force: true });
    throw error;
  }
  return { directory: sourceDirectory, revision, temporary: true };
}

function normalizeGitRelativePath(value: string): string {
  if (value === "" || path.isAbsolute(value) || value.includes("\\")) {
    throw new Error("skillRelativePath must be a POSIX relative path");
  }
  const normalized = path.posix.normalize(value);
  if (normalized === ".." || normalized.startsWith("../")) {
    throw new Error("skillRelativePath escapes repository");
  }
  return normalized;
}

function execFileBuffer(command: string, args: readonly string[], cwd: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    execFile(command, args, { cwd, encoding: "buffer", maxBuffer: 20 * 1024 * 1024 }, (error, stdout) => {
      if (error !== null) {
        reject(error);
        return;
      }
      resolve(Buffer.isBuffer(stdout) ? stdout : Buffer.from(stdout));
    });
  });
}

export async function readMaterializedPrompt(receipt: SubjectRepetitionReceipt): Promise<string> {
  return readFile(path.join(receipt.repositoryDirectory, ".skill-pressure-prompt.md"), "utf8");
}
