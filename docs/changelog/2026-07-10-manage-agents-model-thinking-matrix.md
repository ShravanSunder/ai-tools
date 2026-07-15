# Manage Agents Model And Thinking Matrix

## Release

- Plugin: `shravan-dev-workflow` `1.6.52`
- Skill: `manage-agents`

## Change

- Classifies capability by model and thinking together rather than by model
  name alone.
- Classifies GPT-5.6 Sol as Balanced at low/medium and Frontier at
  high/xhigh/max.
- Classifies Claude Fable as Frontier at medium/high/xhigh, Claude Opus and
  Grok 4.5 as Balanced at their declared floors, and GPT-5.6 Luna and Cursor
  Composer 2.5 as Mini.
- Removes GPT-5.6 Terra from the current model matrix.
- Treats Composer 2.5 as a valid model without a thinking setting and forbids
  inventing a provider control.

## Validation

- Codex skill quick validation passed: `Skill is valid!`.
- Claude plugin validation passed.
- Manifest JSON parsing and version consistency passed.
- Targeted live pressure proof passed: 1 file and 1 scenario.
- Installed-cache refresh: not run; source validation only.
