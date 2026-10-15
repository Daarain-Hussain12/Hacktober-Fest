# RescueShelf — product reference

## Authority and outcome

Dawood selected RescueShelf and accepted the owner-side MVP boundary before requesting this phased handoff. These requirements operationalize that boundary. Suggested implementation defaults below are not additional claimed user decisions. Product expansion requires owner approval; minor reversible implementation choices can be documented in phase 01.

**Promise:** help a bakery owner turn owner-confirmed sellable leftovers into a ready-to-share closing-time offer.

Primary journey: enter stock → review feasible bundles/prices → select and edit one offer → review quantities and financial estimates → copy promotional text and download a shareable card. Sales and customer conversations remain outside the app through existing channels.

## Minimum useful capabilities

- Editable stock: stable item ID, name, available whole-unit quantity, regular unit price, owner minimum clearance unit price, and optional recorded unit cost. Owner explicitly marks items sellable and selects which items may be bundled. No inferred food-safety approval.
- Shop name and a human-readable pickup window/location for the selected offer. Do not require phone numbers, customer records, or geolocation.
- Deterministic candidate bundles from the eligible items. A small transparent heuristic is sufficient; no claim of optimal demand or guaranteed sell-through. Give the owner an editable selection, not an unexplained compulsory choice.
- Each option states composition, number of feasible bundles, price, stock remaining, and conditional revenue. Alternatives reuse the same inventory hypothetically; they are not simultaneous campaigns.
- Selecting one offer produces copyable text and a locally downloadable card (SVG or PNG is acceptable). It contains the actual selected items/price, shop, pickup window, and genuine available quantity. It must not invent ingredients, allergens, certification, health claims, savings, or artificial scarcity.
- Edits invalidate/recompute dependent values and copy/export content. Prevent empty/invalid/stale exports. Generating an offer must not deduct stock as if a sale occurred.
- A visibly labelled fictional sample-data action and a reset/clear action. Persistence across refresh is useful; local browser storage is the suggested default, with a warning that it is not a shared multi-device inventory or durable backup.

## Financial and inventory contract

Suggested unambiguous MVP default: the owner supplies a per-unit clearance floor for each item. Do not derive it from historical unit cost. Display the floor clearly and explain that the owner should account for any extra selling costs when setting it.

For a recipe containing positive integer quantities `q_i` from stocks `s_i`:

- Maximum bundles `B = min(floor(s_i / q_i))` over recipe items. No candidate with `B < 1`.
- Regular bundle price `R = sum(q_i * regular_price_i)`.
- Minimum bundle price `F = sum(q_i * clearance_floor_i)`.
- Chosen price `P` must satisfy `0 < P`, `F <= P <= R` for a discounted/regular-price offer. Invalid floors above regular prices require correction, not silent clamping.
- For a chosen bundle count `n`, require integer `1 <= n <= B`; remaining item stock is `s_i - n*q_i`, unchanged for unused items.
- Conditional revenue is `n*P` **if all selected bundles sell**. Do not call it realized revenue, recovered money, or money saved.
- If all included recorded unit costs are known, recorded item cost per bundle is `K = sum(q_i * recorded_cost_i)`. Display `n*(P-K)` only as “revenue less entered item costs”; disclose that unentered selling costs/fees/taxes/overheads are excluded. It is not net profit. If any cost is unknown, that metric is unavailable, not zero.
- A negative difference against historical item costs is allowed when the owner's floor permits it; show it honestly. Clearance value can differ from historical cost, and alternative sales/opportunity costs can matter.[8]
- Monetary arithmetic uses integer minor units (PKR paisa if PKR is selected) or a decimal-safe representation. Define input precision/rounding in the spec. Never use floating-point approximations for money or round a suggested price below its floor.
- Validate nonnegative finite prices/costs, regular prices above zero, whole nonnegative stock, unique IDs, nonempty names, and whole positive recipe quantities. Reject missing mandatory values; zero stock and absent optional costs are distinct cases.

## Demonstration fixture (fictional, not real operations)

The earlier arithmetic example used 12 pastries (normal price PKR 150, recorded cost PKR 80) and 6 drinks (normal price PKR 80, recorded cost PKR 40). Six bundles of 2 pastries and 1 drink at PKR 300 would yield PKR 1,800 revenue if all sell, and PKR 600 revenue less entered item costs. The owner-entered clearance floors must be explicit in the implemented fixture and must permit that price; do not infer floors from costs.

## Non-goals and integrity

No consumer marketplace, accounts, checkout, payments, delivery, automatic messaging, POS connection, stock forecasting, trained ML model, or food-safety assessment. No donation logistics or emissions/savings dashboards. No promised revenue lift or willingness to pay. Shop subscriptions are an unvalidated future business hypothesis, not an implemented billing requirement.

A deterministic rules-based product is acceptable; the hackathon requires an MVP, not a trained model. Optional AI must add value without breaking the no-key core journey. Never relabel deterministic rules as AI. Public posting/deployment needs separate permission.

[8]: https://www.accaglobal.com/gb/en/student/exam-support-resources/fundamentals-exams-study-resources/f5/technical-articles/relevant-costs.html
