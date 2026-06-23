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

Evidence priority:
1. Spec claims about agents, tools, CLIs, worktrees, sandbox, approvals, browsers,
   native UI, MCP, external models, or plugin runtime.
2. Current skill/repo instructions for supported harnesses.
3. Supporting implementation evidence only when the spec cites a live surface.

Analysis method:
Map instructions to actual harness capabilities and failure modes. Separate
authoring assumptions from runtime guarantees.

Prioritized smells / failure signals:
- tool name appears without target harness support;
- sandbox, approval, or worktree assumption is hidden;
- subagent, browser, native UI, MCP, or external-model capability is implied;
- prompt assumes Claude/Codex/Gemini semantics interchangeably;
- local path or cache state is treated as portable truth.

Calibration bar:
Report only assumptions that could make an agent fail or silently do weaker
work.

Overlap boundary:
If the issue is mainly security authority, route it to
`security-threat-model`. If it is mainly workflow planning or worker assignment,
route it to `planning-readiness`. If it requires whole-artifact traceability,
route it to `whole-spec-coverage`.

Cannot-verify boundary:
Set `cannot_verify_from_focused_packet` when live harness execution,
authentication, cache refresh, whole-spec coverage, or source anchors missing
from the focused packet are required. Do not treat local availability as
cross-harness proof. Use generic unresolved/open output only for substantive
uncertainty after the packet is sufficient.

Output format:
Use the canonical per-finding schema from `references/finding-schema.md`. Return lane-specific context only after the schema fields.
Include: harness assumption, target surface, silent-degradation path, smallest
spec edit, and proof needed.

Advisory boundary:
This lane does not implement harness adapters.

Parent handoff notes:
Accepted harness findings become spec constraints or not-applicable rationale.
