# Reader Understanding Fixture Specification

This specification defines the Why/What for job submission and status. The requirements document owns accepted requirements; the program design owns structural How.

## Purpose And Companion Roles

This specification defines the Why/What for job submission and status. The requirements document owns accepted requirements; the program design owns structural How.

## Observable Obligations

- R1: valid submission returns a stable job identity; invalid submission returns an observable rejection.
- R2: status exposes accepted, running, completed, or failed; timeout is a failed result rather than silence.

## Proof Obligations

- Demonstrate valid and invalid submission at the SDK surface.
- Demonstrate completion and timeout failure through the operator status surface.
