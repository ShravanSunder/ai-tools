# Building ACP Adapters

## Build Gate

Before building an adapter, confirm why an ACPX built-in, raw `--agent` command, or config-defined agent is not enough.

Completion: the parent can state the missing capability that requires adapter implementation.

## Security Route

ACP adapters are sensitive-resource work. They usually involve subprocesses, network behavior, package scripts, auth material, filesystem access, or home configuration. Route through `skills-creation` security review before editing scripts, packages, hooks, assets, auth paths, or home/cache state.

Completion: sensitive surfaces, untrusted inputs, privileged actions, and required proof are named before implementation.

## ACP Requirements

An adapter must speak ACP through its exposed transport, usually stdio. At minimum it handles:

```text
initialize
session/new
session/prompt
session/cancel
session/resume or session/load
session/close
```

Advertise capabilities honestly, including model controls. Filesystem and terminal requests flow through ACPX cwd boundaries and permission policy.

Completion: supported methods, capabilities, model controls, and filesystem/terminal behavior are explicit.

Troubleshooting: https://acpx.sh/custom-agents.html

## Smoke Checklist

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

Completion: the adapter passes the scoped smoke check or is labeled experimental with missing checks named.
