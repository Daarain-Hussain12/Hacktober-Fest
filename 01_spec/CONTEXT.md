# Phase 01 — Technical specification

## Inputs

| File | Read for |
| --- | --- |
| `AGENTS.md`, `STATE.md` | authority, current phase, approvals, constraints |
| `_config/PRODUCT.md` | whole product and financial contract |
| actual source/manifests/lockfiles, if present | real existing stack; preserve work |

## Process

After user authorization, choose the smallest viable browser-first stack and an end-to-end demo path. Prefer frontend/local persistence and deterministic bundle generation; no API or server is needed for the core. Do not invent available tools or lock dependencies from memory. Record real runtime/dependency availability separately from proposed setup.

Specify data types (money, item IDs, quantities, optional costs), price-floor and bundle-generation rules, one-selected-offer state, invalidation after edits, and copy/card export. Explicitly bound candidate enumeration so stock size cannot freeze the UI. Give the owner a way to choose eligible items; no inferred food compatibility or safety.

Plan three connected views/sections: stock → offers → review/share. Include empty/error states, labelled sample data, keyboard/mobile use, persistence/reset, and missing-cost display. Define acceptance cases mapped to phase 03. Record implementation defaults as decisions, not fabricated prior approvals.

## Output and exit gate

Write `01_spec/output/SPEC.md`: stack rationale, source layout, schema, financial rules, algorithm, UI journey, export format, persistence, exact intended scripts, test plan, limitations, and phase-02 checklist. Intended commands are not “verified” until actually run. Update STATE.md.

Stop for owner review unless the current user instruction explicitly authorizes the next phase. Do not install dependencies or implement the app during a spec-only batch.
