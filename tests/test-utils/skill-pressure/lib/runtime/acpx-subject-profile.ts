import path from "node:path";

import type { AcpxLauncher, ExecutableAcpxCommand } from "./acpx-command-executor.js";
import { ACPX_LUNA_HIGH_SUBJECT_PROFILE } from "./runtime-profile.js";

export type AcpxPermissionMode = "approve-all" | "approve-reads" | "deny-all";

export { ACPX_LUNA_HIGH_SUBJECT_PROFILE };

export interface AcpxCodexSubjectProfile {
  readonly launcher: AcpxLauncher;
  readonly codexExecutable: string;
  readonly cwd: string;
  readonly mcpConfigPath: string;
  readonly promptPath: string;
  readonly model: string;
  readonly reasoningEffort: string;
  readonly permissionMode: AcpxPermissionMode;
  readonly allowedTools: readonly string[];
  readonly disabledSkillPaths: readonly string[];
  readonly timeoutSeconds: number;
}

export function buildAcpxCodexSubjectCommand(
  profile: AcpxCodexSubjectProfile,
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
      `--${profile.permissionMode}`,
      "--non-interactive-permissions",
      "fail",
      ...(profile.allowedTools.length === 0
        ? []
        : ["--allowed-tools", profile.allowedTools.join(",")]),
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
      profile.promptPath,
    ],
    environment: {
      CODEX_CONFIG: serializeDisabledSkillConfig(profile.disabledSkillPaths),
      CODEX_PATH: profile.codexExecutable,
    },
  };
}

export function serializeDisabledSkillConfig(
  disabledSkillPaths: readonly string[],
): string {
  return JSON.stringify({
    skills: {
      config: disabledSkillPaths.map((skillPath) => ({
        path: skillPath,
        enabled: false,
      })),
    },
  });
}

function validateProfile(profile: AcpxCodexSubjectProfile): void {
  for (const [field, value] of [
    ["launcher.executable", profile.launcher.executable],
    ["codexExecutable", profile.codexExecutable],
    ["cwd", profile.cwd],
    ["mcpConfigPath", profile.mcpConfigPath],
    ["promptPath", profile.promptPath],
  ] as const) {
    if (!path.isAbsolute(value)) {
      throw new Error(`${field} must be an absolute path`);
    }
  }
  const relativePromptPath = path.relative(profile.cwd, profile.promptPath);
  if (
    relativePromptPath === "" ||
    relativePromptPath === ".." ||
    relativePromptPath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePromptPath)
  ) {
    throw new Error("promptPath must be a file inside cwd");
  }
  if (!Number.isInteger(profile.timeoutSeconds) || profile.timeoutSeconds <= 0) {
    throw new Error("timeoutSeconds must be a positive integer");
  }
  for (const skillPath of profile.disabledSkillPaths) {
    if (!path.isAbsolute(skillPath) || path.basename(skillPath) !== "SKILL.md") {
      throw new Error("disabledSkillPaths must contain absolute SKILL.md paths");
    }
  }
  if (profile.allowedTools.some((toolName) => toolName.trim() === "" || toolName.includes(","))) {
    throw new Error("allowedTools must contain non-empty names without commas");
  }
}
