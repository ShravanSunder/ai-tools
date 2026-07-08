# Research Swarm Source-Lane Structure Spec

## Product Intent

`research-swarm` should be the phase-portable evidence workflow for
`shravan-dev-workflow`. It should be callable before discussion, spec creation,
plan creation, review, implementation, or during a mid-stream model break
whenever responsible progress depends on evidence that is not already loaded.

The improvement target is not a rewrite. The current reusable job is correct:
turn fuzzy research into bounded questions, send source-specific lanes, verify
candidate evidence, and return a ledger that downstream phases can consume. The
defect is structural under-factoring: packet anatomy, source routing, parent
ledger shape, and lane-specific behavior are currently compressed into too few
reference files, which makes future research lanes harder to invoke, audit, and
pressure-test.

Success means a future agent can quickly answer:

- what `research-swarm` owns;
- which source/tool lane applies;
- what evidence shape a lane must return;
- what candidate inputs the next phase can safely consume;
- which workflow owns the next artifact.

## Source Hierarchy

Local workflow skills are the source of truth for ownership boundaries:
`research-swarm` owns evidence gathering, `spec-creation-swarm` owns product
intent, requirements, technical contracts, boundaries, invariants, and proof
expectations, and later phase skills own plans, reviews, and implementation.

Local owner and boundary references:

- `plugins/shravan-dev-workflow/skills/research-swarm/SKILL.md`: current
  workflow contract and source of truth for research ownership.
- `plugins/shravan-dev-workflow/skills/spec-creation-swarm/SKILL.md`: source of
  truth for what belongs in a spec: product intent, requirements, technical
  contract, boundaries, invariants, non-goals, and proof expectations.
- `plugins/shravan-dev-workflow/skills/spec-creation-swarm/references/swarm-packets.md`:
  local pattern for keeping packet anatomy in one skill-local packet reference
  while stable lane behavior lives in `references/lanes/<lane>.md`.
- `plugins/shravan-dev-workflow/skills/skills-creation/SKILL.md`: source of
  truth for the later skill-update workflow, including single-skill scope,
  placement rules, pressure proof, pruning, platform mechanics, and shipping.
- `plugins/shravan-dev-workflow/skills/skills-creation/references/great-skill-evaluation.md`:
  evaluation lens for the eventual skill edit: `research-swarm` is a
  targeted-revision candidate because the reusable job and invocation are
  sound, while reference placement needs refinement.
- `plugins/shravan-dev-workflow/skills/discuss-clarify-mental-models/SKILL.md`:
  boundary reference for discussion versus research. Discussion rebuilds the
  shared model; research gathers evidence; spec creation decides contracts.

The Anthropic article "A field guide to Claude Fable 5: Finding your unknowns"
is the source-of-truth inspiration for the unknowns lens. It frames the gap
between map and territory as unknowns, names known-knowns, known-unknowns,
unknown-knowns, and unknown-unknowns, and stresses that unknowns can surface
before, during, and after implementation:
https://claude.com/blog/a-field-guide-to-claude-fable-finding-your-unknowns

Admired source references inform style and lane design, not local ownership:

- `dzhng/skills` `explore-unknowns`:
  `https://github.com/dzhng/skills/blob/main/skills/engineering/explore-unknowns/SKILL.md`.
  This is an implementation example of the Anthropic unknowns lens, not the
  source of truth. Preserve the quadrant walk and the rule that claims about
  territory cite real files read; keep local workflow ownership in this repo.
- Addy Osmani `doubt-driven-development`:
  `/Users/shravansunder/Documents/dev/open-source/ai-dev-skills/addyosmani-agent-skills/skills/doubt-driven-development/SKILL.md`.
  Preserve adversarial doubt for non-trivial claims, the artifact/contract split,
  and the habit of testing confident claims before they stand.
- Pstack `why`:
  `/Users/shravansunder/Documents/dev/open-source/ai-dev-skills/cursor-plugins/pstack/skills/why/SKILL.md`.
  Preserve evidence before narrative, source coverage maps, null results,
  source-category routing, explicit confidence calibration, and gap reporting.
- Pstack `how`:
  `/Users/shravansunder/Documents/dev/open-source/ai-dev-skills/cursor-plugins/pstack/skills/how/SKILL.md`.
  Preserve architecture explanation before critique, scoped explorer lanes, and
  separate runtime mechanics from motivation.
- Obra `brainstorming`:
  `/Users/shravansunder/Documents/dev/open-source/ai-dev-skills/obra-superpowers/skills/brainstorming/SKILL.md`.
  Preserve design-before-implementation, project-context exploration, explicit
  alternatives/tradeoffs, and a written spec before implementation planning.

## Current-State Evidence

- `research-swarm` already states the reusable job: evidence gathering that
  turns fuzzy research into sharp questions, sends bounded lanes, and returns an
  evidence ledger for discussion, spec design, planning, or review
  (`plugins/shravan-dev-workflow/skills/research-swarm/SKILL.md:8`).
