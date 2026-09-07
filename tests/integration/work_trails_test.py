import concurrent.futures
import fcntl
import json
import stat
import subprocess
import sys
import time
import typing as t
from pathlib import Path

import pytest

SCRIPTS_DIRECTORY = (
    Path(__file__).resolve().parents[2]
    / "plugins/shravan-dev-workflow/skills/track-show-me-your-work/scripts"
)
sys.path.insert(0, str(SCRIPTS_DIRECTORY))

import work_trail_io  # pyright: ignore[reportMissingImports]
import work_trail_storage  # pyright: ignore[reportMissingImports]
from work_trail_models import (  # pyright: ignore[reportMissingImports]
    AppendEventProps,
    AppendPayload,
)

REPOSITORY_ROOT = Path(__file__).resolve().parents[2]
WORK_TRAIL_SCRIPT = (
    REPOSITORY_ROOT
    / "plugins/shravan-dev-workflow/skills/track-show-me-your-work/scripts/work_trail.py"
)


class CliResult:
    def __init__(
        self,
        *,
        process: subprocess.CompletedProcess[str],
        payload: t.Dict[str, t.Any] | None,
    ) -> None:
        self.process = process
        self.payload = payload


def run_command(
    arguments: t.Sequence[str], *, cwd: Path
) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [*arguments],
        cwd=cwd,
        check=True,
        capture_output=True,
        text=True,
    )


def initialize_repository(repository: Path) -> None:
    repository.mkdir()
    run_command(["git", "init", "-q", str(repository)], cwd=repository.parent)
    run_command(
        ["git", "config", "user.email", "trail-tests@example.invalid"], cwd=repository
    )
    run_command(["git", "config", "user.name", "Trail Tests"], cwd=repository)
    run_command(["git", "config", "commit.gpgsign", "false"], cwd=repository)
    tracked_file = repository / "tracked.txt"
    tracked_file.write_text("initial\n", encoding="utf-8")
    run_command(["git", "add", "tracked.txt"], cwd=repository)
    run_command(["git", "commit", "-q", "-m", "initial"], cwd=repository)


def invoke_cli(
    root: Path,
    arguments: t.Sequence[str],
    *,
    cwd: Path,
    input_payload: t.Dict[str, t.Any] | None = None,
) -> CliResult:
    process = subprocess.run(
        [sys.executable, str(WORK_TRAIL_SCRIPT), "--root", str(root), *arguments],
        cwd=cwd,
        input=json.dumps(input_payload) if input_payload is not None else None,
        capture_output=True,
        text=True,
        check=False,
        timeout=20,
    )
    payload = json.loads(process.stdout) if process.stdout else None
    return CliResult(process=process, payload=payload)


def require_success(result: CliResult) -> t.Dict[str, t.Any]:
    assert result.process.returncode == 0, result.process.stderr
    assert result.payload is not None
    assert result.payload["ok"] is True
    return result.payload


def read_events(trail: Path) -> t.List[t.Dict[str, t.Any]]:
    return [
        json.loads(line) for line in (trail / "events.jsonl").read_text().splitlines()
    ]


def append_payload(
    *,
    phase: str,
    decision: str,
    result: str = "complete",
    detail: str | None = None,
    supersedes: str | None = None,
) -> t.Dict[str, t.Any]:
    payload: t.Dict[str, t.Any] = {
        "phase": phase,
        "decision": decision,
        "why": f"Reason for {decision}",
        "evidence": [f"proof/{phase}.txt"],
        "result": result,
    }
    if detail is not None:
        payload["detail"] = detail
    if supersedes is not None:
        payload["supersedes"] = supersedes
    return payload


def start_trail(
    root: Path, repository: Path, *, session: str | None = "session-a"
) -> Path:
    arguments = ["start", "--repo", str(repository)]
    if session is not None:
        arguments.extend(["--session", session])
    result = require_success(invoke_cli(root, arguments, cwd=repository))
    return Path(t.cast(str, result["trail_path"]))


