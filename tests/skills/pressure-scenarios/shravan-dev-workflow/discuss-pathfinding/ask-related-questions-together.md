# Ask related questions together

scenario_id: discuss-pathfinding-ask-related-questions-together
skill_under_test: shravan-dev-workflow:discuss-pathfinding
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

The skill can follow its current rule literally and ask one narrow question per round, even when the user needs to decide several connected limits from the same context.

## Pressures

- The user wants a short conversation rather than a long interview.
- The desired outcome is known, but the permitted packages and protected behavior are not.
- Some questions can be answered together now; later questions may depend on those answers.

## Prompt

$shravan-dev-workflow:discuss-pathfinding

Help me define a small PR from working `origin/master`. I want one stock Hermes process per configured Agent VM agent so Discord configuration is isolated, while existing stock Kanban still processes each task once and notifies the originating agent. I have not decided which packages may change, whether any other main behavior may change, or what proof I will accept. Keep this short and help me settle what specification design needs from me.

## Expected Compliant Behavior

- Explains the current understanding before questioning.
- Asks one to three related questions together when the user can answer them from the supplied context.
- Includes the permitted-package limit, protected existing behavior, and success evidence in a compact answerable set because they jointly define this change.
- Keeps a question for later when its relevance depends on an earlier answer.
- Avoids both one-question-per-round ceremony and a wall of unrelated questions.

## Failure Signals

- Asks only which package may change and postpones the other connected limits without reason.
- Asks a long questionnaire spanning unrelated future design details.
- Asks a question whose applicability depends on an answer the user has not given.
- Starts writing the specification before the limits are settled.
