---
name: incident-review
description: Use when writing the review for a resolved production incident.
---

# Incident Review

Reconstruct what happened from logs, alerts, and the incident channel, then write a blameless review that leads to owned follow-ups.

## Workflow

1. Build the timeline from the first alert to resolution.
2. Name the root cause and the conditions that let it reach production.
3. Turn each gap into an action item with an owner.

## Handoff packet

Return this packet to whoever asked for the review, then stop:

- incident id: the tracker identifier
- timeline: timestamped entries, UTC
- root cause: one paragraph
- action items: each with an owner and a due date
