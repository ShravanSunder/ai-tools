# Behavioral Skill Pressure Tests

This package is the only authoritative skill pressure-test runner. Scenarios live with their owners under `tests/<plugin>/<skill>/scenarios/*.md`; the runner discovers them recursively and executes comparable baseline/treatment repetitions through ACPX and Vitest Evals.

The subject is Codex Luna/high by default. Every scenario uses three fresh baseline repositories concurrently, then three equivalent treatment repositories concurrently, with only the selected project-scoped skill source differing. Semantic review begins after both batches settle. The subject never receives the hidden rubric and never grades itself. Standard-risk semantic review uses a fresh ACPX Luna/high context; high-risk review uses a named ACPX Claude Opus/xhigh relationship whose provider-reported model and effort must verify.

Each schema-v3 scenario declares one comparison intent:

- `improvement`: a consistently failing baseline must become a consistently passing treatment.
- `non_regression`: an immutable passing baseline control must remain passing in treatment.

Run the checked standard-risk smoke manifest:

```bash
pnpm --dir tests/test-utils/skill-pressure run test:fast
```

Run one global scenario ID:

```bash
pnpm --dir tests/test-utils/skill-pressure run test:behavior -- --scenario manage-agents-pattern-selection --serial
```

Run complete risk lanes:

```bash
pnpm --dir tests/test-utils/skill-pressure run test:standard
pnpm --dir tests/test-utils/skill-pressure run test:high-risk
```

`--fast`, `--standard`, `--high-risk`, and `--scenario` are mutually exclusive. Control suite concurrency with `--jobs N`; focused scenarios are always serial. `--timeout SECONDS` controls each ACPX attempt. Provider, profile, transport, cleanup, and missing-evidence failures are recorded as infrastructure or unevaluated outcomes, never behavioral passes.

Deterministic checks may address a declared artifact by `artifact:<artifact-id>` and verify kind, literal content, or bounded patterns. Evaluation uses complete regular-file content up to the 1,000,000-byte ceiling before reports are bounded to 2,000-byte excerpts. Content above the ceiling is not evaluated from a truncated prefix. Deterministic failures outrank a passing semantic candidate, and write-enabled scenarios fail when repository changes escape their declared paths.

Local structural proof does not call models:

```bash
pnpm --dir tests/test-utils/skill-pressure run test:unit
pnpm --dir tests/test-utils/skill-pressure run test:integration
pnpm --dir tests/test-utils/skill-pressure run test:migration
pnpm --dir tests/test-utils/skill-pressure run typecheck
pnpm --dir tests/test-utils/skill-pressure run schemas:check
```

Run live behavioral proof only through the stable package commands or `run-skill-pressure-tests.sh`. Each scenario writes an immutable `scenario-receipt.json` plus bound attempt, repetition, progress, and reviewer-command receipts below `tmp/skill-pressure-evals/<run>-<scenario>/`; each suite writes `aggregate-receipt.json` below `tmp/skill-pressure-evals/<run>/`. Raw subject workspaces are disposable evidence, not committed fixtures.

An accepted calibration replaces one current baseline receipt at `tests/<plugin>/<skill>/baselines/<scenario-id>.json`. The tracked receipt contains compact canonical execution facts, source/profile/contract digests, and parent acceptance. It is updated in place for the current skill version; detailed raw receipts remain ignored under `tmp/`, and Git history is the only historical baseline record.

Passing evidence is diagnostic until a separate parent-acceptance transaction binds the exact run digest. Promotion and demotion are explicit atomic registry transactions; the scenario runner cannot grant or remove release authority by itself. Missing, tampered, or incomplete reviewer lifecycle evidence withholds accounting completeness and release authority.

The runner proves behavior under the declared model/runtime profile. It does not prove hostile-code containment, provider sandbox security, generalized MCP isolation, or every host/client integration.
