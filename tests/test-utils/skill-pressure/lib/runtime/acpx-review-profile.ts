import path from "node:path";

import type { AcpxLauncher, ExecutableAcpxCommand } from "./acpx-command-executor.js";
import { ACPX_CLAUDE_OPUS_XHIGH_REVIEW_PROFILE } from "./runtime-profile.js";

export const ACPX_CLAUDE_STRICT_JSON_REVIEW_INSTRUCTION =
  "For this semantic review, return only one strict JSON object. Do not include analysis, commentary, or Markdown fences. The entire response must begin with { and end with }.";

export interface AcpxClaudeReviewProfile {
  readonly launcher: AcpxLauncher;
  readonly cwd: string;
  readonly mcpConfigPath: string;
  readonly packetPath: string;
  readonly packetDigest: string;
  readonly model: typeof ACPX_CLAUDE_OPUS_XHIGH_REVIEW_PROFILE.requestedModel;
  readonly reasoningEffort: typeof ACPX_CLAUDE_OPUS_XHIGH_REVIEW_PROFILE.requestedReasoningEffort;
  readonly timeoutSeconds: number;
  readonly controlPlaneTimeoutSeconds: number;
}

export interface AcpxClaudeReviewSessionCommands {
  readonly create: ExecutableAcpxCommand;
  readonly setEffort: ExecutableAcpxCommand;
  readonly prompt: ExecutableAcpxCommand;
  readonly close: ExecutableAcpxCommand;
}

export function buildAcpxClaudeReviewSessionCommands(
  profile: AcpxClaudeReviewProfile,
  sessionName: string,
): AcpxClaudeReviewSessionCommands {
  validateProfile(profile, sessionName);
  const boundaryArgs = (timeoutSeconds: number): readonly string[] => [
    ...profile.launcher.prefixArgs,
    "--cwd",
    profile.cwd,
    "--mcp-config",
    profile.mcpConfigPath,
    "--deny-all",
    "--non-interactive-permissions",
    "fail",
    "--no-terminal",
    "--append-system-prompt",
    ACPX_CLAUDE_STRICT_JSON_REVIEW_INSTRUCTION,
    "--allowed-tools",
    "",
    "--max-turns",
    "1",
    "--timeout",
    String(timeoutSeconds),
  ];
  const environment = { ACPX_CLAUDE_INCLUDE_USER_SETTINGS: "1" } as const;
  const command = (args: readonly string[]): ExecutableAcpxCommand => ({
    executable: profile.launcher.executable,
    cwd: profile.cwd,
    args,
    environment,
  });
  return {
    create: command([
      ...boundaryArgs(profile.controlPlaneTimeoutSeconds),
      "--model",
      profile.model,
      "claude",
      "sessions",
      "new",
      "--name",
      sessionName,
    ]),
    setEffort: command([
      ...boundaryArgs(profile.controlPlaneTimeoutSeconds),
      "claude",
      "set",
      "effort",
      profile.reasoningEffort,
      "-s",
      sessionName,
    ]),
    prompt: command([
      ...boundaryArgs(profile.timeoutSeconds),
      "--format",
      "json",
      "--json-strict",
      "claude",
      "-s",
      sessionName,
      "--file",
      profile.packetPath,
    ]),
    close: command([
      ...boundaryArgs(profile.controlPlaneTimeoutSeconds),
      "claude",
      "sessions",
      "close",
      sessionName,
    ]),
  };
}

function validateProfile(profile: AcpxClaudeReviewProfile, sessionName: string): void {
  for (const [field, value] of [
    ["launcher.executable", profile.launcher.executable],
    ["cwd", profile.cwd],
    ["mcpConfigPath", profile.mcpConfigPath],
    ["packetPath", profile.packetPath],
  ] as const) {
    if (!path.isAbsolute(value)) throw new Error(`${field} must be an absolute path`);
  }
  const relativePacketPath = path.relative(profile.cwd, profile.packetPath);
  if (
    relativePacketPath === "" ||
    relativePacketPath === ".." ||
    relativePacketPath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePacketPath)
  ) throw new Error("packetPath must be a file inside cwd");
  if (profile.packetDigest.trim() === "") throw new Error("packetDigest must be non-empty");
  if (!/^[a-z0-9][a-z0-9-]{0,79}$/u.test(sessionName)) throw new Error("sessionName is invalid");
  if (
    !Number.isInteger(profile.timeoutSeconds) || profile.timeoutSeconds <= 0 ||
    !Number.isInteger(profile.controlPlaneTimeoutSeconds) || profile.controlPlaneTimeoutSeconds <= 0
  ) {
    throw new Error("review timeout values must be positive integers");
  }
}
