# Specification: Scenario Label Summary

Identity: specification-scenario-label-summary-v1

- A pure formatter accepts scenario identities and returns stable `skill: count` lines sorted by skill.
- Empty input returns an empty list.
- Duplicate scenario identities are rejected before formatting.
- Unit tests prove ordering, grouping, empty input, and duplicate rejection.
