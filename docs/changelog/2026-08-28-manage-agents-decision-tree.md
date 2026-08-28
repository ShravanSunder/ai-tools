# 2026-08-28 — manage-agents decision tree, keep-alive, and access enforcement

Plugin: `shravan-dev-workflow` 2.4.0.

- `manage-agents` "When To Call What" is now a decision tree on observable cuts: single-assignment vs persistent, then scriptable vs needs-thinking (Operator/Delegate) or executes vs guidance-only (Sidekick/Advisor). Parent validates every receipt; parent decides inline when options and evidence are already in front of it.
- Hard vocabulary cutover: `one-shot` → `single-assignment`, `ongoing`/`multi-turn` → `persistent`; taste words (strategic, high-stakes, ambiguous) removed from routing. Advisor is persistent-only Frontier guidance; a one-time opinion is a Delegate; persistent scriptable work is repeated Operators.
- New Session Keep-Alive: persistent sessions ping within the cache TTL (29-minute default ceiling), recorded on a new `last ping` ledger slot.
- New Workspace Access enforcement levels: read-only is enforced per runtime (Codex sandbox, Claude plan/dontAsk, Cursor readonly sandbox, ACPX fail-closed flags); path-scoped writes enforce only on native Claude Code — elsewhere the packet declares the scope with a stop condition. ACPX references stop overclaiming read-only.
- Callers (`spec-program-review`, `skills-creation` review lane, plugin README) cut over; scenarios rewritten (`pattern-selection-unnamed` inversion, `session-ledger-reduction` override), new `persistent-vs-single-assignment` five-leg scenario, stale `json-flows-exit-codes` retired, `custom-agent-boundary` rebuilt on the Build Gate.
- Validation: whole-skill fresh-context rubric review (findings folded); all 10 live pressure evals pass via legacy regex assertions — matrix in the references entry; unit suite 106/106; vocabulary grep gate clean.
- Refresh/reinstall: pending; live-edit caveat applies until Codex/Claude plugin caches refresh.

Spec: `docs/wip/skills-authoring/2026-08-28-manage-agents-decision-tree.md`. Evidence: `docs/changelog/references/2026-08-28-manage-agents-decision-tree.md`.
