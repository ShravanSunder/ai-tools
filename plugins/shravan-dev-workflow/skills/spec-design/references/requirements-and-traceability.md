# Requirements and Traceability

This reference owns construction and repair of normative requirements plus coverage from problem and outcome to the proof-obligation slot. `proof-obligations.md` alone selects the proof modality.

Expected inputs: authority/problem model, goals/non-goals, resolved decisions, candidate constraints, and current requirement text.

Return: requirement inventory and coverage map, including exact gaps or conflicts.

## Requirement Shape

Each material requirement carries:

```text
stable identifier
normative statement
basis / authority source
consumer or affected boundary
observable success condition
negative or failure expectation
proof-obligation identifier or uncovered slot
dependencies or conflicts
```

Use a conditional form that makes context and response unambiguous. EARS-style forms are construction tools, not mandatory output syntax:

```text
always active     The <system> <response>.
state-driven      While <state>, the <system> <response>.
event-driven      When <trigger>, the <system> <response>.
optional feature  Where <feature exists>, the <system> <response>.
unwanted behavior If <fault>, then the <system> <response>.
complex           While <state>, when <trigger>, the <system> <response>.
```

Write faults as `If/then`; a failure is not a normal event. Split compound obligations when clauses can pass or fail independently.

## Repair Weak Requirements

Weak:

```text
The system must support retries.
```

Repair:

```text
If the provider times out before confirming acceptance, the system must retry
without creating more than one externally visible operation.
```

Weak:

```text
Use Redis for idempotency.
```

Repair:

```text
For repeated requests with the same idempotency key and equivalent payload,
the service must return the original outcome without repeating the external side effect.
```

The technology-name test: if a materially different implementation could satisfy the same observable obligation, the technology name is normally structural How rather than requirement meaning.

Replace `support`, `handle`, `robust`, `easy`, `secure`, `fast`, and similar adjectives with the behavior that distinguishes pass from fail.

## Traceability

Construct the chain:

```text
problem P1
  -> outcome O1
      -> requirement R1
          -> observable contract C1
              -> proof-obligation slot V1
```

Flag:

- an outcome with no requirement;
- a requirement with no outcome or authority basis;
- a contract or constraint with no consumer;
- a requirement whose negative case is undefined;
- a missing proof-obligation slot for the claimed behavior;
- duplicate requirements with different wording or authority.

Apply the stranger test: a capable reader with no session history must state the same pass/fail behavior and proof obligation.

Complete when: every material requirement is authoritative, singular, observable, traceable in both directions, and separated from implementation tasks.
