# Source Inspirations

Load trigger: source provenance matters, the skill borrows an upstream concept,
or public-safe adaptation needs to be checked.

Carry in: source names, concepts being borrowed, changed skill/reference text,
and public docs or changelog surfaces.

## Adaptation Ledger

| Source | Adapt locally | Do not copy |
| --- | --- | --- |
| Matt Pocock `writing-great-skills` | predictability, invocation tradeoffs, trigger-only descriptions, information hierarchy, leading words, pruning | full prose, private glossary dependency, user-invoked-only defaults |
| Superpowers `writing-skills` | RED/GREEN/REFACTOR pressure-first skill writing, rationalization capture | personal directory assumptions, long tutorial body |
| Obra / Superpowers writing discipline | failure-form matching and pressure tests before claims | wholesale templates without repo proof |
| pstack | one entry point routing into playbooks/branches, prove-it-works, minimize reader load | no-planning stance, tool-specific style |
| Codex `skill-creator` | folder anatomy, `agents/openai.yaml`, validation scripts, resource types | treating platform scaffolding as authoring philosophy |
| Claude creator mechanics | Claude packaging/static validation awareness | claiming Claude behavior proof without a behavior harness |
| local great-skills SOP | scorecard, authoring checklist, deployment/pruning gates | local paths, large copied passages, process history |

## Procedure

1. Name the source idea being borrowed.
2. State the local behavior it improves.
3. Record what was adapted, rejected, or intentionally not loaded.
4. Check shipped files for local paths, sensitive values, environment-specific
   config, cache identifiers, and wholesale copied source text.
5. Keep provenance terse and public-safe.

## Return Artifact

```text
source idea:
local adaptation:
rejected material:
not loaded:
public-safe check:
copying risk:
```

Completion criterion: reviewers can see why the local skill behaves this way
without relying on temporary paths or copied source text.

Source material adapted: this file is the source-adaptation boundary. It does
not duplicate all-branch workflow state from `SKILL.md`.
