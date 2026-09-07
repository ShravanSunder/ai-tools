import os
import re
import secrets
import typing as t
from datetime import datetime, timezone
from pathlib import Path

from pydantic import ValidationError
from work_trail_git import (  # pyright: ignore[reportImplicitRelativeImport]
    GitIdentityError,
    discover_git_identity,
)
from work_trail_io import (  # pyright: ignore[reportImplicitRelativeImport]
    TrailError,
    ensure_within_root,
    exclusive_lock,
    open_directory_component,
    open_private,
    pinned_directory,
    prepare_root,
    read_private,
    replace_private,
    write_exclusive,
)
from work_trail_models import (  # pyright: ignore[reportImplicitRelativeImport]
    AppendEventProps,
    AppendPayload,
    FinishPayload,
    GitIdentity,
    RunMetadata,
    StoredEvent,
    TrailPaths,
)
from work_trail_rendering import (  # pyright: ignore[reportImplicitRelativeImport]
    render_markdown,
    sanitize_detail_markdown,
)


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def iso_timestamp(timestamp: datetime | None = None) -> str:
    return (timestamp or utc_now()).isoformat().replace("+00:00", "Z")


def slugify(value: str, *, fallback: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9._-]+", "-", value).strip("-._").lower()
    return (slug or fallback)[:48]


def paths_for_trail(trail: Path) -> TrailPaths:
    return TrailPaths(
        trail=trail,
        metadata=trail / "run.json",
        events=trail / "events.jsonl",
        details=trail / "details",
        lock=trail / ".lock",
        view=trail / "work-trail.md",
    )


def read_metadata(
    paths: TrailPaths, trail_descriptor: int | None = None
) -> RunMetadata:
    try:
        return RunMetadata.model_validate_json(
            read_private(paths.metadata, trail_descriptor)
        )
    except (ValidationError, ValueError) as error:
        raise TrailError("invalid_trail_metadata") from error


def read_events(
    paths: TrailPaths, metadata: RunMetadata, trail_descriptor: int | None = None
) -> t.List[StoredEvent]:
    raw_data = read_private(paths.events, trail_descriptor)
    if raw_data and not raw_data.endswith(b"\n"):
        raise TrailError("malformed_history")
    events: t.List[StoredEvent] = []
    try:
        for raw_line in raw_data.splitlines():
            if not raw_line.strip():
                raise ValueError("blank line")
            events.append(StoredEvent.model_validate_json(raw_line))
    except (ValidationError, ValueError) as error:
        raise TrailError("malformed_history") from error
    for index, event in enumerate(events, start=1):
        if event.event_id != f"event-{index:06d}":
            raise TrailError("malformed_history")
        if (
            event.repo_id != metadata.repo_id
            or event.repo_path != metadata.repo_path
            or event.session_id != metadata.session_id
            or event.session_provenance != metadata.session_provenance
            or event.run_id != metadata.run_id
        ):
            raise TrailError("malformed_history")
        if event.supersedes is not None:
            prior_ids = {prior_event.event_id for prior_event in events[: index - 1]}
            if event.supersedes not in prior_ids:
                raise TrailError("malformed_history")
            prior_successors = [
                prior_event
                for prior_event in events[: index - 1]
                if prior_event.supersedes == event.supersedes
            ]
            if prior_successors:
                raise TrailError("malformed_history")
    return events


def write_once(descriptor: int, content: bytes) -> int:
    return os.write(descriptor, content)


def sync_file(descriptor: int) -> None:
    os.fsync(descriptor)


