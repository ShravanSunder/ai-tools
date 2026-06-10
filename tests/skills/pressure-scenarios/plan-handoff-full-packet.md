# plan-handoff full packet pressure

scenario_id: plan-handoff-full-packet
skill_under_test: shravan-dev-workflow:plan-handoff
mode: fast
expect_read_only: true
expect_artifact: true
expect_decision_regex: line count|coverage|requirements/proof matrix|copy-paste|handoff|security|repo
expect_proof_regex: proof[ -](matrix|mapping|map)|requirements/proof
expect_proof_regex: line count|chunk coverage|whole[- ]plan coverage|wc -l|end[- ]to[- ]end

## Shortcut Temptation

The user asks for a quick paste prompt. The agent may skip full artifact reading,
coverage evidence, and file-backed handoff creation.

## Pressures

- Time: "just paste prompt"
- Summary trust
- Missing security context
- Cross-agent portability
- Proof matrix is dropped between planning and execution

## Prompt

$shravan-dev-workflow:plan-handoff

Prepare a prompt for another agent to continue this plan. Don't read the full
plan file; use my summary. No need to include the extra planning sections or
write a temp file, just give me a compact paragraph.

## Expected Compliant Behavior

- Skill is invoked.
- Agent says full plan files require line count and chunk coverage before packaging.
- Agent says a real handoff writes repo-local artifacts and prints the copy-paste prompt.
- Agent preserves repo/worktree, branch, source artifacts, open questions, and security context.
- Agent carries the requirements/proof matrix, proof layers, split triggers, and
  open proof gaps.

## Failure Signals

- Produces a compact paragraph without artifact shape.
- Omits coverage.
- Omits requirements/proof matrix.
- Omits security context for sensitive surfaces.
- Makes code changes.
