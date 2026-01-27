# Template Inventory

Complete list of all templates available for scaffolding.

## Common Templates

### CLAUDE.md.template
Project-level AI assistant instructions. References cursor rules based on project type.

### agents.md.template
Agent-specific instructions referencing cursor rules and research-specialist guidance.

### gitignore.template
Comprehensive .gitignore covering:
- Node.js (node_modules, dist)
- Python (.venv, __pycache__, .egg-info)
- IDE files (.idea, .vscode)
- Environment files (.env, .dev.vars)
- Test/coverage artifacts
- Secrets (*.pem, *.key)

### config/wt.toml.template
Worktrunk configuration for worktree management:
- Post-start hooks for dependency installation
- Environment file copying
- Dev vars copying
- Tmp directory copying

## TypeScript Templates

### Single Package

| File | Purpose |
|------|---------|
| `biome.json` | Linter + formatter config with strict rules |
| `tsconfig.json` | Strict TypeScript configuration |
| `package.json.template` | Package manifest with dev dependencies |
| `vitest.config.ts.template` | Vitest test runner configuration (colocated unit tests) |

### Monorepo

| File | Purpose |
|------|---------|
| `biome.json` | Monorepo-aware biome config with overrides |
| `package.json.template` | Root workspace config with pnpm workspaces |
| `vitest.config.ts.template` | Root vitest configuration (colocated unit tests across packages) |
| `package-template/` | Template for new packages in monorepo |

## Python Templates

### Single Package

| File | Purpose |
|------|---------|
| `ruff.toml` | Ruff linter configuration with ALL rules |
| `pyrightconfig.json` | BasedPyright strict type checking |
| `pyproject.toml.template` | uv-managed project with dev dependencies |
| `conftest.py.template` | Pytest shared fixtures |

### Monorepo

| File | Purpose |
|------|---------|
| `ruff.toml` | Monorepo ruff config with FastAPI extensions |
| `pyrightconfig.json` | Monorepo paths and execution environments |
| `pyproject.toml.template` | uv workspace with members config |
| `conftest.py.template` | Root pytest shared fixtures for all packages |

## Testing Templates

### vitest-setup.ts.template
Vitest setup file that runs before each test file. Use for global mocks, extending expect, etc.

### vitest-browser.config.ts.template
Vitest browser mode configuration using Playwright provider.

### vitest-multiproject.config.ts.template
Multi-project vitest configuration supporting:
- **unit** - Colocated tests in src/**/*.test.ts
- **integration** - Separate tests/integration/**/*.test.ts
- **e2e** - Separate tests/e2e/**/*.test.ts with Playwright

### playwright.config.ts.template
Playwright E2E testing setup with:
- Chromium project
- Web server configuration
- HTML reporter
- Retry and trace settings

### Test Location Conventions

**Unit tests** (colocated with source):
```
src/
├── utils.ts
└── utils.test.ts       # Colocated unit test
packages/ts-core/src/
├── helpers.ts
└── helpers.test.ts     # Colocated in package
```

**Integration/E2E tests** (separate directories):
```
tests/
├── integration/        # Integration tests
│   └── api.test.ts
└── e2e/               # E2E tests
    └── login.test.ts
```

**Python test pattern** (colocated):
```
packages/py_core/
└── py_core/
    ├── models.py
    └── models_test.py  # Colocated with *_test.py suffix
```

## Cursor Templates

### rules/ts-rules.mdc
TypeScript coding standards:
- No `any` type
- Use `satisfies` over `as` casts
- Strict types everywhere
- Descriptive naming
- Zod schema derivation
- Biome/vitest tool commands

### rules/python-rules.mdc
Python coding standards:
- Import typing as `t`
- Pydantic v2 models
- pytest-mock for mocking
- Arrange/Act/Assert testing
- uv commands for linting/testing

### rules/monorepo-rules.mdc
Monorepo structure and boundaries:
- uv workspaces for Python
- pnpm workspaces for TypeScript
- Absolute imports only
- Project structure guidelines

### hooks/hooks.json
Cursor IDE hook configuration for afterFileEdit event.

### hooks/after-edit.sh.template
Post-edit hook script that runs:
- Biome check for TS/JS files
- TypeScript type checking
- Ruff + BasedPyright for Python files

## Claude Templates

### hooks/check.sh.template
PostToolUse hook for Claude Code:
- Biome check with auto-fix
- TypeScript type checking summary
- Ruff + BasedPyright for Python

### settings.local.json.template
Claude Code permissions template with common allowed commands:
- Git operations
- Package managers (pnpm, npm, uv)
- Linting tools (biome, ruff)
- Testing tools (vitest, pytest)
- File operations

## Monorepo Structure

### apps/.gitkeep
Placeholder for application projects.

### packages/.gitkeep
Placeholder for shared library packages.
- Python: `py_*` prefix
- TypeScript: `ts-*` or `ts_*` prefix

### services/.gitkeep
Placeholder for backend service projects.

## Linter Rule Details

### Biome Rules

Key rules enabled:
- `noExplicitAny`: error
- `noUnusedImports`: warn
- `noUnusedVariables`: warn
- `noNonNullAssertion`: error
- `useImportType`: warn (separatedType style)
- `noRestrictedImports`: error (blocks relative imports in monorepo)

### Ruff Rules

Configuration:
- `select = ['ALL']` - All rules enabled
- `line-length = 160`
- `indent-width = 4`
- Import conventions: numpy=np, pyarrow=pa, typing=t
- Banned from imports: typing (must use `import typing as t`)

### BasedPyright Rules

Strict mode with:
- `typeCheckingMode`: strict
- `pythonVersion`: 3.12
- All report* flags set to error/warning
- Import cycle detection
- Unused code detection