def append_serialized_event(
    paths: TrailPaths, event: StoredEvent, trail_descriptor: int | None = None
) -> None:
    line = event.model_dump_json(exclude_none=True).encode("utf-8") + b"\n"
    descriptor = open_private(
        paths.events,
        os.O_WRONLY | os.O_APPEND,
        directory_descriptor=trail_descriptor,
    )
    initial_offset = os.fstat(descriptor).st_size
    try:
        written = write_once(descriptor, line)
        if written != len(line):
            raise TrailError("filesystem_write_failed")
        sync_file(descriptor)
    except (OSError, TrailError) as error:
        rollback_succeeded = True
        try:
            os.ftruncate(descriptor, initial_offset)
            sync_file(descriptor)
        except OSError:
            rollback_succeeded = False
        if not rollback_succeeded:
            raise TrailError("append_rollback_failed") from error
        if isinstance(error, TrailError):
            raise
        raise TrailError("filesystem_write_failed") from error
    finally:
        os.close(descriptor)


def event_from_payload(
    metadata: RunMetadata,
    git_identity: GitIdentity,
    payload: AppendPayload | FinishPayload,
    *,
    event_id: str,
    detail_reference: str | None,
) -> StoredEvent:
    return StoredEvent(
        event_id=event_id,
        timestamp=iso_timestamp(),
        repo_id=metadata.repo_id,
        repo_path=metadata.repo_path,
        worktree_path=git_identity.worktree_path,
        branch=git_identity.branch,
        session_id=metadata.session_id,
        session_provenance=metadata.session_provenance,
        run_id=metadata.run_id,
        phase=payload.phase,
        decision=payload.decision,
        why=payload.why,
        evidence=payload.evidence,
        result=payload.result,
        detail=detail_reference,
        supersedes=payload.supersedes,
    )


def validate_correction(
    events: t.Sequence[StoredEvent], supersedes: str | None
) -> None:
    if supersedes is None:
        return
    target = next((event for event in events if event.event_id == supersedes), None)
    if target is None:
        raise TrailError("invalid_correction_target")
    if any(event.supersedes == supersedes for event in events):
        raise TrailError("correction_target_already_superseded")


def detail_matches(
    paths: TrailPaths,
    event: StoredEvent,
    detail: str | None,
    trail_descriptor: int | None = None,
) -> bool:
    if detail is None:
        return event.detail is None
    if event.detail is None:
        return False
    detail_path = paths.trail / event.detail
    try:
        detail_path.relative_to(paths.trail)
    except ValueError:
        return False
    if trail_descriptor is None:
        stored_detail = read_private(detail_path)
    else:
        details_descriptor = open_directory_component(trail_descriptor, "details")
        try:
            stored_detail = read_private(detail_path, details_descriptor)
        finally:
            os.close(details_descriptor)
    return stored_detail.decode("utf-8") == sanitize_detail_markdown(detail)


def identical_finish(
    paths: TrailPaths,
    event: StoredEvent,
    payload: AppendPayload | FinishPayload,
    trail_descriptor: int | None = None,
) -> bool:
    return (
        event.phase == "finish"
        and payload.phase == "finish"
        and event.decision == payload.decision
        and event.why == payload.why
        and event.evidence == payload.evidence
        and event.result == payload.result
        and event.supersedes == payload.supersedes
        and detail_matches(paths, event, payload.detail, trail_descriptor)
    )


def validate_repo(metadata: RunMetadata, repository: Path) -> GitIdentity:
    try:
        git_identity = discover_git_identity(repository)
    except GitIdentityError as error:
        raise TrailError("git_repository_required") from error
    if git_identity.repo_id != metadata.repo_id:
        raise TrailError("repository_mismatch")
    return git_identity


