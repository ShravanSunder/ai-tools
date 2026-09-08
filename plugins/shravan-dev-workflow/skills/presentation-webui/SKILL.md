---
name: presentation-webui
description: >-
  Use when composing a substantial architecture, comparison, tradeoff, flow, mockup, state-machine, or multi-section response on a rendered proportional-font chat host (Cursor IDE chat, Claude.ai, ChatGPT, or any session whose markdown renders as a formatted document). Especially "draw this out", "show me", "compare these", "explain the architecture". Not for monospace terminal or CLI (presentation-tui); not for authoring durable Requirements, Specification, or Program Design (spec-design, program-design). Skip for user-requested exact formats, schema-bound output, code-only replies, or terse answers.
---

# Presentation: Web UI

On a rendered chat surface, markdown is the skeleton and every visual is a medium choice. Headings, lists, GFM tables, blockquotes, and links carry the document; box-drawing survives only inside fences and only where it beats the markdown equivalent at showing a spatial relationship.

The surface picks this skill: rendered proportional-font chat hosts, which self-identify in session context. Monospace terminal and CLI hosts — and any host whose identity cannot be determined — belong to `presentation-tui`.

## Core rules

1. Markdown structure is deliberate — the baseline owns the construct-to-need mapping. A construct that changes nothing a reader can find, scan, or do is dropped.
2. Technical atoms are always inline code, a fenced block, or a navigational link, never undifferentiated plain text; the baseline owns the bright line and the labels-versus-atoms boundary.
3. Comparisons default to GFM tables; the baseline owns the box-table fallback threshold, and on this surface the fallback also lives inside a fence.
4. For a difficult system, investigation, implementation, or design, pick a disclosure sequence before detail (`diagram-semantics.md` owns the sequence).
5. Render research as handed-over lanes plus parent synthesis (`diagram-semantics.md`'s ledger step owns the rendering shape); presentation does not run agents or decide acceptance.
6. Place each visual next to the short text it supports; one medium per point.

## Media selection

The table is ordered smallest to largest. Walk down it and stop at the first medium that makes the point without a caption explaining it; a medium-fitness pass names the smaller row it rejected and why.

| Medium | Inspect | Good / bad signal |
|---|---|---|
| prose sentence | a single relationship or verdict | good: one line settles it; bad: a diagram restating a sentence |
| pseudocode (fenced) | logic or an algorithm's branches | good: branch structure visible; bad: real syntax noise hiding the logic |
| diff (fenced) | the delta itself, when the reader already knows the surrounding shape | good: minimal context lines; bad: whole-file diffs for one hunk |
| call tree (fenced) | runtime control flow, who calls whom | good: depth shows ownership; bad: every helper listed |
| file tree (fenced) | file responsibility or layout change | good: shallow trunks with role comments; bad: full recursive listing |
| GFM table | items compared across the same attributes | good: narrow, like-vs-like; bad: prose paragraphs in cells |
| Mermaid | a candidate only — the family is already selected and may render as Mermaid | do not decide here; `mermaid-usage.md` returns use-or-fallback |
| fenced box layout | UI mockups and spatial arrangements markdown cannot show | good: geometry is the meaning; bad: a frame around prose |

## Reference calls

MUST load `../../shared-references/markdown-presentation-baseline.md` and return the construct choices, every technical atom's rendering decision (inline, fenced, linked, or relocated out of a fixed-width row inside any fenced box layout), and its before-send check result.

IF the response needs a diagram or a staged explanation of a hard system, load `../../shared-references/diagram-semantics.md` and return the selected primary visual family with its reason, the disclosure sequence, and the stop/simplify result.

IF Mermaid is a candidate medium, load `../../shared-references/mermaid-usage.md` to decide from the already-selected visual family and return the use-or-fallback decision with its trigger and the readability/semantics check result.

## Before-send check

Fix, then send — any failure below is corrected before the response goes out:

- hierarchy: a reader can locate every major claim from a five-second scan of the headings and bold;
- technical fencing: the baseline's check passed — no atom left as plain text;
- medium fitness: each visual passed the media table's stop condition — a smaller row would not make the point without a caption, and the rejected smaller row is named — and deleting the visual would lose a relationship the reader needs;
- disclosure size: difficult explanations follow the returned disclosure sequence, and no single view tries to show everything;
- rendered readability: tables stay narrow, Mermaid passed its readability check, and any fenced box layout passes its fence check: every line inside the fence is the same width, right edges align, and rows carry short plain labels only, with atoms relocated per the baseline's fixed-width-row resolution.

If the user asked for an exact format or a terse answer, or the whole reply fits in a few sentences with no headings and at most one visual, answer plainly instead.
