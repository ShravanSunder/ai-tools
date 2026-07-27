# mental-model-fit

Mission / stance: Judge the lens, not the wording. The Great Skill Frame makes `SKILL.md` the home of the mental model, which means the skill's most load-bearing claim is a concept the agent is asked to think with. A skill whose every sentence binds can still steer the agent toward the wrong shape of the problem.

Where to look, when the artifact is a **proposal**: the stated lens and the workflow the proposal describes. Both exist in the proposal text.

Where to look, when the artifact is **changed files**:
- the mental model or stance section of `SKILL.md`;
- the leading words the body actually repeats, and how often;
- `../../glossary.md` for coined terms and their definition cost;
- the workflow, to see whether the route the skill walks matches the lens it claims;
- the skill's stated promise and success definition.

How to inspect: Name the lens in your own words after reading only the body, then test it four ways:

```text
fit          does this lens match the work the skill actually does?
priors       does it recruit meaning the model already holds?
cost         is a coined term carrying weight a pretrained word carries free?
coverage     does the workflow walk the lens, or abandon it after the intro?
```

The last one is the most common failure. A skill states a frame in its opening section and then runs a procedure organized on some other principle, leaving the frame as decoration.

Good signals:
- the lens is stated once and the workflow visibly follows it;
- leading words appear as repeated tokens, not as one-off definitions;
- borrowed vocabulary comes from domain or engineering language the model already holds;
- coined terms exist only where no pretrained word fits, and are defined once;
- someone reading only the mental model could predict the shape of the workflow.

Bad signals:
- a frame in the opening section that no later step uses;
- a coined vocabulary large enough to need a glossary to read the body;
- two competing lenses in one skill with no stated relationship;
- a lens borrowed from a source whose problem differs from this skill's;
- the promise and the lens describing different jobs.

Calibration: Propose the smallest change that makes the lens and the route agree — usually either following the frame in the workflow or replacing the frame with the one the workflow already implies. Do not redesign the skill's purpose. A lens you personally find unfashionable is not a finding; a lens the skill does not follow is.

Overlap boundary: This lane owns *whether the concept is right and whether the skill follows it*. `steering-strength` owns whether wording binds once the concept is chosen. `no-op-pruning` owns whether a line should exist. `placement-and-calls` owns where material lives. A weak leading word that fails the no-op test is filed with `route: no-op-pruning`; a leading word that is strong but wrong for the work is this lane's.

Stop when: the lens has been named from the body alone and tested for fit, priors, cost, and coverage.

Output focus: MUST load `lane-schema.md` and return the Lane Finding and receipt shape it defines. Each finding names the lens as stated, where the workflow diverges from it, and the smallest change that reconciles them.
