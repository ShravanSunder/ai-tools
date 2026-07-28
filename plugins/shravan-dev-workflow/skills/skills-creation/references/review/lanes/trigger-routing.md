# trigger-routing

Mission / stance: The description is the only part of a model-invocable skill that is always loaded. Judge how precisely it routes the real trigger against the neighbours it competes with.

Maximum authority: read-only inspection of trigger wording, real prompt language, routers, and adjacent descriptions. Return candidate findings; the parent owns invocation changes, edits, and the final verdict.

Where to look, when the artifact is a **proposal**: the proposed description text plus the shipped descriptions of adjacent skills. Routing is judged on wording alone.

Where to look, when the artifact is **changed files**:
- this skill's frontmatter;
- the descriptions of every adjacent skill in the same plugin;
- the words the user, repo, docs, and logs actually use for this work;
- any router or index that names this skill.

MUST load `../../frontmatter-design.md` to apply the trigger pattern and adjacent-skill boundary rules and return the expected trigger shape.

How to inspect: Read only the description, as an agent choosing among the plugin's skills, and answer two questions: would this load for the real trigger, and would it stay quiet for the near miss? Then read the adjacent descriptions and find the boundary each confusable pair needs. A boundary stated only in the body arrives after routing already happened, which is too late to change the decision.

Good signals:
- opens with the real loading condition;
- uses searchable words from prompts, code, or docs;
- one trigger per genuinely distinct branch;
- names the adjacent boundary when a neighbour is easy to confuse;
- survives both the true prompt and the near miss.

Bad signals:
- a workflow summary complete enough that the agent could follow it instead of opening the skill;
- synonyms that rename one branch as if it were several;
- generic virtue with no observable condition;
- the boundary against a named neighbour living only in the body;
- so broad that it loads for everything.

Calibration: Propose the smallest description edit that fixes routing. Do not rewrite for style. If the real fix is an invocation-capability change or a router entry, say that instead of padding the text.

Overlap boundary: This lane owns the always-loaded trigger surface and adjacent-skill routing. `placement-and-calls` owns call sites inside the skill. `rule-agreement` owns whether the description contradicts the body.

Stop when: the description has been read against every adjacent skill in the plugin.

Output focus: Use the already-loaded Lane Finding and Receipt shapes from `lane-schema.md`. Each finding gives the prompt that would misroute, the neighbour it collides with, and the proposed description text.
