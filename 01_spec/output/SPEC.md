# RescueShelf technical specification

## Purpose and boundary

RescueShelf is a browser-first closing-time offer planner for bakery owners Dawood and Daarain. The owner enters sellable leftovers, reviews feasible bundle options, chooses and edits one, then copies promotional text and downloads a shareable offer card. Sales and customer conversations remain on the shop's existing channels.

The MVP does not provide a marketplace, customer accounts, checkout, payment, delivery, POS connection, automatic messaging, demand forecasts, food-safety judgments, or AI-generated financial decisions. A deterministic rules-based planner is sufficient. Sample data is fictional and must be labelled as such.

## Proposed implementation

Use plain HTML, CSS, and browser JavaScript ES modules, with no runtime dependencies, backend, build system, or API key. This is the smallest runnable browser implementation for the agreed workflow and keeps all stock and offer data local to the shop's browser. Node's built-in test runner can exercise the pure business rules without adding a test dependency. The trade-off is that there is no bundler, framework, server sync, or multi-device inventory.

Observed environment at specification time: Node.js `v24.18.1`, npm `12.0.2`, and Python `3` are available on PATH. There is no application source tree, package manifest, or lockfile to reuse. Browser availability has not been checked. These are environment observations, not verified app runtime or test results.

Proposed source layout:

```text
app/
  index.html
  styles.css
  src/
    main.js
    state.js
    validation.js
    money.js
    offers.js
    share.js
  tests/
    money.test.js
    validation.test.js
    offers.test.js
```

`money.js`, `validation.js`, and `offers.js` should remain DOM-independent so the Node test runner can import and test them. `main.js` wires the views and actions. `share.js` builds escaped SVG and promotional text from the currently validated selected offer.

## Data and money

Persist one versioned local state object under `rescueshelf:v1`:

```text
AppState {
  schemaVersion: 1,
  shop: { name: string, pickupDetails: string },
  items: Item[],
  selectedOffer: OfferDraft | null,
  sampleData: boolean,
  revision: integer
}

Item {
  id: string,                 // stable generated ID, unique
  name: string,               // trimmed, nonempty
  stockUnits: integer,        // >= 0
  regularPricePaisa: integer, // > 0
  clearanceFloorPaisa: integer, // integer, > 0 and <= regular price
  recordedCostPaisa: integer | null, // null means unknown
  sellable: boolean,
  bundleEligible: boolean
}

OfferDraft {
  recipe: [{ itemId: string, unitsPerBundle: integer }],
  bundlesToOffer: integer,
  pricePaisa: integer,
  baseRevision: integer
}
```

Amounts are PKR, entered and displayed to at most two decimal places, and stored as integer paisa. Parse decimal text strictly (reject more than two fractional digits, negatives, non-finite text, and blank required fields); do not convert through floating-point arithmetic. Format paisa as PKR with two decimals for display. Suggested price rounding is half-up to the nearest paisa, then bounded by the floor and regular price. Do not silently clamp invalid owner-entered prices or floors. An absent cost is `null`, never zero.

Validate unique IDs, trimmed nonempty names, integer stock at least zero, positive integer regular prices and floors, floor no greater than regular price, and nonnegative integer recorded costs when present. Only items marked sellable and bundle-eligible can enter generated or edited recipes. A sellability checkbox is an owner declaration, not an app safety assessment.

## Offer generation and financial rules

Offer generation is deterministic and transparent. Limit the eligible selection to eight items, with clear feedback if the owner selects more. Enumerate recipes containing two or three distinct eligible items, with one or two units of each item per bundle. This yields at most 560 recipes for eight items (`C(8,2)*4 + C(8,3)*8`). Filter out recipes with any item whose available stock is below its recipe quantity. Never generate an offer with zero feasible bundles. Do not infer which foods go together; the owner selects eligible stock and can edit recipe quantities.

For each recipe, calculate the maximum feasible bundle count and prices with integer arithmetic:

```text
B = min(floor(stockUnits_i / unitsPerBundle_i))
R = sum(unitsPerBundle_i * regularPricePaisa_i)
F = sum(unitsPerBundle_i * clearanceFloorPaisa_i)
suggestedPrice = max(F, floor((9 * R + 5) / 10))
```

Keep the suggestion at or below `R`; validated inputs imply `F <= R`. The integer expression rounds 90% of `R` half-up to a paisa, then raises it to `F` if needed. Label this as a suggested starting price based on a 10% discount before applying the owner's floor; the floor can reduce that discount. Explain the formula in the interface; it is not a claim of savings or demand. The owner can edit price to any integer paisa `P` satisfying `F <= P <= R`, and offered count `n` satisfying `1 <= n <= B`. Show `B`, composition, `P`, and stock remaining after offering `n` bundles. The remaining amount is a scenario calculation, not a stock deduction.

Conditional revenue is `n * P` and must be labelled “if all offered bundles sell.” If every recipe item's recorded cost is present, calculate `n * (P - K)` where `K = sum(unitsPerBundle_i * recordedCostPaisa_i)`. Label this “revenue less entered item costs” and disclose that selling fees, taxes, labour, overhead, and other costs are excluded; it is not net profit. If any cost is unknown, omit the value and show “Unavailable: enter recorded costs for every included item.” Negative results are valid and must remain visible.

