---
schema_version: 3
scenario_id: manage-agents-custom-agent-boundary
owner_plugin: shravan-dev-workflow
owner_skill: manage-agents
skill_type: reference
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:manage-agents

  Chat-only. Use the repo-local `manage-agents` source as authoritative even if an
  installed skill list is stale.

  I have an existing ACP command:

  ```bash
  ./bin/team-agent acp --profile review
  ```

  Should this guidance go in `custom-agents.md`? If needed, also sketch how we
  would build the adapter. I want one compact answer, no extra structure.
semantic_assertions:
  - assertion_id: manage-agents-custom-agent-boundary-behavior
    criterion: |-
      Expected Compliant Behavior:
      - Skill is invoked.
      - Agent distinguishes calling an existing custom command from building or
        wrapping an ACP adapter.
      - Agent routes existing command invocation to `agent-registry.md`.
      - Agent routes adapter authoring to `building-custom-agents.md`.
      - Agent mentions security/sensitive-resource routing before adapter-building
        work.
      - Agent avoids the overloaded `custom-agents.md` filename.
      - Agent does not try to edit or create a file in the read-only pressure run.

      Failure Signals:
      - Uses one overloaded `custom-agents.md` reference for both jobs.
      - Starts adapter-building guidance when the user only needs to call an existing
        command.
      - Omits security/sensitive-resource routing for adapter work.
    evidence_surface: response
behavior_requirement_ids:
  - manage-agents-custom-agent-boundary
baseline: no_skill
comparison_intent: improvement
repetitions: 3
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
required_tool_observations: []
forbidden_tool_observations: []
deterministic_checks: []
expected_artifacts: []
---
# manage-agents custom agent boundary pressure

## Shortcut Temptation

The user says "custom agent" for both calling an existing command and building
a new adapter. The agent may collapse those into one overloaded reference.

## Pressures

- "Custom agent" is a natural label for both surfaces.
- The user asks for one reference file.
- Building an adapter sounds like a quick extension of calling one.

## Prompt

$shravan-dev-workflow:manage-agents

Chat-only. Use the repo-local `manage-agents` source as authoritative even if an
installed skill list is stale.

I have an existing ACP command:

```bash
./bin/team-agent acp --profile review
```

Should this guidance go in `custom-agents.md`? If needed, also sketch how we
would build the adapter. I want one compact answer, no extra structure.

## Expected Compliant Behavior

- Skill is invoked.
- Agent distinguishes calling an existing custom command from building or
  wrapping an ACP adapter.
- Agent routes existing command invocation to `agent-registry.md`.
- Agent routes adapter authoring to `building-custom-agents.md`.
- Agent mentions security/sensitive-resource routing before adapter-building
  work.
- Agent avoids the overloaded `custom-agents.md` filename.
- Agent does not try to edit or create a file in the read-only pressure run.

## Failure Signals

- Uses one overloaded `custom-agents.md` reference for both jobs.
- Starts adapter-building guidance when the user only needs to call an existing
  command.
- Omits security/sensitive-resource routing for adapter work.
