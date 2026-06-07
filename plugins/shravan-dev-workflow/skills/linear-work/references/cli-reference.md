# Linear CLI Reference

The Linear CLI (`linear`, v1.10.0) fills three gaps that the MCP tools cannot handle: surgical relation management, deletion, and issue start.

## Installation

```bash
# Verify installation
linear --version
```

## Relation Management

The primary reason to use the CLI. The CLI adds or removes individual relations surgically. See the CRITICAL WARNING in `mcp-tool-reference.md` regarding `update_issue` relation replacement.

### Add a relation

```bash
linear issue relation add <issueId> <relationType> <relatedIssueId>
```

**Relation types:** `blocks`, `blocked-by`, `related`, `duplicate`

**Examples:**

```bash
# LUNA-336 is blocked by LUNA-335
linear issue relation add LUNA-336 blocked-by LUNA-335

# LUNA-336 blocks LUNA-337
linear issue relation add LUNA-336 blocks LUNA-337

# Mark as related (no dependency direction)
linear issue relation add LUNA-336 related LUNA-340

# Mark as duplicate
linear issue relation add LUNA-341 duplicate LUNA-336
```

### Remove a relation

```bash
linear issue relation delete <issueId> <relationType> <relatedIssueId>
```

**Example:**

```bash
# Remove the blocks relation
linear issue relation delete LUNA-336 blocks LUNA-337
```

### List relations

```bash
linear issue relation list <issueId>
```

Lists all relations (blocks, blocked-by, related, duplicate) for an issue.

## Deletion

### Delete an issue

```bash
linear issue delete <issueId>
```

Not available via MCP. Use when cleaning up duplicate or obsolete tickets.

### Delete a milestone

```bash
linear milestone delete <milestoneId>
```

Not available via MCP. Issues in the milestone are NOT deleted — they become milestone-less.

## Issue Start

Creates a git branch and sets the issue to "In Progress":

```bash
linear issue start <issueId>
```

Branch name follows Linear's convention (e.g., `feature/luna-336`). Useful when beginning implementation on a specific ticket.

## Other Useful CLI Commands

### View issue details (text output)

```bash
linear issue view <issueId>
# or open in browser
linear issue view <issueId> --open
```

### Create issue from file

```bash
linear issue create \
  --title "Issue title" \
  --team "Product Engineering" \
  --project "My Project" \
  --description-file ./description.md \
  --label "feature" \
  --priority 3 \
  --state "Backlog" \
  --no-interactive
```

The `--description-file` flag is useful for long markdown descriptions. The `--no-interactive` flag prevents prompts.

### Issue URL

```bash
linear issue url <issueId>
# prints: https://linear.app/workspace/issue/LUNA-336/...
```

### Create PR from issue

```bash
linear issue pr <issueId>
```

Creates a GitHub pull request with the issue title and Linear-issue trailer.

## Workspace Targeting

All commands support `--workspace <slug>` to target a specific workspace if multiple are configured.

## Configuration

```bash
# Interactive config setup (creates .linear.toml)
linear config

# Check auth status
linear auth status
```
