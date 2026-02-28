# OXC Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete the Biome-to-OXC migration across the ai-tools ecosystem -- the scaffold plugin templates are done, now apply the same OXC standard to any repos that were previously scaffolded with Biome.

**Architecture:** The `ai-scaffold` plugin templates have been updated to generate `.oxlintrc.json` + `.oxfmtrc.json` instead of `biome.json`. This plan covers applying that same OXC configuration to existing repos (like `relay-codebase-mcp`) that still use Biome, plus bumping the plugin version.

**Tech Stack:** oxlint (stable, v1.0+), oxfmt (beta, Prettier-compatible), oxlint-tsgolint (type-aware linting)

---

## Context: What Was Already Done (ai-scaffold plugin)

The scaffold plugin at `~/dev/ai-tools/plugins/ai-scaffold` has been fully migrated:

- **Created** 4 new OXC config templates (single + monorepo, lint + format)
- **Deleted** 2 old Biome config templates
- **Updated** 11 files: scaffold script, package templates, hook templates, permissions, all docs
- **Verified** both `single-ts` and `monorepo-ts` scaffold outputs produce correct OXC configs with zero Biome references

### The OXC Configuration Standard

This is the reference configuration that all scaffolded TS projects now use. Any repo migration should match this.

#### Severity Strategy

| Category | Severity | Rationale |
|----------|----------|-----------|
| correctness | error | Definitely wrong code -- block CI |
| suspicious | warn | Likely wrong, some auto-fixable |
| style | **off** | Too many noisy rules (197 total); enable specific style rules individually |
| perf | warn | Performance advisory |
| pedantic | off | Too noisy for most projects |
| restriction | off | Overly restrictive, not needed |
| nursery | off | Unstable rules, enable selectively |

#### Rule Overrides (surgical, on top of categories)

**Blocking rules (error, require manual fix):**
- `typescript/no-explicit-any`
- `typescript/no-non-null-assertion`
- `no-param-reassign`
- `no-void` (with `allowAsStatement: true`)
- `typescript/explicit-function-return-type` (with expression/HOF/typed-expression exceptions)
- `typescript/no-floating-promises` (type-aware, `ignoreVoid: true`)
- `typescript/await-thenable` (type-aware)

**Auto-fixable rules (warn, fix on save):**
- `no-console`
- `prefer-const`
- `typescript/consistent-type-imports` (prefer type-imports, separate style)
- `typescript/no-unused-vars` (ignore `_` prefixed)
- `typescript/no-unsafe-assignment` (type-aware)
- `typescript/no-unsafe-return` (type-aware)
- `typescript/no-unsafe-call` (type-aware)

**Monorepo-only additions:**
- `import/no-cycle`: error
- `react` plugin enabled
- Overrides for `**/*.gen.ts` and `**/__generated__/**` (disable strict rules)

#### Oxfmt Configuration

```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": true,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "sortImports": { "enabled": true },
  "sortPackageJson": { "enabled": true }
}
```

#### Package.json Scripts Standard

```json
{
  "lint": "oxlint",
  "lint:fix": "oxlint --fix",
  "lint:types": "oxlint --type-aware",
    "fmt": "oxfmt .",
    "fmt:check": "oxfmt --check .",
    "typecheck": "tsc --noEmit",
    "check": "oxlint --type-aware && oxfmt --check . && tsc --noEmit"
}
```

#### Hook Pattern (Cursor + Claude)

On file edit:
1. Run `oxlint --fix <file>` for auto-fixable lint issues
2. Run `oxfmt <file>` for formatting
3. If errors remain, parse `oxlint -f json` output and emit concise hint via stderr
4. Type-aware rules (`--type-aware`) are NOT run per-edit (too slow), only in explicit scripts/CI

---

## Task 1: Bump ai-scaffold Plugin Version

**Files:**
- Modify: `plugins/ai-scaffold/.claude-plugin/plugin.json`

**Step 1: Bump version**

Change `"version": "0.1.1"` to `"version": "0.2.0"` to reflect the Biome-to-OXC breaking change in generated output.

```json
{
  "name": "scaffold-project",
  "version": "0.2.0",
  "description": "Scaffold new projects or retrofit existing ones with standard dev configs (linters, rules, hooks, testing)",
  "author": {
    "name": "Shravan Sunder"
  },
  "keywords": ["scaffolding", "project-setup", "linting", "oxlint", "oxfmt", "oxc", "ruff", "swiftlint", "swiftformat", "typescript", "python", "swift", "swiftui"]
}
```

