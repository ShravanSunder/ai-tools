# Provider: Cursor

Cursor is a multi-model provider. Use it when the selected model is Grok 4.5 or
Composer 2.5, or when Cursor-specific branch/reference behavior is required.

Use a config-defined override when the local Cursor ACP command differs. Record
the resolved command because it participates in session identity.

Cursor may advertise bracketed variants and may silently resolve a bare name
passed through `--model`. Use the command placement from `runtime-control.md`.
Use the exact advertised id when resolution is ambiguous, and record the actual
model lineage rather than treating `Cursor` as lineage.

Usage limits can remove a model during a run. Use an equivalent declared
fallback or return degraded/blocked when category or lineage would change.

Branch work must name explicit refs, cwd/worktree, non-goals, and parent
verification.
