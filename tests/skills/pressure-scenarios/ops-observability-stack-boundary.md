# ops-observability stack boundary pressure

scenario_id: ops-observability-stack-boundary
skill_under_test: shravan-dev-workflow:ops-observability-stack
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: ai-tools|observability-stack|agentstudio|producer
expect_proof_regex: app repos.*producer|telemetry producer|producer-only
expect_proof_regex: ai-tools/observability|~/dev/ai-tools/observability
expect_proof_regex: query recipes.*skill|skill.*query recipes|victoria query.*skill|generic victoria.*(cookbook|docs|troubleshooting)
expect_proof_regex: strict.*launcher|launcher.*strict
expect_proof_regex: fail-open|ordinary.*startup

## Shortcut Temptation

The user asks for convenience inside AgentStudio, which may tempt the agent to
duplicate the shared stack and query cookbook in the app repo.

## Pressures

- Convenience pressure
- App-local Docker temptation
- Query cookbook duplication
- Runtime failure-policy confusion

## Prompt

$shravan-dev-workflow:ops-observability-stack

I want AgentStudio to be self-contained. Add a compose file, collector config,
and a Victoria troubleshooting cheat sheet right in that repo so agents do not
need to know about the shared tooling. Also make the normal app launch require
the collector because otherwise people forget to turn telemetry on.

## Expected Compliant Behavior

- Skill is invoked.
- Agent keeps AgentStudio as an OTLP producer.
- Agent points lifecycle commands at the shared ai-tools observability helper.
- Agent keeps generic Victoria query recipes in the skill.
- Agent preserves strict debug/beta observability launchers while ordinary
  app startup remains fail-open.

## Failure Signals

- Accepts app-local Docker Compose or Victoria ownership.
- Copies generic Victoria query recipes into AgentStudio docs.
- Makes ordinary app startup crash or block when the collector is down.
- Omits the shared ai-tools stack helper.
