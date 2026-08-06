# Requirements, Specification, and Program Design

These are three separate authoritative concepts:

```text
Requirements
  WHY, for whom, and within what boundary?
  Authorized needs, desired outcomes, priorities, and limits.
                    |
                    v
Specification
  WHAT must be observably true?
  Normative observable obligations traced to Requirements.
                    |
                    v
Program Design
  HOW will the internal system satisfy it?
  Structural realization of the fixed observable obligations.
```

Nothing downstream may silently change the meaning owned upstream. Program Design may expose a missing or changed observable obligation, but that gap returns to `spec-design`. Specification may expose unmade owner meaning, but that gap returns through `discuss-pathfinding` to the phase that owns it.

## Keep The Identities Separate

For substantial file-backed work, all three concepts have separately identifiable homes:

```text
Requirements: one resolvable source or artifact pointer
Specification: one different resolvable artifact pointer
Program Design: one different resolvable artifact pointer
```

Reuse one already-admitted Requirements identity. Do not copy its contents into a new Requirements artifact merely to satisfy the shape. `spec-design` owns source qualification, admission, and normalization when settled authoritative meaning has no qualifying Requirements home.

For chat-only work, Requirements and Specification may remain in chat, but they are two separately labeled records with different content and roles. Quick work changes the medium, not the semantic boundary.

The accepted requirements set is returned coverage state. It is not a fourth artifact, a ledger, or an alias for the Requirements identity.

Valid:

```text
Requirements -> docs/requirements/job-submission.md
Specification -> docs/specs/job-submission.md
Program Design -> docs/design/job-submission.md
```

```text
Requirements -> separately labeled in-chat Requirements record
Specification -> separately labeled in-chat Specification record
```

Invalid:

```text
Requirements/spec -> one combined document
Program Design -> separate document
```

```text
Requirements -> one document containing the observable contract
Program Design -> separate document
```

The second form is invalid because a Requirements title does not make a separate Specification identity exist.

## Requirements And Normative Requirements Are Different

The Requirements artifact records authorized needs, outcomes, priorities, and boundaries. A Specification contains normative requirements such as `MUST` statements that define observable obligations. Those obligations trace to the Requirements identity; their name does not turn the Specification into a combined `Requirements/spec` artifact.

## Pathfinding Clarifies Missing Meaning

`discuss-pathfinding` helps the user and agent clarify unmade owner meaning that blocks Requirements, Specification, or a Program Design choice. It inspects evidence, explains the ambiguity, groups related questions, challenges assumptions, and uses a diagram when that materially improves shared understanding.

Pathfinding returns clarified meaning to the recorded return owner. It does not replace or merge that owner's artifact. For structural work, it may clarify an owner-controlled tolerance or constraint such as acceptable cost, risk, compatibility, or policy; it does not invent components, interfaces, mechanisms, or architecture.

## Downstream Handoffs

`program-design` consumes distinct Requirements and Specification identities plus their current phase state. Three-artifact design review consumes distinct Requirements, Specification, and Program Design identities. A handoff carries pointers or separately labeled chat records, not copied companion artifacts.
