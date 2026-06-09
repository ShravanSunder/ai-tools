# Shravan Dev Workflow skill renames

## Summary

- Plugin: `shravan-dev-workflow`
- Version: `1.6.1`
- Change type: skill rename cleanup

## User-visible changes

- Renamed `maintain-docs` to `docs-maintain`.
- Renamed `spec-adversarial-council-design` to `spec-review-council`.
- Renamed `security-scan-router` to `security-router`.
- Renamed `plan-validate-execute` to `plan-execute`.
- Renamed `implementation-subagent-review` to `implementation-review-swarm`.
- Left `grill-interview` unchanged pending a separate design discussion.

## Security router clarification

`security-router` is security-primary routing, not a general review lane. It sends explicit security scan, audit, threat-model, diff-scan, or one-finding remediation requests to the installed official Codex Security plugin skills, and normal plan or implementation review still owns lightweight security concerns inside those workflows.

## Manifests touched

- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`

## Validation

- `claude plugin validate .`: passed.
- `codex plugin add shravan-dev-workflow@ai-tools --json`: refreshed installed Codex cache to `1.6.1`.
- `codex plugin list --marketplace ai-tools --available --json`: confirmed `shravan-dev-workflow` installed and enabled at `1.6.1`.
- `rg` stale-name scan across active docs/manifests/plugin files: no old skill names remain outside historical changelog entries.
