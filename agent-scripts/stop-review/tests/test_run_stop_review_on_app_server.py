#!/usr/bin/env python3

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from run_stop_review_on_app_server import extract_agent_message_text


class ExtractAgentMessageTests(unittest.TestCase):
    def test_reads_last_agent_message(self) -> None:
        payload = {
            "turn": {
                "items": [
                    {"type": "userMessage", "text": "prompt"},
                    {"type": "agentMessage", "text": '{"decision":"stop_ok","reason":"done","cot":"x"}'},
                ]
            }
        }
        self.assertIn("stop_ok", extract_agent_message_text(payload))

    def test_empty_when_missing(self) -> None:
        self.assertEqual(extract_agent_message_text({"turn": {"items": []}}), "")


if __name__ == "__main__":
    unittest.main()
