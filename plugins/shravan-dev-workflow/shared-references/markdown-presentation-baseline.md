# Markdown Presentation Baseline

This shared runtime reference owns the supported Markdown set, the technical-content bright line, and the table default for every presentation surface. Consumers: `presentation-tui`, `presentation-webui`, and `shared-references/diagram-rendering-and-fallbacks.md`.

Expected inputs: the draft response (or the content about to be composed) and the consuming skill's surface stance (TUI skeleton default, or markdown skeleton).

Return: the construct choices taken, every technical atom's rendering decision (inline code, fence, link, or relocated out of a fixed-width row), and the before-send check result.

## Supported Markdown Set

Treat this set as universally supported on every agent surface; do not add per-CLI exceptions or probe the renderer:

ATX headings (`#`–`###`), `**bold**`, `*italic*`, `` `inline code` ``, fenced code blocks, `-` bullets, ordered lists, nested lists, `>` blockquotes, `[label](url)` links, `---` rules, and GFM tables. Keep tables reasonably narrow.

## Choosing the Construct

Match the construct to the relationship, not to habit. Inspect what the reader must do with each piece of content, then pick:

| Reader's need | Construct |
|---|---|
| Navigate a long answer, jump to a section | heading |
| Catch the load-bearing term or verdict in a scan | **bold** on the few words that carry it |
| Hold a set of parallel items | `-` bullets; numbers only when order or count matters |
| Compare items across the same attributes | GFM table (the default comparison medium) |
| Read a caveat, quote, or aside apart from the main line | blockquote |
| Open a file, doc, or URL | link with anchor text; bare URL only when the URL itself is the thing to verify |
| Copy, run, or scan code-shaped content | inline code or a fence (see the bright line below) |

Good structure is deliberate: one heading level change at a time, sections that follow the argument, emphasis on the decision words only. If a construct does not change what the reader can find, scan, or do, drop it.

Stop when the skeleton lets a reader locate every major claim from a five-second scan.

## The Technical-Content Bright Line

JSON, JSON Schema, source code, configuration, commands, flags, structured data, schemas, and identifiers are **never undifferentiated plain text**. Only backticks, a fence, or a link differentiate; alignment, indentation, and frames do not. This is the bright line both presentation skills enforce.

Inspect every candidate atom in the draft: file paths, commands, package names, versions, hashes, branches, type names, enum values, config keys, event kinds, protocol fields, tool names, API names, expressions, literal values.

Choose the rendering decision per atom:

- **Inline code** for short atoms living inside prose: `SKILL.md`, `pnpm --dir tests/skills run test:evals`, `kind: "agent-channel-provider-health"`, type and field names, flags.
- **Fenced block** (with a language tag) the moment the reader would treat the content as structure to copy, scan, or run: source code, JSON documents, schemas, config files, multi-line commands, data models. Do not redraw such content as box-drawing or aligned plain text.
- **Link** for navigation: a file link when the reader should open local code or docs (with a line number when useful), a markdown URL link when anchor text improves scanning, a bare URL only when the exact URL is itself the thing to inspect, copy, or verify. Links follow the same fixed-width-row rule below: relocated, never inside a row.

Good and bad inline-code atoms:

- Good: files and paths, commands and flags, packages, models, versions, hashes, branches, tags, type names, enum values, config keys, event kinds, protocol fields, tool and API names.
- Bad: emphasis words (`important`, `recommended`), arbitrary nouns the writer wants to color, whole sentences that are not technical identifiers. Semantic markdown carries technical meaning; it is not decoration.

### Labels Versus Atoms

A fixed-width row may carry a short plain **label** — prose naming what the row is about (a role, a column header, a human-readable name). **If the label would be written in backticks in prose, it is an atom, not a label.** When the row's subject has a copyable or navigable form, that form appears in code formatting outside the row and the label merely points at it. Anything the reader would copy, run, open, or paste is an **atom** and never sits plain in a row. When in doubt, treat it as an atom.

**Diagram labels:** short node, actor, state, and edge names inside box-drawn diagrams (`idle`, `Client`, `publish`) are labels — they position the relationship. A command, path, expression, or full identifier is an atom even inside a diagram, whatever its length: keep a short name on the node or edge and put the backticked form in the prose or fence beside the diagram.

### Fixed-Width-Row Resolution

No markup renders safely inside a fixed-width framed or box-table row — never place inline code, bold, or links inside one; hidden markup shifts the visible right edge. The bright line still holds; resolve it by **moving the content, not stripping its formatting**:

- Technical atoms belonging to a row move **outside** the row into inline code, a fence, or a link.
- The row keeps a short plain label pointing at it (for example `fix → below`), and the formatted content sits immediately before or after the framed block.
- Never wrap identifiers as raw plain text inside rows to preserve geometry; relocate them instead.

## Table Default

GFM tables are the default medium for comparisons, matrices, and attribute-aligned data on every surface. Fall back to a box-drawn table only when the table itself needs what GFM cannot carry: embedded callout arrows on cells, sub-row annotations, deliberate column geometry, or alignment that is part of the meaning. The fallback fires only when you can point at the specific cell annotation or alignment the GFM rendering would destroy; if you cannot name it, use GFM.

## Before-Send Check

Fix, then send — any failure below is corrected before the response goes out:

- every technical atom is inline code, fenced, linked, or relocated per the fixed-width-row resolution — none is plain text;
- fenced blocks carry language tags and contain everything the reader may copy or run;
- for each heading, bold, list, table, and blockquote, the reader action it serves can be named — any construct without one is dropped;
- every comparison is a GFM table, or the specific annotation the box table carries is named;
- tables compare like against like and stay reasonably narrow;
- no markup sits inside a fixed-width row.

Complete when every check passes on the final draft.
