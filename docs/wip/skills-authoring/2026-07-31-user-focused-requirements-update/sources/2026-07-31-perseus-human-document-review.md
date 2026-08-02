# Perseus Human-Document Review

Date: 2026-07-31
Role: read-only source evidence for the user-focused requirements/design proposal; not an implementation contract

## Snapshot

The reviewed external working set contained:

- customer requirements: 205 lines; SHA-256 `ec6ad5ee9201d13384bdab6ae080f3235e1ecd099e8264b95500ba931a33aba8`;
- eval specification: 492 lines; SHA-256 `129ccc6ef510e82dfc14f84b1ed8524da277f176bdf23603d850e6a56eefb809`;
- program design: 871 lines; SHA-256 `18e22924a07b2439b0232df131c33ef7cc190de400540e780e8ba046fb75d972`.

All sections and existing Mermaid/text views were inspected. The reviewer worked read-only and made no edits.

## Confirmed Examples

1. Three late “Related documents” lists provide links but not a declared top-down route. The artifact set needs one compact `requirements -> specification -> program design` entry map, with each downstream artifact naming its immediate governing input near the start.
2. The specification attaches customer requirement identifiers to all eighteen scenarios, but coverage requires scanning every definition. One compact customer-job/requirement → scenario/contract crosswalk would make the correct coverage verifiable.
3. The program-design realization table jumps from customer requirements directly to structural owners, bypassing the specification's scenario and artifact contracts. Program design must trace through the immediate specification contract.
4. Program design opens with source inventory and current call-path detail while the integrated target ownership map appears much later. Progressive disclosure should preview the target mental model before deep source and type detail.
5. A specification diagram presents live runtime as a third evaluation layer even though it is an execution condition on customer scenarios. Useful diagrams can still mislead through topology.
6. A state diagram says any failed case transitions directly to sealed failure, while the prose requires incremental retention and final sealing after the run. Useful diagrams can still mislead through timing.
7. Source inventories identify important contracts by digest without a navigable revision-bound location. A human cannot verify the claimed closed inventory from the artifact set alone.
8. Requirements negative space has more than one home. Unique boundaries should move to one owner and duplicated sections should be removed.

## Useful Views to Preserve or Add

Preserve the customer question/evidence/decision flow, supported/partial/unsupported decision flow, scenario-family tree, target ownership topology, normal sequence, evidence state machine, dataset identity ledger, and concurrency ledger.

Add or improve only views that expose a missing relationship:

- artifact spine: requirements → specification → program design;
- crosswalk: customer job → requirement → scenario/contract → structural owner → proof;
- overlapping-lifetimes timeline: runtime and truth end during cleanup while report-safe evidence survives;
- current-versus-target sequence: show the disappearing handle/evidence-loss boundary and its correction.

## Transferable Rules

- Long material is not cruft when it is the only place a human can simulate failure or verify an exact contract.
- Begin with the smallest target model that lets the human place later detail.
- Lower layers implement and link to upstream contracts; they do not duplicate or silently replace upstream authority.
- Choose diagrams for branching, time, state, ownership, and crosswalks; retain prose and examples for nuanced obligations.
- Audit every diagram for direction, timing, ownership, cardinality, and failure meaning.
- Treat jargon as a defect only when it forces a consequential guess; provide a meaning-preserving plain replacement.
- Reject deletion advice unless every unique decision has a surviving authoritative home.
