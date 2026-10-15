# Hackathon product discussion

Status: HANDOFF DOCUMENTS AUTHORIZED — RescueShelf owner-side MVP accepted. AGENTS.md and an ICM-inspired phased handoff were requested. No application build was performed or authorized in this documentation session. Start future work from AGENTS.md and STATE.md; earlier sections below preserve historical discussion.
Last recorded: 2026-10-15 (PKT).

This is the model/session-independent discussion record. Separate user-provided context, explicit decisions, research, and provisional suggestions. Do not treat an assistant recommendation or an unanswered question as agreement. Read this file before resuming product discovery; update it when substantive discussion or decisions occur.

## User-provided context and constraints

- Participants: Dawood and Daarain, discussing the idea together in person.
- Workspace: `~/Hacktober-Fest`.
- Dawood reports that he cloned Daarain's repository and is a collaborator.
- Dawood reports a deadline of **1.5 hours** in his follow-up. This is the budget reported then, not a fresh remaining-time estimate for future sessions. No exact submission timestamp was supplied.
- Dawood clarified that the hackathon wants a product MVP, not a trained-model comparison. Judges are not highly technical; prioritize explainable use cases and business value. The organizer, detailed theme/rules, and judging rubric remain unknown.
- Asked whether either teammate knew someone who recently signed a rental/employment agreement they did not understand, Dawood answered that they do not know anyone. No user interview or sample agreement is available in this discussion.

## Confirmed process boundaries

- Have a conversation and select the product before implementation.
- RescueShelf is now selected. Detailed features and technical scope still require agreement; earlier alternative ideas remain historical context, not active contenders.
- Preserve major discussion points in portable project files rather than relying on a particular chat or model.
- The earlier no-setup boundary was superseded only for the requested AGENTS.md/phased handoff documents. Do not scaffold the application, install dependencies, initialize graphify, or build in this documentation session.
- The ICM paper has now been read for its context layers and stage contracts. The handoff adapts numbered stages, CONTEXT.md inputs/process/outputs, stable references, and working output folders; it does not install an orchestration framework.
- Implementation belongs to a later session after the product and `AGENTS.md` have been agreed.

## Candidate A — rough, not selected

> Plain-language explainer for Urdu legal and rental documents
>
> Problem: Tenants and workers sign agreements they can’t fully read.
> AI part: Clause extraction, risk flags (penalties, termination terms), and a simple-language summary.
> Prototype: Upload an agreement, get highlighted clauses and a summary. Must carry a clear “not legal advice” notice.

These are the team's starting hypotheses, not validated demand or an agreed feature list.

### Initial assistant assessment — NOT team decisions

- Retain the comprehension problem for discussion, but challenge “all legal documents / tenants and workers” scope.
- Compare a general explainer, a tenant-focused before-signing companion, and a first-job employment-offer explainer.
- Initial provisional preference, BEFORE the deadline was known: explore the tenant-focused option, subject to constraints and access to users/documents. This was not a final selection.
- A potentially stronger outcome than a summary: identify what someone would pay, how they could leave, what could happen to their deposit, and which unanswered questions to take to the other party or a qualified professional.
- Distinguish “the document says this,” “this is unclear/not found,” and “this is legally enforceable.” Do not silently turn document explanation into legal judgment.
- Consider evidence-linked explanations and explicit unreadable/unclear states rather than an unsupported safety score. A disclaimer is not a substitute for trustworthy output.
- Do not assume easier Urdu text solves the reading problem; establish whether the barrier is formal wording, English, literacy, or something else before selecting text, Roman Urdu, or audio.

### Limited desk research

A public ContractGuard page advertises Pakistani contract analysis from PDFs/photos, English/Urdu explanations, clause risk scores, and support for rental and employment documents.[1] This establishes advertised overlap, not verified functionality, accuracy, adoption, commercial viability, or competition strength. No contract was uploaded or tested. Do not claim novelty merely from “Urdu + contract summary.”

## Candidate B — supplied by Dawood as Claude's suggestion, NOT selected

> Mule-account ring detection with a temporal graph neural network
>
> Core: Money-laundering and fraud rings show up as patterns in a transaction graph (shared devices, rapid pass-through accounts), not in single transactions.
> Models: A graph neural network (GraphSAGE or a temporal variant) against an XGBoost baseline on the same features.
> Data and evaluation: Elliptic or IBM’s synthetic AML dataset are open. Report precision-recall, and show the specific rings the graph model catches that XGBoost misses.
> Why it fits: It builds directly on your fraud detection project, so you start ahead.

Follow-up clarification from Dawood: the fraud-detection project does belong to the team, but uses a very old IEEE dataset and is of no use for this hackathon. Do not keep investigating or proposing reuse of it. Dawood supplied Claude’s suggestion only as a reference and requested fresh, outside-the-box, use-case-led business product ideas instead.

