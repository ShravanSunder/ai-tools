# 2026-07-16-discuss-clarify-mental-models-decision-authority

## Source

- Session, transcript, PR, issue, Slack thread, or manual note: Private Perseus
  Agent architecture session. Relevant raw-session turns include
  `019f4d0b-3cf1-7270-9a6b-da685851dff7`,
  `019f6681-21cd-7723-8bce-b29271af109a`, and
  `019f66cf-d94e-74a3-a8a1-36cd6dd69b1f`.
- Related repo or workflow: `perseus-agent`;
  `shravan-dev-workflow:discuss-clarify-mental-models`.
- Date observed: 2026-07-13 through 2026-07-16.

## What Went Wrong

- Observed behavior: The agent proposed a non-React product controller and said
  the decision required confirmation. The user responded by questioning that
  item while explicitly approving other numbered items. The agent later called
  the non-React controller a confirmed decision.
- Expected behavior: A question remains `questioned` or `unresolved`. Partial
  answers to a numbered decision set apply only to the answered items. A
  proposed architecture becomes approved only through an explicit user
  selection.
- Cost of the failure: An unresolved recommendation was exported into a durable
  specification, implementation plan, goal, and large controller rewrite.

## Evidence To Collect

- Relevant transcript excerpts:
  - The assistant said the non-React controller was the largest architectural
    decision and required confirmation.
  - The user asked what that decision meant and reiterated that the PI runtime,
    not necessarily the React SDK, should remain outside React lifecycle.
  - The assistant subsequently listed the unselected proposal under
    "Confirmed decisions."
  - Earlier alignment explicitly treated PI ownership of the agent loop as
    orthogonal to AI SDK `Chat` and `useChat` ownership of generic chat state.
- Files, commands, or logs: Private session transcript; Perseus commits
  `b0c1f4`, `0c22a1e`, `7a5a269`, and `6513d3c` show downstream propagation.
- Existing skill or instruction that should have prevented it:
  `discuss-clarify-mental-models` requires separating inherited framing,
  first principles, and assumptions, and preserving real branches. It does not
  explicitly distinguish proposal, question, approval, rejection, and
  unresolved decision authority.

## Failure Scenario To Pressure-Test

An assistant presents five numbered architectural decisions. The user asks for
an explanation of item 1, explicitly approves item 3, adds constraints to items
4 and 5, and says nothing about item 2. The agent must report:

- item 1: questioned or unresolved;
- item 2: unresolved;
- item 3: approved;
- items 4 and 5: approved only with the user's stated constraints.

The agent must not describe item 1 or item 2 as confirmed and must not route
them into a spec as normative requirements.

## Initial Classification

- Status: investigate
- Likely owner: `discuss-clarify-mental-models`
- Candidate outcome: update existing skill

## Next Step

- What evidence is still missing: Determine whether the decision-status model
  belongs in the compact `SKILL.md` contract or a focused provenance reference,
  and whether the current output contract can carry it without becoming
  ceremonial.
- Who or what should inspect it next: `skill-audit`, followed by one
  `skills-creation` evaluation run for `discuss-clarify-mental-models` with a
  RED pressure replay of the partial-numbered-response scenario.
