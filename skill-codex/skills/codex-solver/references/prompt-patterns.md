# Codex Prompt Patterns

Complete prompt templates for common Codex tasks. Copy and adapt these.

## Pattern 1: Codebase Exploration

**When:** Need to understand unfamiliar code area before making changes.

**Effort:** `low` (broad search)

```
You are managing a Codex task for Claude. Use the mcp__codex__codex tool.

TASK: Explore and document {area} of the codebase

CODEX CONFIGURATION:
- model: gpt-5.2
- sandbox: workspace-write
- approval-policy: untrusted
- cwd: {project_path}
- config: {"model_reasoning_effort": "low"}

DEVELOPER INSTRUCTIONS:
"""
OUTPUT RULES - FOLLOW EXACTLY:
1. NEVER modify any source code files
2. Write ALL findings to /tmp/codex-analysis/explore-{area}-{timestamp}/

Create:
- /tmp/codex-analysis/explore-{area}-{timestamp}/summary.md - Overview
- /tmp/codex-analysis/explore-{area}-{timestamp}/architecture.md - How components connect
- /tmp/codex-analysis/explore-{area}-{timestamp}/key-files.md - Important files with purposes
- /tmp/codex-analysis/explore-{area}-{timestamp}/data-flow.md - How data moves
"""

PROMPT:
Explore {area} in this codebase:
- Map the architecture and component relationships
- Identify entry points and key abstractions
- Document data flow patterns
- Note any unusual patterns or potential issues

Focus on: {specific_questions}

After Codex completes, report back with summary and file paths.
```

## Pattern 2: Claude is Stuck (Debug/Problem Solving)

**When:** Claude has tried 2+ approaches without success.

**Effort:** `high` (maximum reasoning)

```
You are managing a Codex task for Claude. Use the mcp__codex__codex tool.

TASK: Solve problem that Claude couldn't crack

CODEX CONFIGURATION:
- model: gpt-5.2
- sandbox: workspace-write
- approval-policy: untrusted
- cwd: {project_path}
- config: {"model_reasoning_effort": "high"}

DEVELOPER INSTRUCTIONS:
"""
OUTPUT RULES - FOLLOW EXACTLY:
1. NEVER modify any source code files
2. Write ALL findings to /tmp/codex-analysis/stuck-{problem}-{timestamp}/

Create:
- /tmp/codex-analysis/stuck-{problem}-{timestamp}/summary.md - Solution overview
- /tmp/codex-analysis/stuck-{problem}-{timestamp}/analysis.md - Problem breakdown
- /tmp/codex-analysis/stuck-{problem}-{timestamp}/solution.md - Proposed fix with code
- /tmp/codex-analysis/stuck-{problem}-{timestamp}/alternatives.md - Other approaches considered
"""

PROMPT:
Claude is stuck on: {problem_description}

What Claude already tried:
{list_of_attempts}

Why those didn't work:
{failure_reasons}

Constraints:
{constraints}

Your task:
1. Analyze the problem fresh - don't assume Claude's approach was correct
2. Look for what Claude might have missed
3. Consider alternative angles
4. Propose a solution with specific code changes

After Codex completes, report back with summary and file paths.
```

## Pattern 3: Code Review (Subsection)

**When:** Need thorough review of specific code area.

**Effort:** `medium` (systematic analysis)

```
You are managing a Codex task for Claude. Use the mcp__codex__codex tool.

TASK: Review {area} for issues and improvements

CODEX CONFIGURATION:
- model: gpt-5.2
- sandbox: workspace-write
- approval-policy: untrusted
- cwd: {project_path}
- config: {"model_reasoning_effort": "medium"}

DEVELOPER INSTRUCTIONS:
"""
OUTPUT RULES - FOLLOW EXACTLY:
1. NEVER modify any source code files
2. Write ALL findings to /tmp/codex-analysis/review-{area}-{timestamp}/

Create:
- /tmp/codex-analysis/review-{area}-{timestamp}/summary.md - Key findings
- /tmp/codex-analysis/review-{area}-{timestamp}/issues.md - Problems found (severity rated)
- /tmp/codex-analysis/review-{area}-{timestamp}/security.md - Security concerns
- /tmp/codex-analysis/review-{area}-{timestamp}/improvements.md - Suggested improvements
"""

PROMPT:
Review {files_or_directory} for:

1. **Bugs & Edge Cases**
   - Null/undefined handling
   - Boundary conditions
   - Error scenarios

2. **Security**
   - Input validation
   - Auth/authz issues
   - Data exposure

3. **Performance**
   - N+1 queries
   - Memory leaks
   - Unnecessary computation

4. **Maintainability**
   - Code clarity
   - Documentation gaps
   - Test coverage

Context: {what_this_code_does}
Recent changes: {if_applicable}

After Codex completes, report back with summary and file paths.
```

