# User-Requirements and Design-View Manual Proof

Date: 2026-07-31
Scope: manual semantic/readability preview for one Mermaid view, one Markdown table, and one fenced plain-text fallback
Boundary: no Mermaid renderer is installed in this checkout; Mermaid source was inspected manually and is not claimed as machine-rendered syntax proof

## Mermaid Context View

```mermaid
flowchart LR
    sdk["SDK consumer<br/>U1: first successful call"] -->|"public API contract C1"| system["Onboarding system<br/>(opaque)"]
    operator["Operator<br/>U2: actionable recovery"] -->|"operational surface C2"| system
    buyer["Customer stakeholder<br/>audit outcome"] -. "constraint, no direct journey" .-> system
    system -->|"observable result or error"| sdk
    excluded["Internal worker<br/>structural How"] -. "excluded from context view" .-> system
```

Visual check:

- external consumers/stakeholder and observable surfaces are visible;
- the system remains one opaque node;
- the internal worker is named as excluded negative space rather than drawn inside the system;
- U1/U2 and C1/C2 anchors survive;
- result: pass by manual source inspection; renderer availability remains not applicable to this preview.

## Markdown Requirement Coverage Table

| U root | Problem | Outcome | Requirement | Contract | Proof obligation | Gap |
| --- | --- | --- | --- | --- | --- | --- |
| U1 SDK consumer | P1 setup failure is opaque | O1 first call succeeds or fails actionably | R1 return actionable authentication failure | C1 public API error shape | V1 integration behavior | none |
| U2 operator | P2 recovery owner is unclear | O2 operator can recover without source inspection | R2 expose recovery state | C2 operational status surface | V2 manual operational proof | evidence source pending |

Visual check:

- the dense U→P→O→R→C→V relationship is easier to scan as a table than topology;
- the missing evidence remains visible instead of being silently filled;
- result: pass.

## Fenced Plain-Text Call Fallback

```text
SDK consumer
  -> public API [owner: API boundary; input authority: request]
      -> async worker [owner: onboarding coordinator; edge: queued event]
          -> provider [side effect: credential verification]
          <- accepted | timeout error
      <- completion event | retryable failure
  <- actionable result | actionable error

evidence anchors: API handler, queue consumer, provider adapter, integration trace
```

Visual check:

- entrypoint, owners, async boundary, side effect, result/error path, and evidence anchors are visible;
- the view remains readable without Mermaid support;
- result: pass.

## Proof Boundary

These previews show that the three supported media can preserve representative required fields. They do not prove stochastic skill invocation or behavior under pressure. Model pressure execution is deferred by explicit user direction.
