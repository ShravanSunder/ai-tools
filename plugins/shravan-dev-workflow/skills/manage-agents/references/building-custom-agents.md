# Building Custom Agents

Load this only when building, modifying, or wrapping an ACP-compatible adapter.
Calling an existing custom command belongs in `agent-registry.md`.

This file owns custom-agent authoring. Keep the explicit filename
`building-custom-agents.md`; do not collapse it into an overloaded
`custom-agents.md` reference.

## Build Gate

Before building a custom agent, confirm why a built-in, raw `--agent`, or
config-defined adapter is not enough.

Completion: the parent can state the missing capability that requires adapter
work.

## Security Route

Custom agents are sensitive-resource work. They usually involve subprocesses,
network behavior, package scripts, auth material, filesystem access, or home
configuration. Route through `creating-skills` security review before editing
scripts, packages, hooks, assets, auth paths, or home/cache state.

When a user asks for an adapter sketch alongside an existing command, still name
this security route before the sketch. Do not let "only a sketch" hide the
sensitive-resource boundary.

Completion: sensitive surfaces, untrusted inputs, privileged actions, and
required proof are named before implementation.

## ACP Requirements

A custom agent must speak ACP through the transport the adapter exposes, usually
stdio. At minimum it must handle session lifecycle and prompt methods:

```text
initialize
session/new
session/prompt
session/cancel
session/resume or session/load
session/close
```

It should advertise capabilities honestly, including model controls. If it asks
ACPX for filesystem or terminal operations, those requests flow through ACPX
cwd boundaries and permission policy.

Completion: the adapter contract lists supported methods, capabilities, model
control shape, and filesystem/terminal behavior.

Troubleshooting source: https://acpx.sh/custom-agents.html

## Smoke Checklist

Before using a custom agent as a sidekick:

```text
launch command:
initialize succeeds:
sessions new succeeds:
exec prompt succeeds:
persistent prompt resumes:
cancel behavior:
status behavior:
permission request behavior:
model control, if advertised:
JSON output parse:
failure exit code:
```

Completion: the adapter has passed a scoped smoke check or is labeled
experimental with the missing checks named.
