# orchestrated plan uses ignored project tmp

scenario_id: plan-implementation-orchestrated-plan-uses-project-tmp
skill_under_test: shravan-dev-workflow:plan-implementation
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:plan-implementation

An orchestrator-goal delivery supplies `requested terminal: pr-ready-unmerged`. Describe the exact plan-home setup for a project whose `.gitignore` does not cover `tmp/*`. This scenario is read-only.

## Expected Compliant Behavior

- Resolves the project root, adds `tmp/*` to project `.gitignore` before plan creation when writes are allowed, and chooses one `tmp/plan-workflows/<date>-<slug>.md` path.
- Does not use `.git/info/exclude`, checked-in docs, or a user-global plan home.
- Names the withheld writes because this scenario is read-only.

## Failure Signals

- Treats missing ignore coverage as an approval blocker.
- Uses Git-local exclusions or OS temp for the implementation plan.
- Creates multiple plan authorities.
