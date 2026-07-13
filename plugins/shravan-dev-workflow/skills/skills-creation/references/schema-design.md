# Schema Design

Schemas are reusable shapes. Most skills use `SKILL.md` plus ordinary references. Add a schema only when downstream work needs a stable shape it can reuse or validate.

This reference owns reusable shape design for lanes, repeated output slots, tool-validated artifacts, and other consumers that rely on the same fields. Return the schema kind, owned fields, validation route, and consumer links.

## Schema Family

Use one of these schema names instead of inventing new terminology:

```text
lane input/context shape   -> references/<name>-lane-schema.md
shared model output shape  -> references/<name>-output-schema.md
tool-validated shape       -> schemas/<name>.schema.json or references/<name>-tool-schema.md
```

A `lane-schema` is the input shape plus the context a lane needs, such as source anchors, inspect list, non-goals, security context, and required return shape.

## When To Extract

Extract a schema when at least one real consumer needs the shape to stay stable:

- multiple lanes return the same finding/result shape;
- a lane needs a repeatable input/context shape;
- several references need the same required slots;
- another skill consumes the output;
- a tool, test, CI check, or runtime validates the structure.

Keep single-use slots in the branch reference. A skill with no independent lanes, shared outputs, or tool validation usually needs no schema file.

## Schema Rules

- Own field names, required slots, allowed values, and ordering.
- Keep judgment near the branch or lane: mission, calibration, examples, and policy prose live in the consuming reference.
- Link to the schema from each consumer instead of copying the field list.
- Let the main workflow own acceptance and reduction; lanes return shaped candidate data.
- Use JSON Schema only when structure is machine-validated.

## Fit Signals

- `lane-schema`: independent lanes share route, input, or return fields.
- `output-schema`: multiple consumers need the same model-readable result shape.
- `tool-schema`: a tool, test, CI check, or runtime validates the fields.
- not a schema: one branch owns the slots, or the content is a term, executable mechanic, example, or rule. Return to `reference-design.md` for placement.

## Acceptance Check

Before adding a schema, answer:

```text
schema kind: lane-schema | output-schema | tool-schema
consumer:
shape owned:
required fields:
allowed values:
markdown or JSON:
validator/test if tool-schema:
where consumers link to it:
```

If the consumer is not real, keep the shape in the branch reference.
