---
name: migration-check
description: Use when reviewing a database schema migration before it runs in production.
---

# Migration Check

Read the migration and the schema it changes, run it against a copy of production data, and decide whether it is safe to apply.

## Workflow

1. List every table and index the migration touches.
2. Run it on a production-sized copy and note locks and duration.
3. Write the rollback steps and confirm they restore the previous schema.

## Handoff packet

Return this packet to whoever asked for the check, then stop:

- schema version: before and after
- tables touched: with expected lock time
- rollback plan: ordered steps
- dry-run result: duration and any errors
