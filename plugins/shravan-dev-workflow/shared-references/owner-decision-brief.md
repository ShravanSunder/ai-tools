# Owner-decision brief

Use this when a skill needs the owner to decide something about design: domain boundaries, storage boundaries (what is stored, where, who owns it, what it means), architecture, contracts between parts, product behavior, the shape of the design itself (how it decomposes and which abstractions carry weight), or a correction that would change any of them. Procedure (sequencing, PR grouping, agent or model choice, review rounds, work home) is decided and recorded, never briefed.

Return one brief per decision, in this order:

1. **The decision in one sentence**, in the owner's words where possible.
2. **The current model, drawn.** Load `presentation-tui` or `presentation-webui` for the host and draw what exists today: the parts, who owns what, and the path that matters.
3. **Each option, drawn as a change to that picture**, with what it gains, what it costs, and who bears the cost.
4. **Your recommendation and why.**
5. **What happens if the owner defers**: what stays blocked and what continues.

Good briefs look like the ones owners accept quickly: one picture of today, one picture per option, a clear pick. Bad briefs are option menus with a preselected answer, several unrelated decisions bundled into one prompt, and internal jargon the owner has not used.

A question tool may carry the final pick only after the brief is on screen. Ask once. Later updates point back to the open brief in one line instead of asking again.

Complete when the owner can decide from the brief alone, without opening a file.
