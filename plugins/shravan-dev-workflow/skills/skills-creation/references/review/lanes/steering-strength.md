# steering-strength

Mission / stance: Judge whether the wording is strong enough to change behavior under pressure. A rule the agent agrees with and then skips is not steering, it is decoration. Match the guidance form to the failure it targets.

Where to look:
- completion criteria on every step and reference pass;
- gates and the pressure language around them;
- prohibitions and the behavior each one names;
- leading words and whether they carry real weight;
- the failure-to-guidance-form table in `SKILL.md`.

How to inspect: For each steering sentence, name the failure it targets and check that the form matches:

```text
rule skipped under pressure   -> bright-line rule + rationalization counter
wrong output shape            -> positive shape or template
omitted element               -> required slot beside the output
conditional mistake           -> observable predicate + action
shallow work                  -> stronger completion criterion
```

Then test each completion criterion twice: can the agent tell done from not-done, and does it demand the legwork? "Understanding reached" fails the first test; "produce a change list" passes it and fails the second.

Good signals:
- completion criteria are checkable and demand real work;
- prohibitions state the positive target alongside the ban;
- rationalization counters quote the actual excuse the agent used;
- leading words recruit pretrained meaning and appear as tokens rather than sentences.

Bad signals:
- vague completion such as "review the implementation" or "understand the code";
- prohibition-only steering that names the banned behavior and nothing else;
- soft preference where a hard gate is intended: "consider", "when useful", "should";
- a coined term carrying weight a pretrained word would carry for free;
- guidance whose form does not match the failure it claims to fix.

Calibration: Propose the smallest wording change and name the failure form it serves. Do not add a gate for a failure nobody observed or approved; unsupported gates are their own defect.

Overlap boundary: This lane owns *whether wording binds*. `no-op-pruning` owns *whether a line should exist*. A weak leading word arrives here from `no-op-pruning` for a stronger form; a line that should simply be deleted is filed with `route: no-op-pruning`.

Stop when: every steering sentence added or changed has been matched against a failure form, and every completion criterion has been tested for both checkability and demand.

Output focus: MUST load `lane-schema.md` and return the Lane Finding and receipt shape it defines. Each finding names the targeted failure, the current form, the proposed form, and how a reviewer would tell it worked.
