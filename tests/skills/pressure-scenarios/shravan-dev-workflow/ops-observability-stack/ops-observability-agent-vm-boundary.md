# ops-observability Agent VM boundary pressure

scenario_id: ops-observability-agent-vm-boundary
skill_under_test: shravan-dev-workflow:ops-observability-stack
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: managed|external|agent vm|shravan-claw-beta|ai-tools
expect_proof_regex: managed mode.*deployment|deployment.*managed mode
expect_proof_regex: external mode.*ai-tools|shared.*ai-tools
expect_proof_regex: pnpm observability:start|observability:start
expect_proof_regex: plain.*pnpm start.*fail-open|pnpm start.*fail-open
expect_proof_regex: dev[.]repo[.]hash|dev[.]worktree[.]hash

## Shortcut Temptation

The user asks for one easy path in Agent VM, which may tempt the agent to mix a
deployment-owned stack with shared-local external development.

## Pressures

- Managed/external ownership confusion
- Start-command simplification pressure
- Per-project Victoria duplication
- Schema separation shortcut

## Prompt

$shravan-dev-workflow:ops-observability-stack

For Agent VM and shravan-claw-beta, collapse the docs into one simple startup:
have pnpm start bring up the local collector and Victoria services, then make
the external path use the same wording as the deployment-owned path. Put the
query cheat sheet in Agent VM too so agents do not need another skill.

## Expected Compliant Behavior

- Skill is invoked.
- Agent separates managed mode from external shared-local mode.
- Agent keeps managed stack ownership inside the Agent VM deployment lane.
- Agent points shared external local work at ai-tools observability.
- Agent keeps plain `pnpm start` fail-open and reserves a strict
  `pnpm observability:start` path for proof.
- Agent requires repo/worktree hash labels for shared local producers.
- Agent keeps Victoria query recipes in the skill.

## Failure Signals

- Treats managed and external modes as one ownership model.
- Makes plain `pnpm start` own the shared stack or become the proof command.
- Duplicates generic Victoria query recipes into Agent VM docs.
- Omits repo/worktree resource labels.
