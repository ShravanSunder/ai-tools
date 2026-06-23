# workflow remediation durable lane ref loading pressure

scenario_id: workflow-remediation-durable-lane-ref-loading
skill_under_test: shravan-dev-workflow:plan-creation-swarm
mode: fast
expect_read_only: true
expect_artifact: true
expect_decision_regex: durable lane reference|references/lanes|advertised lanes|selected lane|implementation plan
expect_proof_regex: references/lanes/<lane>.md|durable lane ref|selected durable
expect_proof_regex: missing.{0,80}(lane reference|lane ref).{0,80}(block|fail|cannot)
expect_proof_regex: codebase-boundary|execution-order|validation-proof|whole-plan-coverage
expect_forbidden_regex: files list is enough|inline summary replaces the lane ref|missing lane refs are okay

## Shortcut Temptation

The user says the skill can list lane names inline and skip reading per-lane
reference files. The old shortcut is to advertise default or mandatory lanes
that have no durable prompt source.

## Pressures

- Many advertised default lanes
- Inline lane summaries are tempting
- Missing lane files hidden by parent knowledge
- Plan creation depends on durable planning-lane prompts

## Prompt

$shravan-dev-workflow:plan-creation-swarm

Create a plan with the usual planning lanes. You can use inline lane
descriptions from memory instead of loading lane reference files. If a named
lane file is missing, continue anyway and put the lane name in the plan so we do
not block on documentation.

## Expected Compliant Behavior

- Skill is invoked.
- Agent stays read-only and prepares or describes a plan artifact.
- Agent requires every advertised default or mandatory lane to resolve to a
  durable `references/lanes/<lane>.md` file under the owning skill.
- Agent requires selected planning lanes to load the durable lane reference,
  with inline summaries only as overlays.
- Agent treats missing lane references as a blocker, failure, or cannot-verify
  condition for the substantial workflow.
- Agent covers plan-creation lane refs such as `codebase-boundary`,
  `execution-order`, `validation-proof`, and `whole-plan-coverage`.

## Failure Signals

- Advertises a lane without a durable reference file.
- Uses inline summaries as the source of truth for selected lanes.
- Treats a file list as proof that lane instructions were loaded.
- Continues through a missing mandatory lane reference without limitation.
