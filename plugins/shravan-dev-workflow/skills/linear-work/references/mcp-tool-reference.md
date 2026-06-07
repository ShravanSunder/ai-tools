# Linear MCP Tool Reference

All tools are prefixed `mcp__plugin_linear_linear__`. This reference covers parameters, response shapes, and common usage patterns.

## Issues

### list_issues

Search and filter issues. Returns paginated results.

**Key parameters:**

| Parameter | Type | Notes |
|-----------|------|-------|
| `project` | string | Project name, ID, or slug |
| `team` | string | Team name or ID |
| `assignee` | string | User ID, name, email, or `"me"`. Use `"null"` for unassigned |
| `state` | string | State type (`backlog`, `unstarted`, `started`, `completed`, `canceled`), name, or ID |
| `label` | string | Label name or ID |
| `priority` | number | 0=None, 1=Urgent, 2=High, 3=Normal, 4=Low |
| `query` | string | Search title or description text |
| `limit` | number | Max 250, default 50 |
| `cursor` | string | Pagination cursor from previous response |
| `orderBy` | string | `createdAt` or `updatedAt` (default) |
| `includeArchived` | boolean | Default true |

**Common patterns:**

```
# All issues in a project
list_issues(project: "My Project")

# Unblocked ready work
list_issues(project: "My Project", state: "Ready")

# My assigned issues
list_issues(assignee: "me", project: "My Project")

# Search by keyword
list_issues(query: "RPC router", project: "My Project")
```

### get_issue

Retrieve full issue details including attachments and git branch name.

**Parameters:**

| Parameter | Type | Notes |
|-----------|------|-------|
| `id` | string | Issue ID or identifier (e.g., `LUNA-336`) |
| `includeRelations` | boolean | Include blocking/related/duplicate relations (default false) |

**Response shape (key fields):**

```json
{
  "id": "uuid",
  "identifier": "LUNA-336",
  "title": "...",
  "description": "markdown content",
  "status": "Ready",
  "url": "https://linear.app/...",
  "gitBranchName": "feature/luna-336",
  "projectMilestone": { "id": "...", "name": "Bridge Infrastructure" },
  "project": "Project Name",
  "team": "Team Name",
  "relations": {
    "blocks": [{ "id": "...", "identifier": "LUNA-337", "title": "..." }],
    "blockedBy": [{ "id": "...", "identifier": "LUNA-335", "title": "..." }],
    "relatedTo": [],
    "duplicateOf": null
  }
}
```

Always use `includeRelations: true` when checking dependency status.

### create_issue

Create a new issue. Supports setting dependencies at creation time.

**Required:** `title`, `team`

**Key parameters:**

| Parameter | Type | Notes |
|-----------|------|-------|
| `title` | string | Issue title |
| `team` | string | Team name or ID |
| `description` | string | Markdown content |
| `project` | string | Project name, ID, or slug |
| `milestone` | string | Milestone name or ID |
| `state` | string | State type, name, or ID |
| `priority` | number | 0=None, 1=Urgent, 2=High, 3=Normal, 4=Low |
| `assignee` | string | User ID, name, email, or `"me"` |
| `labels` | string[] | Label names or IDs |
| `blockedBy` | string[] | Issue IDs/identifiers blocking this |
| `blocks` | string[] | Issue IDs/identifiers this blocks |
| `relatedTo` | string[] | Related issue IDs/identifiers |
| `links` | object[] | `[{url, title}]` — link attachments |
| `estimate` | number | Points estimate |
| `dueDate` | string | ISO format date |

**Pattern — create with dependencies and doc links:**

```
create_issue(
  title: "JSON-RPC command channel",
  team: "Product Engineering",
  project: "My Project",
  milestone: "Bridge Infrastructure",
  state: "Backlog",
  priority: 3,
  blockedBy: ["LUNA-335"],
  blocks: ["LUNA-337"],
  description: "markdown with scope, doc refs, checklists..."
)
```

### update_issue

Update any field on an existing issue.

**Required:** `id` (issue ID or identifier)

All other parameters are the same as `create_issue`. Only pass fields to change — omitted fields are unchanged.

**CRITICAL WARNING:** `blockedBy` and `blocks` arrays **replace** the entire relation list. Omit them to keep existing relations unchanged. To add a single relation, use the CLI instead (see cli-reference.md).

**Pattern — update status:**
```
update_issue(id: "LUNA-336", state: "In Progress")
```

**Pattern — update description:**
```
update_issue(id: "LUNA-336", description: "updated markdown...")
```

**Pattern — move to different milestone:**
```
update_issue(id: "LUNA-336", milestone: "New Milestone Name")
```

## Projects

### list_projects

List projects in the workspace. No required parameters.

**Key parameters:** `limit`, `cursor`, `orderBy`, `includeArchived`

### get_project

Get project details with optional includes.

**Parameters:**

| Parameter | Type | Notes |
|-----------|------|-------|
| `query` | string | Project name, ID, or slug |
| `includeMilestones` | boolean | Include milestone list |
| `includeMembers` | boolean | Include project members |
| `includeResources` | boolean | Include documents, links, attachments |

**Pattern — project overview with milestones:**
```
get_project(query: "My Project", includeMilestones: true)
```

### save_project

Create or update a project. Pass `id` to update; omit to create.

**Key parameters (create):** `name` (required), `team` (required), `description`, `startDate`, `targetDate`, `priority`, `state`

**Pattern — create project:**
```
save_project(
  name: "AgentStudio Bridge & Diff Viewer",
  team: "Product Engineering",
  description: "...",
  priority: 2
)
```

## Milestones

Milestones belong to projects. They represent conceptual phases.

### list_milestones

**Required:** `project` (name, ID, or slug)

### get_milestone

**Required:** `project`, `query` (milestone name or ID)

### create_milestone

**Required:** `project`, `name`

**Optional:** `description`, `targetDate` (ISO format)

**Pattern:**
```
create_milestone(
  project: "My Project",
  name: "Bridge Infrastructure",
  description: "Transport layer, push pipeline, RPC router"
)
```

### update_milestone

**Required:** `project`, `id` (milestone name or ID)

**Optional:** `name`, `description`, `targetDate` (ISO or null to remove)

## Teams and Users

### list_teams

No required parameters. Returns all teams with IDs and names.

### list_users

No required parameters. Optional `limit`, `cursor`.

### get_user

**Required:** `id` (user ID, name, email, or `"me"`)

## Other Useful Tools

### list_issue_statuses

**Required:** `team` — returns workflow states for that team. Useful to discover valid state names before creating/updating issues.

### list_issue_labels / create_issue_label

List existing labels or create new ones. Labels can be workspace-wide or team-scoped.

### list_comments / create_comment

Read or add comments on issues. `create_comment` requires `issueId` and `body` (markdown).

### search_documentation

Search Linear docs. Parameter: `query` string.
