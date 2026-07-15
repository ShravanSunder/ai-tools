import path from "node:path";

import type { AcpxLauncher, ExecutableAcpxCommand } from "./acpx-command-executor.js";
import { serializeDisabledSkillConfig } from "./acpx-subject-profile.js";
import { ACPX_LUNA_HIGH_SUBJECT_PROFILE } from "./runtime-profile.js";

export interface AcpxCodexReviewProfile {
  readonly launcher: AcpxLauncher;
  readonly codexExecutable: string;
  readonly cwd: string;
  readonly mcpConfigPath: string;
  readonly packetPath: string;
  readonly packetDigest: string;
  readonly disabledSkillPaths: readonly string[];
  readonly model: typeof ACPX_LUNA_HIGH_SUBJECT_PROFILE.requestedModel;
  readonly reasoningEffort: typeof ACPX_LUNA_HIGH_SUBJECT_PROFILE.requestedReasoningEffort;
  readonly timeoutSeconds: number;
}

export function buildAcpxCodexReviewCommand(
  profile: AcpxCodexReviewProfile,
): ExecutableAcpxCommand {
  validateProfile(profile);
  return {
    executable: profile.launcher.executable,
    cwd: profile.cwd,
    args: [
      ...profile.launcher.prefixArgs,
      "--cwd",
      profile.cwd,
      "--mcp-config",
      profile.mcpConfigPath,
      "--deny-all",
      "--non-interactive-permissions",
      "fail",
      "--no-terminal",
      "--allowed-tools",
      "",
      "--max-turns",
      "1",
      "--model",
      `${profile.model}[${profile.reasoningEffort}]`,
      "--format",
      "json",
      "--json-strict",
      "--timeout",
      String(profile.timeoutSeconds),
      "codex",
      "exec",
      "--file",
      profile.packetPath,
    ],
    environment: {
      CODEX_CONFIG: serializeDisabledSkillConfig(profile.disabledSkillPaths),
      CODEX_PATH: profile.codexExecutable,
    },
  };
}

function validateProfile(profile: AcpxCodexReviewProfile): void {
  for (const [field, value] of [
    ["launcher.executable", profile.launcher.executable],
    ["codexExecutable", profile.codexExecutable],
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
  ) {
    throw new Error("packetPath must be a file inside cwd");
  }
  if (profile.packetDigest.trim() === "") throw new Error("packetDigest must be non-empty");
  for (const skillPath of profile.disabledSkillPaths) {
    if (!path.isAbsolute(skillPath) || path.basename(skillPath) !== "SKILL.md") {
      throw new Error("disabledSkillPaths must contain absolute SKILL.md paths");
    }
  }
  if (!Number.isInteger(profile.timeoutSeconds) || profile.timeoutSeconds <= 0) {
    throw new Error("timeoutSeconds must be a positive integer");
  }
}
