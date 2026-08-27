#!/usr/bin/env python3

"""Run the Stop-review classifier on the existing Codex app-server control socket."""

import argparse
import base64
import hashlib
import json
import os
import secrets
import socket
import struct
import sys
import typing as t
from pathlib import Path

DEFAULT_SOCKET_PATH: str = os.path.join(
    os.environ.get("CODEX_HOME", os.path.expanduser("~/.codex")),
    "app-server-control",
    "app-server-control.sock",
)
HANDSHAKE_PATH: str = "/rpc"
WS_GUID: str = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
TEXT_OPCODE: int = 0x1
CLOSE_OPCODE: int = 0x8
MAX_FRAME_BYTES: int = 16 * 1024 * 1024


class UnixWebSocket:
    def __init__(self, sock: socket.socket) -> None:
        self._sock = sock
        self._buffer = bytearray()

    def send_text(self, payload: str) -> None:
        encoded = payload.encode("utf-8")
        header = bytearray()
        header.append(0x80 | TEXT_OPCODE)
        length = len(encoded)
        mask_bit = 0x80
        if length < 126:
            header.append(mask_bit | length)
        elif length < 65536:
            header.append(mask_bit | 126)
            header.extend(struct.pack("!H", length))
        else:
            header.append(mask_bit | 127)
            header.extend(struct.pack("!Q", length))
        mask = secrets.token_bytes(4)
        header.extend(mask)
        masked = bytes(b ^ mask[index % 4] for index, b in enumerate(encoded))
        self._sock.sendall(header + masked)

    def recv_text(self) -> str:
        while True:
            opcode, payload = self._recv_frame()
            if opcode == CLOSE_OPCODE:
                raise ConnectionError("app-server closed the websocket")
            if opcode == TEXT_OPCODE:
                return payload.decode("utf-8")

    def close(self) -> None:
        try:
            header = bytearray([0x80 | CLOSE_OPCODE, 0x80 | 2])
            mask = secrets.token_bytes(4)
            header.extend(mask)
            payload = bytes(b ^ mask[index % 4] for index, b in enumerate(b"\x03\xe8"))
            self._sock.sendall(header + payload)
        except OSError:
            pass
        self._sock.close()

    def _recv_exact(self, size: int) -> bytes:
        while len(self._buffer) < size:
            chunk = self._sock.recv(65536)
            if not chunk:
                raise ConnectionError("app-server socket closed")
            self._buffer.extend(chunk)
        data = bytes(self._buffer[:size])
        del self._buffer[:size]
        return data

    def _recv_frame(self) -> tuple[int, bytes]:
        header = self._recv_exact(2)
        opcode = header[0] & 0x0F
        masked = header[1] & 0x80
        length = header[1] & 0x7F
        if length == 126:
            length = struct.unpack("!H", self._recv_exact(2))[0]
        elif length == 127:
            length = struct.unpack("!Q", self._recv_exact(8))[0]
        if length > MAX_FRAME_BYTES:
            raise ValueError("websocket frame too large")
        mask = self._recv_exact(4) if masked else b""
        payload = self._recv_exact(length)
        if masked:
            payload = bytes(b ^ mask[index % 4] for index, b in enumerate(payload))
        return opcode, payload


def connect_unix_websocket(socket_path: str) -> UnixWebSocket:
    sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
    sock.settimeout(10)
    sock.connect(socket_path)
    key = base64.b64encode(secrets.token_bytes(16)).decode("ascii")
    request = (
        f"GET {HANDSHAKE_PATH} HTTP/1.1\r\n"
        "Host: localhost\r\n"
        "Upgrade: websocket\r\n"
        "Connection: Upgrade\r\n"
        f"Sec-WebSocket-Key: {key}\r\n"
        "Sec-WebSocket-Version: 13\r\n"
        "\r\n"
    )
    sock.sendall(request.encode("ascii"))
    response = bytearray()
    while b"\r\n\r\n" not in response:
        chunk = sock.recv(4096)
        if not chunk:
            raise ConnectionError("websocket handshake closed")
        response.extend(chunk)
    header_text, _, leftover = bytes(response).partition(b"\r\n\r\n")
    if b"101" not in header_text.split(b"\r\n", 1)[0]:
        raise ConnectionError(f"websocket handshake failed: {header_text.decode('latin1')[:200]}")
    expected = base64.b64encode(hashlib.sha1((key + WS_GUID).encode("ascii")).digest()).decode("ascii")
    accept = ""
    for line in header_text.decode("latin1").split("\r\n"):
        if line.lower().startswith("sec-websocket-accept:"):
            accept = line.split(":", 1)[1].strip()
    if accept != expected:
        raise ConnectionError("websocket accept mismatch")
    ws = UnixWebSocket(sock)
    ws._buffer.extend(leftover)
    return ws


def extract_agent_message_text(payload: object) -> str:
    texts: list[str] = []

    def walk(value: object) -> None:
        if isinstance(value, dict):
            item_type = value.get("type")
            if item_type == "agentMessage":
                text = value.get("text")
                if isinstance(text, str) and text.strip():
                    texts.append(text)
            for nested in value.values():
                walk(nested)
        elif isinstance(value, list):
            for nested in value:
                walk(nested)

    walk(payload)
    return texts[-1] if texts else ""


