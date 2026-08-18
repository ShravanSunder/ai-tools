#!/usr/bin/env python3

"""Build a bounded Stop-review conversation window from a Codex rollout JSONL."""

import argparse
import json
import os
import re
import sys
import typing as t
from dataclasses import dataclass, field

DEFAULT_MAX_USER_TURNS: int = 3
DEFAULT_MAX_USER_TOKENS: int = 1200
DEFAULT_MAX_ASSISTANT_LAST_TOKENS: int = 1600
EARLIER_ASSISTANT_CHAR_CAP: int = 200

HOOK_INJECTED_USER_PATTERNS: tuple[re.Pattern[str], ...] = (
    re.compile(r"(?is)^\s*do not stop\b"),
    re.compile(r"(?is)stop review hook"),
    re.compile(r"(?is)^\s*outstanding job is still\b"),
    re.compile(r"(?is)continue the (original )?task now\b"),
    re.compile(r"(?is)<hook_prompt\b"),
    re.compile(r"(?is)continue the outstanding implementation\b"),
)


@dataclass
class ChatMessage:
    role: t.Literal["user", "assistant"]
    text: str


@dataclass
class ConversationTurn:
    user_texts: list[str] = field(default_factory=list)
    assistant_messages: list[str] = field(default_factory=list)