### Dataset/model checks

- IBM AML-Data documents synthetic financial transactions with a laundering tag for each transaction.[2] Transaction classification labels do not automatically provide a validated mule-ring detection benchmark. No dataset was downloaded or tested.
- The original Elliptic dataset documented by PyTorch Geometric is a Bitcoin transaction graph with licit, illicit, and unknown transaction labels.[3] Do not present it as direct bank-account mule-ring ground truth.
- Standard SAGEConv implements GraphSAGE neighborhood aggregation; temporal handling is not supplied merely by choosing that operator.[4]
- Shared-device detection requires actual device identifiers in the chosen data; their availability has not been established.
- “The graph model catches rings XGBoost misses” is an experimental hypothesis, not an outcome to promise. Comparisons would require a justified task, compatible labels, leakage-aware temporal evaluation, and measured results.

### Assistant recommendation under the reported deadline — NOT approved

- Reject a from-scratch temporal-GNN/XGBoost research comparison as the default for the reported deadline. Reconsider only if relevant data, training, and evaluation already run.
- A smaller candidate: **transaction-flow investigation demo**. An investigator explores timestamped transfers, inspects a small suspicious path/pattern, and sees the actual supporting transactions and trigger reason.
- Use bounded graph/time rules for triage, not a claim that a model has proven money laundering. Ordinary legitimate transfers can resemble suspicious patterns.
- If using seeded synthetic demo scenarios, label them prominently. Do not invent model scores, precision/recall, benchmark wins, real-bank deployment, or criminal conclusions.
- If the event requires a trained model, establish that immediately; a rule-based demo must not be misrepresented as a GNN or ML detector.
- Keep infrastructure/setup minimal in the eventual build; elaborate tooling cannot take priority over the demonstration under this deadline. No setup changes have been authorized here.

## Follow-up direction — explicit user clarification

- Focus on a genuine product MVP with a simple business/use-case explanation for nontechnical judges.
- Do not anchor ideation on a fancy model, the old fraud project, or Claude's suggestion.
- At this earlier stage, fresh alternatives were requested. Product selection has since occurred (see the selection record below); implementation remains unauthorized.

## Earlier shortlist — historical assistant proposals; selection recorded below

### Candidate C: RescueShelf — provisional assistant favorite

- Target user: a bakery/cafe owner with sellable stock left near closing.
- Proposed outcome: turn owner-entered stock, costs, and a minimum margin into feasible discounted bundles and a ready-to-share offer for existing customers.
- Proposed flow: enter/import a small inventory; inspect bundle quantities, prices, remaining stock, and conditional revenue/gross contribution; approve an offer and copy/download promotional material.
- Constraints: no marketplace, delivery service, POS/WhatsApp integration, model training, demand prediction, or AI food-safety judgment. Only use stock the owner marks sellable. Do not claim bundles will sell or discounts always improve revenue.
- Verified arithmetic for a FICTIONAL pitch scenario, not a built product: 12 pastries and 6 drinks permit 6 boxes of 2 pastries + 1 drink. Assuming pastry cost PKR 80 and drink cost PKR 40, each box costs PKR 200. At a hypothetical PKR 300 selling price, all 6 selling would yield PKR 1,800 revenue and PKR 600 gross contribution before overheads. This is not observed revenue, net profit, guaranteed recovery, or proven savings.
- Business hypothesis: repeated owner use might support a subscription; demand, willingness to pay, and discount cannibalization are untested.
- Existing-category check: Too Good To Go advertises a marketplace for selling surplus.[7] This candidate is an owner-side planning tool using existing channels, not a claim of a globally new category or a validated differentiated business.

### Candidate D: BillMatch — before-you-pay discrepancy checker

- Target user: small-business buyer or event organizer.
- Proposed flow: compare an accepted quotation with the final invoice; surface changed unit prices, quantities, new fees, and inconsistencies, with supporting passages and a clarification checklist.
- Demonstration example: an original quote says delivery is included while the bill adds a delivery charge. This is a hypothetical example, not a real supplier case.
- Boundary: unexplained differences, not automatic accusations of fraud or legally invalid charges. User confirms amendments and extracted values. Monetary arithmetic must be deterministic.
- Keep MVP to pasted text/clean text documents; do not assume arbitrary scans/handwriting or integrations can be supported within the deadline.
- Background only: supplier-sourcing guidance discusses differing quote inclusions/exclusions.[5] That does not validate this particular invoice-checking product or customer willingness to pay.

### Candidate E: ScopeFence — turn extra client requests into explicit changes