- `research-swarm` already forbids momentum into downstream artifacts:
  research preserves evidence for specs/plans but does not synthesize them
  (`plugins/shravan-dev-workflow/skills/research-swarm/SKILL.md:21`).
- `research-swarm` already makes local repo truth primary for repo-affecting
  work (`plugins/shravan-dev-workflow/skills/research-swarm/SKILL.md:29`).
- `research-swarm` already requires bounded research questions before lanes
  (`plugins/shravan-dev-workflow/skills/research-swarm/SKILL.md:32`).
- `lane-packets.md` currently owns packet anatomy, source classes, route
  recommendations, evidence expectations, receipts, parent reducer rules, and
  mini lane overlays (`plugins/shravan-dev-workflow/skills/research-swarm/references/lane-packets.md:3`,
  `plugins/shravan-dev-workflow/skills/research-swarm/references/lane-packets.md:83`).
- `tool-routing.md` has the right source classes but only a short route table
  and compact rules (`plugins/shravan-dev-workflow/skills/research-swarm/references/tool-routing.md:8`,
  `plugins/shravan-dev-workflow/skills/research-swarm/references/tool-routing.md:23`).
- `evidence-ledger.md` has a useful but minimal ledger template
  (`plugins/shravan-dev-workflow/skills/research-swarm/references/evidence-ledger.md:6`).
- `spec-creation-swarm` already models the reference split this spec should
  adapt: packet anatomy stays in the packet reference, while stable lane
  behavior belongs in `references/lanes/<lane>.md`
  (`plugins/shravan-dev-workflow/skills/spec-creation-swarm/references/swarm-packets.md:3`,
  `plugins/shravan-dev-workflow/skills/spec-creation-swarm/references/swarm-packets.md:7`).
- Existing pressure coverage rejects a global shared runtime lane contract and
  requires packet anatomy to stay skill-local
  (`tests/skills/pressure-scenarios/no-global-runtime-lane-contract.md:41`).

## Requirements

R1. `research-swarm` remains phase-portable. It must be callable from any phase
when source evidence, stale assumptions, unknowns, or source coverage gaps block
responsible progress.

R2. `research-swarm` must return evidence and candidate downstream inputs, not
discussion conclusions, specs, implementation plans, review verdicts, code, or
shipping decisions.

R3. `research-swarm` must keep packet contracts skill-local. Do not create a
global runtime lane contract or shared workflow rubric.

R4. `research-swarm` must split stable lane behavior into named
`references/lanes/*.md` files, following the local pattern used by
`spec-creation-swarm`.

R5. Reusable packet anatomy and parent ledger rules must stay in
`references/lane-packets.md`. That file should not own source/tool-specific
research behavior.

R6. A reusable evidence schema must define the row shape used by lanes and the
candidate phase-input slots returned to downstream workflows.

R7. Tool routing must explain when to use each source/tool class, when not to
use it, what proof it returns, and the fallback when the preferred tool is
unavailable.

R8. The skill must distinguish intentional packet anatomy repetition from
harmful duplicated rule prose. Required packet fields such as source anchors,
inspect lists, non-goals, receipts, confidence, and security context are not
redundant merely because other swarms also use them.

R9. The design must preserve user-named sources. Specific articles, repos,
tools, and documents must not be replaced by generic search.

R10. Security-sensitive research must route context gathering carefully and
hand authorized security scanning to `ops-security-review`; `research-swarm`
must not invent security scanners or secret-handling workflows.

## Technical Contract

### Ownership Map

```text
research-swarm
  owns:
    source gathering
    source/tool lane selection
    evidence rows
    source coverage map
    unknowns and caveats
    parent verification of candidate lane evidence
  exposes:
    research ledger
    accepted/contested/rejected/open evidence
    candidate downstream phase inputs

spec-creation-swarm
  owns:
    product intent
    requirements
    data/state model decisions
    interface and contract decisions
    invariants
    boundary and separability map
    proof expectations
  consumes:
    research ledger and candidate phase inputs

plan-creation-swarm
  owns:
    task sequence
    implementation slices
    exact proof gates and command strategy
  consumes:
    accepted spec/design contract and research evidence as needed

review swarms
  own:
    adversarial critique of drafted artifacts or implementation
  consume:
    research evidence only as source material, not as verdict

skills-creation
  owns:
    final skill edit
    pressure scenario design
    pruning
    platform mechanics
    shipping proof
```

### Target File Layout

```text
plugins/shravan-dev-workflow/skills/research-swarm/
  SKILL.md
    all-branch workflow, phase portability, and boundaries
  references/
    lane-packets.md
      packet anatomy, parent research ledger, completion receipt
    schema-research-evidence.md
      evidence row shape and candidate downstream input slots
    tool-routing.md
      source/tool selection with use, avoid, proof, fallback
    lanes/
      local-code-docs.md
      repo-architecture-deepwiki.md
      current-web-docs.md
      specific-url-extraction.md
      reader-saved-research.md
      memory-session-logs.md
      ui-browser-behavior.md
      source-coverage-map.md
```

