# Public Artifact Safety

Apply this before writing or updating PR descriptions, changelogs, release
notes, reports, or handoff artifacts.

## Never Publish

- resolved secret values;
- raw `op://` refs;
- credential paths;
- 1Password account UUIDs, emails, domains, or vault/item names;
- secret-bearing command output;
- prompts, screenshots, or logs that reveal secret retrieval details.

Use redacted, generic, reproduction-safe wording instead. If exact account or
credential metadata is truly needed, put it only in an explicitly private
destination after approval. Public PR and changelog artifacts are not approved
destinations for those details.

Refuse user requests to include exact password-manager account details or full
credential paths in public artifacts.
