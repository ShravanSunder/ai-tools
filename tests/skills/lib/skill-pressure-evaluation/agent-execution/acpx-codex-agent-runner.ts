import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import type {
  AcpxCodexAdapterConfiguration,
  AcpxCodexAgentSetup,
} from "../runtime-configuration/skill-pressure-runtime-configuration.js";

export interface AcpxAgentRunRequest {
  readonly namePrefix: string;
  readonly prompt: string;
  readonly signal?: AbortSignal;
  readonly setup: AcpxCodexAgentSetup;
}

export interface AcpxAgentRunResult {
  readonly finalText: string;
  readonly rawEvents: string;
  readonly stderr: string;
}

export type AcpxAgentRunner = (
  request: AcpxAgentRunRequest,
) => Promise<AcpxAgentRunResult>;

export interface AcpxProcessRequest {
  readonly args: readonly string[];
  readonly cwd: string;
  readonly stdin: string;
  readonly environment: NodeJS.ProcessEnv;
  readonly signal?: AbortSignal;
}

export interface AcpxProcessResult {
  readonly stdout: string;
  readonly stderr: string;
}

export type AcpxProcessRunner = (
  request: AcpxProcessRequest,
) => Promise<AcpxProcessResult>;

export interface CreateAcpxCodexAgentRunnerProps {
  readonly repoRoot: string;
  readonly adapterConfiguration: AcpxCodexAdapterConfiguration;
  readonly processRunner?: AcpxProcessRunner;
}

export function createAcpxCodexAgentRunner(
  props: CreateAcpxCodexAgentRunnerProps,
): AcpxAgentRunner {
  const processRunner = props.processRunner ?? runAcpxProcess;
  const environment = createAcpxProcessEnvironment(
    props.adapterConfiguration,
  );

  return async (request): Promise<AcpxAgentRunResult> => {
    const sessionName = `${request.namePrefix}-${randomUUID()}`;
    const baseArguments = buildAcpxBaseArguments({
      repoRoot: props.repoRoot,
      setup: request.setup,
    });

    try {
      await processRunner({
        args: [
          ...baseArguments,
          "codex",
          "sessions",
          "new",
          "--name",
          sessionName,
        ],
        cwd: props.repoRoot,
        stdin: "",
        environment,
        ...(request.signal === undefined ? {} : { signal: request.signal }),
      });
      await processRunner({
        args: [
          ...baseArguments,
          "codex",
          "-s",
          sessionName,
          "set",
          "reasoning_effort",
          request.setup.reasoningEffort,
        ],
        cwd: props.repoRoot,
        stdin: "",
        environment,
        ...(request.signal === undefined ? {} : { signal: request.signal }),
      });
      const promptResult = await processRunner({
        args: [
          ...baseArguments,
          "--format",
          "json",
          "--json-strict",
          "codex",
          "-s",
          sessionName,
          "--file",
          "-",
        ],
        cwd: props.repoRoot,
        stdin: request.prompt,
        environment,
        ...(request.signal === undefined ? {} : { signal: request.signal }),
      });

      return {
        finalText: extractAcpxAssistantText(promptResult.stdout),
        rawEvents: promptResult.stdout,
        stderr: promptResult.stderr,
      };
    } finally {
      await processRunner({
        args: [
          ...baseArguments,
          "codex",
          "sessions",
          "close",
          sessionName,
        ],
        cwd: props.repoRoot,
        stdin: "",
        environment,
      }).catch(() => undefined);
    }
  };
}

function createAcpxProcessEnvironment(
  adapterConfiguration: AcpxCodexAdapterConfiguration,
): NodeJS.ProcessEnv {
  const environment: NodeJS.ProcessEnv = { ...process.env };
  // The typed caller setup is authoritative. Do not inherit a launcher or
  // profile approximation from the parent shell: codex-acp starts app-server,
  // where Codex CLI profiles are unsupported. CODEX_CONFIG/MODEL_PROVIDER are
  // the temporary supported profile-equivalent bridge.
  delete environment["CODEX_CONFIG"];
  delete environment["MODEL_PROVIDER"];
  delete environment["CODEX_PATH"];

  if (adapterConfiguration.config !== undefined) {
    environment["CODEX_CONFIG"] = JSON.stringify(adapterConfiguration.config);
  }
  if (adapterConfiguration.modelProvider !== undefined) {
    environment["MODEL_PROVIDER"] = adapterConfiguration.modelProvider;
  }
  return environment;
}

export function buildAcpxBaseArguments(props: {
  readonly repoRoot: string;
  readonly setup: AcpxCodexAgentSetup;
}): readonly string[] {
  const permissionArguments =
    props.setup.permissionMode === "approve-reads"
      ? ["--approve-reads"]
      : ["--deny-all"];
  const allowedToolArguments =
    props.setup.allowedTools === undefined
      ? []
      : ["--allowed-tools", props.setup.allowedTools];

  return [
    "--cwd",
    props.repoRoot,
    "--model",
    props.setup.model,
    ...permissionArguments,
    "--non-interactive-permissions",
    "fail",
    "--no-terminal",
    ...allowedToolArguments,
    "--timeout",
    String(props.setup.timeoutSeconds),
  ];
}

export function extractAcpxAssistantText(rawEvents: string): string {
  const textChunks: string[] = [];
  for (const line of rawEvents.split(/\r?\n/)) {
    const event = parseJsonRecord(line);
    const params = readRecord(event?.["params"]);
    const update = readRecord(params?.["update"]);
    const content = readRecord(update?.["content"]);
    if (
      event?.["method"] === "session/update" &&
      update?.["sessionUpdate"] === "agent_message_chunk" &&
      content?.["type"] === "text" &&
      typeof content["text"] === "string"
    ) {
      textChunks.push(content["text"]);
    }
  }

  const finalText = textChunks.join("").trim();
  if (!finalText) {
    throw new Error("ACPX Codex run returned no assistant response.");
  }
  return finalText;
}

async function runAcpxProcess(
  request: AcpxProcessRequest,
): Promise<AcpxProcessResult> {
  return await new Promise((resolve, reject) => {
    const child = spawn("acpx", [...request.args], {
      cwd: request.cwd,
      env: request.environment,
      stdio: ["pipe", "pipe", "pipe"],
      ...(request.signal === undefined ? {} : { signal: request.signal }),
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString("utf8");
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf8");
    });
    child.on("error", reject);
    child.on("close", (exitCode) => {
      if (exitCode === 0) {
        resolve({ stdout, stderr });
        return;
      }
      reject(
        new Error(
          `ACPX exited with code ${exitCode ?? "unknown"}: ${stderr.trim()}`,
        ),
      );
    });
    child.stdin.end(request.stdin);
  });
}

function parseJsonRecord(line: string): Record<string, unknown> | undefined {
  if (!line.trim()) {
    return undefined;
  }
  try {
    const parsedValue: unknown = JSON.parse(line);
    return readRecord(parsedValue);
  } catch {
    return undefined;
  }
}

function readRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return undefined;
  }
  return Object.fromEntries(Object.entries(value));
}
