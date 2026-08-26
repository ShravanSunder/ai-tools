#!/usr/bin/env bash
# Nested Luna classify defaults. Edit here.
# Env overlay: CODEX_STOP_REVIEW_MODEL, CODEX_STOP_REVIEW_REASONING_EFFORT,
# CODEX_STOP_REVIEW_REASONING_SUMMARY, CODEX_STOP_REVIEW_SERVICE_TIER,
# CODEX_STOP_REVIEW_LUNA_TIMEOUT.

STOP_REVIEW_MODEL_DEFAULT="gpt-5.6-luna"
# none | low | medium | high | xhigh | max  (Luna rejects minimal)
STOP_REVIEW_REASONING_EFFORT_DEFAULT="low"
STOP_REVIEW_REASONING_SUMMARY_DEFAULT="none"
# Codex Fast mode service_tier: fast | priority.
# default | off | empty = no service_tier override.
STOP_REVIEW_SERVICE_TIER_DEFAULT="fast"
STOP_REVIEW_LUNA_TIMEOUT_DEFAULT="40"
