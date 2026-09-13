# Codex Router 0.4.0: agent collaboration

- Replace the retired agent-communication skill with agent-collaboration and its five references.
- Pin the canonical Router skill and vendor it through scripts/sync-skills.py.
- Include shared boards, filtered session discovery, and automated or human permission guidance.
- Align Codex and Claude Router metadata at 0.4.0; correct the workflow marketplace entry to its released 2.12.1.
- Writing reviewed; pressure testing explicitly skipped for this publication.
- Passed: `uv run scripts/sync-skills.py --skill agent-collaboration --source-repo "$ROUTER_CHECKOUT" --check` (six files), Codex `quick_validate.py` and `validate_plugin.py`.
- Passed: `python3 -m unittest discover -s tests/plugin-vendoring` (9 tests); `claude plugin validate .` passed after aligning the workflow marketplace version.
- Installation/cache readback is a separate post-push step; no Router process restart.