**Step 2: Verify plugin validates**

Run: `claude plugin validate ~/dev/ai-tools`
Expected: passes validation

**Step 3: Commit**

```bash
cd ~/dev/ai-tools
git add plugins/ai-scaffold/
git commit -m "feat(ai-scaffold): migrate TS templates from Biome to OXC (oxlint + oxfmt)

- Replace biome.json templates with .oxlintrc.json + .oxfmtrc.json
- Strict category defaults: correctness=error, suspicious/style/perf=warn
- Type-aware rules: no-floating-promises, await-thenable (error)
- Auto-fixable rules set to warn for fix-on-save UX
- Update hooks to use oxlint --fix + oxfmt
- Update all docs, skills, command references
- BREAKING: generated TS projects now use oxlint/oxfmt instead of biome"
```

---

## Task 2: Migrate relay-codebase-mcp from Biome to OXC

This task migrates `~/dev/relay-ai-tools/relay-codebase-mcp` which currently uses Biome.

**Files:**
- Delete: `relay-codebase-mcp/biome.json`
- Create: `relay-codebase-mcp/.oxlintrc.json`
- Create: `relay-codebase-mcp/.oxfmtrc.json`
- Modify: `relay-codebase-mcp/package.json`
- Modify: `relay-codebase-mcp/.claude/settings.json` (if it has Biome hooks)
- Modify: `relay-codebase-mcp/AGENTS.md` (if it references Biome)
- Modify: `relay-codebase-mcp/.cursor/rules/ts-rules.md` (if it references Biome)

**Step 1: Read current biome.json to understand existing rules**

Run: `cat ~/dev/relay-ai-tools/relay-codebase-mcp/biome.json`

Note which rules are enabled and their severities. Map them to OXC equivalents.

**Step 2: Install OXC dependencies**

Run: `cd ~/dev/relay-ai-tools/relay-codebase-mcp && pnpm add -D oxlint oxfmt`

If type-aware linting is desired: `pnpm add -D oxlint-tsgolint`

**Step 3: Remove Biome**

Run: `pnpm remove @biomejs/biome`

**Step 4: Delete biome.json**

Run: `rm relay-codebase-mcp/biome.json`

**Step 5: Create .oxlintrc.json**

