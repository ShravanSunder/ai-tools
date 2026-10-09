# Scenario Authoring

This reference owns how to write a pressure scenario: an organic request a fresh agent receives, plus a checklist of narrow checks that decide from what the agent did whether the skill held. Return the scenario file path, its checks with the evidence each relies on, and the `validate` result.

Expected inputs: the skill under test, the behavior to prove (from the success definition or the recorded failure), and the done bar the scenario serves.

## The Model

A scenario is an experiment, not a quiz. The subject is a fresh Luna agent that sees only the request, the repository snapshot, and the skills under test. It never learns it is being tested. The checks are hidden from it and decide one narrow question each, from evidence the runner retrieves out of the recorded run.

Grade what the agent did before what it said. The code-step catalog reads recorded actions: which files it opened, whether it tried to write, how many tool calls it made. A question about meaning goes to a Jev card, and only an answer Jev is unsure about reaches the Luna judge.

## Where It Lives

```text
<scenario dir>/<scenario-id>.scenario.md   one scenario
<scenario dir>/cards.yaml                  the skill's Question cards and their calibrations, shared by its scenarios
<scenario dir>/fixtures/<file>             a file the scenario's `fixtures:` front matter copies into the snapshot at its `target`
```

`<scenario dir>` is `tests/skills/pressure-scenarios/<owner>/<skill>/` in the skill's repository, where `<owner>` is the directory holding the skill set (the plugin for `plugins/<plugin>/skills/<skill>`). `--scenarios <dir>` points the runner at another directory.

## Write The Prompt

The `## Prompt` section is exactly what the subject receives. Write it the way a real user would ask in that situation, including the pressure that tempts the shortcut (urgency, "it's just a label swap", "I already know the fix").

- It may invoke the skill by name (`$skill-creation`) when the scenario tests the body; leave the name out when it tests the trigger. A named skill is put into the agent's context directly, without a file read, so `loadedSkill` only proves anything when the prompt leaves the name out.
- It never contains the checklist or a hint of it, never asks which skills or files the agent used, and never uses the words eval, test, judge, experiment, rubric, score, compare, benchmark, candidate, or arena. `validate` rejects these words.
- Files the request needs must exist in the repository snapshot. Point at real paths; a fixture is a file under `<scenario dir>/fixtures/` that `fixtures:` copies to a path a user would plausibly name.

Use `followUps` in the front matter for scripted later turns in the same session.

## Write The Checks

Each check answers one narrow question, stated in `criterion` as a plain sentence a stranger could judge. Split a check that could pass on one clause and fail on another. Judge only what the request asked: a chat-only request never fails for a missing file it did not ask for.

Build each check as a decision tree, cheapest evidence first:

1. **Code step** when the answer is in recorded actions. Steps: `readFile: <file>` (it read the file's content; mentioning the path is not a read), `loadedSkill: <name?>` (it read that skill's `SKILL.md`), `noWritesAttempted: {}`, `toolCallCount: {max: n}`, `startedSubagents: {min: n}` (it started at least `n` separate agents). File references are `skill:<path>` (the scenario's skill), `skill(<name>):<path>` (a sibling skill), or `repo:<path>`.
2. **Jev card** when the answer is a narrow yes/no or choice about meaning. Its `uncertain` branch decides what happens when Jev is unsure: usually a judge leaf, sometimes `inconclusive`.
3. **Judge leaf** only where the tree needs it. It sees the request, the criterion, and the evidence you list, nothing else.

Every branch ends in `pass`, `fail`, `inconclusive`, or a judge leaf. A step that cannot be decided, or a node whose evidence is missing, makes the check `inconclusive` on its own; a missing observation is never a `fail`. Code steps check what was done, not when: write a criterion as "opens X", not "opens X before Y".

```yaml
checks:
  - id: reads-the-isolation-recipes
    criterion: The agent reads the isolation-recipes reference.
    root: opened
    nodes:
      opened:
        kind: code
        step: { readFile: "skill:references/isolation-recipes.md" }
        onTrue: pass
        onFalse: fail
  - id: names-the-missing-guarantee
    criterion: From the flaky test it opened, the reply names a guarantee the test relies on that the runtime does not give.
    root: opened-test
    nodes:
      opened-test:
        kind: code
        step: { readFile: "repo:tests/test_checkout.py" }
        onTrue: says-which
        onFalse: fail
      says-which:
        kind: jev
        card: names-missing-guarantee
        branches: { yes: pass, no: fail, uncertain: judge-which }
      judge-which:
        kind: judge
        evidence: [finalMessage]
```

## Write The Cards

```yaml
cards:
  - id: names-missing-guarantee
    serves: names-the-missing-guarantee
    type: yes_no
    question: Does the reply name what the flaky test assumes, such as ordering, timing, or shared state, that the runtime does not guarantee?
    evidence: [finalMessage]
```

A card asks one judgement over named evidence. It never asks whether the work is good overall. Evidence sources are `finalMessage`, `conversation`, `toolCalls`, and `{file: <file>}`; the runner retrieves them from the whole run, never a window. Never point card evidence at credential-handling files. `validate` rejects evidence paths that look like credentials.

A card's calibration lives inline on the card under `calibration`, keyed by Jev engine, each entry with `bands`, `labelledSet`, and `measuredAt`. Until a card has a calibration for the Jev engine in use, every answer falls in the uncertain band, so its uncertain branch decides. Write that branch as if it will run every time.

## Good And Bad

Good:
- a code step that proves the agent opened the reference the skill routes to;
- a card asking whether the reply names the specific gap, with the judge as its uncertain branch;
- a prompt that applies real pressure and reads like a person wrote it.

Bad:
- matching words in the reply; the runner has no step for it;
- one check bundling the verdict, the route, and the tone;
- a criterion that demands an artifact the request never asked for;
- a prompt that says "for this test" or lists what a good answer contains.

## Validate

Run `validate` (see `runner-usage.md`) before any run. It rejects banned words, `expect_*` fields from the old format, unknown cards or steps, trees that loop or cannot finish, credential-looking evidence paths, `allowWrites: true`, and judge tools, and it names the scenario and the rule broken.

Complete when: the scenario file and any new cards exist in the skill's scenario directory, every check's criterion is one narrow question with its evidence named, and `validate` exits 0.
