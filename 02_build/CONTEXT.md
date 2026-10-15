# Phase 02 — Working MVP

## Inputs

| File | Read for |
| --- | --- |
| `AGENTS.md`, `STATE.md` | contract, authorization, latest checkpoint |
| `_config/PRODUCT.md` | constraints and formulas |
| `01_spec/output/SPEC.md` | approved implementation plan |
| actual application files | preserve/resume existing work |

## Process

Verify that the technical spec exists and implementation is authorized. Build one complete vertical slice before cosmetic expansion: editable stock → validated feasible offers → owner selection/edit → correct preview → copy and real card download. Use the established package manager/lockfile, or record the initial choice. Define real dev/build/test/typecheck scripts as appropriate for the selected stack; record their exact names.

Separate pure domain calculations from UI and optional AI. Add domain tests while implementing. Keep the no-key path working; local persistence must not masquerade as shared stock. A sample action must be clearly labelled fictional; a reset must work. Do not add excluded integrations or spend time on agent infrastructure.

Exercise the application and scripts. Fix real failures. If an install/network/service blocks the chosen approach, record it and try a simpler compatible path, not fabricated outputs. For optional AI failure, retain the deterministic path and label its mode honestly.

## Output and exit gate

Write actual application source plus `02_build/output/BUILD.md`: files/features delivered, real setup/run commands, checks actually run, errors/limits, deviations from spec, and remaining work. Update STATE.md with a precise resume action. Stop at the phase boundary unless the next phase is explicitly authorized.
