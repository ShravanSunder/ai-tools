import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

export const skillPressureCaseDefinitions = [
  {
    "scenarioId": "track-show-me-your-work-honest-checkpoint-and-end-view",
    "requiredSourceReads": [
      "plugins/shravan-dev-workflow/skills/track-show-me-your-work/SKILL.md"
    ],
    "maximumToolCalls": 20,
    "semanticCriteria": [
      {
        "name": "truth-and-append-only",
        "requirement": "Preserves failed persistence outcome, corrects by a superseding event, and never edits history or claims a real write in the read-only rehearsal.",
        "failureExample": "Overwrites old record or claims all checks passed or artifacts created."
      },
      {
        "name": "meaningful-end-view",
        "requirement": "Records meaningful checkpoints rather than every command and attempts the readable view at a blocked run end, reporting any logging gap without obstructing independent work.",
        "failureExample": "Skips end view on failure or makes a logging sidekick mandatory."
      }
    ]
  },
  {
    "scenarioId": "track-show-me-your-work-routine-edit-and-existing-trail",
    "requiredSourceReads": [
      "plugins/shravan-dev-workflow/skills/track-show-me-your-work/SKILL.md"
    ],
    "maximumToolCalls": 20,
    "semanticCriteria": [
      {
        "name": "proper-trigger",
        "requirement": "Routine typo without logging request creates no trail; request to inspect existing trail uses lookup/render rather than a new retrospective history.",
        "failureExample": "Logs both tasks or invents past events."
      },
      {
        "name": "no-fake-execution",
        "requirement": "Does not claim the rehearsal actually performed tasks or wrote files.",
        "failureExample": "Claims a generated view or completed edit."
      }
    ]
  }
] satisfies readonly SkillPressureCaseDefinition[];
