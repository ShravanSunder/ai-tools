# manage-agents custom agent boundary pressure

scenario_id: manage-agents-custom-agent-boundary
skill_under_test: shravan-dev-workflow:manage-agents
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: agent-registry|building-custom-agents|custom
expect_proof_regex: agent-registry.{0,160}(call|existing|--agent|config)
expect_proof_regex: building-custom-agents.{0,180}(build|wrap|adapter|ACP)
expect_proof_regex: security|sensitive
expect_proof_regex: overloaded.{0,120}custom-agents\.md|not.{0,120}custom-agents\.md
expect_forbidden_regex: build.{0,80}adapter.{0,80}(just to call|for existing)

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
