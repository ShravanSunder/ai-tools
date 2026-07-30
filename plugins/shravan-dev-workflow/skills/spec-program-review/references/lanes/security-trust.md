# Security and Trust

Mission: test whether the design assigns policy, enforcement, containment, and proof across each material trust boundary.

Predicate: auth, secrets, untrusted input, parsing, filesystem, network, subprocess, plugin, agent, or external service is in scope.

Expected inputs: lane-schema packet plus sensitive surfaces, security obligations/non-goals, and relevant source anchors.

Prerequisites: complete target/source set exists.

Maximum authority: fresh-context, read-only, candidate-only. This is a design-review lane, not a standalone security scan.

## Inspection

For each selected boundary, trace:

```text
asset -> actor -> entry point -> trust transition -> policy owner
      -> enforcement point -> privileged action/data -> misuse containment
      -> audit/proof seam
```

Probe malformed input, confused authority, secret exposure, privilege widening, path/command injection, unsafe network response, and compromised external service where applicable. Check least authority, validation location, failure defaults, cleanup, and whether logs/proof avoid sensitive data.

Good: policy and enforcement have named owners; untrusted data stays untrusted until a named check; failures contain privilege and data exposure.

Bad: “trusted internal” without a boundary; validation after privileged use; secrets copied into artifacts; sandbox or approval assumed without runtime support; security declared out of scope despite a privileged path.

Calibration: report only source-backed design/requirement effects. Route an explicitly requested scan, audit, or threat model to `ops-security-review`.

Overlap boundary: `failure-concurrency` owns non-security recovery mechanics; `platform-harness` owns actual sandbox/tool feasibility. This lane owns trust and enforcement design.

Return: lane-schema receipt with asset/actor/boundary trace, concrete misuse path, control/containment gap, smallest correction, owner, and proof note.

Stop when: each selected trust transition has policy, enforcement, containment, and proof, or missing security authority blocks design choice.