def test_start_append_render_and_finish_real_cli(tmp_path: Path) -> None:
    # Arrange
    repository = tmp_path / "project"
    root = tmp_path / "trails"
    initialize_repository(repository)

    # Act
    trail = start_trail(root, repository)
    appended = require_success(
        invoke_cli(
            root,
            ["append", "--trail", str(trail), "--repo", str(repository)],
            cwd=repository,
            input_payload=append_payload(
                phase="implementation",
                decision="Use the repository pattern",
                detail="# Detail\n\nThe implementation follows the existing boundary.\n",
            ),
        )
    )
    rendered = require_success(
        invoke_cli(root, ["render", "--trail", str(trail)], cwd=repository)
    )
    finished = require_success(
        invoke_cli(
            root,
            ["finish", "--trail", str(trail), "--repo", str(repository)],
            cwd=repository,
            input_payload=append_payload(phase="finish", decision="Finish the run"),
        )
    )

    # Assert
    events = read_events(trail)
    assert [event["event_id"] for event in events] == [
        "event-000001",
        "event-000002",
        "event-000003",
    ]
    assert appended["event_id"] == "event-000002"
    assert (
        Path(t.cast(str, appended["detail_path"]))
        .read_text(encoding="utf-8")
        .startswith("# Detail")
    )
    assert rendered["snapshot_event_count"] == 2
    assert finished["snapshot_event_count"] == 3
    view = (trail / "work-trail.md").read_text(encoding="utf-8")
    assert "Use the repository pattern" in view
    assert "Reason for Use the repository pattern" in view
    assert "proof/implementation.txt" in view
    assert "details/event-000002.md" in view


def test_repo_identity_groups_worktrees_and_records_branch_at_append(
    tmp_path: Path,
) -> None:
    # Arrange
    repository = tmp_path / "project"
    worktree = tmp_path / "topic-worktree"
    root = tmp_path / "trails"
    initialize_repository(repository)
    run_command(
        ["git", "worktree", "add", "-q", "-b", "topic", str(worktree)], cwd=repository
    )
    trail = start_trail(root, repository)

    # Act
    append_result = require_success(
        invoke_cli(
            root,
            ["append", "--trail", str(trail), "--repo", str(worktree)],
            cwd=worktree,
            input_payload=append_payload(
                phase="implementation", decision="Work in topic branch"
            ),
        )
    )
    find_result = require_success(
        invoke_cli(
            root,
            ["find", "--repo", str(worktree), "--session", "session-a"],
            cwd=worktree,
        )
    )
    run_command(["git", "checkout", "-q", "--detach"], cwd=worktree)
    require_success(
        invoke_cli(
            root,
            ["append", "--trail", str(trail), "--repo", str(worktree)],
            cwd=worktree,
            input_payload=append_payload(
                phase="proof", decision="Verify detached head"
            ),
        )
    )

    # Assert
    events = read_events(trail)
    assert events[0]["repo_id"] == events[1]["repo_id"] == events[2]["repo_id"]
    assert events[1]["branch"] == "topic"
    assert events[2]["branch"] == "detached"
    assert append_result["event_id"] == "event-000002"
    assert [candidate["trail_path"] for candidate in find_result["candidates"]] == [
        str(trail)
    ]


def test_generated_session_and_find_returns_every_candidate(tmp_path: Path) -> None:
    # Arrange
    repository = tmp_path / "project"
    root = tmp_path / "trails"
    initialize_repository(repository)

    # Act
    first = start_trail(root, repository, session=None)
    second = start_trail(root, repository, session=None)
    found = require_success(
        invoke_cli(root, ["find", "--repo", str(repository)], cwd=repository)
    )

    # Assert
    first_event = read_events(first)[0]
    assert first_event["session_provenance"] == "generated"
    assert first_event["session_id"]
    assert {candidate["trail_path"] for candidate in found["candidates"]} == {
        str(first),
        str(second),
    }
    assert "trail_path" not in found


