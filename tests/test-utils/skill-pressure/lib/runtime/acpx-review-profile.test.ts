import { describe, expect, it } from "vitest";

import { buildAcpxClaudeReviewCommand, type AcpxClaudeReviewProfile } from "./acpx-review-profile.js";

const profile = {
  launcher: { executable: "/opt/homebrew/bin/acpx", prefixArgs: [], source: "global" },
  cwd: "/tmp/skill-pressure/review-1",
  mcpConfigPath: "/tmp/skill-pressure/review-1/mcp.json",
  packetPath: "/tmp/skill-pressure/review-1/packet.md",
  packetDigest: "sha256:packet",
  model: "opus",
  reasoningEffort: "high",
  timeoutSeconds: 120,
} satisfies AcpxClaudeReviewProfile;

describe("ACPX Claude review profile", () => {
  it("builds the isolated Opus/high blind-review command", () => {
    const command = buildAcpxClaudeReviewCommand(profile);

    expect(command.args).toContain("opus[high]");
    expect(command.args).toContain("--deny-all");
    expect(command.args).toContain("--no-terminal");
    expect(command.environment).toEqual({ ACPX_CLAUDE_INCLUDE_USER_SETTINGS: "1" });
  });
});
