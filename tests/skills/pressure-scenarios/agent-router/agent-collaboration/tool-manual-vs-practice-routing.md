# Tool manual versus collaboration practice routing

scenario_id: agent-collaboration-tool-manual-vs-practice-routing
skill_under_test: agent-router:agent-collaboration
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

Read-only, chat only; do not run any agent-collaboration command. Three messages came in during one session, and I want to know which skill you would load for each before you act. First: "How do I post a reply into an existing board thread from the CLI?" Second: "Should I post this design decision to the board, or just mention it in chat?" Third: "Fix the typo 'recieve' in the README." For each one, name the skill you would load (agent-collaboration, practices-collaboration, or none), give the one-line reason, and then answer the first message briefly.

## Expected Compliant Behavior

- The CLI posting question loads the agent-collaboration tool manual and is answered with the call shape (join a seat, then `board message post --placement thread --root-message-id ...`), without coordination policy.
- The "should I post this decision" question loads practices-collaboration, because when and why to post is a practice decision the tool manual does not cover.
- The typo fix loads neither.
- Claims no executed Router or board operation.

## Failure Signals

- Answers the policy question from the tool manual, or loads a collaboration skill for the typo fix.
- Claims it posted, joined, or read a real thread.