Each candidate is an alternative using the same current stock. Do not sum revenue or stock remaining across candidates. Selecting or editing an offer never records a sale or changes inventory.

## UI journey and state changes

Build a responsive single-page interface with three clearly ordered sections or steps: **Stock → Offers → Review and share**. Keep the current step and primary action obvious. All fields need visible labels, keyboard operation, focus styles, and inline validation. Keep layout usable on narrow screens. Use text nodes or safe DOM APIs for owner-provided content; never inject imported or generated strings as executable HTML.

1. **Stock:** show an editable list of items with name, quantity, regular price, owner-set clearance floor, optional recorded cost, sellable, and bundle eligibility. Provide add/edit/remove controls, a fictional sample-data action visibly labelled “Load fictional sample,” and “Clear all data” with a clear confirmation step. The sample uses 12 pastries (regular PKR 150, entered cost PKR 80, floor PKR 100) and 6 drinks (regular PKR 80, entered cost PKR 40, floor PKR 50), so two pastries plus one drink can be offered at PKR 300 without violating floors. Display an empty state with an add-item action. Identify missing costs as unknown.
2. **Offers:** show generated feasible recipes with item quantities, maximum bundles, suggested price and formula context, floor, regular price, and conditional revenue for the default maximum count. Make it clear each is an alternative. Empty states explain whether stock is empty, no items are eligible, or no feasible recipe exists. Selecting a candidate copies it into an editable offer draft.
3. **Review and share:** allow edits to recipe quantities, count, price, shop name, and human-readable pickup window/location. Show composition, per-item remaining stock, price constraints, conditional revenue, and the cost metric only when all costs are known. Provide “Copy offer text” and “Download offer card” actions only for a currently valid offer.

Any stock, eligibility, recipe, price, count, shop, or pickup edit increments `revision`, recomputes derived values, and invalidates the selected draft's `baseRevision`. Revalidate the entire draft against current state before preview, copy, and download; refresh the draft revision only after successful validation. Disable or reject copy/export while stale or invalid and explain what to fix. Copy text contains shop, pickup details, actual selected composition and price, and genuine available offered quantity. It must not add ingredients, allergens, certifications, health claims, savings, urgency, or scarcity language. Use Clipboard API where available with a selectable-text fallback and visible success/error status.

Generate a downloadable SVG card locally from the validated selected offer. Escape XML text and attribute values, use a fixed local template, and include shop, pickup details, selected items and quantities, price, and offered bundle count. Do not include cost, internal stock, or personal data. Download as `rescueshelf-offer.svg`. No external image/font requests or secrets are required.

## Persistence and recovery

Save valid state changes to versioned `localStorage`; restore on refresh. Show a persistent note that data is stored only in this browser and is not shared or backed up. Catch storage parse/quota errors, preserve the current in-memory session where possible, and show a recovery message rather than silently claiming persistence. Clear all data removes the RescueShelf key and returns to the empty state. The sample action replaces current state only after an explicit in-app confirmation if the current stock is nonempty. Tag sample state and keep the sample banner visible until the owner changes the sample data or clears it.

## Intended commands

These commands are proposed for Phase 02/03; they have not been run against an application:

```sh
python3 -m http.server 4173 --directory app
node --test app/tests/*.test.js
```

The first serves the static app at `http://localhost:4173`; the second runs built-in Node tests. No install or build command is required for this design. Record actual commands and outcomes in the Phase 03 handoff, and do not describe an unrun command as verification.

## Acceptance cases for Phase 03

| Area | Required evidence |
| --- | --- |
| Inventory validation | Reject duplicate IDs, blank names, fractional/negative stock, invalid prices, floor above regular price, and costs below zero; accept zero stock and unknown cost distinctly. |
| Money | Strictly parse up to two decimals into paisa; reject excess precision; test half-up rounding and ensure suggested price never falls below `F`. |
| Feasibility | Generated recipes use only eligible sellable items, have positive capacity, and never exceed stock. Verify capacity with uneven stock and quantities greater than one. |
| Price floor | Reject selected prices below `F` or above `R`; accept endpoints. Reject invalid item floors without silent correction. |
| Cost uncertainty | Show cost comparison only when every included item has a known cost; preserve negative comparison and show unknown as unavailable. |
| Alternative offers | Candidate revenues remain independent and are not summed; generating or selecting offers does not mutate inventory. |
| Stale state | After any dependent edit, stale drafts cannot be copied/downloaded until revalidated. |
| Journey | In a browser, load fictional sample, edit stock, generate/select/edit an offer, review it, copy text, and download/open the SVG card. Verify displayed content matches the validated offer. |
| Persistence and responsive use | Refresh restores data; clear returns to empty state; keyboard and narrow viewport checks cover labelled controls, focus, validation, and empty states. |

Browser checks must be marked `not run` if no browser is available. A unit test or generated file alone does not prove the complete browser journey.

## Phase 02 checklist

- Implement only the agreed owner-side flow using the proposed source layout and static stack, or record a justified small adjustment before coding.
- Keep financial and offer logic pure, integer-based, deterministic, and covered by the planned Node tests.
- Implement the three connected UI sections, clear validation and empty states, sample/reset actions, and local persistence warning.
- Revalidate the selected offer before preview, copy, and SVG download; preserve inventory when offers are created.
- Do not install dependencies, add a backend/API, or expand product scope without an explicit need and authorization.
