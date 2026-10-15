# RescueShelf

RescueShelf helps a bakery owner turn today’s sellable leftovers into a clear closing-time bundle offer. Add the stock you have, review feasible combinations, choose and adjust one offer, then copy its text or download a share card for your existing shop channels.

RescueShelf is an owner-side planner. It does not sell to customers or make decisions about food safety.

## Run locally

Requirements: Python 3 and a modern browser. The app has no package installation or build step.

From the repository root, start the static server:

```sh
python3 -m http.server 4173 --directory app
```

Open [http://localhost:4173](http://localhost:4173). Stop the server with `Ctrl+C`.

## Use the planner

1. Add each item that the owner has confirmed is sellable. Enter units left, its regular price, and an owner-set minimum price. Recorded unit cost is optional; leave it blank when unknown.
2. Mark which items may be included in bundles. RescueShelf generates feasible combinations from those selections. It does not infer which products go together.
3. Choose an option and adjust its contents, bundle count, price, shop name, and pickup details. Review the price range, remaining stock, and conditional revenue.
4. Confirm the changes, then copy the offer text or download `rescueshelf-offer.svg`.

The **Load fictional sample** action fills the planner with an example shelf: 12 pastries and 6 drinks with explicit prices, costs, and minimums. The sample is marked as fictional in the app. Use **Clear all data** to remove the saved shelf and return to an empty planner.

Offer creation is a scenario, not a sale: stock is not deducted. Each bundle option reuses the same stock and represents an alternative, so option revenues must not be added together.

## Prices and estimates

Amounts use PKR, stored in paisa with two decimal places. Each owner-entered minimum price sets the floor for that item in a bundle; historical recorded cost does not determine the floor. The starting suggestion uses 90% of the regular bundle price, rounded to the nearest paisa, and is raised when needed to respect the combined minimum price. The owner can edit the offer within its displayed minimum and regular-price range.

“If all offered bundles sell” is conditional revenue, not a sales forecast or realized result. When recorded cost is known for every included item, RescueShelf also shows revenue less those entered item costs. That figure excludes fees, taxes, labour, overhead, and other costs, so it is not net profit. Unknown costs remain unavailable rather than being treated as zero.

## Data and privacy

Stock and shop details are saved in this browser’s local storage. They are not sent to a server, shared across devices, or backed up. Clearing browser storage can remove them. The share card contains the selected bundle, price, shop, pickup details, and offered quantity; it does not include internal stock or cost data.

## What it does not do

RescueShelf does not provide a marketplace, customer accounts, checkout, payment, delivery, point-of-sale integration, automatic messaging, demand forecasting, food-safety assessment, or an AI model. Bundle generation and price suggestions are deterministic rules. No API key or network service is required.

## Project status

The current implementation is a dependency-free static MVP. JavaScript syntax checks passed, and the app shell and share-card module returned HTTP 200 from the local server. Full browser interaction, responsive inspection, clipboard and downloaded-card behavior, and automated domain tests have not yet been verified. See [the Phase 02 build handoff](02_build/output/BUILD.md) for the observed commands and limits. The next planned work is the Phase 03 verification suite and browser journey.