`SKILL.md` must stay compact. It should tell the parent when to use the skill,
how to frame research questions, how to preserve phase boundaries, and which
references to load. Branch-only research behavior belongs behind the named lane
references.

### Evidence Schema Contract

`references/schema-research-evidence.md` should define a reusable row shape:

```text
- claim:
- source anchor:
- source class:
- evidence class: direct observation | cited source summary | user-memory evidence | inference | contradiction | unresolved
- supports/refutes/complicates:
- downstream input type:
  state/data shape | interface/contract surface | invariant |
  boundary/invalid example | proof or failure probe | open owner decision |
  source coverage gap | none
- downstream candidate:
- freshness:
- verification status: parent-verified | needs primary-source check | unresolved
- countercase:
- confidence: high | medium | low
```

The downstream input type is intentionally candidate-shaped. Research may
surface that a data model, function contract, invariant, invalid example, or
proof probe is needed, but the receiving phase decides whether to adopt it.

### Source And Tool Lane Taxonomy

Each lane file should answer five questions:

```text
when to use:
when not to use:
inputs required:
proof returned:
fallback:
```

Initial lane contracts:

- `local-code-docs.md`: local repo code, docs, specs, plans, runbooks, current
  worktree state, and sibling local prior art. Use first for repo-affecting
  work.
- `repo-architecture-deepwiki.md`: open-source repository architecture and API
  questions. Use DeepWiki first when available, then verify load-bearing claims
  against primary files or official docs.
- `current-web-docs.md`: freshness-sensitive web facts, docs, release notes,
  pricing, policy, package behavior, or current platform guidance. Use current
  web tools and cite primary URLs.
- `specific-url-extraction.md`: user-named articles, docs, issues, PDFs, or
  pages. Preserve the exact URL and extract it directly before any generic
  search.
- `reader-saved-research.md`: Reader or Readwise saved research when the user's
  prior saved material is relevant to the question.
- `memory-session-logs.md`: prior user decisions, repeated workflow patterns,
  old sessions, and durable preferences. Treat memory as discovery until live
  repo evidence confirms drift-prone claims.
- `ui-browser-behavior.md`: page or app behavior that must be observed through
  browser/app tooling rather than inferred from source.
- `source-coverage-map.md`: coverage accounting, null results, unavailable
  tools, contradictions, and source classes deliberately not searched.

## Data, Interfaces, And Invariants Boundary

The user-specified "data structures first" and "interfaces/contracts second"
discipline belongs primarily to spec creation, with research as input.

Research can produce:

- candidate state/data shapes found in code, docs, prior art, or current
  platform guidance;
- candidate interface surfaces, API signatures, protocol shapes, and
  integration contracts;
- candidate invariants, invalid examples, and edge cases;
- candidate proof or failure probes;
- open owner decisions when evidence cannot decide the contract.

Spec creation must then decide:

- which state representation is the system contract;
- which API stubs, function signatures, component boundaries, or protocol
  contracts must exist;
- which invariants are required versus merely observed;
- which proof expectations are tied to requirements.

This keeps research callable from any phase without letting research silently
become the design authority.

## Non-Goals

- Do not implement the skill changes in this spec branch.
- Do not create a global packet contract shared by all runtime workflow skills.
- Do not deduplicate required packet anatomy merely because the same field names
  appear in other swarm skills.
- Do not move phase ownership into `research-swarm`.
- Do not add exact implementation order, execution DAGs, worker assignments, or
  exact validation command sequences to the research skill.
- Do not treat `dzhng/explore-unknowns` as the source of truth over the
  Anthropic article or local workflow ownership.
- Do not broaden this change into a repo-wide skill portfolio audit.

## Proof Expectations

The implementation plan that follows this spec should include proof for:

- pressure scenario coverage that `research-swarm` frames questions before
  source gathering and preserves local re-anchor first;
- pressure scenario coverage that substantial fan-out creates parent and
  per-lane artifacts unless a named exception applies;
- pressure scenario coverage that a global runtime lane contract is still
  rejected;
- a new or updated pressure scenario proving source/tool lane selection,
  including at least one specific URL case and one memory/session case;
- static validation that the new references are reachable from `SKILL.md`;
- manual source-read validation that no rule has two homes after pruning.

## Open Questions

No blocking design questions remain for the spec. Naming may still be refined
during implementation if a lane name reads awkwardly in pressure tests, but the
owned lane set and boundary are decided here.

## Next Workflow

Use `spec-review-swarm` to critique this spec before implementation planning.
After accepted review feedback is folded in, use `plan-creation-swarm` or
`skills-creation` to write the implementation plan for the actual skill update,
pressure scenarios, versioning, changelog, and release proof.
