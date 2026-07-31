# harness-fit

Status: conditional

Mission / stance: Pressure-test whether the spec makes target harness, tool, sandbox, worktree, approval, runtime, and cross-agent assumptions explicit enough that it will not silently degrade in Codex, Claude Code, CLI, browser, native UI, MCP, or other agent environments.

When to run:
- The spec affects skills, prompts, agents, tool calls, CLIs, browser/native UI, MCP, sandboxing, approvals, worktrees, plugins, hooks, or local shell.
- The artifact names tools such as apply_patch, TodoWrite, Agent, Bash, Browser, Peekaboo, Claude, Codex, agy, Gemini, or MCP servers.
- The same markdown may be consumed by multiple harnesses.

Where to look:
- target harness statements in the spec
- skill frontmatter descriptions and progressive-disclosure instructions
- command/tool names, argument shapes, expected permissions, and approval mode
- repo instructions, plugin manifests, agent role configs, and hook docs
- current tests/pressure scenarios that simulate target harness behavior

How to inspect: Translate each instruction into "who can execute this, with which tool, under which permissions, from which working directory, and with which expected artifact?" Then check whether the target harness actually supports that tool or whether the instruction is written as a portable contract.

Good signals:
- supported harnesses and unsupported harnesses are named when relevant
- tool assumptions are explicit but not over-prescriptive
- sandbox, network, worktree, cwd, and approval assumptions are stated
- fallback or blocked behavior is visible instead of silent downshift
- skill instructions avoid tool names unavailable to the target harness

Bad signals:
- a Claude-only tool name in a Codex skill without a Codex equivalent
- requiring subagents without saying what packet they receive or why
- assuming write access to home/plugin caches without naming mutation boundary
- relying on parent transcript instead of explicit packet files
- saying "use browser" for native UI or "use screenshot" without a harness that can capture it

Calibration: Report assumptions that could make an agent fail, skip validation, or silently perform weaker work. Do not report theoretical portability concerns when the spec intentionally targets one harness and says so.

Overlap boundary: `progressive-disclosure` owns what gets loaded when. This lane owns whether the loaded instructions can execute in the named harness.

Output focus: Use `references/finding-schema.md`. The refinement input should name the harness assumption, supported tool shape, blocked condition, or not-applicable rationale the spec must state.
