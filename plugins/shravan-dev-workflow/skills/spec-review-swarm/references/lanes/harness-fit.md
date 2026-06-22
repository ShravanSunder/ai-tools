# harness-fit

Status: conditional

Mission / stance:
Pressure-test whether the spec makes target harness, tool, sandbox, worktree,
approval, and runtime assumptions explicit.

Trigger examples:
- The spec affects agents, skills, prompts, tools, CLIs, browser/native UI,
  MCP, sandboxing, approvals, worktrees, or cross-harness behavior.

Why this lane matters:
The same markdown can parse across harnesses while executing differently or
silently degrading.

Default scope:
Codex, Claude Code, Copilot, OpenClaw, local shell, browser, native UI, MCP,
tool names/args, sandbox, network, approvals, worktree, and platform assumptions.

Contract inheritance:
The parent loads the shared lane contract named by `SKILL.md` before this lane file.
This file adds lane-specific constraints only.

Parent packet requirements:
- target harnesses
- named tools and prompts
- environment assumptions
- incompatible surfaces

Core responsibilities:
- Check supported and unsupported harnesses are named when relevant.
- Flag tool names or argument shapes unavailable in target harnesses.
- Flag hidden sandbox/worktree/approval/network assumptions.
- Name cross-harness degradation risks.

Analysis method:
Map instructions to actual harness capabilities and failure modes.

Calibration bar:
Report only assumptions that could make an agent fail or silently do weaker
work.

Output format:
Use the canonical per-finding schema from `references/finding-schema.md`. Return lane-specific context only after the schema fields.

Advisory boundary:
This lane does not implement harness adapters.

Parent handoff notes:
Accepted harness findings become spec constraints or not-applicable rationale.