- Target user: freelancer or small agency.
- Proposed flow: compare agreed deliverables with a new client request; distinguish included, additional, and unclear work; create an editable change-request draft using the freelancer's own rates and assumptions.
- Desired outcome: help the user discuss additional work before doing it unpaid, not automatically argue with clients or make legal judgments.
- First-person practitioner material describes out-of-scope requests and change orders.[6] This is evidence of that practitioner's experience, not market prevalence or validated buying intent.

## Product selection — explicit user decision

Dawood: “let's go with RescueShelf. Very nice.” He then asked to expand the idea and whether to move into a technical specification or continue discussing the product.

- DECIDED: RescueShelf is the chosen product direction.
- NOT DECIDED: detailed feature scope, optimization/pricing policy, architecture, stack, AI provider, agent folder layout, or implementation authorization.
- Assistant recommendation: stop broad ideation; agree a concise product contract and one end-to-end demonstration journey, then move into the technical spec. Avoid extended discovery or speculative expansion under the reported deadline.

## Product lock — subsequently accepted for the phased handoff

- Working promise: help a small bakery turn owner-confirmed sellable leftovers into a ready-to-share closing-time offer.
- First user: the bakery owner, not a customer browsing a marketplace.
- Owner inputs: available quantities, regular prices, an acceptable clearance-price floor, and a pickup window. Recorded unit costs and additional selling costs support clearly labelled financial estimates when supplied; unknown costs must not silently become zero.
- Core journey: enter leftovers → inspect feasible bundle/price options → choose and review one offer → copy customer-facing promotional text and obtain a shareable offer card.
- Respect stock limits and the owner's price floor. Show leftover quantities and conditional revenue, with cost/margin information clearly separated. Do not claim a mathematically best selling plan without a demand model or measured demand.
- All projected revenue is conditional on sales. Generating an offer is not evidence of sold stock, actual revenue, food saved, or emissions avoided.
- Exclusions proposed for the hackathon MVP: marketplace/customer accounts, checkout/payments, delivery, POS integrations, automatic WhatsApp messaging, demand forecasts, and food-safety judgments.
- Only use stock the owner marks sellable; do not infer safety from a photo or date.

### Pricing correction to earlier framing — assistant proposal

The earlier suggestion of a hard minimum profit margin should not silently become a business rule. ACCA distinguishes sunk historical costs from future cash-flow changes and opportunity costs.[8] Applied conditionally here: for stock that would otherwise have no sale or alternative value, a below-original-cost sale can still improve cash recovery after additional selling costs. This does not imply every discounted sale is beneficial; full-price sales displaced, alternative uses, brand effects, and extra costs can matter.

Proposed MVP treatment: let the owner set the acceptable floor, show revenue and margin/cost information honestly, and do not hardcode “never sell below original cost” or claim guaranteed profit. This is a suggested correction, not a user-approved pricing policy.

## Questions still open

- Owner-side scope accepted; future phase 01 should select and record minimal technical choices without reopening ideation.
- Exact submission time, current time budget, technical/API constraints, and detailed event rules remain unverified.
- Start/resume and phase approval state now live in STATE.md; AGENTS.md is the read-only entrypoint.

## Resume point

Dawood accepted the proposed owner-side RescueShelf boundary and requested a read-only, model/session-agnostic AGENTS.md, grounded with a quick search, for another model to build across sessions/phases. AGENTS.md, CONTEXT.md, STATE.md, stable product/source references, and numbered ICM-inspired phase contracts now form the handoff. Future sessions start at AGENTS.md and STATE.md, not this historical brainstorm. No application was built here; phase 01 remains not started pending the next user instruction. AGENTS.md is owner-maintained/read-only; all progress goes into STATE.md and phase outputs.

## Sources

[1] https://business-hive-continue.replit.app — ContractGuard — advertised AI contract analysis for Pakistan
[2] https://github.com/IBM/AML-Data — IBM AML-Data
[3] https://pytorch-geometric.readthedocs.io/en/2.5.2/generated/torch_geometric.datasets.EllipticBitcoinDataset.html — PyTorch Geometric — EllipticBitcoinDataset
[4] https://pytorch-geometric.readthedocs.io/en/latest/generated/torch_geometric.nn.conv.SAGEConv.html — PyTorch Geometric — SAGEConv
[5] https://www.sourceready.com/blog/compare-supplier-quotes — SourceReady — comparing supplier quotes
[6] https://jenniferbourn.com/script-client-making-out-of-scope-requests — Jennifer Bourn — out-of-scope client requests
[7] https://www.toogoodtogo.com/en-us/business — Too Good To Go — selling surplus
[8] https://www.accaglobal.com/gb/en/student/exam-support-resources/fundamentals-exams-study-resources/f5/technical-articles/relevant-costs.html — ACCA — relevant costs and sunk costs
