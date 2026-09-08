# Diagram Semantics

This shared runtime reference owns renderer-neutral visual judgment: choosing the visual family for a relationship, and the progressive-disclosure sequence for hard explanations. Consumers: `presentation-tui` and `presentation-webui`. Rendering medium (box-drawing, Mermaid, tables, fences) belongs to the consuming skill and `mermaid-usage.md`; this file decides *what to show and in what order*, not *what syntax draws it*.

Expected inputs: the concept to explain, the reader's current question, and the consuming skill's surface stance.

Return: the selected primary family with its reason, the disclosure sequence chosen, and the stop/simplify result.

## Visual Family Selection

Pick one primary family from the concept being explained. Compose a second family only when it clarifies a local subproblem.

Zoom is not a visual family. Zoom is a disclosure move: start broad, select one slice, then show detail.

| The concept is… | Family | Inspection question |
|---|---|---|
| ordered work, branching decisions, a pipeline | flow | what happens next, and where does it branch? |
| who talks to whom, in what order | sequence | who sends, who receives, what returns or fails? |
| lifecycle states and transitions | state | what states exist, which transitions are labeled, where is recovery? |
| two independent axes explaining a tradeoff | quadrant / 2D | are both axes real tradeoff dimensions? |
| boundaries, ownership, dependencies, communication paths | topology | who owns what, and which edges carry the meaning? |

One worked example per family (renderer-neutral sketches; the consuming skill picks the medium):

Flow — ordered work with a branch:

```text
input ──► parse ──► validate ──► output
                    │
                    ▼
                  error
```

Sequence — participants and messages; time flows down; a retry that changes ownership is a real message, not a footnote:

```text
client          api           auth
  │── request ──►│             │
  │              │── verify ──►│
  │              │◄── token ───│
  │◄── result ───│             │
```

State — entry state, labeled transitions, terminal states, and the recovery path:

```text
idle ──start──► loading ──ok──► done
  ▲                │
  └──── retry ◄────┘ failed
```

Quadrant / 2D — only when both axes are real tradeoff dimensions, never because it looks tidy:

```text
                 high clarity
                      ▲
low effort ◄──────────┼──────────► high effort
                      ▼
                 low clarity
```

Topology — ownership labels ride the edges; do not imply data flow when the point is responsibility:

```text
┌────────────┐   owns layout   ┌──────────────┐
│ skill      │────────────────►│ chat surface │
└────────────┘                 └──────────────┘
```

Wrong-family red flags:

- flow chosen when ownership boundaries are the point (use topology);
- state chosen when only message order matters (use sequence);
- sequence chosen when there are no participants;
- quadrant chosen for tidiness rather than two real axes;
- a table chosen where the relationship, not comparison, is the point.

Stop when one primary family is named with its inspection question answered. If no family fits after two attempts, the concept is probably a comparison or a list — simplify to a table or prose instead of forcing a diagram.

## Progressive Disclosure

Default sequence for a difficult system, investigation, implementation, or design:

1. **One map** — the user's named target and current question, their nouns preserved, placed in one small relationship view. It answers: what are the moving parts, and why are they in tension? Not every subsystem, not every test, not a table that hides the relationship.
2. **One selected slice** — one path through the system, narrower than the map and deeper than a label. Name why this slice: it is the user-visible failure, it crosses the disputed boundary, it proves the tradeoff, or it explains the confusing transition.
3. **One small ledger** — compact status, not a second giant diagram: what is known, new, open, and the next proof. For research synthesis, render the handed-over lanes and parent status; presentation renders research state, it does not run agents or decide acceptance.
4. **Technical detail** — only now name concrete files, commands, code, and data, each per the technical-content bright line in `markdown-presentation-baseline.md`.

Variants (same discipline, different spine):

- Debug narrative: symptom → suspected boundary → proof gathered → decision → next validation.
- Design tradeoff: goal → two viable options → cost paid by each → recommended slice → proof gate.
- Review synthesis: finding → evidence → failure mode → accepted/rejected/deferred → smallest edit.

Red flags — stop and simplify when:

- the first diagram tries to show everything;
- three unrelated visuals appear before one clear map;
- zoom is treated as a diagram family;
- helper lanes are presented as truth without parent synthesis;
- code, paths, URLs, or tokens are redrawn as decorative layout text.

Complete when the reader can follow map → slice → ledger → detail without rereading, and every visual earns its place in that sequence.
