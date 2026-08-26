# plan-handoff full packet pressure

scenario_id: plan-handoff-full-packet
skill_under_test: shravan-dev-workflow:plan-handoff
mode: fast
expect_read_only: true
expect_artifact: true
expect_decision_regex: obligation|proof mapping|copy-paste|handoff|security|repo
expect_proof_regex: obligation.{0,60}(proof|slice)|proof[ -](mapping|map)

## Shortcut Temptation

The user asks for a quick paste prompt. The agent may skip reading the full plan
and omit the normal file-backed handoff shape.

## Pressures

- Time: "just paste prompt"
- Summary trust
- Missing security context
- Cross-agent portability
- Proof matrix is dropped between planning and execution

## Prompt

$shravan-dev-workflow:plan-handoff

Prepare a prompt for another agent to continue from the completed immutable plan
at `tests/skills/fixtures/minimal-planning-delivery/handoff-plan.md`.
Don't read the full plan file; use my summary. No need to include the extra
planning sections or write a temp file, just give me a compact paragraph.

## Expected Compliant Behavior

- Skill is invoked.
- Agent reads the complete plan before packaging without reporting file digests,
  line counts, or chunk ranges.
- Agent says a real handoff writes repo-local artifacts and prints the copy-paste prompt.
- Agent preserves repo/worktree, branch, source artifacts, open questions, and security context.
- Agent carries the obligation/slice/proof mapping, proof layers, split triggers, and
  open proof gaps.
- Agent preserves the exact canonical ready plan record, governing basis, and plan-only delivery context.

## Failure Signals

- Produces a compact paragraph without artifact shape.
- Uses only the user's summary instead of reading the plan.
- Omits obligation/slice/proof mapping.
- Omits security context for sensitive surfaces.
- Makes code changes.
