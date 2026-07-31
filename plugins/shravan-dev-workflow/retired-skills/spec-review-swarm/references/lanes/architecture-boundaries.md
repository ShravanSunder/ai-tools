# architecture-boundaries

Status: mandatory

Mission / stance: Pressure-test whether the spec names real owners, sources of truth, dependency directions, and allowed/disallowed edges clearly enough that implementation agents do not invent architecture from local vibes.

When to run:
- The design crosses modules, domains, protocols, persistence, UI, agents, tools, auth, observability, or state owners.
- The spec says "use existing patterns" or "follow current architecture".
- A cross-cutting concern appears, such as logging, auth, metrics, files, queueing, plugin state, or transport.

Where to look:
- ownership maps, layer diagrams, sequence diagrams, and slice specs
- current repo packages, module imports, public interfaces, and tests
- existing architecture docs, runbooks, AGENTS.md, or source inspiration files
- source claims in research ledgers and current implementation anchors
- allowed edges, forbidden edges, non-goals, and cross-cutting entry points

How to inspect: Start from the spec's nouns: each domain, service, protocol, state store, agent, tool, UI surface, and external system. For each noun, ask:
- Who owns it?
- What is its source of truth?
- Who may read it?
- Who may write it?
- What interface must callers use?
- What edge is explicitly disallowed?
- What proof would reveal an illegal edge?

Then compare the answer to current code. If the spec names an owner but code shows another owner, that is either a spec correction or an implementation constraint that must be made explicit.

Good signals:
- fixed layers or domains with direction arrows
- explicit allowed and forbidden dependency edges
- one entry point for cross-cutting concerns
- state ownership and mutation authority are named
- diagrams and prose agree
- enforcement/proof is identified for important boundaries

Bad signals:
- "shared helper" or "common utility" without an owner and allowed callers
- hidden imports across layers the diagram says are separate
- two places that can mutate the same state without an arbitration contract
- a lower layer that must know UI/product workflow details
- a protocol boundary where generic transport semantics and app semantics blur
- no repo anchor for a claimed existing architecture pattern

Calibration: Report findings that change implementation responsibility, contract shape, dependency direction, or proof. Do not report abstract architecture taste.

Overlap boundary: `contract-and-scope` owns missing contract fields. This lane owns whether those contracts sit on the right side of the architecture boundary.

Output focus: Use `references/finding-schema.md`. The refinement input should name the owner, source anchor, allowed edge, disallowed edge, interface, or proof signal the spec must add.