def test_concurrent_writers_get_unique_sequential_events(tmp_path: Path) -> None:
    # Arrange
    repository = tmp_path / "project"
    root = tmp_path / "trails"
    initialize_repository(repository)
    trail = start_trail(root, repository)

    def append_index(index: int) -> CliResult:
        return invoke_cli(
            root,
            ["append", "--trail", str(trail), "--repo", str(repository)],
            cwd=repository,
            input_payload=append_payload(
                phase="implementation", decision=f"Concurrent {index}"
            ),
        )

    # Act
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
        results = list(executor.map(append_index, range(16)))

    # Assert
    assert all(result.process.returncode == 0 for result in results)
    events = read_events(trail)
    assert len(events) == 17
    assert [event["event_id"] for event in events] == [
        f"event-{index:06d}" for index in range(1, 18)
    ]


def test_competing_corrections_allow_only_one_leaf_successor(tmp_path: Path) -> None:
    # Arrange
    repository = tmp_path / "project"
    root = tmp_path / "trails"
    initialize_repository(repository)
    trail = start_trail(root, repository)
    original = require_success(
        invoke_cli(
            root,
            ["append", "--trail", str(trail), "--repo", str(repository)],
            cwd=repository,
            input_payload=append_payload(phase="design", decision="Original decision"),
        )
    )

    def correct(label: str) -> CliResult:
        return invoke_cli(
            root,
            ["append", "--trail", str(trail), "--repo", str(repository)],
            cwd=repository,
            input_payload=append_payload(
                phase="design",
                decision=f"Correction {label}",
                supersedes=t.cast(str, original["event_id"]),
            ),
        )

    # Act
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
        results = list(executor.map(correct, ["A", "B"]))

    # Assert
    assert sorted(result.process.returncode for result in results) == [0, 2]
    events = read_events(trail)
    corrections = [
        event for event in events if event.get("supersedes") == original["event_id"]
    ]
    assert len(corrections) == 1
    failure = next(result for result in results if result.process.returncode != 0)
    assert "Original decision" not in failure.process.stderr
    assert "payload" not in failure.process.stderr.lower()


def test_repeated_identical_finish_is_idempotent_but_later_work_continues(
    tmp_path: Path,
) -> None:
    # Arrange
    repository = tmp_path / "project"
    root = tmp_path / "trails"
    initialize_repository(repository)
    trail = start_trail(root, repository)
    finish_payload = append_payload(
        phase="finish", decision="Blocked on owner", result="blocked"
    )

    # Act
    first = require_success(
        invoke_cli(
            root,
            ["finish", "--trail", str(trail), "--repo", str(repository)],
            cwd=repository,
            input_payload=finish_payload,
        )
    )
    repeated = require_success(
        invoke_cli(
            root,
            ["finish", "--trail", str(trail), "--repo", str(repository)],
            cwd=repository,
            input_payload=finish_payload,
        )
    )
    require_success(
        invoke_cli(
            root,
            ["append", "--trail", str(trail), "--repo", str(repository)],
            cwd=repository,
            input_payload=append_payload(
                phase="implementation", decision="Resume after owner reply"
            ),
        )
    )
    require_success(invoke_cli(root, ["render", "--trail", str(trail)], cwd=repository))

    # Assert
    assert first["event_id"] == "event-000002"
    assert repeated["event_id"] == "event-000002"
    assert repeated["deduplicated"] is True
    assert len(read_events(trail)) == 3
    view = (trail / "work-trail.md").read_text(encoding="utf-8")
    assert "Activity after last finish" in view


@pytest.mark.parametrize(
    "invalid_payload",
    [
        {"phase": "proof"},
        append_payload(phase="proof", decision="Unknown field")
        | {"secret": "do not print"},
        append_payload(phase="proof", decision="Wrong evidence")
        | {"evidence": "one string"},
    ],
)
def test_invalid_payload_fails_without_mutation_or_echo(
    tmp_path: Path, invalid_payload: t.Dict[str, t.Any]
) -> None:
    # Arrange
    repository = tmp_path / "project"
    root = tmp_path / "trails"
    initialize_repository(repository)
    trail = start_trail(root, repository)
    before = (trail / "events.jsonl").read_bytes()

    # Act
    result = invoke_cli(
        root,
        ["append", "--trail", str(trail), "--repo", str(repository)],
        cwd=repository,
        input_payload=invalid_payload,
    )

    # Assert
    assert result.process.returncode == 2
    assert (trail / "events.jsonl").read_bytes() == before
    assert "do not print" not in result.process.stderr
    error = json.loads(result.process.stderr)
    assert error["ok"] is False
    assert set(error) == {"ok", "error"}