def default_control_socket_path() -> str:
    return DEFAULT_SOCKET_PATH


class AppServerClassifierClient:
    def __init__(self, ws: UnixWebSocket) -> None:
        self._ws = ws
        self._next_id = 1

    def initialize(self) -> None:
        request_id = self._request(
            "initialize",
            {
                "clientInfo": {
                    "name": "stop-review",
                    "title": "Codex Stop-review",
                    "version": "1",
                },
                "capabilities": {
                    "experimentalApi": True,
                    "optOutNotificationMethods": [
                        "item/agentMessage/delta",
                        "item/agentReasoning/delta",
                    ],
                },
            },
        )
        self._wait_for_response(request_id)
        self._notify("initialized", {})

    def classify(
        self,
        *,
        prompt: str,
        output_schema: dict[str, object],
        model: str,
        effort: str,
        summary: str,
        service_tier: str,
        cwd: str,
    ) -> str:
        thread_params: dict[str, object] = {
            "model": model,
            "cwd": cwd,
            "approvalPolicy": "never",
            "sandbox": "read-only",
            "ephemeral": True,
            "environments": [],
            "config": {
                "model_reasoning_effort": effort,
                "model_reasoning_summary": summary,
            },
        }
        thread_id = self._request("thread/start", thread_params)
        thread_response = self._wait_for_response(thread_id)
        thread = thread_response.get("result", {}).get("thread") or {}
        started_thread_id = thread.get("id")
        if not isinstance(started_thread_id, str) or not started_thread_id:
            raise RuntimeError(f"thread/start missing id: {thread_response}")

        turn_params: dict[str, object] = {
            "threadId": started_thread_id,
            "input": [{"type": "text", "text": prompt}],
            "model": model,
            "effort": effort,
            "summary": summary,
            "outputSchema": output_schema,
            "approvalPolicy": "never",
        }
        if service_tier:
            turn_params["serviceTier"] = service_tier
        turn_request_id = self._request("turn/start", turn_params)
        self._wait_for_response(turn_request_id)
        completed = self._wait_for_notification("turn/completed")
        text = extract_agent_message_text(completed)
        if not text:
            raise RuntimeError("turn/completed had no agentMessage")
        unsubscribe_id = self._request("thread/unsubscribe", {"threadId": started_thread_id})
        try:
            self._wait_for_response(unsubscribe_id)
        except Exception:
            pass
        return text

    def _request(self, method: str, params: dict[str, object]) -> int:
        request_id = self._next_id
        self._next_id += 1
        self._ws.send_text(json.dumps({"id": request_id, "method": method, "params": params}))
        return request_id

    def _notify(self, method: str, params: dict[str, object]) -> None:
        self._ws.send_text(json.dumps({"method": method, "params": params}))

    def _read_message(self) -> dict[str, object]:
        raw = self._ws.recv_text()
        parsed: object = json.loads(raw)
        if not isinstance(parsed, dict):
            raise RuntimeError("app-server sent non-object JSON")
        message = t.cast(dict[str, object], parsed)
        if "method" in message and "id" in message and "result" not in message and "error" not in message:
            self._ws.send_text(
                json.dumps(
                    {
                        "id": message["id"],
                        "error": {"code": -32601, "message": f"unsupported `{message.get('method')}`"},
                    }
                )
            )
        return message

    def _wait_for_response(self, request_id: int) -> dict[str, object]:
        while True:
            message = self._read_message()
            if message.get("id") == request_id:
                if "error" in message:
                    raise RuntimeError(f"app-server error: {message['error']}")
                return message

    def _wait_for_notification(self, method: str) -> dict[str, object]:
        while True:
            message = self._read_message()
            if message.get("method") == method:
                params = message.get("params")
                if isinstance(params, dict):
                    return t.cast(dict[str, object], params)
                return message


def run_classifier(args: argparse.Namespace) -> str:
    schema = json.loads(Path(args.output_schema).read_text(encoding="utf-8"))
    prompt = Path(args.prompt_file).read_text(encoding="utf-8") if args.prompt_file else sys.stdin.read()
    ws = connect_unix_websocket(args.socket)
    client = AppServerClassifierClient(ws)
    try:
        client.initialize()
        return client.classify(
            prompt=prompt,
            output_schema=schema,
            model=args.model,
            effort=args.effort,
            summary=args.summary,
            service_tier=args.service_tier,
            cwd=args.cwd,
        )
    finally:
        ws.close()


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser()
    parser.add_argument("--socket", default=default_control_socket_path())
    parser.add_argument("--prompt-file")
    parser.add_argument("--output-schema", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--model", required=True)
    parser.add_argument("--effort", required=True)
    parser.add_argument("--summary", required=True)
    parser.add_argument("--service-tier", default="")
    parser.add_argument("--cwd", default=os.getcwd())
    return parser


def main() -> int:
    args = build_parser().parse_args()
    text = run_classifier(args)
    Path(args.output).write_text(text, encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