## Pattern 4: Architecture Design

**When:** Need to design new system component or major refactor.

**Effort:** `high` (complex trade-offs)

```
You are managing a Codex task for Claude. Use the mcp__codex__codex tool.

TASK: Design {component/system}

CODEX CONFIGURATION:
- model: gpt-5.2
- sandbox: workspace-write
- approval-policy: untrusted
- cwd: {project_path}
- config: {"model_reasoning_effort": "high"}

DEVELOPER INSTRUCTIONS:
"""
OUTPUT RULES - FOLLOW EXACTLY:
1. NEVER modify any source code files
2. Write ALL findings to /tmp/codex-analysis/design-{component}-{timestamp}/

Create:
- /tmp/codex-analysis/design-{component}-{timestamp}/summary.md - Design overview
- /tmp/codex-analysis/design-{component}-{timestamp}/architecture.md - Detailed design
- /tmp/codex-analysis/design-{component}-{timestamp}/tradeoffs.md - Options considered
- /tmp/codex-analysis/design-{component}-{timestamp}/implementation.md - How to build it
- /tmp/codex-analysis/design-{component}-{timestamp}/files.md - File structure
"""

PROMPT:
Design {what_to_build}

Requirements:
- Functional: {functional_requirements}
- Non-functional: {performance_scale_etc}
- Constraints: {must_integrate_with}

Existing patterns to follow:
- {reference_existing_code_patterns}

Questions to answer:
1. What's the recommended architecture?
2. What are the key abstractions?
3. How does it integrate with existing code?
4. What are the trade-offs of this approach?
5. What's the implementation order?

After Codex completes, report back with summary and file paths.
```

## Pattern 5: Dependency/Impact Analysis

**When:** Need to understand what a change will affect.

**Effort:** `medium` (trace dependencies)

```
You are managing a Codex task for Claude. Use the mcp__codex__codex tool.

TASK: Analyze impact of changing {component}

CODEX CONFIGURATION:
- model: gpt-5.2
- sandbox: workspace-write
- approval-policy: untrusted
- cwd: {project_path}
- config: {"model_reasoning_effort": "medium"}

DEVELOPER INSTRUCTIONS:
"""
OUTPUT RULES - FOLLOW EXACTLY:
1. NEVER modify any source code files
2. Write ALL findings to /tmp/codex-analysis/impact-{component}-{timestamp}/

Create:
- /tmp/codex-analysis/impact-{component}-{timestamp}/summary.md - Impact overview
- /tmp/codex-analysis/impact-{component}-{timestamp}/dependents.md - What uses this
- /tmp/codex-analysis/impact-{component}-{timestamp}/dependencies.md - What this uses
- /tmp/codex-analysis/impact-{component}-{timestamp}/risks.md - Breaking change risks
"""

PROMPT:
Analyze the impact of modifying {component/file/function}

Proposed change: {description_of_change}

Find:
1. All code that calls/uses this
2. All code this depends on
3. Test files that cover this
4. Configuration that references this
5. Breaking change risks

After Codex completes, report back with summary and file paths.
```

## Prompt Writing Tips

1. **Be specific about output files** - Codex follows file creation instructions well
2. **List what Claude tried** - Prevents Codex from repeating failed approaches
3. **Include constraints** - Codex respects boundaries when told
4. **Ask specific questions** - Gets more focused analysis
5. **Reference existing patterns** - Codex will follow them
