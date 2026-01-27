---
alwaysApply: true
---
# Python Rules

## Types

- Always import typing as `t` for all type hints, e.g. `t.List[int]`. Examples:
  - `t.List[int]` is preferred over `list[int]`
  - `t.Dict[str, t.Any]` is preferred over `dict[str, Any]`
  - Avoid raw `list` or `dict`; prefer narrow generics or pydantic models
  - DO NOT import in a function or class, only at the top level of the file.
- Use Python 3.12 annotations everywhere.
- Use 3.12 generics or 3.13 typing_extensions generics.
- Don't use `__future__` imports unless requested.
- Prefer `| None` over `t.Optional`
- For functions with >3 parameters, define an adjacent props dataclass named `<FuncName>Props`
- Discriminant unions do not need casts or isinstance checks for type safety & resolution

### Type Error Nuances

- If it's a library: `# pyright: ignore[reportUnknownVariableType]` and specifying the type hint is necessary
- Never use `# type: ignore`
- Never use `# pyright: ignore` without specifying rules to ignore

## Data Models

- Use **Pydantic v2** exclusively for schemas
- Configure models with `mode_config` and `ConfigDict` (do **not** use `class Config`)
- Avoid `TypeDict`, `dataclass`, `NamedTuple`, plain `dict` / `list` unless a library demands them
- Prefer timezone aware datetime objects

## Formatting

- Indent code with 4 spaces
- Follow `ruff` and `black` defaults where they don't conflict with these rules
- Always use `dedent` to format multi-line f-strings
- Prefer f-strings over `str.format` or jinja2 templates

## Libraries

- Prefer **pyarrow** and batch / stream processing utilities
- Use pandas only when unavoidable (e.g. third-party API returns DataFrame)

## Testing

### Test Setup

- Test framework: **pytest**; run using `uv run pytest`
- Colocate tests next to source with a `_test.py` suffix
- DO use **pytest-mock** for mocking dependencies cleanly. Do NOT use `unittest.mock`.
- Put factories and mocks factories under the package/service `tests` folder
- Only integration tests are in `./tests/integration` folder

### Test Quality

- Follow *Arrange / Act / Assert* comments to structure tests
- *Quality over quantity* means: cover critical paths with concise, readable tests; avoid redundant, brittle cases
  - Tests should be minimal, valuable and easy to maintain
  - Make sure to focus on testing business logic
  - Make sure to test critical paths
- Never create temporary test files
  - Use proper unit tests in existing test suite, not throwaway scripts
  - All verification should be part of permanent test suite

### Testing Pyramid

- More concise, easy to debug, valuable unit tests
- Fewer integration tests that are very valuable for integration testing criteria
- And much fewer e2e smoke tests

## Documentation

- Skip return-type sections in docstrings when type hints suffice
- Write concise, high-impact documentation that explains *why*, not just *what*

## Python Commands

Do not run random commands for linting and pytest. You MUST follow the ones below without any variations.

### Pytest

- `uv run pytest <relative_path>` to run tests. `<relative_path>` is the path to the test directory or ignore
- Test marks:
  - `integration_llm`: tests that hit real language-model APIs
  - `integration_db`: tests that hit databases that require external connection
  - no marks: all unit tests

### Basedpyright

- `uv run basedpyright <relative_path>` to run type checking. `<relative_path>` is the path to the file or directory to check

### Ruff

- `uv run ruff check <relative_path>` to run linting. `<relative_path>` is the path to the file or directory to check
