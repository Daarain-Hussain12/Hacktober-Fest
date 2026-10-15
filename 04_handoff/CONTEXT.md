# Phase 04 — Demo and human handoff

## Inputs

| File | Read for |
| --- | --- |
| `AGENTS.md`, `STATE.md` | authority and current state |
| `01_spec/output/SPEC.md`, `02_build/output/BUILD.md` | actual product and commands |
| `03_verify/output/VERIFICATION.md` | proven behavior and limits |

## Process

Read the real verification report; do not turn failures into marketing claims. Produce a concise README with prerequisites, exact observed setup/dev/test/build commands, fictional-data/reset instructions, local-storage/no-key limitations, and user journey. No public deployment or push is implied.

Write a plain-language judge walkthrough: leftover stock → feasible owner-controlled offer → conditional economics → usable share card. Explain the business hypothesis without invented revenue, customers, accuracy, food saved, or emissions avoided. Call deterministic rules rules; optional AI is only AI if actually connected and exercised.

Perform a fresh-start smoke run using the documented commands when the environment permits; report any install/offline/browser limitations explicitly. Record where the locally produced card can be found and verify its contents. A frontend build alone does not prove this flow works.

## Output and exit gate

Write `README.md` and `04_handoff/output/DEMO.md`: demo steps, sample inputs, observed behavior, actual optional-AI status, limitations, and next development priorities. Update STATE.md with the exact runnable checkpoint and anything not verified. Done means the agreed artifact works and the evidence says so; it does not mean a production deployment or validated business.
