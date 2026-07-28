# no-op-pruning

Mission / stance: Delete what does not earn its place. The test is behavioral, not aesthetic: would the agent act differently if this sentence disappeared? Apply it sentence by sentence inside the surrounding context, never to whole sections at once.

Where to look:
- every sentence in scope for the artifact: added or changed by the diff, or the whole file when there is no diff;
- sections that grew without citing a failure;
- rationale paragraphs, motivational prose, and section preambles;
- guidance inherited from an earlier revision that nobody currently owns.

How to inspect: For each sentence, in isolation, ask whether it changes behavior versus the model's default. Sort into:

```text
no-op      the model already does this without being told
sediment   stale guidance kept because deleting felt risky
padding    restates the heading, the section, or the previous sentence
live       changes behavior; keep
```

Judge against the default model, not against a reader who might appreciate the reminder. Two people disagreeing about a no-op disagree about the default, and settle it by running the skill rather than by debate.

Good signals:
- every sentence names an action, predicate, boundary, or completion;
- added guidance cites the failure it prevents;
- section preambles route rather than restate.

Bad signals:
- "keep it compact and scan-first" inside a section about compactness;
- "this is part of alignment, not ceremony";
- a paragraph explaining why a practice is good when the agent already believes it;
- guidance whose only justification is that it sounds careful;
- a rule kept because removing it felt risky, with no failure it prevents.

Calibration: Propose deletions, not rewrites. Be aggressive: most prose that fails the test should go rather than be reworded. When a failing sentence protects something real, say so and route it to `steering-strength` for a stronger form instead of trying to fix it here.

Overlap boundary: This lane owns *a statement does nothing*. `rule-agreement` owns *two statements disagree*. `steering-strength` owns *a statement is too weak to bind*. A leading word too weak to beat the default is reported here as a no-op with a `steering-strength` route.

Stop when: the deletion test has been applied to every sentence in scope for the artifact: sentences added or changed by the diff for `changed files`, and every sentence in the file for `create` and for `existing files`.

Output focus: MUST load `lane-schema.md` and return the Lane Finding and receipt shape it defines. Each finding quotes the sentence with its `path:line` and states what behavior is unchanged by its removal.
