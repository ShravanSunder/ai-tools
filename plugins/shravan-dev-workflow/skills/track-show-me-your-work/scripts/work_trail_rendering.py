import html
import re
import typing as t
from pathlib import Path
from urllib.parse import quote, urlsplit

from work_trail_models import (  # pyright: ignore[reportImplicitRelativeImport]
    RunMetadata,
    StoredEvent,
)


def escape_markdown(value: str) -> str:
    escaped = html.escape(value, quote=True)
    return re.sub(r"([\\`*_{}\[\]()#!|>])", r"\\\1", escaped)


def sanitize_detail_markdown(value: str) -> str:
    escaped_html = html.escape(value, quote=True)
    escaped_backslashes = escaped_html.replace("\\", "\\\\")
    return escaped_backslashes.replace("[", "\\[").replace("]", "\\]")


def evidence_link(value: str, worktree_path: str) -> str:
    label = escape_markdown(value)
    line_match = re.fullmatch(r"(.+):([1-9][0-9]*)", value)
    local_value = line_match.group(1) if line_match is not None else value
    line_suffix = f":{line_match.group(2)}" if line_match is not None else ""
    local_path = Path(local_value)
    worktree = Path(worktree_path).resolve()
    resolved = (
        (worktree / local_path).resolve()
        if not local_path.is_absolute()
        else local_path.resolve()
    )
    local_line_exists = line_match is not None and resolved.is_file()
    parsed = urlsplit(value)
    if parsed.scheme and not local_line_exists:
        if parsed.scheme.lower() not in {"http", "https"} or not parsed.netloc:
            return label
        if parsed.username is not None or parsed.password is not None:
            return label
        destination = quote(value, safe=":/?#[]@!$&'+,;=%")
        return f"[{label}]({destination})"
    try:
        resolved.relative_to(worktree)
    except ValueError:
        return label
    destination = quote(str(resolved), safe="/:") + line_suffix
    return f"[{label}]({destination})"


def render_markdown(metadata: RunMetadata, events: t.Sequence[StoredEvent]) -> str:
    finish_indexes = [
        index for index, event in enumerate(events) if event.phase == "finish"
    ]
    last_finish_index = finish_indexes[-1] if finish_indexes else None
    superseded = {event.supersedes for event in events if event.supersedes is not None}
    lines = [
        "# Work trail",
        "",
        "> Generated from the append-only event record.",
        "",
        f"- Run: `{escape_markdown(metadata.run_id)}`",
        f"- Repository: `{escape_markdown(metadata.repo_path)}`",
        f"- Session: `{escape_markdown(metadata.session_id)}` ({metadata.session_provenance})",
        f"- Snapshot events: {len(events)}",
        "",
    ]
    for index, event in enumerate(events):
        if last_finish_index is not None and index == last_finish_index + 1:
            lines.extend(["## Activity after last finish", ""])
        status = " — superseded" if event.event_id in superseded else ""
        lines.extend(
            [
                f'<a id="{event.event_id}"></a>',
                "",
                f"## {event.event_id}: {escape_markdown(event.phase)}{status}",
                "",
                f"- Time: `{escape_markdown(event.timestamp)}`",
                f"- Worktree: `{escape_markdown(event.worktree_path)}`",
                f"- Branch: `{escape_markdown(event.branch)}`",
                f"- Decision: {escape_markdown(event.decision)}",
                f"- Why: {escape_markdown(event.why)}",
                f"- Result: {escape_markdown(event.result)}",
            ]
        )
        if event.evidence:
            lines.append("- Evidence:")
            lines.extend(
                f"  - {evidence_link(item, event.worktree_path)}"
                for item in event.evidence
            )
        else:
            lines.append("- Evidence: none recorded")
        if event.detail is not None:
            lines.append(f"- Detail: [event detail]({event.detail})")
        if event.supersedes is not None:
            lines.append(f"- Corrects: [{event.supersedes}](#{event.supersedes})")
        correction = next(
            (
                candidate
                for candidate in events
                if candidate.supersedes == event.event_id
            ),
            None,
        )
        if correction is not None:
            lines.append(
                f"- Superseded by: [{correction.event_id}](#{correction.event_id})"
            )
        lines.append("")
    return "\n".join(lines)
