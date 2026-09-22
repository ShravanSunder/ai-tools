#!/usr/bin/env bash
# Stop-review classify defaults. JEV is primary. Luna runs when JEV fails.
# Env overlay: CODEX_STOP_REVIEW_MODEL, CODEX_STOP_REVIEW_REASONING_EFFORT,
# CODEX_STOP_REVIEW_REASONING_SUMMARY, CODEX_STOP_REVIEW_SERVICE_TIER,
# CODEX_STOP_REVIEW_LUNA_TIMEOUT, CODEX_STOP_REVIEW_HOME,
# CODEX_STOP_REVIEW_MAX_CONTINUES, CODEX_STOP_REVIEW_BACKEND,
# CODEX_STOP_REVIEW_JEV_MODEL, CODEX_STOP_REVIEW_JEV_YES,
# CODEX_STOP_REVIEW_OPENROUTER_OP_REF.

STOP_REVIEW_BACKEND_DEFAULT="jev"
STOP_REVIEW_MODEL_DEFAULT="gpt-6-luna"
STOP_REVIEW_JEV_MODEL_DEFAULT="jev-latest"
STOP_REVIEW_JEV_YES_DEFAULT="0.8"
# Machine overlay only. Do not put an op:// value in this git file.
# Deploy reads CODEX_STOP_REVIEW_OPENROUTER_OP_REF, then this default,
# then ~/.agents/stop-review/machine.env.
STOP_REVIEW_OPENROUTER_OP_REF_DEFAULT=""
# none | low | medium | high | xhigh | max  (Luna rejects minimal)
STOP_REVIEW_REASONING_EFFORT_DEFAULT="low"
STOP_REVIEW_REASONING_SUMMARY_DEFAULT="none"
# Codex Fast mode service_tier: fast | priority.
# default | off | empty = no service_tier override.
STOP_REVIEW_SERVICE_TIER_DEFAULT="fast"
STOP_REVIEW_LUNA_TIMEOUT_DEFAULT="40"
# Isolated reviewer Codex home. Not ~/.codex and not a named --profile.
STOP_REVIEW_HOME_DEFAULT="${HOME}/.codex-reviewer"
# Max continue_work blocks per turn, including nested Stops. Then allow.
STOP_REVIEW_MAX_CONTINUES_DEFAULT="6"
