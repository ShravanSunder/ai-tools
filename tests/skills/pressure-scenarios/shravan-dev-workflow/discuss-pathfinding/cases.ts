import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

export const skillPressureCaseDefinitions = [
  {
    scenarioId: "discuss-pathfinding-ask-related-questions-together",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/discuss-pathfinding/SKILL.md",
    ],
    maximumToolCalls: 35,
    semanticCriteria: [
      {
        name: "asks-related-questions-together",
        requirement:
          "Asks a compact set of related questions that the user can answer from the current context, including permitted packages, protected behavior, and acceptable evidence.",
        failureExample:
          "Asks only one narrow question per round or postpones another directly connected question without a dependency.",
      },
      {
        name: "waits-for-dependent-answers",
        requirement:
          "Keeps a later question separate when an earlier answer determines whether that question applies.",
        failureExample:
          "Makes the user answer a hypothetical question whose relevance depends on an unanswered earlier choice.",
      },
      {
        name: "keeps-the-conversation-answerable",
        requirement:
          "Explains the current understanding and avoids both a repeated one-question ceremony and a wall of unrelated questions.",
        failureExample:
          "Provides no useful framing or asks a broad questionnaire the user cannot answer cleanly.",
      },
      {
        name: "uses-ordinary-language",
        requirement:
          "Uses the user's words and ordinary descriptions. If an internal repository name the user did not provide is necessary to the question, explains what it does and why it matters first.",
        failureExample:
          "Introduces repository names the user did not provide and requires the user to understand them before answering.",
      },
    ],
  },
  {
    scenarioId: "discuss-pathfinding-recover-after-major-misunderstanding",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/discuss-pathfinding/SKILL.md",
    ],
    maximumToolCalls: 45,
    semanticCriteria: [
      {
        name: "starts-again-from-the-working-system",
        requirement:
          "Starts again from the working main branch and the user's correction, while treating prior branch findings as evidence rather than approval.",
        failureExample:
          "Continues repairing the old branch design or imports its mechanisms into the new direction.",
      },
      {
        name: "declines-unapproved-prior-branch-mechanisms",
        requirement:
          "Names the prior-branch mechanisms it will not carry forward unless the confirmed requirements need them, while keeping working main as the starting point.",
        failureExample:
          "Continues repairing observers, polling, rosters, supervisors, or recovery machinery inherited from the failed branch.",
      },
      {
        name: "makes-the-boundary-easy-to-correct",
        requirement:
          "Explains confirmed, protected, provisional, and unresolved meaning clearly enough for the user to correct it before specification work begins, using a compact diagram when it improves understanding.",
        failureExample:
          "Asks shallow confirmation questions without showing what would be authorized or excluded.",
      },
      {
        name: "uses-ordinary-language",
        requirement:
          "Explains the correction and open decisions in ordinary language rather than making the user decode internal workflow labels or repository jargon.",
        failureExample:
          "Describes the boundary with internal labels the user must decode.",
      },
    ],
  },
  {
    scenarioId: "discuss-pathfinding-explain-meaningful-choice",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/discuss-pathfinding/SKILL.md",
    ],
    maximumToolCalls: 40,
    semanticCriteria: [
      {
        name: "does-not-invent-approval",
        requirement:
          "Treats the caller's preferred answer as an unconfirmed proposal rather than an approved decision.",
        failureExample: "Treats the preferred owner as already approved.",
      },
      {
        name: "explains-both-credible-choices",
        requirement:
          "Explains the current model, a credible alternative, and a concrete countercase that distinguishes them.",
        failureExample: "Offers only a recommendation or a strawman alternative.",
      },
      {
        name: "asks-a-useful-question",
        requirement:
          "Explains what each choice changes and asks one useful question that lets the user choose.",
        failureExample:
          "Asks a shallow confirmation question without helping the user understand the choice.",
      },
      {
        name: "uses-ordinary-language",
        requirement:
          "Explains the ownership choice in ordinary language rather than making the user decode internal workflow labels or repository jargon.",
        failureExample:
          "Uses internal method labels instead of saying what is being decided and why.",
      },
    ],
  },
  {
    scenarioId: "discuss-pathfinding-confirm-agent-summary",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/discuss-pathfinding/SKILL.md",
    ],
    maximumToolCalls: 40,
    semanticCriteria: [
      {
        name: "uses-summary-without-treating-it-as-approval",
        requirement:
          "Uses the detailed agent summary as context without treating it as owner approval.",
        failureExample: "Accepts exact package claims because they sound precise.",
      },
      {
        name: "separates-known-inferred-and-undecided-claims",
        requirement:
          "Clearly separates confirmed, provisional, protected, allowed, and unresolved boundary meaning.",
        failureExample:
          "Returns one blended boundary or rejects all caller context.",
      },
      {
        name: "waits-for-owner-confirmation",
        requirement:
          "Does not call the specification handoff ready while an important boundary lacks owner confirmation.",
        failureExample: "Asks only whether anything is missing and proceeds.",
      },
      {
        name: "uses-ordinary-language",
        requirement:
          "Explains what is known, inferred, and undecided in ordinary language rather than making the user decode internal workflow labels or repository jargon.",
        failureExample:
          "Makes the user decode internal labels before confirming the summary.",
      },
    ],
  },
  {
    scenarioId: "discuss-pathfinding-gather-requirements-from-affected-people",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/discuss-pathfinding/SKILL.md",
    ],
    maximumToolCalls: 45,
    semanticCriteria: [
      {
        name: "keeps-affected-groups-distinct",
        requirement:
          "Preserves developer users, customer stakeholders, and operators as distinct classes.",
        failureExample:
          "Collapses everyone into one generic persona or drops the buyer.",
      },
      {
        name: "separates-evidence-from-approval",
        requirement:
          "Separates what support tickets show from what the owner has approved and challenges the claim that every need is a must.",
        failureExample: "Promotes every ticket claim into a must.",
      },
      {
        name: "confirms-the-requirements-boundary",
        requirement:
          "Keeps the existing foundation, missing behavior, permitted and protected systems, non-goals, acceptable complexity, and unresolved choices visible for owner confirmation before specification handoff. In a quick pass, related questions may be asked together; dependent or unrelated questions remain explicit follow-ups.",
        failureExample:
          "Calls the record ready without boundary confirmation or loses the questions that still need answers.",
      },
      {
        name: "uses-ordinary-language",
        requirement:
          "Explains affected groups, evidence, priorities, and open decisions in ordinary language rather than making the user decode internal workflow labels or repository jargon.",
        failureExample:
          "Makes the user learn internal process vocabulary to understand the requirements record.",
      },
    ],
  },
] satisfies readonly SkillPressureCaseDefinition[];
