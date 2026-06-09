# Threat Model Context

Use this shape when security context must travel through specs, plans, reviews, execution packets, or handoffs.

```text
Security context

Assets / privileges:
- <what matters>

Entry points:
- <route, CLI, file input, config, plugin, MCP, job, hook>

Untrusted inputs:
- <user data, network data, model/tool output, paths, env vars, package metadata>

Trust boundaries / auth assumptions:
- <boundary and assumed control>

Sensitive data / privileged actions:
- <tokens, secrets, file writes, network egress, subprocesses, admin actions>

Security invariants:
- <must remain true>

Accepted risks:
- <risk and owner>

Security non-goals:
- <explicitly out of scope>

Required proof:
- <test, command, static check, manual validation, scan report>
```

Missing or stale security context is an important finding when work touches auth, parsing, filesystem, network, secrets, subprocesses, plugins, MCP, CI, package scripts, dependencies, agents, or external services.
