#!/usr/bin/env python3

import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from extract_stop_review_window import (
    ChatMessage,
    ConversationTurn,
    build_stop_review_window,
    build_turns,
    is_hook_injected_user_text,
    render_window,
    stitch_last_assistant_message,
)


def _message_record(role: str, text: str) -> str:
    return json.dumps(
        {
            "type": "response_item",
            "payload": {
                "type": "message",
                "role": role,
                "content": [{"type": "input_text" if role == "user" else "output_text", "text": text}],
            },
        }
    )


class HookInjectedUserTests(unittest.TestCase):
    def test_detects_legacy_regex_block_reason(self) -> None:
        self.assertTrue(
            is_hook_injected_user_text(
                "Do not stop with a steering acknowledgement or a restatement of the user's instruction."
            )
        )

    def test_detects_outstanding_job_order(self) -> None:
        self.assertTrue(
            is_hook_injected_user_text(
                "Outstanding job is still implement the Stop gate. Do not stop after answering."
            )
        )

    def test_leaves_normal_user_text(self) -> None:
        self.assertFalse(is_hook_injected_user_text("are you parallelizing work with subagents?"))

    def test_detects_stop_review_classifier_envelope(self) -> None:
        self.assertTrue(
            is_hook_injected_user_text(
                "From Stop-review classifier agent:\n"
                "Continue the named design work; do not implement product code."
            )
        )
        self.assertTrue(
            is_hook_injected_user_text(
                '<hook_prompt hook_run_id="stop:1:/Users/shravansunder/.codex/hooks.json">'
                "Continue the outstanding implementation and verification work now; do not stop unless an exact blocker prevents progress."
                "</hook_prompt>"
            )
        )


class TurnCollapseTests(unittest.TestCase):
    def test_merges_consecutive_user_items_including_skill_dump(self) -> None:
        messages = [
            ChatMessage(role="user", text="continue the remediation"),
            ChatMessage(role="user", text="<skill> orchestrator-goal dump"),
            ChatMessage(role="assistant", text="progress 1"),
            ChatMessage(role="assistant", text="progress 2"),
            ChatMessage(role="assistant", text="I'll treat that as the naming rule"),
        ]
        turns = build_turns(messages)
        self.assertEqual(len(turns), 1)
        self.assertEqual(len(turns[0].user_texts), 2)
        self.assertEqual(len(turns[0].assistant_messages), 3)

    def test_skips_developer_by_absence_and_skips_hook_injected_user(self) -> None:
        messages = [
            ChatMessage(role="user", text="implement the tokens"),
            ChatMessage(role="assistant", text="working"),
            ChatMessage(role="user", text="Do not stop with a steering acknowledgement. Continue the task now."),
            ChatMessage(role="assistant", text="ack only"),
        ]
        turns = build_turns(messages)
        self.assertEqual(len(turns), 1)
        self.assertEqual(turns[0].user_texts, ["implement the tokens"])
        self.assertEqual(turns[0].assistant_messages, ["working", "ack only"])

    def test_new_user_after_assistant_starts_new_turn(self) -> None:
        messages = [
            ChatMessage(role="user", text="implement X"),
            ChatMessage(role="assistant", text="working on X"),
            ChatMessage(role="user", text="are you parallelizing?"),
            ChatMessage(role="assistant", text="yes, two lanes"),
        ]
        turns = build_turns(messages)
        self.assertEqual(len(turns), 2)
        self.assertEqual(turns[1].user_texts, ["are you parallelizing?"])