def estimated_token_count(text: str) -> int:
    if not text:
        return 0
    return max(1, len(text) // 4)


def is_hook_injected_user_text(text: str) -> bool:
    stripped = text.strip()
    if not stripped:
        return False
    return any(pattern.search(stripped) is not None for pattern in HOOK_INJECTED_USER_PATTERNS)


def _content_text(content: object) -> str:
    if isinstance(content, str):
        return content
    if not isinstance(content, list):
        return ""
    parts: list[str] = []
    for item in content:
        if not isinstance(item, dict):
            continue
        item_type = item.get("type")
        if item_type in {"input_text", "output_text", "text"}:
            text = item.get("text")
            if isinstance(text, str) and text:
                parts.append(text)
    return "\n".join(parts)


def extract_chat_message(record: dict[str, object]) -> ChatMessage | None:
    if record.get("type") != "response_item":
        return None
    payload = record.get("payload")
    if not isinstance(payload, dict):
        return None
    if payload.get("type") != "message":
        return None
    role = payload.get("role")
    if role not in {"user", "assistant"}:
        return None
    text = _content_text(payload.get("content"))
    if not text.strip():
        return None
    return ChatMessage(role=role, text=text)


def load_chat_messages(transcript_path: str) -> list[ChatMessage]:
    messages: list[ChatMessage] = []
    try:
        with open(transcript_path, encoding="utf-8") as handle:
            for raw_line in handle:
                line = raw_line.strip()
                if not line:
                    continue
                try:
                    record = json.loads(line)
                except json.JSONDecodeError:
                    continue
                if not isinstance(record, dict):
                    continue
                message = extract_chat_message(record)
                if message is not None:
                    messages.append(message)
    except OSError:
        return []
    return messages


def build_turns(messages: list[ChatMessage]) -> list[ConversationTurn]:
    turns: list[ConversationTurn] = []
    current_turn: ConversationTurn | None = None

    for message in messages:
        if message.role == "user":
            if is_hook_injected_user_text(message.text):
                continue
            if current_turn is None or current_turn.assistant_messages:
                current_turn = ConversationTurn(user_texts=[message.text], assistant_messages=[])
                turns.append(current_turn)
            else:
                current_turn.user_texts.append(message.text)
            continue

        if current_turn is None:
            current_turn = ConversationTurn()
            turns.append(current_turn)
        current_turn.assistant_messages.append(message.text)

    return turns


def stitch_last_assistant_message(
    turns: list[ConversationTurn],
    last_assistant_message: str,
) -> list[ConversationTurn]:
    last_text = last_assistant_message.strip()
    if not last_text:
        return turns
    if not turns:
        return [ConversationTurn(assistant_messages=[last_text])]
    newest_turn = turns[-1]
    if newest_turn.assistant_messages and newest_turn.assistant_messages[-1].strip() == last_text:
        return turns
    newest_turn.assistant_messages.append(last_text)
    return turns


def _truncate_tail(text: str, max_chars: int) -> str:
    if max_chars <= 0:
        return ""
    if len(text) <= max_chars:
        return text
    keep = max_chars - 15
    if keep <= 0:
        return text[-max_chars:]
    return f"...[truncated]...\n{text[-keep:]}"


def _fit_to_token_budget(text: str, max_tokens: int) -> str:
    if max_tokens <= 0:
        return ""
    if estimated_token_count(text) <= max_tokens:
        return text
    return _truncate_tail(text, max_tokens * 4)


def _compress_earlier_assistant(text: str) -> str:
    compact = " ".join(text.split())
    if len(compact) <= EARLIER_ASSISTANT_CHAR_CAP:
        return compact
    return f"{compact[: EARLIER_ASSISTANT_CHAR_CAP - 3]}..."


def _user_body(turn: ConversationTurn) -> str:
    return "\n\n".join(text.strip() for text in turn.user_texts if text.strip()) or "(no user text)"


def _allocate_newest_first(texts: list[str], max_tokens: int) -> list[str]:
    if max_tokens <= 0:
        return ["" for _ in texts]
    allocated: list[str] = ["" for _ in texts]
    remaining = max_tokens
    for index in range(len(texts) - 1, -1, -1):
        fitted = _fit_to_token_budget(texts[index], remaining)
        allocated[index] = fitted
        remaining = max(0, remaining - estimated_token_count(fitted))
        if remaining <= 0:
            break
    return allocated


def format_turn(
    turn_index: int,
    turn: ConversationTurn,
    *,
    user_body: str,
    last_assistant_text: str | None,
    is_newest_turn: bool,
) -> str:
    lines: list[str] = [
        f"USER TURN {turn_index}",
        user_body or "(truncated)",
        "",
        f"ASSISTANT TURN {turn_index} ({len(turn.assistant_messages)} messages, last privileged)",
    ]
    if not turn.assistant_messages:
        lines.append("(no assistant text)")
        return "\n".join(lines)

    earlier_messages = turn.assistant_messages[:-1]
    for earlier in earlier_messages:
        lines.append(f"[earlier] {_compress_earlier_assistant(earlier)}")

    last_source = turn.assistant_messages[-1].strip()
    if is_newest_turn:
        lines.append(f"[last] {(last_assistant_text or last_source).strip()}")
    else:
        lines.append(f"[earlier] {_compress_earlier_assistant(last_source)}")
    return "\n".join(lines)


def render_window(
    turns: list[ConversationTurn],
    *,
    max_user_turns: int = DEFAULT_MAX_USER_TURNS,
    max_user_tokens: int = DEFAULT_MAX_USER_TOKENS,
    max_assistant_last_tokens: int = DEFAULT_MAX_ASSISTANT_LAST_TOKENS,
) -> str:
    selected_turns = turns[-max_user_turns:] if max_user_turns > 0 else []
    if not selected_turns:
        return "(empty conversation window)"

    start_index = len(turns) - len(selected_turns) + 1
    user_bodies = _allocate_newest_first([_user_body(turn) for turn in selected_turns], max_user_tokens)

    newest_last = ""
    if selected_turns[-1].assistant_messages:
        newest_last = _fit_to_token_budget(
            selected_turns[-1].assistant_messages[-1].strip(),
            max_assistant_last_tokens,
        )

    formatted_turns: list[str] = []
    last_offset = len(selected_turns) - 1
    for offset, turn in enumerate(selected_turns):
        formatted_turns.append(
            format_turn(
                start_index + offset,
                turn,
                user_body=user_bodies[offset],
                last_assistant_text=newest_last if offset == last_offset else None,
                is_newest_turn=offset == last_offset,
            )
        )
    return "\n\n".join(formatted_turns)


def build_stop_review_window(
    *,
    transcript_path: str | None,
    last_assistant_message: str,
    max_user_turns: int = DEFAULT_MAX_USER_TURNS,
    max_user_tokens: int = DEFAULT_MAX_USER_TOKENS,
    max_assistant_last_tokens: int = DEFAULT_MAX_ASSISTANT_LAST_TOKENS,
) -> str:
    messages: list[ChatMessage] = []
    if transcript_path:
        messages = load_chat_messages(transcript_path)
    turns = stitch_last_assistant_message(build_turns(messages), last_assistant_message)
    return render_window(
        turns,
        max_user_turns=max_user_turns,
        max_user_tokens=max_user_tokens,
        max_assistant_last_tokens=max_assistant_last_tokens,
    )


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Extract a bounded Codex Stop-review window")
    parser.add_argument("--transcript", default="", help="Path to Codex rollout JSONL")
    parser.add_argument(
        "--last-assistant",
        default="",
        help="Stop payload last_assistant_message; stitched as newest assistant line",
    )
    parser.add_argument("--max-user-turns", type=int, default=DEFAULT_MAX_USER_TURNS)
    parser.add_argument("--max-user-tokens", type=int, default=DEFAULT_MAX_USER_TOKENS)
    parser.add_argument("--max-assistant-last-tokens", type=int, default=DEFAULT_MAX_ASSISTANT_LAST_TOKENS)
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    transcript = args.transcript.strip() or None
    last_assistant = args.last_assistant or os.environ.get("CODEX_STOP_REVIEW_LAST_ASSISTANT", "")
    window = build_stop_review_window(
        transcript_path=transcript,
        last_assistant_message=last_assistant,
        max_user_turns=args.max_user_turns,
        max_user_tokens=args.max_user_tokens,
        max_assistant_last_tokens=args.max_assistant_last_tokens,
    )
    sys.stdout.write(window)
    if not window.endswith("\n"):
        sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
