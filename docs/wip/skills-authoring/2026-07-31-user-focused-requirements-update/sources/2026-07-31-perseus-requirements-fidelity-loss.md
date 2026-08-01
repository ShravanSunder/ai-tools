# Perseus Requirements Fidelity Loss During Design Simplification

Date: 2026-07-31
Source: private application skill-behavior checkout; the checkout name and location are intentionally omitted.
Purpose: observed-failure evidence for `spec-design`, `program-design`, and `spec-program-review`; not a proposal contract

## Confirmed Failure

The requested correction was to remove unrelated Upload concurrency, SQL lease, cleanup, SDK disposal, and reporter machinery from an overengineered program design while preserving the accepted Lane B behavior for six skills.

The correction instead narrowed the governing requirements and specification to Upload Reconciliation, then wrote an Upload-only program design. The artifacts became mutually consistent by dropping accepted scope.

```text
accepted Why/What
  18 universal customer requirements
  6 skill-specific default and behavior contracts
  all-six eval coverage
      |
      | requested: remove unrelated structural How
      v
dirty artifact set
  Upload-only customer requirements
  Upload-only specification
  Upload-only program design
```

## Evidence Checked

Baseline private customer-requirements artifact at `HEAD`:

- title: `Customer-First Requirements for Phase A Analysis Skills`
- universal requirements `CUS-01` through `CUS-18`
- separate contracts for Spend Anomaly, Cash Coverage, Recurring Spend, Missing Receipt, Upload Reconciliation, and Payables
- customer text → conversation context → disclosed skill default → clarification only when no honest default exists
- per-skill defaults include 30-day Spend comparison, 7-day Cash verdict plus 30-day forward context, 24-month Recurring review, 30-day Receipt queue plus older backlog, provisional Upload candidates, and all open Payables bills including overdue and missing-due-date rows

Failure snapshot observed during the first inspection:

- title changed to `Customer Requirements for Upload Reconciliation`
- scope changed to `Upload Reconciliation only`
- status changed to `Accepted customer contract`
- the customer-requirements file had shrunk from the six-skill contract to 111 lines; the diff replaced 330 lines of the tracked file

Baseline private specification artifact at `HEAD`:

- shared parameter resolution and disclosure contract
- six per-skill default/prerequisite sections
- six-skill minimum behavior scenario matrix
- existing Vitest/Voyager harness boundary

Specification in the same failure snapshot:

- completion and scenario coverage are Upload-only
- the tracked-file diff replaces 1,142 lines across the requirements/specification pair

Private program-design artifact in the same failure snapshot:

- title and declared scope are Upload Reconciliation only
- it embeds governing-document SHA-256 values and workflow status in durable prose
- its minimal structural design is locally reasonable for Upload, but it realizes the wrong narrowed requirement set

No files in the source checkout were changed by this investigation.

## Later Recovery Observed

The source checkout changed concurrently after the first inspection. A later read and the Terra-low log analysis found the six-skill scope restored:

- customer requirements again contain all six skill sections;
- the specification again contains all six behavior contracts and existing-harness evaluation coverage;
- the program design again contains six skill bodies and the accepted defaults table;
- the unrelated Upload lifecycle, SQL lease, cleanup, and new-runner machinery remains excluded.

The incident remains valid observed-failure evidence. The Upload-only statements above describe the failure snapshot, not the source checkout's current state. The later recovery strengthens the intended correction: remove unnecessary structural How while retaining all accepted Why/What.

## Failure Model

The agent treated a request to simplify structural How as authorization to rewrite governing Why/What. Once both governing artifacts were narrowed, cross-document consistency stopped being useful: each document agreed with the same wrong scope.

The missing invariant was semantic retention:

```text
simplify How
  -> remove unnecessary components and contracts
  -> preserve every accepted user class, requirement, default, scenario, and proof obligation
  -> stop for an owner decision if simplification appears to require changing What
```

Exact snapshot identity would not prevent this failure. It can prove which narrowed files a reviewer read; it cannot prove that the narrowed files still represent the accepted customer contract.

## Skill Requirements Derived From the Failure

1. Before editing, classify the correction as a change to requirements/Why/What, structural How, or both. “Remove unrelated machinery” is a How correction unless the owner explicitly changes outcomes or scope.
2. Requirements and specification authoring preserve the confirmed user classes, stable requirement identities, priorities, defaults, scenarios, and proof obligations. Deletion or supersession needs explicit owner authority.
3. Program design consumes the governing semantic inventory. It may reduce mechanisms while preserving complete coverage; it does not repair overengineering by editing away obligations.
4. Boundary check 2 compares the proposed architecture and coverage with boundary check 1. A six-skill → one-skill change is a scope deviation, not simplification.
5. Pair review reconstructs the confirmed goal and requirement inventory independently. Agreement between two narrowed artifacts is not sufficient for readiness.
6. A review finding first asks whether the questioned mechanism should exist. Deleting unnecessary How is preferred; deleting accepted What is not a remediation.
7. Workflow acceptance stays in the review result. Changing a durable `Status` line does not establish semantic acceptance.

## Proof Scenario

Start with an accepted six-skill requirements/specification pair and an overengineered program design containing unrelated Upload lifecycle machinery. Ask the agent to remove the unrelated machinery while preserving the six-skill defaults and existing eval contract.

Passing behavior:

- requirements and specification retain all six skills and their accepted defaults;
- program design removes unrelated lifecycle machinery;
- the remaining design uses existing runtime and eval foundations;
- requirement-to-design-to-proof coverage remains complete;
- any apparent need to remove an accepted obligation returns as an owner decision;
- no review or acceptance status is written into the durable product artifacts.

Failing behavior:

- narrowing any governing artifact to Upload-only;
- treating internal consistency of the narrowed pair as semantic fidelity;
- preserving unnecessary machinery because reviewers requested more contracts around it;
- claiming that a digest, status line, or review receipt proves the intended scope survived.
