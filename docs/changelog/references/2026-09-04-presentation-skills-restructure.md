# Evidence — Presentation skills restructure (2026-09-04)

## Spec and review trail

- Spec: `docs/wip/skills-authoring/2026-08-30-presentation-skills-restructure.md`, accepted at r4 after a 4-lane spec review (targeted-revision on r1; 13 accepted findings) and a 4-lane delta re-review of r3 (7 accepted findings).
- Run 1 (`presentation-tui`) implementation review: 8 lanes → remediation pass 1 → 8-lane refresh → pass 2 → focused 3-lane final refresh → pass 3. All lanes returned complete receipts. Reviewer models: claude-fable-5-thinking-medium, gpt-5.6-sol-high, cursor-grok-4.6-high/medium (runtime deviations recorded in the spec's Run 1 record).

## Behavior proof (live ACPX Codex subjects, legacy keyword graders)

presentation-tui: all 7 scenarios GREEN — monospace-structure, progressive-disclosure, research-lane-board, no-mermaid-catalog, semantic-markdown-boundary, visual-family-selection, table-medium-choice.

presentation-webui: all 4 scenarios GREEN — markdown-first-structure, rendered-surface-layout, smallest-view, exact-format-precedence. The smallest-view campaign surfaced two genuine behavior failures (fresh subjects choosing Mermaid for a delta-shaped question, once on surface availability and once on an inflated topology rationale); both were fixed in `mermaid-usage.md` (availability-is-not-a-reason; delta-shaped questions take a diff/tree/table) and the final subjects rejected Mermaid with the taught reasoning. Named proof gaps: real surface routing (exactly-one-skill loading) and no-load near-misses are not assertable — the legacy harness force-invokes the named skill and subjects run in a CLI with host identity supplied in-prompt.

Claim boundary (recorded verbatim from the claim-vs-evidence lane): single-run GREEN is characterization at keyword-grader strength, not repeated regression evidence. Five initial REDs were grader-vocabulary repairs on compliant subjects; two scenario premises were corrected (research-lane demanded a disclosure the skill never required; table-medium's callout was GFM-carryable until re-premised on a sub-row annotation). Shared-reference loading is not behavior-asserted by legacy evaluation.

Notable: two subjects out-argued the original scenarios by following the skill exactly — refusing to invent an unnameable annotation (GFM branch legitimately fired) and carrying row emphasis in GFM. The threshold rule survived adversarial contact intact.

## Static proof

- `pnpm --dir tests/skills run test`: 106/106, including the pinned `selected medium: mermaid | markdown-table | presentation-tui | fenced-plain-text` contract line.
- `claude plugin validate .`: pass at 2.5.0.
- Active-tree greps: no `tui-presentation` outside `docs/` history and `retired-skills/`; no `$tui-presentation` in any agent config; no unqualified `No markdown-as-layout` / `TUI owns structure` wording.
