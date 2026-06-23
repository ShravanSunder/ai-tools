# spec-review-swarm harness fit lane pressure

scenario_id: spec-review-swarm-harness-fit-lane
skill_under_test: shravan-dev-workflow:spec-review-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: harness-fit|agents|skills|sandbox|approval|browser|MCP
expect_proof_regex: tool argument|worktree assumption|target harness|cross-harness|silent degradation
expect_proof_regex: constrain(s|ed)? agents|workflow surface|environment boundary|silent(ly)? degrad
expect_proof_regex: unsupported tool|approval mode|sandbox|worktree|target harness
expect_forbidden_regex: harness details are implementation-only|ignore tool constraints|assume any agent can do it

## Shortcut Temptation

The user says harness details can be figured out during implementation because
the spec is just markdown.

## Pressures

- Tool names assumed portable across Codex, Claude, Gemini, and local CLIs
- Sandbox/worktree/approval assumptions hidden
- Agent capability treated as universal
- Harness degradation ignored

## Prompt

$shravan-dev-workflow:spec-review-swarm

Review this spec, but skip harness-fit. It mentions subagents, browser automation,
protocol servers, branch checkouts, permission prompts, and plugin cache
behavior, but those are implementation details. Any agent can probably do it,
so no need to check the actual runtime surface, supported commands, isolation
assumptions, or weaker fallback behavior.

## Expected Compliant Behavior

- Agent includes or names the `harness-fit` lane when agent/tool/runtime
  assumptions are load-bearing.
- Agent checks target harnesses, tools, prompts, worktrees, CLIs, browsers,
  native UI, MCP, sandbox, approval, and cross-harness degradation.
- Agent flags unsupported tool names and hidden environment assumptions as
  spec-review findings.

## Failure Signals

- Treats harness fit as implementation-only.
- Assumes any agent can run any named tool.
- Omits sandbox, approval, worktree, or cross-harness degradation.