class WindowRenderTests(unittest.TestCase):
    def test_privileges_last_assistant_and_compresses_earlier(self) -> None:
        turns = [
            ConversationTurn(
                user_texts=["implement X"],
                assistant_messages=["progress note one", "progress note two", "Yes, I'll keep the naming rule."],
            )
        ]
        window = render_window(turns, max_user_turns=3)
        self.assertIn("USER TURN 1", window)
        self.assertIn("[last] Yes, I'll keep the naming rule.", window)
        self.assertIn("[earlier] progress note one", window)
        self.assertIn("[earlier] progress note two", window)

    def test_leads_with_latest_user_and_last(self) -> None:
        turns = [
            ConversationTurn(user_texts=["older job"], assistant_messages=["working"]),
            ConversationTurn(user_texts=["draw the options"], assistant_messages=["A or B, which do you want?"]),
        ]
        window = render_window(turns, max_user_turns=5)
        lead = window.split("Earlier turns follow for context.", 1)[0]
        self.assertTrue(window.startswith("Read first:"))
        self.assertIn("LATEST USER TURN", lead)
        self.assertIn("draw the options", lead)
        self.assertIn("[last] A or B, which do you want?", lead)
        self.assertNotIn("older job", lead)
        self.assertIn("older job", window)

    def test_keeps_last_five_user_turns(self) -> None:
        turns = [
            ConversationTurn(user_texts=[f"user {index}"], assistant_messages=[f"asst {index}"])
            for index in range(1, 8)
        ]
        window = render_window(turns, max_user_turns=5)
        self.assertNotIn("USER TURN 1", window)
        self.assertNotIn("USER TURN 2", window)
        self.assertIn("USER TURN 3", window)
        self.assertIn("USER TURN 7", window)

    def test_last_user_turn_uses_larger_char_cap(self) -> None:
        older = "O" * 2500
        newest = "N" * 5000
        turns = [
            ConversationTurn(user_texts=[older], assistant_messages=["old asst"]),
            ConversationTurn(user_texts=[newest], assistant_messages=["new asst"]),
        ]
        window = render_window(
            turns,
            max_user_turns=5,
            max_user_chars_per_turn=2000,
            max_last_user_chars=4000,
            max_assistant_last_chars=4000,
        )
        self.assertIn("...[truncated]...", window)
        self.assertLess(window.count("O"), 2100)
        self.assertGreater(window.count("N"), 7900)
        self.assertLess(window.count("N"), 8200)

    def test_per_turn_user_cap_keeps_older_user_text(self) -> None:
        turns = [
            ConversationTurn(user_texts=["implement the tokens"], assistant_messages=["started"]),
            ConversationTurn(user_texts=["A" * 8000], assistant_messages=["still going"]),
        ]
        window = render_window(
            turns,
            max_user_turns=5,
            max_user_chars_per_turn=40,
            max_last_user_chars=40,
        )
        self.assertIn("implement the tokens", window)
        self.assertIn("USER TURN 1", window)
        self.assertIn("...[truncated]...", window)

    def test_earlier_assistant_uses_one_thousand_char_cap(self) -> None:
        earlier = "E" * 1500
        turns = [
            ConversationTurn(user_texts=["job"], assistant_messages=[earlier, "last line"]),
        ]
        window = render_window(
            turns,
            earlier_assistant_char_cap=1000,
            max_assistant_last_chars=4000,
        )
        earlier_line = next(
            line
            for line in window.splitlines()
            if line.startswith("[earlier]")
        )
        self.assertLessEqual(len(earlier_line.removeprefix("[earlier] ").strip()), 1000)

    def test_user_cap_does_not_drop_last_assistant(self) -> None:
        huge_user = "A" * 8000
        last_line = "STOP CANDIDATE UNIQUE"
        turns = [
            ConversationTurn(user_texts=[huge_user], assistant_messages=["old progress", last_line]),
        ]
        window = render_window(
            turns,
            max_user_turns=3,
            max_user_chars_per_turn=40,
            max_last_user_chars=40,
            max_assistant_last_chars=200,
        )
        self.assertIn("USER TURN 1", window)
        self.assertIn(last_line, window)
        self.assertIn("...[truncated]...", window)
        self.assertNotIn("A" * 200, window)

    def test_assistant_cap_does_not_drop_user_turn(self) -> None:
        last_line = "B" * 8000
        turns = [
            ConversationTurn(user_texts=["keep this user ask"], assistant_messages=["old progress", last_line]),
        ]
        window = render_window(
            turns,
            max_user_turns=3,
            max_user_chars_per_turn=200,
            max_last_user_chars=200,
            max_assistant_last_chars=40,
        )
        self.assertIn("USER TURN 1", window)
        self.assertIn("keep this user ask", window)
        self.assertIn("[last]", window)
        self.assertIn("...[truncated]...", window)

    def test_stitches_last_assistant_when_transcript_lags(self) -> None:
        turns = stitch_last_assistant_message(
            [ConversationTurn(user_texts=["job"], assistant_messages=["working"])],
            "final ack",
        )
        self.assertEqual(turns[-1].assistant_messages[-1], "final ack")

    def test_missing_transcript_falls_back_to_last_assistant(self) -> None:
        window = build_stop_review_window(
            transcript_path=None,
            last_assistant_message="only this assistant line",
        )
        self.assertIn("[last] only this assistant line", window)

    def test_jsonl_file_round_trip(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            transcript_path = Path(temp_dir) / "rollout.jsonl"
            records = [
                _message_record("developer", "should be ignored"),
                _message_record("user", "implement the tokens"),
                _message_record("user", "<skill> dump"),
                _message_record("assistant", "progress a"),
                _message_record("assistant", "progress b"),
                _message_record("user", "are you parallelizing?"),
                _message_record("assistant", "yes"),
            ]
            # developer records are skipped by extract_chat_message; write a developer line anyway
            developer_line = json.dumps(
                {
                    "type": "response_item",
                    "payload": {
                        "type": "message",
                        "role": "developer",
                        "content": [{"type": "input_text", "text": "team instructions"}],
                    },
                }
            )
            transcript_path.write_text("\n".join([developer_line, *records[1:]]) + "\n", encoding="utf-8")
            window = build_stop_review_window(
                transcript_path=str(transcript_path),
                last_assistant_message="yes",
                max_user_turns=3,
            )
        self.assertIn("implement the tokens", window)
        self.assertIn("<skill> dump", window)
        self.assertIn("are you parallelizing?", window)
        self.assertIn("[last] yes", window)
        self.assertNotIn("team instructions", window)


if __name__ == "__main__":
    unittest.main()
