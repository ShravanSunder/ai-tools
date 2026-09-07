#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.12"
# dependencies = [
#   "pydantic>=2,<3",
# ]
# ///

import argparse
import json
import sys
import typing as t
from pathlib import Path

from pydantic import ValidationError
from work_trail_io import (  # pyright: ignore[reportImplicitRelativeImport]
    TrailError,
    default_root,
)
from work_trail_models import (  # pyright: ignore[reportImplicitRelativeImport]
    AppendEventProps,
    AppendPayload,
    FinishPayload,
)
from work_trail_storage import (  # pyright: ignore[reportImplicitRelativeImport]
    append_event,
    find_trails,
    render_trail,
    start_trail,
)


class SanitizedArgumentParser(argparse.ArgumentParser):
    def error(self, message: str) -> t.NoReturn:
        del message
        raise TrailError("invalid_arguments")


def build_parser() -> SanitizedArgumentParser:
    parser = SanitizedArgumentParser(prog="work_trail.py")
    parser.add_argument("--root", type=Path, default=default_root())
    commands = parser.add_subparsers(
        dest="command", required=True, parser_class=SanitizedArgumentParser
    )

    start_parser = commands.add_parser("start")
    start_parser.add_argument("--repo", type=Path, required=True)
    start_parser.add_argument("--session")

    find_parser = commands.add_parser("find")
    find_parser.add_argument("--repo", type=Path, required=True)
    find_parser.add_argument("--session")

    append_parser = commands.add_parser("append")
    append_parser.add_argument("--trail", type=Path, required=True)
    append_parser.add_argument("--repo", type=Path, default=Path.cwd())
    append_parser.add_argument("--input", type=Path)

    render_parser = commands.add_parser("render")
    render_parser.add_argument("--trail", type=Path, required=True)

    finish_parser = commands.add_parser("finish")
    finish_parser.add_argument("--trail", type=Path, required=True)
    finish_parser.add_argument("--repo", type=Path, default=Path.cwd())
    finish_parser.add_argument("--input", type=Path)
    return parser


def read_payload(
    input_path: Path | None, *, finish: bool
) -> AppendPayload | FinishPayload:
    try:
        raw_payload = (
            input_path.expanduser().read_bytes()
            if input_path is not None
            else sys.stdin.buffer.read()
        )
    except OSError as error:
        raise TrailError("payload_read_failed") from error
    if not raw_payload.strip():
        raise TrailError("invalid_payload")
    try:
        if finish:
            return FinishPayload.model_validate_json(raw_payload)
        return AppendPayload.model_validate_json(raw_payload)
    except (ValidationError, ValueError) as error:
        raise TrailError("invalid_payload") from error


def execute(arguments: argparse.Namespace) -> t.Dict[str, t.Any]:
    root = t.cast(Path, arguments.root)
    command = t.cast(str, arguments.command)
    if command == "start":
        return start_trail(
            root, t.cast(Path, arguments.repo), t.cast(str | None, arguments.session)
        )
    if command == "find":
        return find_trails(
            root, t.cast(Path, arguments.repo), t.cast(str | None, arguments.session)
        )
    if command == "render":
        return render_trail(root, t.cast(Path, arguments.trail))
    if command in {"append", "finish"}:
        is_finish = command == "finish"
        payload = read_payload(t.cast(Path | None, arguments.input), finish=is_finish)
        return append_event(
            root,
            AppendEventProps(
                trail=t.cast(Path, arguments.trail),
                repository=t.cast(Path, arguments.repo),
                payload=payload,
                finish=is_finish,
            ),
        )
    raise TrailError("invalid_arguments")


def main() -> int:
    try:
        arguments = build_parser().parse_args()
        result = execute(arguments)
    except TrailError as error:
        print(json.dumps({"ok": False, "error": error.code}), file=sys.stderr)
        return 2
    except Exception:  # noqa: BLE001 - CLI failures must never expose payloads or local paths.
        print(json.dumps({"ok": False, "error": "unexpected_failure"}), file=sys.stderr)
        return 2
    print(json.dumps(result, separators=(",", ":")))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
