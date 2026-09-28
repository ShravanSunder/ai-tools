# Evidence: Workhorse decomposition and PR breakdown (2.66.0)

## Static proof

- `pnpm --dir tests/skills test`: 17 files, 125 tests passed, exit 0. `pnpm --dir tests/skills typecheck`: exit 0.
- `claude plugin validate .` and `claude plugin validate plugins/shravan-dev-workflow`: passed. Codex `skill-creator` quick validator: 12 of 12 changed skills valid. Cursor and Codex manifests parse as JSON.
- `rg -i "sonnet|haiku" plugins/shravan-dev-workflow/skills`: two exclusion lines, no routing row. `rg "directly by default"` over the skills, the plugin README, and `AGENTS.md`: no match.
- Every file that cites Workhorse fit, the executor record, the Workhorse packet, the plan review, the staffing table, the breakdown record, or the PR independence test names that contract's home by path.

## Blind replay of Workhorse fit (Spec A D13, condition 4)

A Luna xhigh Worker classified the 29 wave-1 briefs of one test-hunt wave from the briefs plus source at the wave's pinned base (the shared parent of every recorded unit commit), with outcome files forbidden; its transcript shows only brief reads, `git show`, and `git grep` at that base. Main then compared the predictions with the recorded PASS rows and stop notes.

| | recorded PASS (22) | recorded STOPPED (7) |
|---|---|---|
| predicted fit (25) | 20 | 5: four seam stops, one proof-strength drop |
| predicted miss, condition 4 (4) | 2 | 2 |

Condition 4 caught 2 of the 6 recorded seam stops, missed 4 where an adjacent or same-named signal existed but did not support the needed observation, and flagged 2 units that passed. The earlier replay without condition 4 caught 1 of 7 stops through span, which the current catalog no longer treats as a miss. No result was required in advance; the replay shows the seam check needs more than one reader's judgment of "supports the observation".

## Spec B walkthroughs

Seven review cases (a large local change, two disjoint features, a two-owner atomic change, a contract with two consumers, a stack whose parent head moves, a mechanics-only improvement, a singleton plan-only request) hold against the implemented text. A re-cut of one real thirteen-slice PR assignment yields seven PR nodes, three contract nodes, three stacks on the contract, and two integration gates. The plan-time eligibility check moves two of its three mid-assignment stops to design gaps before commissioning, and the per-slice seam check covers the third.
