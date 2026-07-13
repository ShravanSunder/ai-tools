import { describe, expect, it } from "vitest";

import {
  buildAcpxCodexSubjectCommand,
  serializeDisabledSkillConfig,
  type AcpxCodexSubjectProfile,
} from "./acpx-subject-profile.js";

const profile = {
  launcher: { executable: "/opt/homebrew/bin/acpx", prefixArgs: [], source: "global" },
  codexExecutable: "/opt/homebrew/bin/codex",
  cwd: "/tmp/skill-pressure/run-1",
  mcpConfigPath: "/tmp/skill-pressure/run-1/mcp.json",
  promptPath: "/tmp/skill-pressure/run-1/prompt.md",
  model: "gpt-5.6-luna",
  reasoningEffort: "xhigh",
  permissionMode: "approve-reads",
  disabledSkillPaths: ["/tmp/ambient/SKILL.md"],
  timeoutSeconds: 120,
} satisfies AcpxCodexSubjectProfile;

describe("ACPX Codex subject profile", () => {
  it("builds the one-shot Luna/xhigh command in the disposable repository", () => {
    const command = buildAcpxCodexSubjectCommand(profile);

    expect(command.cwd).toBe(profile.cwd);
    expect(command.args).toContain("gpt-5.6-luna[xhigh]");
    expect(command.args.slice(-3)).toEqual(["exec", "--file", profile.promptPath]);
    expect(command.environment.CODEX_CONFIG).toBe(
      serializeDisabledSkillConfig(profile.disabledSkillPaths),
    );
  });

  it("rejects a prompt outside the disposable repository", () => {
    expect(() =>
      buildAcpxCodexSubjectCommand({ ...profile, promptPath: "/tmp/prompt.md" }),
    ).toThrow(/inside cwd/);
  });
});
