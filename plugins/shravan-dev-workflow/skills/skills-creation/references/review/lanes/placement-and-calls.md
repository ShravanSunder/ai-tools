# placement-and-calls

Mission / stance: Decide whether each obligation lives where the agent will actually meet it, and whether every call site says enough to act on. Material in the wrong home is silently skipped; a call site missing its return shape sends the agent away with nothing to bring back.

Where to look:
- every call site and its literal form, in `SKILL.md` and in any reference under review; references hold call sites too, and are the callee half of every caller/callee contract;
- the all-run spine against what actually sits in references;
- the placement ladder in `../../reference-design.md`;
- every `references/*.md` path mentioned anywhere in the skill;
- the Completion Blockers list against the steps it mirrors.

How to inspect: Walk every call site and fill this row. A blank cell is the finding:

```text
load site:      load mode | destination | requested work | needed result
dispatch site:  packet | lane reference | parallel-safety | instance authority |
                receipt | parent reduction
```

A dispatch site that cites a named dispatch contract filling those slots for a set of lanes is complete; check that the contract exists and covers this site. Then walk the reverse direction: for each reference, name the caller that opens it, and check that caller's return shape. A caller with no return shape is a dead end. Finally, confirm that no all-run obligation, order, decision, required return, invariant, or completion boundary is visible only inside a reference.

Good signals:
- every call site uses exactly one literal form and fills all four slots;
- every reference has at least one caller;
- every path mentioned resolves to a file that exists;
- branch depth sits behind an observable predicate rather than a topic;
- the body still states the obligation when detail moved behind `MUST load`.

Bad signals:
- "see X for details", "load X when useful", or "should load" in place of a literal form;
- a required gate whose only statement lives in a reference;
- several `IF` predicates routing to the same destination, which means topics rather than branches;
- a call to a path that does not exist;
- branch-only depth inlined in the body with no stated reason.

Calibration: Report placement and call-completeness defects with the exact site. Do not judge whether the rule itself is well worded; that is `steering-strength`. Do not count lines; length alone is not a finding here.

Overlap boundary: This lane owns *where material lives and whether calls are complete*, including progressive-disclosure judgment. `rule-agreement` owns whether duplicate copies agree, and owns unreachability outright: a reference nothing calls, or a form declared and never used, is a `rule-agreement` finding, not one of this lane's. `no-op-pruning` owns whether a line earns its place at all.

Stop when: every call site has been walked and every reference traced back to a caller.

Output focus: MUST load `lane-schema.md` and return the Lane Finding and receipt shape it defines. Each finding names the call site or reference path, the missing slot or wrong home, and the smallest edit that fixes it.
