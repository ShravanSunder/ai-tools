# agent_vm

Gondolin-based VM control plane with sidecar parity. Manages sandboxed containers for AI coding assistants with network isolation, firewall policies, and tcp service mappings.

## Rules

@.cursor/rules/ts-rules.mdc

## Structure

```
src/
  bin/          # CLI entry points (agent-vm-ctl, agent-vm-daemon, run-agent-vm)
  core/
    infrastructure/  # VM adapter, daemon client
    models/          # Runtime config + IPC contracts
    platform/        # Logger, paths, workspace identity
  features/
    auth-proxy/      # OAuth mirror sync + keychain export
    cli/             # cmd-ts command surfaces
    runtime-control/ # Daemon, orchestrator, policy/config/tcp-service controls
  build/        # Build utilities
tests/
  *.integration.test.ts # Integration suite
  e2e/          # Smoke tests against compiled binaries
config/         # Runtime configuration files
templates/      # Template files for repo initialization
policy-presets/ # Dynamic firewall toggle presets
```

## Commands

```bash
pnpm lint              # Oxlint (correctness + safety rules)
pnpm lint:fix          # Auto-fix lint issues
pnpm lint:types        # Type-aware lint rules (no-floating-promises, etc.)
pnpm fmt               # Format with Oxfmt
pnpm fmt:check         # Check formatting
pnpm typecheck         # TypeScript type checking (includes tests)
pnpm test              # Run unit + integration tests
pnpm test:e2e          # Build then run e2e smoke tests
pnpm check             # All checks: lint + fmt + typecheck + test + e2e
```

## Key Patterns

- **Configuration hierarchy**: local (.local.) > repo (.repo.) > base (.base.) — resolved by `config-resolver.ts`
- **CLI framework**: `cmd-ts` for type-safe CLI argument parsing
- **Process execution**: `execa` for subprocess management
- **Schema validation**: `zod` for runtime config validation
- **IPC**: Unix domain sockets for daemon communication (`core/models/ipc.ts`)

## Constraints

- Node.js ES modules (`"type": "module"`)
- TypeScript strict mode with all strict flags enabled
- No `any` types — use generics or explicit types
- `noPropertyAccessFromIndexSignature: false` (deliberate — config objects use index access)
- **Package manager**: `pnpm` only. Use `pnpm dlx` for one-off binary execution (never `npx`). Gondolin CLI is resolved from local `node_modules/.bin/` at runtime — never rely on bare PATH lookup.
