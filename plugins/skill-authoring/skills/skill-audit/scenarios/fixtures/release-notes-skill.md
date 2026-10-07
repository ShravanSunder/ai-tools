---
name: release-notes
description: Use when drafting release notes for a tagged version from merged pull requests.
---

# Release Notes

Collect the merged pull requests since the previous tag, group them by user-facing area, and write notes a customer can read without the code.

## Workflow

1. List merged pull requests between the previous tag and the new one.
2. Group them by area; drop internal-only changes.
3. Write one line per change in the customer's words, breaking changes first.

## Handoff packet

Return this packet to whoever asked for the notes, then stop:

- version: the new tag
- highlights: three lines at most
- breaking changes: each with the action a customer must take
- migration link: the docs page, or "none"