Use the single-package template from `~/dev/ai-tools/plugins/ai-scaffold/templates/typescript/single/.oxlintrc.json` as the baseline. Adjust plugins if the project uses React (add `"react"` plugin) or not.

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["typescript", "unicorn", "oxc", "import"],
  "categories": {
    "correctness": "error",
    "suspicious": "warn",
    "style": "warn",
    "perf": "warn",
    "pedantic": "off",
    "restriction": "off",
    "nursery": "off"
  },
  "rules": {
    "typescript/no-explicit-any": "error",
    "typescript/no-non-null-assertion": "error",
    "no-param-reassign": "error",
    "no-void": ["error", { "allowAsStatement": true }],

    "no-console": "warn",
    "prefer-const": "warn",
    "typescript/consistent-type-imports": ["warn", {
      "prefer": "type-imports",
      "disallowTypeAnnotations": false,
      "fixStyle": "separate-type-imports"
    }],
    "typescript/no-unused-vars": ["warn", {
      "argsIgnorePattern": "^_",
      "destructuredArrayIgnorePattern": "^_",
      "varsIgnorePattern": "^_"
    }],
    "typescript/explicit-function-return-type": ["error", {
      "allowExpressions": true,
      "allowTypedFunctionExpressions": true,
      "allowDirectConstAssertionInArrowFunctions": true,
      "allowHigherOrderFunctions": true
    }],

    "typescript/no-floating-promises": ["error", { "ignoreVoid": true }],
    "typescript/await-thenable": "error",
    "typescript/no-unsafe-assignment": "warn",
    "typescript/no-unsafe-return": "warn",
    "typescript/no-unsafe-call": "warn"
  },
  "ignorePatterns": ["dist", "build", "coverage", "node_modules"]
}
```

**Step 6: Create .oxfmtrc.json**

```json
{
  "$schema": "./node_modules/oxfmt/configuration_schema.json",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": true,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "sortImports": {
    "enabled": true
  },
  "sortPackageJson": {
    "enabled": true
  },
  "ignorePatterns": ["dist", "build", "coverage", "node_modules"]
}
```

**Step 7: Update package.json scripts**

Replace any `biome check` / `biome check --fix` scripts with:

```json
{
  "lint": "oxlint",
  "lint:fix": "oxlint --fix",
  "lint:types": "oxlint --type-aware",
    "fmt": "oxfmt .",
    "fmt:check": "oxfmt --check .",
    "typecheck": "tsc --noEmit",
    "check": "oxlint --type-aware && oxfmt --check . && tsc --noEmit"
}
```

Keep existing non-lint scripts (dev, build, start, test, etc.) unchanged.

**Step 8: Run formatter to reformat all source files**

Run: `pnpm fmt`

This will reformat everything to the new oxfmt standard. Review the diff -- it should be formatting-only changes.

**Step 9: Run lint fix to auto-fix lint issues**

Run: `pnpm lint:fix`

Review remaining warnings/errors. Fix any blocking errors manually.

**Step 10: Update docs referencing Biome**

Search for Biome references:
```bash
rg -i 'biome|@biomejs' relay-codebase-mcp/
```

Update each file found:
- `AGENTS.md` / `CLAUDE.md`: replace `biome check` commands with `oxlint` / `oxfmt`
- `.cursor/rules/ts-rules.md`: replace tool commands
- `.claude/settings.json`: replace `Bash(biome *)` with `Bash(oxlint *)` and `Bash(oxfmt *)`

**Step 11: Verify everything passes**

Run each and confirm exit code 0:
```bash
pnpm lint
pnpm fmt:check
pnpm typecheck
pnpm test
```

If `pnpm lint` reports type-aware errors from `--type-aware`, run `pnpm lint:types` separately to see them. The base `pnpm lint` (without `--type-aware`) should pass cleanly.

**Step 12: Commit**

```bash
cd ~/dev/relay-ai-tools
git add relay-codebase-mcp/
git commit -m "feat(relay-codebase-mcp): migrate from Biome to OXC (oxlint + oxfmt)

- Replace biome.json with .oxlintrc.json + .oxfmtrc.json
- Strict category defaults with type-aware rules
- Update package.json scripts, docs, and hooks
- Reformat codebase with oxfmt"
```

---

## Task 3: Verify No Biome References Remain Across Both Repos

**Step 1: Sweep ai-tools**

Run: `cd ~/dev/ai-tools && rg -i 'biome|@biomejs' --glob '!node_modules' --glob '!.git'`
Expected: zero matches (already verified, but double-check after version bump commit)

**Step 2: Sweep relay-ai-tools/relay-codebase-mcp**

Run: `cd ~/dev/relay-ai-tools && rg -i 'biome|@biomejs' relay-codebase-mcp/ --glob '!node_modules' --glob '!.git'`
Expected: zero matches

**Step 3: Commit any stragglers**

If any references found, fix and amend the previous commit.

---

## Troubleshooting Reference

### Type-aware linting fails or is too slow

The `--type-aware` flag requires `oxlint-tsgolint` and a valid `tsconfig.json`. If it fails:

1. Check `tsconfig.json` exists and is valid
2. Ensure `oxlint-tsgolint` is installed: `pnpm add -D oxlint-tsgolint`
3. If still failing, fall back: change `typecheck` script to `tsc --noEmit` and remove `--type-aware` from `check`

### Oxfmt formatting differs from Biome

Expected -- oxfmt is Prettier-compatible, Biome is not. The initial `pnpm fmt` run will produce a formatting diff. Review it once, commit it, and move on.

### Hook JSON parsing breaks

Oxlint JSON output (`-f json`) has a different schema than Biome's `--reporter=json`. The hooks in the scaffold templates have already been updated to parse the oxlint format. If a hook in an existing project still uses the old Biome parsing, replace the case block with the pattern from `~/dev/ai-tools/plugins/ai-scaffold/templates/claude/hooks/check.sh.template`.

### Import sorting conflicts

Oxfmt has built-in import sorting (`sortImports.enabled: true`). If the project also uses oxlint import rules, they should be complementary. If conflicts arise, disable oxfmt import sorting and let oxlint handle it via `--fix`.
