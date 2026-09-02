# Job Planning

Build the job graph before the first dispatch when the request names more than one outcome or action, any work could run in parallel, or you are unsure one bounded packet covers the task. The graph owns decomposition, sequencing, and parent verification points; each job then runs its own ordered dispatch decision. A job yields at most one assignment-bound receipt and always closes at its named parent verification point.

## What To Inspect When Cutting Jobs

- Outcomes the user named: each named outcome is a candidate job; two outcomes inside one packet is a sign to split.
- Write-dependencies between actions: a job that edits what another job reads cannot run in parallel with it; sequence it and name the gate between them.
- Parent verification points: which results must the parent verify before anything builds on them. Every job names the verification point that closes it — a receipt alone does not close a job.
- Context conservation: work that would flood the parent's window — large file reads, log scans, wide searches, long watches — is a job to hand off even when it is sequential; the parent gets a bounded receipt instead of raw bulk.

## The Graph

For each job record: the job in one sentence, its dependencies and whether it is parallel-safe, its expected receipt, and the parent verification point that closes it. Step 1 of the workflow assigns each job's pattern; the graph never chooses models or runtimes.

## One Good Decomposition

Task: "research prior art on X and Y, then implement the chosen approach."

- job A: prior-art research on X — parallel-safe, read-only. Expected receipt: findings bound to sources. Closes at: parent reduces the findings.
- job B: prior-art research on Y — parallel-safe with A, read-only. Same closure.
- job C: implementation slice — depends on the parent accepting A and B; not parallel-safe (it writes). Expected receipt: diff plus test results. Closes at: parent verifies the diff against the accepted approach.

Jobs A and B dispatch in parallel; job C waits for the parent verification point on A and B, not merely their receipts.

## One Bad Decomposition

- Parallelizing a write-dependent sequence: dispatching "rename the module" and "update its callers" as parallel jobs. The second reads what the first rewrites; both receipts arrive, and the merged result is incoherent.
- Ceremony split: a "graph" whose jobs are really one packet split into fetch-the-file, read-the-file, summarize-the-file. One bounded packet with one stop condition covers it; the graph added records, not control.

## What Parallelizes Well

Before marking two jobs parallel-safe, open what each job names: its write paths, shared stores, and inputs. Two jobs are parallel-safe only when neither reads the other's write set and neither consumes the other's unverified receipt. Read-only evidence lanes and independent review lanes pass this check by construction; a mechanical procedure passes when its writes are disjoint from every concurrent job.

Trap: "different files, so parallel" — when one file imports or loads the other, the write set crosses the file boundary. When unsure, sequence it — a wrong parallel merge costs more than the wait.

## Stop Condition

Stop decomposing when each job fits one bounded packet with one stop condition; a job you cannot give a stop condition is two jobs.

## Boundary

The job graph never restates the Dispatch packet fields — `agent-job-packet.md` owns per-dispatch shape.