def test_corrupt_history_fails_closed_and_preserves_bytes(tmp_path: Path) -> None:
    # Arrange
    repository = tmp_path / "project"
    root = tmp_path / "trails"
    initialize_repository(repository)
    trail = start_trail(root, repository)
    events_path = trail / "events.jsonl"
    events_path.write_bytes(events_path.read_bytes() + b'{"truncated":')
    before = events_path.read_bytes()

    # Act
    append_result = invoke_cli(
        root,
        ["append", "--trail", str(trail), "--repo", str(repository)],
        cwd=repository,
        input_payload=append_payload(phase="proof", decision="Must not append"),
    )
    render_result = invoke_cli(root, ["render", "--trail", str(trail)], cwd=repository)

    # Assert
    assert append_result.process.returncode == 2
    assert render_result.process.returncode == 2
    assert events_path.read_bytes() == before
    assert "truncated" not in append_result.process.stderr


def test_private_modes_and_path_or_symlink_escape_rejected(tmp_path: Path) -> None:
    # Arrange
    repository = tmp_path / "project"
    root = tmp_path / "trails"
    outside = tmp_path / "outside"
    initialize_repository(repository)
    outside.mkdir()
    trail = start_trail(root, repository)
    symlink = root / "redirect"
    symlink.symlink_to(outside, target_is_directory=True)

    # Act
    outside_result = invoke_cli(
        root,
        ["append", "--trail", str(outside), "--repo", str(repository)],
        cwd=repository,
        input_payload=append_payload(phase="proof", decision="Outside root"),
    )
    symlink_result = invoke_cli(
        root,
        ["append", "--trail", str(symlink), "--repo", str(repository)],
        cwd=repository,
        input_payload=append_payload(phase="proof", decision="Symlink escape"),
    )

    # Assert
    assert stat.S_IMODE(root.stat().st_mode) == 0o700
    assert stat.S_IMODE(trail.stat().st_mode) == 0o700
    assert stat.S_IMODE((trail / "events.jsonl").stat().st_mode) == 0o600
    assert outside_result.process.returncode == 2
    assert symlink_result.process.returncode == 2
    assert list(outside.iterdir()) == []


