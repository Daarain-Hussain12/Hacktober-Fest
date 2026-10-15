# Phase 02 — Build handoff

## Delivered

RescueShelf is implemented as a static browser app in `app/` with no package installation, backend, remote font/image request, API key, or runtime dependency.

- Editable owner-confirmed stock includes whole-unit quantity, regular price, owner floor, optional recorded cost, sellable status, and bundle eligibility. Add, edit, remove, clear, and visibly fictional sample actions are present.
- Stock and shop details persist in versioned localStorage. The UI warns that data remains in this browser and is not backed up or shared. Storage read/write failures are shown.
- Offers are deterministic combinations of two or three eligible items at one or two units per item. Enumeration is bounded by eight eligible items (560 recipes maximum); the UI displays up to 12 options and states how many combinations are available. Each option shows its capacity, floor/regular range, suggested starting price, and conditional revenue.
- Owners can select an offer, edit recipe composition, bundle count, price, shop name, and pickup details. A revision check makes any dependent change stale until “Review changes” validates it. Invalid or stale offers cannot be copied or downloaded. Stock is never deducted.
- The review shows item-by-item remaining stock, “if all offered bundles sell” revenue, and revenue less entered costs only when all costs are known. It discloses excluded costs and does not call this net profit.
- A safe text preview supports manual copying if Clipboard API access fails. The SVG card is generated locally and includes only the selected offer details and offered quantity; user-entered text is escaped.
- The UI uses labelled controls, keyboard focus styles, inline status/error messages, empty states, and narrow-screen layouts.

## Source files

```text
app/index.html
app/styles.css
app/src/main.js
app/src/state.js
app/src/validation.js
app/src/money.js
app/src/offers.js
app/src/share.js
```

The static app is served from `app/`. There is no build step or package script. Business logic lives in importable ES modules.

## Run and checks

Run from the repository root:

```sh
python3 -m http.server 4173 --directory app
```

Then open `http://localhost:4173` in a browser. No dependency installation is needed.

Actual implementation checks performed on 2026-10-15 in the project environment (Node `v24.18.1`, Python `3.14.4`):

| Command/action | Result |
| --- | --- |
| `node --check app/src/main.js` and the same command for `money.js`, `validation.js`, `offers.js`, `share.js`, and `state.js` | All six returned exit code 0. |
| `python3 -m http.server 4173 --directory app` | Initial sandbox launch could not bind a socket (`PermissionError`). The same command was then run with approved local-server permission, started successfully, and was stopped with Ctrl+C after the request. |
| `curl -sS -D - http://127.0.0.1:4173/ -o /tmp/rescueshelf-page.html` | Exit code 0; HTTP 200. The saved response contains the page heading and copy-preview markup. |
| `curl -sS -I http://127.0.0.1:4173/src/share.js` | Exit code 0; HTTP 200 and JavaScript content type. |
| Browser interaction, responsive inspection, copy action, and downloaded-card opening | Not run; no browser tool was available in this session. |
| Automated domain and journey tests | Not added or run in this phase. Phase 03 must implement and execute the acceptance cases in `01_spec/output/SPEC.md`. |

The HTTP checks establish that the static app shell and module are served. They do not establish the browser journey or prove generated financial outputs in the UI.

## Spec adjustments and limits

The UI lists at most 12 candidate cards at a time to keep the page scannable while showing the total feasible count; the generator still applies the specified 560-recipe upper bound. No other product-scope changes were made.

Browser-only behavior, localStorage refresh recovery, Clipboard API permission behavior, SVG rendering in target sharing apps, responsive behavior at the specified widths, and all financial acceptance cases remain to be checked in Phase 03. No deployment or external messaging was performed.

## Phase 03 starting action

Read `03_verify/CONTEXT.md`, inspect the current app, add and run the required automated coverage for money, validation, feasibility, price floors, cost uncertainty, alternatives, and stale offers, then exercise the complete browser journey if browser access is available. Record any unavailable browser work as `not run` or `blocked`, never passed.
