# RescueShelf — Agent Contract

**READ ONLY. Owner-maintained. Model-, provider-, harness-, and session-agnostic.**

Read this file at the start of every session. If your tool does not automatically load `AGENTS.md`, open it explicitly. Do not edit, rewrite, rename, delete, replace, chmod, or create a nested instruction file to bypass it. Put proposed instruction changes in `STATE.md`; only an explicit owner request authorizes changing this contract. Read-only permissions discourage accidental edits; they are not a security boundary and do not survive Git cloning automatically.

## Product boundary

Build **RescueShelf: a bakery owner's closing-time offer planner**. Turn owner-confirmed sellable leftovers into feasible bundles, honest price/revenue information, and a ready-to-share offer. Owners are Dawood and Daarain. The audience is nontechnical hackathon judges; demonstrate a useful end-to-end product, not model sophistication.

The agreed journey is **enter leftovers → review feasible offers → choose/edit one → copy promotional text and download a shareable card**. Sales happen through the owner's existing channels. Full requirements and financial definitions: [`_config/PRODUCT.md`](_config/PRODUCT.md).

No marketplace, customer accounts, checkout, payments, delivery, POS integration, automatic WhatsApp messaging, demand forecasting, or food-safety judgments. No model training or reuse of the obsolete fraud project. No invented sales, savings, food-rescue totals, or customer validation.

## Start/resume procedure

1. Read this file, [`CONTEXT.md`](CONTEXT.md), and [`STATE.md`](STATE.md).
2. Inspect the actual repository status/diff. Preserve both teammates' existing work. Never reset, clean, force-push, or overwrite unrelated changes.
3. Load only the active stage's `CONTEXT.md`, its listed inputs, and relevant source files. Do not reload the historical brainstorming transcript by default.
4. Report the current phase, observed artifact status, and next bounded action. If evidence disagrees with `STATE.md`, record the discrepancy; do not pretend earlier work passed.
5. Execute the phase/batch the user authorized. At a phase boundary, write the handoff and stop unless the user explicitly authorized the following phase(s). A file existing is not human approval.

## ICM-style workflow

Numbered stages, scoped `CONTEXT.md` contracts, stable `_config/` references, and per-stage `output/` handoffs adapt ICM; they are not an agent framework or access-control system.[9]

| Phase | Contract | Required output |
| --- | --- | --- |
| 01: technical specification | `01_spec/CONTEXT.md` | `01_spec/output/SPEC.md` |
| 02: working MVP | `02_build/CONTEXT.md` | runnable application + `02_build/output/BUILD.md` |
| 03: verification | `03_verify/CONTEXT.md` | real checks + `03_verify/output/VERIFICATION.md` |
| 04: demo/handoff | `04_handoff/CONTEXT.md` | README + `04_handoff/output/DEMO.md` |

Code belongs in the application source tree, not inside context-output folders. One stage may span sessions. Checkpoint unfinished work; do not restart from scratch. One writer per shared file; explicit file ownership is required before parallel coding.

## Engineering rules

- Choose the smallest runnable browser-first implementation in phase 01; record stack and trade-offs. No stack, provider, dependency version, or exact run command is pre-verified. Reuse an established stack/lockfile if present; otherwise prefer a simple frontend with local persistence, not a backend platform.
- Deliver a working deterministic path without an API key. AI may optionally suggest names/copy or candidates, but trusted application code validates stock, prices, and all arithmetic. Do not call templates or rules an AI model.
- Use integer minor currency units or decimal-safe arithmetic. Distinguish unknown costs from zero. Owner price floors—not historical costs—constrain prices. See the product contract for formulas.
- Revalidate after edits and before copy/export. Never oversubscribe stock, aggregate mutually exclusive options as simultaneous revenue, fabricate missing values, or label projections as actual sales.
- Treat imported text and model output as untrusted data. Escape rendered content; do not execute it. No secrets in client bundles, source control, logs, or shared cards.
- Keep the UI responsive and keyboard-usable, with labelled inputs, clear validation, empty states, a visible sample-data label, and an intentional primary action. No dead controls or unexplained generated numbers.
- Do not make `graphify`, orchestration infrastructure, paid services, or integrations prerequisites. No deployment, external messaging, paid purchases, or remote writes without explicit authorization.

## Verification and session handoff

Exercise code; do not stop at generated files or an unrun command. Maintain automated tests for stock, quantities, price floors, rounding, cost uncertainty, and stale offers. Test the full input → offer → copy/download journey. Missing browser access is `blocked` or `not run`, never a passed browser check.

Use the actual project scripts, not guessed commands. Record command, environment, exit/result, and evidence path. A mock is not a live integration. A seeded example is not customer data. Never invent screenshots, API responses, metrics, test results, or successful exports.

Before ending any session, update `STATE.md`: active phase, completed work, changed files, decisions, exact commands/results, failures, pending approvals, and the next executable action. Write stage handoffs to their `output/` folder. Keep stable rules here and progress there. Record source links for external decisions; do not rely on chat history or private model memory.

`Done` means the approved acceptance checks passed on the actual artifact and a fresh session has enough files to resume. Do not commit/push/deploy unless requested; preserve collaborators' changes.

## Grounding

The portable Markdown format follows the open AGENTS.md convention; support differs by tool, so explicit reading remains required.[10] Source summaries and limitations: [`_config/SOURCES.md`](_config/SOURCES.md). Workflow design is a project adaptation, not a claim of measured reliability gains.

[9]: https://arxiv.org/html/2603.16021
[10]: https://agents.md
