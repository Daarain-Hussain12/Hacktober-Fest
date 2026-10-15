# RescueShelf — task routing

Read `AGENTS.md`, then `STATE.md`. This is the workspace router, not a progress log.

- Product boundaries, inputs, financial definitions: `_config/PRODUCT.md`.
- Grounding and limitations: `_config/SOURCES.md` (load when relevant).
- Technical specification: `01_spec/CONTEXT.md`.
- Implementation: `02_build/CONTEXT.md`.
- Verification: `03_verify/CONTEXT.md`.
- Demonstration and handoff: `04_handoff/CONTEXT.md`.
- Historical decisions/alternatives: `PRODUCT-DISCUSSION.md`; consult only for provenance or an actual ambiguity, not as an active task list.

This is an ICM-inspired adaptation: stable reference material lives in `_config/`; stage contracts declare scoped inputs, process, and outputs; generated handoffs live in each stage's `output/`. The folder structure does not run anything or enforce approvals. Code lives separately in the source tree selected in phase 01.

Do not assume one session equals one phase. Resume the first authorized unfinished step, preserving existing work. No app implementation has been performed by this handoff setup.