def append_event(root: Path, props: AppendEventProps) -> t.Dict[str, t.Any]:
    canonical_root = prepare_root(root, create=False)
    trail = ensure_within_root(props.trail, canonical_root)
    paths = paths_for_trail(trail)
    with pinned_directory(canonical_root, trail) as trail_descriptor:
        metadata = read_metadata(paths, trail_descriptor)
        git_identity = validate_repo(metadata, props.repository)
        with exclusive_lock(paths, trail_descriptor):
            events = read_events(paths, metadata, trail_descriptor)
            if (
                props.finish
                and events
                and identical_finish(paths, events[-1], props.payload, trail_descriptor)
            ):
                render_snapshot(paths, metadata, events, trail_descriptor)
                return {
                    "ok": True,
                    "trail_path": str(trail),
                    "event_id": events[-1].event_id,
                    "view_path": str(paths.view),
                    "snapshot_event_count": len(events),
                    "deduplicated": True,
                }
            validate_correction(events, props.payload.supersedes)

            event_id = f"event-{len(events) + 1:06d}"
            detail_reference: str | None = None
            detail_path: Path | None = None
            details_descriptor: int | None = None
            if props.payload.detail is not None:
                try:
                    os.mkdir("details", mode=0o700, dir_fd=trail_descriptor)
                except FileExistsError:
                    pass
                details_descriptor = open_directory_component(
                    trail_descriptor, "details"
                )
                os.fchmod(details_descriptor, 0o700)
                detail_reference = f"details/{event_id}.md"
                detail_path = paths.trail / detail_reference
                sanitized_detail = sanitize_detail_markdown(props.payload.detail)
                write_exclusive(
                    detail_path,
                    sanitized_detail.encode("utf-8"),
                    details_descriptor,
                )
            event = event_from_payload(
                metadata,
                git_identity,
                props.payload,
                event_id=event_id,
                detail_reference=detail_reference,
            )
            try:
                append_serialized_event(paths, event, trail_descriptor)
            except TrailError:
                if details_descriptor is not None and detail_path is not None:
                    try:
                        os.unlink(detail_path.name, dir_fd=details_descriptor)
                        os.fsync(details_descriptor)
                    except OSError as cleanup_error:
                        raise TrailError("append_rollback_failed") from cleanup_error
                raise
            finally:
                if details_descriptor is not None:
                    os.close(details_descriptor)
            result: t.Dict[str, t.Any] = {
                "ok": True,
                "trail_path": str(trail),
                "event_id": event_id,
                "events_path": str(paths.events),
                "deduplicated": False,
            }
            if detail_path is not None:
                result["detail_path"] = str(detail_path)
            if props.finish:
                render_snapshot(paths, metadata, [*events, event], trail_descriptor)
                result["view_path"] = str(paths.view)
                result["snapshot_event_count"] = len(events) + 1
            return result


def start_trail(
    root: Path, repository: Path, session: str | None
) -> t.Dict[str, t.Any]:
    try:
        git_identity = discover_git_identity(repository)
    except GitIdentityError as error:
        raise TrailError("git_repository_required") from error
    canonical_root = prepare_root(root, create=True)
    now = utc_now()
    session_id = session or f"generated-{secrets.token_hex(8)}"
    session_provenance: t.Literal["provided", "generated"] = (
        "provided" if session is not None else "generated"
    )
    repository_name = slugify(Path(git_identity.repo_path).name, fallback="repository")
    bucket = canonical_root / f"{repository_name}-{git_identity.repo_id[:12]}"
    run_slug = "__".join(
        [
            now.strftime("%Y-%m-%d"),
            slugify(Path(git_identity.worktree_path).name, fallback="worktree"),
            slugify(git_identity.branch, fallback="detached"),
            slugify(session_id, fallback="session"),
            secrets.token_hex(4),
        ]
    )
    trail = bucket / run_slug
    paths = paths_for_trail(trail)
    run_id = run_slug
    metadata = RunMetadata(
        run_id=run_id,
        created_at=iso_timestamp(now),
        repo_id=git_identity.repo_id,
        repo_path=git_identity.repo_path,
        initial_worktree_path=git_identity.worktree_path,
        initial_branch=git_identity.branch,
        session_id=session_id,
        session_provenance=session_provenance,
    )
    with pinned_directory(canonical_root, canonical_root) as root_descriptor:
        try:
            os.mkdir(bucket.name, mode=0o700, dir_fd=root_descriptor)
        except FileExistsError:
            pass
        bucket_descriptor = open_directory_component(root_descriptor, bucket.name)
        try:
            os.fchmod(bucket_descriptor, 0o700)
            os.mkdir(run_slug, mode=0o700, dir_fd=bucket_descriptor)
            trail_descriptor = open_directory_component(bucket_descriptor, run_slug)
        except OSError as error:
            raise TrailError("filesystem_write_failed") from error
        finally:
            os.close(bucket_descriptor)
        try:
            os.fchmod(trail_descriptor, 0o700)
            write_exclusive(
                paths.metadata,
                metadata.model_dump_json().encode("utf-8") + b"\n",
                trail_descriptor,
            )
            write_exclusive(paths.events, b"", trail_descriptor)
            start_payload = AppendPayload(
                phase="start",
                decision="Started work trail",
                why="A durable account was initialized for this run.",
                evidence=[],
                result="started",
            )
            event = event_from_payload(
                metadata,
                git_identity,
                start_payload,
                event_id="event-000001",
                detail_reference=None,
            )
            append_serialized_event(paths, event, trail_descriptor)
        finally:
            os.close(trail_descriptor)
    return {
        "ok": True,
        "run_id": run_id,
        "trail_path": str(trail),
        "events_path": str(paths.events),
        "view_path": str(paths.view),
        "event_id": event.event_id,
        "session_id": session_id,
        "session_provenance": session_provenance,
    }


