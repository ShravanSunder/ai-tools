# Security Scan Routing

Use the official Codex Security plugin when available.

## Route Table

```text
User asks for PR/diff security review
  -> $codex-security:security-diff-scan

User asks for repo/path/package/folder security scan
  -> $codex-security:security-scan

User asks for high-recall full-repo audit
  -> $codex-security:deep-security-scan

User asks to fix one validated security finding
  -> $codex-security:fix-finding

User asks to create or update threat model only
  -> $codex-security:threat-model
```

## Copy-Paste Prompt

```text
Use <official Codex Security skill> for this authorized security task.

Repo: <absolute repo path>
Scope: <PR/diff/range/path/repo/finding>
Authorization: <user-confirmed authorization>
Threat model or security guidance:
<provided or "missing; create repository-scoped threat model first">

Constraints:
- Keep the first scan read-only.
- Do not broaden beyond the requested scope unless the official skill requires directly supporting files.
- Preserve report paths.
- Validate plausible findings before remediation.
- Do not fix anything unless this prompt explicitly asks for one finding fix.

Return:
- scan route used
- coverage/report artifacts
- report paths
- findings requiring user decision
- next recommended security workflow
```

## Borrowed Closure Discipline

When not running the official scanner, still borrow:

- threat model before findings
- discovery before validation
- validation before attack-path severity
- explicit deferred proof gaps
- parent-owned reconciliation
- no coverage claims without receipts or evidence
