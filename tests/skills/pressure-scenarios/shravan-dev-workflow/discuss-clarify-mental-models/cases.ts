import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

const skillSources = [
  "plugins/shravan-dev-workflow/skills/discuss-clarify-mental-models/SKILL.md",
  "plugins/shravan-dev-workflow/shared-references/diagram-rendering-and-fallbacks.md",
] satisfies readonly string[];

const firstMapSources = [
  ...skillSources,
  "plugins/shravan-dev-workflow/skills/discuss-clarify-mental-models/references/model-shapes.md",
] satisfies readonly string[];

const plainSurfaceCriterion = {
  name: "keeps-the-surface-in-plain-words",
  requirement:
    "The user-facing response carries no skill-coined bookkeeping vocabulary, neither as label forms (`inherited_frame:`, `first_principles:`, `assumptions:`, `countercase:`, `evidence_checked:`, `rebuilt_model:`, `open_or_confirmed:`, `next_workflow:`, `branches:`, `model:` as a template field) nor narrated in prose ('our inherited frame is...', 'the countercase here...', 'provenance decomposition shows...'), and no rendering bookkeeping (`selected medium:`, `semantic preservation:`, `visual check:`, `fallback:`). Allowed: route-target skill names, plain verdict words ('we're agreed', 'still open', 'on track'), the phrases 'divergence map' and 're-anchor', and words the user introduced in the prompt echoed as element names. Private working state outside the user-facing response is not judged.",
  failureExample:
    "The response displays the old ten-field template, labels a section `assumptions:`, narrates 'my inherited frame comes from the docs', or prints a rendering audit trail such as `visual check: readable`.",
} as const;

const drawnMapCriterion = {
  name: "draws-the-map-instead-of-narrating",
  requirement:
    "The user-facing response presents a drawn comparison structure (side-by-side columns, aligned rows or regions in fenced text or equivalent visual layout) whose elements are named in the user's words and carry visible statuses (same picture / split / unchecked, or aligned / mismatch / unchecked for work-vs-goal), with plain-words origin annotations beside elements or splits.",
  failureExample:
    "Explains the disagreement in paragraphs only, or draws decorative columns whose rows expose no status, origin, or actual split.",
} as const;