def find_trails(
    root: Path, repository: Path, session: str | None
) -> t.Dict[str, t.Any]:
    try:
        git_identity = discover_git_identity(repository)
    except GitIdentityError as error:
        raise TrailError("git_repository_required") from error
    if not root.expanduser().absolute().exists():
        return {"ok": True, "repo_id": git_identity.repo_id, "candidates": []}
    canonical_root = prepare_root(root, create=False)
    repository_name = slugify(Path(git_identity.repo_path).name, fallback="repository")
    bucket = canonical_root / f"{repository_name}-{git_identity.repo_id[:12]}"
    if not bucket.exists():
        return {"ok": True, "repo_id": git_identity.repo_id, "candidates": []}
    bucket = ensure_within_root(bucket, canonical_root)
    candidates: t.List[t.Dict[str, t.Any]] = []
    with pinned_directory(canonical_root, bucket) as bucket_descriptor:
        for trail_name in sorted(os.listdir(bucket_descriptor)):
            trail = bucket / trail_name
            trail_descriptor = open_directory_component(bucket_descriptor, trail_name)
            try:
                paths = paths_for_trail(trail)
                metadata = read_metadata(paths, trail_descriptor)
            finally:
                os.close(trail_descriptor)
            if metadata.repo_id != git_identity.repo_id:
                raise TrailError("invalid_trail_metadata")
            if session is not None and metadata.session_id != session:
                continue
            candidates.append(
                {
                    "run_id": metadata.run_id,
                    "trail_path": str(trail),
                    "session_id": metadata.session_id,
                    "session_provenance": metadata.session_provenance,
                    "created_at": metadata.created_at,
                    "initial_worktree_path": metadata.initial_worktree_path,
                    "initial_branch": metadata.initial_branch,
                }
            )
    return {"ok": True, "repo_id": git_identity.repo_id, "candidates": candidates}


def render_snapshot(
    paths: TrailPaths,
    metadata: RunMetadata,
    events: t.Sequence[StoredEvent],
    trail_descriptor: int | None = None,
) -> None:
    replace_private(
        paths.view,
        render_markdown(metadata, events).encode("utf-8"),
        trail_descriptor,
    )


def render_trail(root: Path, requested_trail: Path) -> t.Dict[str, t.Any]:
    canonical_root = prepare_root(root, create=False)
    trail = ensure_within_root(requested_trail, canonical_root)
    paths = paths_for_trail(trail)
    with pinned_directory(canonical_root, trail) as trail_descriptor:
        metadata = read_metadata(paths, trail_descriptor)
        with exclusive_lock(paths, trail_descriptor):
            events = read_events(paths, metadata, trail_descriptor)
            render_snapshot(paths, metadata, events, trail_descriptor)
    return {
        "ok": True,
        "trail_path": str(trail),
        "view_path": str(paths.view),
        "snapshot_event_count": len(events),
    }
