# creating-skills Source Inspirations

Provenance ledger for the `shravan-dev-workflow:creating-skills` skill
family. Moved out of the active skill (`plugins/shravan-dev-workflow/skills/
creating-skills/references/`) during the 2026-07-03 rewrite so normal
authoring never routes through a source-provenance file; this ledger is
historical/reference-only.

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

## Public-Safe Check

- Keep local paths, sensitive values, environment-specific config, cache
  identifiers, and copied source text out of shipped skill files.
- Prefer adapted judgment over quoted source prose.
- This ledger itself lives outside the active skill; it is not loaded during
  normal authoring.