export const skillPressureCaseDefinitions = [
  {
    scenarioId: "discuss-clarify-mental-models-drift-interrupt",
    requiredSourceReads: firstMapSources,
    maximumToolCalls: 25,
    semanticCriteria: [
      {
        name: "interrupts-and-stays-read-only",
        requirement:
          "Treats the invocation as an interrupt: does not continue, resume, or propose continuing the in-flight refactor this turn, and neither edits nor creates any file.",
        failureExample:
          "Apologizes and resumes the migration, or proposes finishing the remaining files before discussing.",
      },
      {
        name: "draws-the-work-vs-goal-map",
        requirement:
          "Draws the re-anchor comparison: the confirmed goal and governing boundaries against the in-flight work, each element carrying an aligned / exact-mismatch / unchecked verdict with plain-words evidence or origin beside it, and states 'on track' or the exact mismatch instead of a bare yes. The work-vs-goal map carries no 'my read of your picture — correct me' confirmation marker, which belongs to the belief-vs-belief map only.",
        failureExample:
          "Answers 'yes we are on track' without a drawn comparison, claims a verdict with no evidence beside it, or forces the goal into a fake belief column with a confirmation marker.",
      },
      {
        name: "locates-the-divergence-and-closes-or-asks",
        requirement:
          "Points at where the divergence lives (a term, boundary, assumption, or missing architecture detail) on the map. Then either closes — naming what its comparison leans on in plain words and stating what is agreed or still open before any next step or skill — or keeps it open by asking the settling question instead of guessing a verdict. Never names a next workflow ahead of the agreed/open statement.",
        failureExample:
          "Summarizes the user's frustration without locating the split, closes without naming what the comparison leans on, or routes to a next workflow before stating what is agreed or still open.",
      },
      plainSurfaceCriterion,
    ],
  },
  {
    scenarioId: "discuss-clarify-mental-models-map-building",
    requiredSourceReads: [
      ...firstMapSources,
      "plugins/shravan-dev-workflow/skills/discuss-clarify-mental-models/references/provenance-decomposition.md",
    ],
    maximumToolCalls: 25,
    semanticCriteria: [
      drawnMapCriterion,
      {
        name: "keeps-three-origins-distinct-in-plain-words",
        requirement:
          "For the sidekick situation, keeps three kinds of standing distinct in plain words on the map: what the report claims, what direct evidence would show (honestly stating none is readable here — the picture is from memory or the report alone), and what is only being assumed. Says what the report alone cannot prove, e.g. that 'started tests' does not mean tests passed.",
        failureExample:
          "Blurs claims, missing evidence, and guesses into one caveat, treats the report as verified proof, or implies files were checked when the workspace is not mounted.",
      },
      {
        name: "marks-the-unconfirmed-picture",
        requirement:
          "Marks the user-picture side as the agent's current read and invites correction, and names what would settle the biggest open question.",
        failureExample:
          "Presents its guess of the user's picture as confirmed, or closes without a settling question.",
      },
      plainSurfaceCriterion,
    ],
  },
  {
    scenarioId: "discuss-clarify-mental-models-reconverge",
    requiredSourceReads: firstMapSources,
    maximumToolCalls: 25,
    semanticCriteria: [
      drawnMapCriterion,
      {
        name: "draws-the-mixed-concerns-apart",
        requirement:
          "The mixed concerns (discussion behavior, specs, plan review, goal loops) appear as distinct elements or competing framings on the map with their own statuses and plain-words origins, not flattened into one thing; the split under discussion carries what would settle it.",
        failureExample:
          "Treats the four concerns as one topic, or lists them without statuses, origins, or a settling question.",
      },
      {
        name: "handles-the-challenge-and-stays-open-honestly",
        requirement:
          "Takes the user's challenge (that the agent agreed too quickly and flattened distinct concerns) seriously on the surface: repairs the drawn map or plainly names the bounded gap the challenge exposed, rather than re-agreeing. Marks the user's column as the agent's read inviting correction; since real branches remain in a first exchange, ends with one to three related branch-selecting questions rather than one ritual forcing question or a premature confirmed verdict; if any next step is named, what is agreed or still open is stated first; writes no spec, plan, doc, or code.",
        failureExample:
          "Re-agrees to soothe the user, confirms the model from mere agreement, ends on a single ritual question, claims closure on the first exchange, or starts the plan the user forbade.",
      },
      plainSurfaceCriterion,
    ],
  },
  {
    scenarioId: "discuss-clarify-mental-models-diagram-first-surface",
    requiredSourceReads: firstMapSources,
    maximumToolCalls: 25,
    semanticCriteria: [
      {
        name: "map-leads-the-response",
        requirement:
          "The drawn side-by-side map appears before any substantive split resolution or explanation: the response leads with the two pictures (statuses, plain-words origins for both sides of each split), then resolves.",
        failureExample:
          "Explains cache invalidation in prose first and appends a map at the end, or never draws one.",
      },
      {
        name: "invites-correction-and-settles-one-split",
        requirement:
          "Marks the user's column as the agent's current read with an explicit invitation to correct; the split under discussion carries discriminating evidence or a settling question; asks one to three related branch-selecting questions; and honestly states the picture is from memory since no files can be read.",
        failureExample:
          "Asserts its own picture as fact, asks a wall of unrelated questions, or implies checked evidence in a talk-only turn.",
      },
      {
        name: "echoes-the-user-word-without-the-label-form",
        requirement:
          "May echo the user's word 'assumption' as an element name in plain prose, while never using the bookkeeping label form `assumptions:` or any other field-label form on the surface.",
        failureExample:
          "Renders a labeled `assumptions:` section because the user said the word.",
      },
      plainSurfaceCriterion,
    ],
  },
] satisfies readonly SkillPressureCaseDefinition[];
