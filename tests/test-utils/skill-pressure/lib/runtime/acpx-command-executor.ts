import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

import { runSupervisedProcess, type ProcessSupervisorReceipt } from "./process-group-supervisor.js";

export interface AcpxLauncher {
  readonly executable: string;
  readonly prefixArgs: readonly string[];
  readonly source: "global" | "pnpm-dlx" | "npx";
}

export interface RuntimeExecutableIdentity {
  readonly launcher: AcpxLauncher;
  readonly launcherDigest: string;
  readonly launcherVersion: string;
  readonly codexExecutable: string;
  readonly codexDigest: string;
  readonly codexVersion: string;
}

const execFileAsync = promisify(execFile);

export interface ExecutableAcpxCommand {
  readonly executable: string;
  readonly args: readonly string[];
  readonly cwd: string;
  readonly environment: Readonly<Record<string, string>>;
  readonly timeoutMs?: number;
  readonly terminationGraceMs?: number;
  readonly signal?: AbortSignal;
}

export interface AcpxProcessExecution {
  readonly exitCode: number;
  readonly timedOut: boolean;
  readonly cleanupComplete: boolean;
  readonly stdout: string;
  readonly stderr: string;
  readonly supervisorReceipt: ProcessSupervisorReceipt;
}

const DEFAULT_COMMAND_TIMEOUT_MS = 30_000;
const DEFAULT_TERMINATION_GRACE_MS = 5_000;
const ACPX_TIMEOUT_OVERHEAD_MS = 10_000;

export async function resolveAcpxLauncher(
  environmentPath = process.env.PATH ?? "",
): Promise<AcpxLauncher> {
  const globalAcpx = await findExecutable("acpx", environmentPath);
  if (globalAcpx !== null) {
    return { executable: globalAcpx, prefixArgs: [], source: "global" };
  }
  const pnpm = await findExecutable("pnpm", environmentPath);
  if (pnpm !== null) {
    return { executable: pnpm, prefixArgs: ["dlx", "acpx"], source: "pnpm-dlx" };
  }
  const npx = await findExecutable("npx", environmentPath);
  if (npx !== null) {
    return { executable: npx, prefixArgs: ["--yes", "acpx"], source: "npx" };
  }
  throw new Error("ACPX is unavailable: expected global acpx, pnpm, or npx");
}

export async function resolveExecutablePath(
  executableName: string,
  environmentPath = process.env.PATH ?? "",
): Promise<string> {
  const executable = await findExecutable(executableName, environmentPath);
  if (executable === null) {
    throw new Error(`executable is unavailable on PATH: ${executableName}`);
  }
  return executable;
}

export async function resolveRuntimeExecutableIdentity(
  launcher: AcpxLauncher,
  codexExecutable: string,
): Promise<RuntimeExecutableIdentity> {
  const [launcherContents, codexContents, launcherVersion, codexVersion] = await Promise.all([
    readFile(launcher.executable),
    readFile(codexExecutable),
    execFileAsync(launcher.executable, [...launcher.prefixArgs, "--version"], { timeout: 30_000 }),
    execFileAsync(codexExecutable, ["--version"], { timeout: 30_000 }),
  ]);
  return {
    launcher,
    launcherDigest: digestBytes(launcherContents),
    launcherVersion: launcherVersion.stdout.trim(),
    codexExecutable,
    codexDigest: digestBytes(codexContents),
    codexVersion: codexVersion.stdout.trim(),
  };
}

export async function executeAcpxCommand(
  command: ExecutableAcpxCommand,
): Promise<AcpxProcessExecution> {
  const result = await runSupervisedProcess({
    command: command.executable,
    args: command.args,
    cwd: command.cwd,
    environment: { ...safeInheritedEnvironment(), ...command.environment },
    timeoutMs: command.timeoutMs ?? inferWrapperTimeoutMs(command.args),
    terminationGraceMs:
      command.terminationGraceMs ?? DEFAULT_TERMINATION_GRACE_MS,
    ...(command.signal === undefined ? {} : { signal: command.signal }),
  });
  const timedOut = result.receipt.outcome === "timed_out" ||
    result.receipt.exitCode === 3;

  return {
    exitCode: timedOut ? 3 : (result.receipt.exitCode ?? 1),
    timedOut,
    cleanupComplete: result.receipt.stdoutEof && result.receipt.stderrEof,
    stdout: result.stdout,
    stderr: result.stderr,
    supervisorReceipt: result.receipt,
  };
}

export function collectSensitiveEnvironmentValues(
  environment: NodeJS.ProcessEnv = process.env,
): readonly string[] {
  return [...new Set(Object.entries(environment)
    .filter(([key, value]) => value !== undefined && /(?:KEY|TOKEN|SECRET|PASSWORD|AUTH)/iu.test(key))
    .map(([, value]) => value as string)
    .filter((value) => value.length >= 8))];
}

function safeInheritedEnvironment(environment: NodeJS.ProcessEnv = process.env): NodeJS.ProcessEnv {
  const allowedKeys = [
    "HOME", "PATH", "TMPDIR", "TMP", "TEMP", "SHELL", "USER", "LOGNAME",
    "LANG", "LC_ALL", "TERM", "NO_COLOR", "XDG_CONFIG_HOME", "XDG_CACHE_HOME",
    "SSL_CERT_FILE", "SSL_CERT_DIR", "HTTP_PROXY", "HTTPS_PROXY", "NO_PROXY",
    "http_proxy", "https_proxy", "no_proxy", "CODEX_HOME", "OPENAI_API_KEY",
    "ANTHROPIC_API_KEY",
  ];
  return Object.fromEntries(allowedKeys.flatMap((key) =>
    environment[key] === undefined ? [] : [[key, environment[key]]],
  ));
}

function inferWrapperTimeoutMs(args: readonly string[]): number {
  const timeoutIndex = args.lastIndexOf("--timeout");
  const timeoutSeconds = timeoutIndex >= 0
    ? Number(args[timeoutIndex + 1])
    : Number.NaN;
  return Number.isFinite(timeoutSeconds) && timeoutSeconds > 0
    ? timeoutSeconds * 1_000 + ACPX_TIMEOUT_OVERHEAD_MS
    : DEFAULT_COMMAND_TIMEOUT_MS;
}

async function findExecutable(
  executableName: string,
  environmentPath: string,
): Promise<string | null> {
  for (const directory of environmentPath.split(path.delimiter).filter(Boolean)) {
    const candidate = path.join(directory, executableName);
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Continue through PATH in order.
    }
  }
  return null;
}

function digestBytes(value: Buffer): string {
  return `sha256:${createHash("sha256").update(value).digest("hex")}`;
}
