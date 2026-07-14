import { describe, expect, it } from "vitest";

import { buildAcpxCodexReviewCommand, type AcpxCodexReviewProfile } from "./acpx-codex-review-profile.js";

const profile = {
  launcher: { executable: "/opt/homebrew/bin/acpx", prefixArgs: [], source: "global" },
  codexExecutable: "/opt/homebrew/bin/codex",
  cwd: "/tmp/skill-pressure/review-1",
  mcpConfigPath: "/tmp/skill-pressure/review-1/mcp.json",
  packetPath: "/tmp/skill-pressure/review-1/packet.json",
  packetDigest: "sha256:packet",
  model: "gpt-5.6-luna",
  reasoningEffort: "xhigh",
  timeoutSeconds: 120,
} satisfies AcpxCodexReviewProfile;

describe("ACPX Codex review profile", () => {
  it("builds the one-shot Luna/xhigh blind-review command", () => {
    const command = buildAcpxCodexReviewCommand(profile);

    expect(command.args).toContain("gpt-5.6-luna[xhigh]");
    expect(command.args).toContain("--deny-all");
    expect(command.args).toContain("--no-terminal");
    expect(command.args.slice(-3)).toEqual(["exec", "--file", profile.packetPath]);
    expect(command.environment).toEqual({ CODEX_PATH: profile.codexExecutable });
  });
});