def test_ancestor_swap_after_directory_open_cannot_redirect_append(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    # Arrange
    repository = tmp_path / "project"
    root = tmp_path / "trails"
    outside = tmp_path / "outside"
    initialize_repository(repository)
    trail = start_trail(root, repository)
    outside.mkdir()
    outside_events = outside / "events.jsonl"
    outside_events.write_text("outside sentinel\n", encoding="utf-8")
    moved_trail = trail.with_name(f"{trail.name}-moved")
    original_open_component = work_trail_io.open_directory_component

    def open_then_swap(parent_descriptor: int, component: str) -> int:
        descriptor = original_open_component(parent_descriptor, component)
        if component == trail.name and trail.exists():
            trail.rename(moved_trail)
            trail.symlink_to(outside, target_is_directory=True)
        return descriptor

    monkeypatch.setattr(work_trail_io, "open_directory_component", open_then_swap)
    payload = AppendPayload.model_validate(
        append_payload(phase="proof", decision="Stay in pinned directory")
    )

    # Act
    result = work_trail_storage.append_event(
        root,
        AppendEventProps(trail=trail, repository=repository, payload=payload),
    )

    # Assert
    assert result["event_id"] == "event-000002"
    assert outside_events.read_text(encoding="utf-8") == "outside sentinel\n"
    assert not (outside / "run.json").exists()
    assert len(read_events(moved_trail)) == 2


def test_lock_timeout_is_bounded_and_does_not_mutate_history(tmp_path: Path) -> None:
    # Arrange
    repository = tmp_path / "project"
    root = tmp_path / "trails"
    initialize_repository(repository)
    trail = start_trail(root, repository)
    before = (trail / "events.jsonl").read_bytes()
    lock_handle = (trail / ".lock").open("a+b")
    fcntl.flock(lock_handle.fileno(), fcntl.LOCK_EX)

    # Act
    try:
        started_at = time.monotonic()
        result = invoke_cli(
            root,
            ["append", "--trail", str(trail), "--repo", str(repository)],
            cwd=repository,
            input_payload=append_payload(
                phase="proof", decision="Wait for bounded lock"
            ),
        )
        elapsed = time.monotonic() - started_at
    finally:
        fcntl.flock(lock_handle.fileno(), fcntl.LOCK_UN)
        lock_handle.close()

    # Assert
    assert result.process.returncode == 2
    assert json.loads(result.process.stderr)["error"] == "lock_timeout"
    assert 2.5 <= elapsed < 10
    assert (trail / "events.jsonl").read_bytes() == before


def test_nonwritable_event_file_fails_without_changing_permissions_or_history(
    tmp_path: Path,
) -> None:
    # Arrange
    repository = tmp_path / "project"
    root = tmp_path / "trails"
    initialize_repository(repository)
    trail = start_trail(root, repository)
    events_path = trail / "events.jsonl"
    before = events_path.read_bytes()
    events_path.chmod(0o400)

    # Act
    result = invoke_cli(
        root,
        ["append", "--trail", str(trail), "--repo", str(repository)],
        cwd=repository,
        input_payload=append_payload(phase="proof", decision="Cannot write"),
    )

    # Assert
    assert result.process.returncode == 2
    assert events_path.read_bytes() == before
    assert stat.S_IMODE(events_path.stat().st_mode) == 0o400


def test_render_escapes_active_markdown_and_html(tmp_path: Path) -> None:
    # Arrange
    repository = tmp_path / "project"
    root = tmp_path / "trails"
    initialize_repository(repository)
    trail = start_trail(root, repository)
    hostile = "[click](https://example.invalid) <img src=x onerror=alert(1)> **bold**"

    # Act
    require_success(
        invoke_cli(
            root,
            ["append", "--trail", str(trail), "--repo", str(repository)],
            cwd=repository,
            input_payload={
                "phase": "proof",
                "decision": hostile,
                "why": hostile,
                "evidence": [hostile],
                "result": hostile,
            },
        )
    )
    require_success(invoke_cli(root, ["render", "--trail", str(trail)], cwd=repository))

    # Assert
    view = (trail / "work-trail.md").read_text(encoding="utf-8")
    assert "&lt;img src=x onerror=alert\\(1\\)&gt;" in view
    assert "\\[click\\]\\(https://example.invalid\\)" in view
    assert "\\*\\*bold\\*\\*" in view
    assert "<img" not in view


def test_render_links_safe_evidence_and_leaves_unsafe_evidence_inert(
    tmp_path: Path,
) -> None:
    # Arrange
    repository = tmp_path / "project"
    root = tmp_path / "trails"
    initialize_repository(repository)
    trail = start_trail(root, repository)
    local_evidence = repository / "docs/proof file.md"
    local_evidence.parent.mkdir()
    local_evidence.write_text("proof\n", encoding="utf-8")
    readme_evidence = repository / "README.md"
    makefile_evidence = repository / "Makefile"
    readme_evidence.write_text("readme\n", encoding="utf-8")
    makefile_evidence.write_text("target:\n", encoding="utf-8")

    # Act
    require_success(
        invoke_cli(
            root,
            ["append", "--trail", str(trail), "--repo", str(repository)],
            cwd=repository,
            input_payload={
                "phase": "proof",
                "decision": "Link safe evidence",
                "why": "Readers need navigable evidence",
                "evidence": [
                    "docs/proof file.md:12",
                    "README.md:3",
                    "Makefile:7",
                    "https://example.invalid/proof file?q=one two",
                    "javascript:alert(1)",
                    "data:text/html,unsafe",
                    "../outside.txt",
                ],
                "result": "complete",
            },
        )
    )
    require_success(invoke_cli(root, ["render", "--trail", str(trail)], cwd=repository))

    # Assert
    view = (trail / "work-trail.md").read_text(encoding="utf-8")
    assert f"]({str(local_evidence).replace(' ', '%20')}:12)" in view
    assert f"]({readme_evidence}:3)" in view
    assert f"]({makefile_evidence}:7)" in view
    assert "](https://example.invalid/proof%20file?q=one%20two)" in view
    assert "](javascript:" not in view
    assert "](data:" not in view
    assert "javascript:alert\\(1\\)" in view
    assert "../outside.txt" in view


def test_detail_markdown_preserves_structure_but_neutralizes_active_content(
    tmp_path: Path,
) -> None:
    # Arrange
    repository = tmp_path / "project"
    root = tmp_path / "trails"
    initialize_repository(repository)
    trail = start_trail(root, repository)
    hostile_detail = """# Proof notes

Ordinary explanation remains readable.

<script>alert(1)</script>
![remote](https://example.invalid/tracker.png)
[unsafe](javascript:alert(1))
"""

    # Act
    result = require_success(
        invoke_cli(
            root,
            ["append", "--trail", str(trail), "--repo", str(repository)],
            cwd=repository,
            input_payload=append_payload(
                phase="proof", decision="Store hostile detail", detail=hostile_detail
            ),
        )
    )

    # Assert
    detail = Path(t.cast(str, result["detail_path"])).read_text(encoding="utf-8")
    assert detail.startswith("# Proof notes")
    assert "Ordinary explanation remains readable." in detail
    assert "<script>" not in detail
    assert "&lt;script&gt;" in detail
    assert "![remote](" not in detail
    assert "[unsafe](javascript:" not in detail
    assert "\\[unsafe\\](javascript:" in detail


def test_detail_markdown_neutralizes_reference_forms_and_preescaped_brackets(
    tmp_path: Path,
) -> None:
    # Arrange
    repository = tmp_path / "project"
    root = tmp_path / "trails"
    initialize_repository(repository)
    trail = start_trail(root, repository)
    hostile_detail = """# Reference forms

![beacon]
[beacon]: https://example.invalid/pixel.png
![collapsed][]
[collapsed]: https://example.invalid/collapsed.png
[shortcut]
[shortcut]: javascript:alert(1)
\\[preescaped]
"""

    # Act
    result = require_success(
        invoke_cli(
            root,
            ["append", "--trail", str(trail), "--repo", str(repository)],
            cwd=repository,
            input_payload=append_payload(
                phase="proof",
                decision="Neutralize reference forms",
                detail=hostile_detail,
            ),
        )
    )

    # Assert
    detail = Path(t.cast(str, result["detail_path"])).read_text(encoding="utf-8")
    assert detail.startswith("# Reference forms")
    assert "![beacon]" not in detail
    assert "[beacon]:" not in detail
    assert "![collapsed][]" not in detail
    assert "[shortcut]:" not in detail
    assert "!\\[beacon\\]" in detail
    assert "\\[beacon\\]: https://example.invalid/pixel.png" in detail
    assert "\\\\\\[preescaped\\]" in detail


@pytest.mark.parametrize("failure_kind", ["short_write", "fsync"])
def test_failed_append_rolls_back_attempt_detail_and_allows_retry(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
    failure_kind: str,
) -> None:
    # Arrange
    repository = tmp_path / "project"
    root = tmp_path / "trails"
    initialize_repository(repository)
    trail = start_trail(root, repository)
    events_path = trail / "events.jsonl"
    before = events_path.read_bytes()
    payload = AppendPayload.model_validate(
        append_payload(
            phase="implementation",
            decision="Retry after injected failure",
            detail="# Attempt detail\n",
        )
    )
    props = AppendEventProps(trail=trail, repository=repository, payload=payload)
    original_write_once = work_trail_storage.write_once
    original_sync_file = work_trail_storage.sync_file

    if failure_kind == "short_write":

        def write_short(descriptor: int, content: bytes) -> int:
            written = original_write_once(
                descriptor, content[: max(1, len(content) // 2)]
            )
            return written

        monkeypatch.setattr(work_trail_storage, "write_once", write_short)
    else:
        sync_calls = 0

        def fail_first_sync(descriptor: int) -> None:
            nonlocal sync_calls
            sync_calls += 1
            if sync_calls == 1:
                raise OSError("injected sync failure")
            original_sync_file(descriptor)

        monkeypatch.setattr(work_trail_storage, "sync_file", fail_first_sync)

    # Act
    with pytest.raises(work_trail_storage.TrailError):
        work_trail_storage.append_event(root, props)
    monkeypatch.setattr(work_trail_storage, "write_once", original_write_once)
    monkeypatch.setattr(work_trail_storage, "sync_file", original_sync_file)
    retry = work_trail_storage.append_event(root, props)

    # Assert
    assert retry["event_id"] == "event-000002"
    assert events_path.read_bytes().startswith(before)
    assert len(read_events(trail)) == 2
    assert (trail / "details/event-000002.md").read_text() == "# Attempt detail\n"
    assert list((trail / "details").glob("*.md")) == [trail / "details/event-000002.md"]


def test_identical_finish_with_supersedes_deduplicates_before_leaf_revalidation(
    tmp_path: Path,
) -> None:
    # Arrange
    repository = tmp_path / "project"
    root = tmp_path / "trails"
    initialize_repository(repository)
    trail = start_trail(root, repository)
    original = require_success(
        invoke_cli(
            root,
            ["append", "--trail", str(trail), "--repo", str(repository)],
            cwd=repository,
            input_payload=append_payload(phase="proof", decision="Original outcome"),
        )
    )
    finish_payload = append_payload(
        phase="finish",
        decision="Correct and finish",
        supersedes=t.cast(str, original["event_id"]),
    )
    first = require_success(
        invoke_cli(
            root,
            ["finish", "--trail", str(trail), "--repo", str(repository)],
            cwd=repository,
            input_payload=finish_payload,
        )
    )

    # Act
    repeated = require_success(
        invoke_cli(
            root,
            ["finish", "--trail", str(trail), "--repo", str(repository)],
            cwd=repository,
            input_payload=finish_payload,
        )
    )

    # Assert
    assert repeated["deduplicated"] is True
    assert repeated["event_id"] == first["event_id"]
    assert len(read_events(trail)) == 3


def test_payload_file_and_finish_default_phase(tmp_path: Path) -> None:
    # Arrange
    repository = tmp_path / "project"
    root = tmp_path / "trails"
    initialize_repository(repository)
    trail = start_trail(root, repository)
    payload_path = tmp_path / "finish.json"
    payload_path.write_text(
        json.dumps(
            {
                "decision": "Finish from a file",
                "why": "The caller supplied a named payload",
                "evidence": [],
                "result": "partial",
            }
        ),
        encoding="utf-8",
    )

    # Act
    result = require_success(
        invoke_cli(
            root,
            [
                "finish",
                "--trail",
                str(trail),
                "--repo",
                str(repository),
                "--input",
                str(payload_path),
            ],
            cwd=repository,
        )
    )

    # Assert
    assert result["event_id"] == "event-000002"
    assert read_events(trail)[-1]["phase"] == "finish"


def test_non_repository_is_rejected_without_creating_root(tmp_path: Path) -> None:
    # Arrange
    repository = tmp_path / "not-a-repository"
    root = tmp_path / "trails"
    repository.mkdir()

    # Act
    result = invoke_cli(root, ["start", "--repo", str(repository)], cwd=repository)

    # Assert
    assert result.process.returncode == 2
    assert not root.exists()
    assert str(repository) not in result.process.stderr
