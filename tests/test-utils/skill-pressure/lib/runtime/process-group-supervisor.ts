import { spawn } from "node:child_process";
import type { ChildProcess, SpawnOptions } from "node:child_process";
import type { Readable } from "node:stream";

export interface ProcessLaunchProps {
  readonly command: string;
  readonly args: readonly string[];
  readonly cwd: string;
  readonly environment: NodeJS.ProcessEnv;
  readonly timeoutMs: number;
  readonly terminationGraceMs: number;
  readonly signal?: AbortSignal;
  readonly captureOutput?: boolean;
  readonly onStdoutChunk?: (chunk: Buffer) => void;
  readonly onStderrChunk?: (chunk: Buffer) => void;
  readonly processRunner?: ProcessRunner;
  readonly signalProcessGroup?: ProcessGroupSignaler;
}

export interface ProcessHandle {
  readonly pid?: number | undefined;
  readonly stdout: Readable | null;
  readonly stderr: Readable | null;
  once(event: "error", listener: (error: Error) => void): this;
  once(event: "close", listener: (exitCode: number | null, signal: NodeJS.Signals | null) => void): this;
  kill(signal: NodeJS.Signals): boolean;
}

export interface ProcessRunner {
  spawn(props: Pick<ProcessLaunchProps, "command" | "args" | "cwd" | "environment">): ProcessHandle;
}

export type ProcessGroupSignaler = (processId: number, signal: NodeJS.Signals) => boolean;

export interface ProcessCleanupReceipt {
  readonly processGroupId: number | null;
  readonly termSent: boolean;
  readonly killSent: boolean;
}

export interface ProcessSupervisorReceipt {
  readonly outcome: "completed" | "timed_out" | "cancelled";
  readonly exitCode: number | null;
  readonly signal: NodeJS.Signals | null;
  readonly stdoutEof: boolean;
  readonly stderrEof: boolean;
  readonly cleanup: ProcessCleanupReceipt;
}

export interface SupervisedProcessResult {
  readonly stdout: string;
  readonly stderr: string;
  readonly receipt: ProcessSupervisorReceipt;
}

const nodeProcessRunner: ProcessRunner = {
  spawn(props): ProcessHandle {
    const options: SpawnOptions = {
      cwd: props.cwd,
      env: props.environment,
      detached: process.platform !== "win32",
      stdio: ["ignore", "pipe", "pipe"],
    };
    return spawn(props.command, props.args, options);
  },
};

function signalProcessGroup(processId: number, signal: NodeJS.Signals): boolean {
  if (process.platform !== "win32") {
    process.kill(-processId, signal);
    return true;
  }
  return process.kill(processId, signal);
}

function observeStream(
  stream: Readable | null,
  captureOutput: boolean,
  onChunk: ((chunk: Buffer) => void) | undefined,
): { readonly output: Promise<string>; readonly eof: Promise<boolean> } {
  if (stream === null) {
    return { output: Promise.resolve(""), eof: Promise.resolve(true) };
  }
  const chunks: Buffer[] = [];
  let resolveOutput: (value: string) => void = () => undefined;
  let resolveEof: (value: boolean) => void = () => undefined;
  const output = new Promise<string>((resolve) => {
    resolveOutput = resolve;
  });
  const eof = new Promise<boolean>((resolve) => {
    resolveEof = resolve;
  });
  stream.on("data", (chunk: Buffer | string) => {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    if (captureOutput) {
      chunks.push(buffer);
    }
    onChunk?.(buffer);
  });
  stream.once("end", () => {
    resolveOutput(Buffer.concat(chunks).toString("utf8"));
    resolveEof(true);
  });
  stream.once("error", () => {
    resolveOutput(Buffer.concat(chunks).toString("utf8"));
    resolveEof(false);
  });
  return { output, eof };
}

function waitForClose(processHandle: ProcessHandle): Promise<{ readonly exitCode: number | null; readonly signal: NodeJS.Signals | null }> {
  return new Promise((resolve, reject) => {
    processHandle.once("error", reject);
    processHandle.once("close", (exitCode, signal) => resolve({ exitCode, signal }));
  });
}

export async function runSupervisedProcess(props: ProcessLaunchProps): Promise<SupervisedProcessResult> {
  if (props.timeoutMs <= 0 || props.terminationGraceMs <= 0) {
    throw new Error("timeoutMs and terminationGraceMs must be positive");
  }
  const processHandle = (props.processRunner ?? nodeProcessRunner).spawn(props);
  const captureOutput = props.captureOutput ?? true;
  const stdout = observeStream(processHandle.stdout, captureOutput, props.onStdoutChunk);
  const stderr = observeStream(processHandle.stderr, captureOutput, props.onStderrChunk);
  const groupSignaler = props.signalProcessGroup ?? signalProcessGroup;
  let outcome: ProcessSupervisorReceipt["outcome"] = "completed";
  let termSent = false;
  let killSent = false;
  let closed = false;
  let killTimer: ReturnType<typeof setTimeout> | undefined;

  const terminate = (nextOutcome: "timed_out" | "cancelled"): void => {
    if (closed || termSent) {
      return;
    }
    outcome = nextOutcome;
    const processId = processHandle.pid;
    if (processId === undefined) {
      return;
    }
    try {
      termSent = groupSignaler(processId, "SIGTERM");
    } catch {
      termSent = false;
    }
    killTimer = setTimeout(() => {
      if (closed || processId === undefined) {
        return;
      }
      try {
        killSent = groupSignaler(processId, "SIGKILL");
      } catch {
        killSent = false;
      }
    }, props.terminationGraceMs);
  };

  const timeoutTimer = setTimeout(() => terminate("timed_out"), props.timeoutMs);
  const abortHandler = (): void => terminate("cancelled");
  props.signal?.addEventListener("abort", abortHandler, { once: true });
  if (props.signal?.aborted) {
    abortHandler();
  }

  try {
    const closeResult = await waitForClose(processHandle);
    closed = true;
    clearTimeout(timeoutTimer);
    if (killTimer !== undefined) {
      clearTimeout(killTimer);
    }
    props.signal?.removeEventListener("abort", abortHandler);
    const [stdoutOutput, stderrOutput, stdoutEof, stderrEof] = await Promise.all([
      stdout.output,
      stderr.output,
      stdout.eof,
      stderr.eof,
    ]);
    return {
      stdout: stdoutOutput,
      stderr: stderrOutput,
      receipt: {
        outcome,
        exitCode: closeResult.exitCode,
        signal: closeResult.signal,
        stdoutEof,
        stderrEof,
        cleanup: {
          processGroupId: processHandle.pid ?? null,
          termSent,
          killSent,
        },
      },
    };
  } finally {
    clearTimeout(timeoutTimer);
    if (killTimer !== undefined) {
      clearTimeout(killTimer);
    }
    props.signal?.removeEventListener("abort", abortHandler);
  }
}
