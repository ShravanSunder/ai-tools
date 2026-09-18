# Domain Entities

This reference owns deriving the Specification's domain entities from settled sources: the nouns every obligation is written over, each with an identity rule, relationships, invariants, and observable states.

Expected inputs: the authority/problem model, the admitted Requirements rows and their U identifiers or the settling decision records, pathfinding records when present, and existing code or documentation vocabulary as observational evidence of terms already in use.

Return: the entity table, undefined-noun gaps, and any term routed to `discuss-pathfinding` with the exact same-instance question the sources cannot settle.

## Why the Specification Owns This

An obligation is a sentence about nouns. "At most one pending reminder per ticket" cannot be tested until a reader knows what makes two reminders the same and when a reminder stops being pending. The stage that writes the obligations must define the nouns; leaving them to design lets each downstream reader invent a different meaning, and the trace from requirement to realization has nothing stable to bind to.

Requirements surfaces the owner's words. Program Design binds each entity to an owner, a package, a schema, and a wire shape. Neither of those is definition.

## What to Inspect

Read every owner statement as evidence about entities, not only as a future requirement:

- a noun that appears in more than one U row or outcome;
- two words the owner uses for one thing, or one word used for two things ("account" as tenant and as agent login);
- behavior that only makes sense if two instances are distinct ("a fresh reminder, not the old one" says identity includes the occurrence that created it);
- behavior that only makes sense if two instances are the same ("moving the date moves it, not a second one" says identity excludes the due date);
- conditions that mark a state boundary ("nothing comes back after close" names a terminal state);
- constraints across nouns ("never touch another tenant's ticket" is a relationship invariant);
- vocabulary already in use in code, contracts, or prior specifications — reuse the term when an authoritative contract, decision, or Specification gives it the same meaning; code alone shows current behavior and does not settle desired meaning. Do not rename a term a governing source has already fixed.

## Entity Table

```text
E<n>  canonical term
      identity rule:   what makes two instances the same, stated so the hardest case in the source is decidable
      relationships:   owns / belongs to / references, with cardinality
      invariants:      what is always true, from the owner's statements
      observable states: named states and the owner statement that implies each transition
      canonicalizes:   the source words this term replaces, and the reading it excludes
      basis:           U rows when present, otherwise the decision record or governing source that settles the meaning
```

Fill every slot from the sources or mark it as an exact gap; a blank slot is neither.

Give every entity a stable `E` identifier. It travels with the identity chain (`U -> E -> P -> O -> R -> C -> V`), appears in the coverage table and the accepted requirements set, and is the anchor a downstream binding or a review finding cites. Deleting an entity later is a coverage loss, not pruning.

## Settled or Unmade

Define the entity when two capable readers of the settled sources would answer the same-instance question the same way. Route it to `discuss-pathfinding` only when they would not, and carry the exact question: "Is a reminder re-created after re-hold the same reminder or a new one?" not "please define reminder". A term whose readings differ only in implementation detail is settled at this altitude; the difference belongs to `program-design`.

Reading "a fresh reminder, not the old one" as an identity rule is Specification authoring over settled statements. It is not the Requirements inference that `authority-and-problem-framing.md` forbids: that rule stops an author from inventing owner meaning while normalizing Requirements; this stage derives what the owner's statements already decide.

Four rationalizations leave nouns undefined: "the words are obvious", "the team knows what it means", "the data model is design's problem", and — the one that returns `decision-needed` instead of a table — "the source did not define enough entity semantics, so I must ask". The last is a stop only for a question two readers would answer differently; for every other noun the answer is in the statements. The test is not whether the team knows; it is whether a stranger reading only the Specification can decide every same-instance and state question the obligations depend on.

## Good and Bad

Good:

```text
E2  Reminder
    identity rule:     one Ticket plus the Hold-with-due-date occurrence that created it; a later re-hold creates a new Reminder
    relationships:     belongs to exactly one Ticket; a Ticket has at most one pending Reminder
    invariants:        never spans Accounts; exists only while its Ticket is on Hold with a future due date
    observable states: pending -> moved (due date changed) | cancelled (leaves Hold, closed, date cleared) | completed (due reached, Ticket moved to Open)
    canonicalizes:     "reminder", "nudge"; excludes the notification text an agent later sees
    basis:             U1, U2
```

Bad:

- a one-line description with no identity rule ("the pending wait for a ticket");
- a type, table, schema, package, or event payload field standing in for a definition;
- a glossary of every noun in the source, including ones no obligation uses;
- states copied from a workflow engine rather than from owner statements;
- a term redefined when existing code or a prior Specification already fixes its meaning.

## Complete When

At this pass, every noun the problem and desired outcomes name is a defined entity with an `E` identifier and every slot filled or marked as an exact gap; every identity rule decides the hardest case the source raises; no definition names an implementation home; and each unsettled term has been routed with its exact same-instance question. Whether every entity is used by an obligation is checked when obligations exist, by `requirements-and-traceability.md` and the author self-check.
