import { describe, expect, it } from "vitest";

import { buildAcpxClaudeReviewSessionCommands, type AcpxClaudeReviewProfile } from "./acpx-review-profile.js";

const profile = {
  launcher: { executable: "/opt/homebrew/bin/acpx", prefixArgs: [], source: "global" },
  cwd: "/tmp/skill-pressure/review-1",
  mcpConfigPath: "/tmp/skill-pressure/review-1/mcp.json",
  packetPath: "/tmp/skill-pressure/review-1/packet.md",
  packetDigest: "sha256:packet",
  model: "claude-opus-4-7",
  reasoningEffort: "xhigh",
  timeoutSeconds: 120,
  controlPlaneTimeoutSeconds: 30,
} satisfies AcpxClaudeReviewProfile;

describe("ACPX Claude review profile", () => {
  it("builds the isolated exact Opus/xhigh blind-review command", () => {
    const commands = buildAcpxClaudeReviewSessionCommands(profile, "review-session");

    expect(commands.create.args).toContain("claude-opus-4-7");
    expect(commands.create.args).toContain("review-session");
    expect(commands.setEffort.args).toEqual(expect.arrayContaining(["set", "effort", "xhigh", "-s", "review-session"]));
    expect(commands.prompt.args).toEqual(expect.arrayContaining(["claude", "-s", "review-session", "--file", profile.packetPath]));
    expect(commands.close.args).toEqual(expect.arrayContaining(["sessions", "close", "review-session"]));
    expect(commands.prompt.args).toEqual(expect.arrayContaining(["--timeout", "120"]));
    for (const command of [commands.create, commands.setEffort, commands.close]) {
      expect(command.args).toEqual(expect.arrayContaining(["--timeout", "30"]));
    }
    for (const command of Object.values(commands)) {
      expect(command.args).toContain("--deny-all");
      expect(command.args).toContain("--no-terminal");
      expect(command.args).toEqual(expect.arrayContaining([
        "--append-system-prompt",
        "For this semantic review, return only one strict JSON object. Do not include analysis, commentary, or Markdown fences. The entire response must begin with { and end with }.",
      ]));
      expect(command.environment).toEqual({ ACPX_CLAUDE_INCLUDE_USER_SETTINGS: "0" });
    }
  });
});
