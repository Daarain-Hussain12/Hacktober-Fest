# Phase 03 — Verify the actual artifact

## Inputs

| File | Read for |
| --- | --- |
| `AGENTS.md`, `STATE.md` | authority and checkpoint |
| `_config/PRODUCT.md`, `01_spec/output/SPEC.md` | requirements and expected behavior |
| `02_build/output/BUILD.md`, source/tests/scripts | actual runnable target |

## Required checks

- Happy path: seeded fictional inventory → valid bundle/price → edit → matching preview → clipboard action and locally downloaded card. Inspect exported content, not just a click event.
- Stock limits: zero stock, insufficient recipe stock, changing stock after selection, whole-unit validation, no oversubscription, and no stock deduction merely for generating an offer.
- Prices: floor obeyed, price above regular rejected, owner-permitted price below historical cost allowed with honest display, decimal input/rounding, and invalid NaN/infinity/negative inputs.
- Cost uncertainty: missing cost produces unavailable cost comparison, not assumed zero or invented profit.
- Alternatives: potential revenues from mutually exclusive options never summed as actual recovery.
- Integrity: offer text/card updates after edits; unknown ingredients/allergens/certification are not invented. Hostile item names render as data, not executable HTML.
- UX: empty inventory, reset, refresh persistence, mobile-width controls, labelled/keyboard-operable inputs, useful failures when clipboard/export is unavailable, and no-key operation.
- Run actual project tests, type checks, and production build. Document exact commands/exit results. Check browser console/runtime where browser access exists. If missing, explicitly mark browser checks not run and provide an executable manual checklist; this does not pass those checks.

Use reproducible fixtures, including the numeric example in the product reference. Add regression tests for defects fixed. Retain failed-run evidence; do not convert absence of evidence into a pass.

## Output and exit gate

Write `03_verify/output/VERIFICATION.md`: requirement-by-requirement pass/fail/blocked/not-run matrix, commands/results/evidence, fixes, and remaining limitations. Update STATE.md. Do not declare the product complete while a required acceptance case is failed or unrun. Stop for review unless handoff is already authorized.
