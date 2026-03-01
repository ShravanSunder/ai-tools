# agent_vm

Gondolin-based VM control plane with sidecar parity. Manages sandboxed containers for AI coding assistants with network isolation, firewall policies, and service tunnels.

## Rules

@.cursor/rules/ts-rules.mdc

## Structure

```
src/
  bin/          # CLI entry points (agent-vm-ctl, agent-vm-daemon, run-agent-vm)
  cli/          # CLI command implementations
  core/         # Core business logic (config, policy, tunnels, orchestration)
  types/        # Shared type definitions
  build/        # Build utilities
tests/
  unit/         # Fast, isolated unit tests
  integration/  # Daemon lifecycle, auth sync, tunnel tests
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
- **IPC**: Unix domain sockets for daemon communication (`types/ipc.ts`)

## Constraints

- Node.js ES modules (`"type": "module"`)
- TypeScript strict mode with all strict flags enabled
- No `any` types — use generics or explicit types
- `noPropertyAccessFromIndexSignature: false` (deliberate — config objects use index access)
