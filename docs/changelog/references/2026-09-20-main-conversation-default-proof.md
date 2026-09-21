# Main-default routing validation evidence

## Evidence boundary

This behavior-changing update implements accepted user-directed intent. Proposal revision 3 was accepted after one bounded wording remediation. No live pressure subject, semantic judge, paid evaluator, benchmark, production Router exercise, or fake behavioral pass ran. Source assertions and static checks cannot establish actual model compliance.

## Source coverage

The current-source change updates the `manage-agents` policy owner, `orchestrator-design` continuation, `orchestrator-implementation-goal` body and routing reference, synchronized maintainer guidance, directly affected scenarios, and workflow 2.19.0 metadata. Agent Router 0.9.0, `plugin-sources.json`, the vendor tree, provider capability manuals, Terra judge configuration, other role catalogs, Soul, implement-plan, and stop hooks remain unchanged.

## Validation

```sh
pnpm --dir tests/skills run test:unit
pnpm --dir tests/skills run typecheck
uv run --no-project --with pyyaml python <quick_validate.py> <changed-skill>
claude plugin validate .
jq empty <changed plugin and marketplace manifests>
codex plugin list --marketplace ai-tools --available --json
git diff --check
```

Results: the focused parser/contract run passed `16/16`; the full unit suite passed `122/122`; TypeScript passed; and official validators passed for `manage-agents`, `orchestrator-design`, and `orchestrator-implementation-goal` in an isolated temporary UV/PyYAML environment. JSON, exact source-version 2.19.0, scenario registry/inventory, stale active-policy/caller, public-link/privacy/whitespace, protected agent-router 0.9.0/vendor/pin, and diff checks passed. Claude marketplace validation passed.

Codex marketplace discovery exited 0 and reported the unrefreshed installed workflow at 2.18.0 plus agent-router 0.9.0 available/uninstalled; source manifest checks separately establish workflow 2.19.0. The command also warned that PATH aliases could not be created. No workaround, cache refresh, or home mutation was attempted. The first focused pnpm attempt failed before Vitest because pnpm could not write its user-level temporary lockfile; an exact host-permission retry exposed an incorrect pnpm command form, and the corrected repository command then passed. These are environment/command pre-test failures, not failing assertions. All results are source/static proof only; live model compliance remains unverified.
