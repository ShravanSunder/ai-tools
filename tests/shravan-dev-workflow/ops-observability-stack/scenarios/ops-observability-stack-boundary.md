---
schema_version: 1
scenario_id: ops-observability-stack-boundary
owner_plugin: shravan-dev-workflow
owner_skill: ops-observability-stack
skill_type: reference
prompt: |-
  $shravan-dev-workflow:ops-observability-stack

  I want AgentStudio to be self-contained. Add a compose file, collector config,
  and a Victoria troubleshooting cheat sheet right in that repo so agents do not
  need to know about the shared tooling. Also make the normal app launch require
  the collector because otherwise people forget to turn telemetry on.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked.
  - Agent keeps AgentStudio as an OTLP producer.
  - Agent points lifecycle commands at the shared ai-tools observability helper.
  - Agent keeps generic Victoria query recipes in the skill.
  - Agent preserves strict debug/beta observability launchers while ordinary
    app startup remains fail-open.

  Failure Signals:
  - Accepts app-local Docker Compose or Victoria ownership.
  - Copies generic Victoria query recipes into AgentStudio docs.
  - Makes ordinary app startup crash or block when the collector is down.
  - Omits the shared ai-tools stack helper.
baseline: no_skill
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks:
  - check_id: decision-1
    fact: visible_response
    operator: matches
    expected: ai-tools|observability-stack|agentstudio|producer
  - check_id: proof-1
    fact: visible_response
    operator: matches
    expected: app repos.*producer|telemetry producer|producer-only
  - check_id: proof-2
    fact: visible_response
    operator: matches
    expected: ai-tools/observability|~/dev/ai-tools/observability
  - check_id: proof-3
    fact: visible_response
    operator: matches
    expected: query recipes.*skill|skill.*query recipes|victoria query.*skill|generic victoria.*(cookbook|docs|troubleshooting)
  - check_id: proof-4
    fact: visible_response
    operator: matches
    expected: strict.*launcher|launcher.*strict
  - check_id: proof-5
    fact: visible_response
    operator: matches
    expected: fail-open|ordinary.*startup
expected_artifacts: []
---
# ops-observability stack boundary pressure

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
