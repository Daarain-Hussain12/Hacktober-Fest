export function validateItem(item, allItems = []) {
  const errors = [];
  if (!String(item.name ?? '').trim()) errors.push('Enter an item name.');
  if (!Number.isSafeInteger(item.stockUnits) || item.stockUnits < 0) errors.push('Units left must be a whole number of zero or more.');
  if (!Number.isSafeInteger(item.regularPricePaisa) || item.regularPricePaisa <= 0) errors.push('Regular price must be greater than zero.');
  if (!Number.isSafeInteger(item.clearanceFloorPaisa) || item.clearanceFloorPaisa <= 0) errors.push('Minimum price must be greater than zero.');
  if (item.clearanceFloorPaisa > item.regularPricePaisa) errors.push('Minimum price cannot exceed regular price.');
  if (item.recordedCostPaisa !== null && (!Number.isSafeInteger(item.recordedCostPaisa) || item.recordedCostPaisa < 0)) errors.push('Recorded cost must be zero or more, or left unknown.');
  if (!item.id || allItems.some(other => other.id === item.id && other !== item)) errors.push('Item IDs must be unique.');
  if (typeof item.sellable !== 'boolean' || typeof item.bundleEligible !== 'boolean') errors.push('Choose sellable and bundle eligibility.');
  return errors;
}

export function validateDraft(draft, items, revision) {
  const errors = [];
  if (!draft) return ['Choose an offer first.'];
  if (draft.baseRevision !== revision) errors.push('This offer is out of date. Review the changes before sharing.');
  if (!Array.isArray(draft.recipe) || draft.recipe.length < 2) errors.push('An offer needs at least two items.');
  const seen = new Set();
  let capacity = Infinity;
  let floor = 0;
  let regular = 0;
  let costsKnown = true;
  let itemCost = 0;
  for (const part of draft.recipe ?? []) {
    if (seen.has(part.itemId)) errors.push('An item can only appear once in the recipe.');
    seen.add(part.itemId);
    const item = items.find(candidate => candidate.id === part.itemId);
    if (!item) { errors.push('An offer item no longer exists.'); continue; }
    if (!String(item.name ?? '').trim()) errors.push('Offer items need a nonempty name.');
    if (!Number.isSafeInteger(item.stockUnits) || item.stockUnits < 0) errors.push(`${item.name || 'An item'} needs a valid whole-unit stock count.`);
    if (!Number.isSafeInteger(item.regularPricePaisa) || item.regularPricePaisa <= 0 || !Number.isSafeInteger(item.clearanceFloorPaisa) || item.clearanceFloorPaisa <= 0 || item.clearanceFloorPaisa > item.regularPricePaisa) errors.push(`${item.name || 'An item'} needs valid regular and minimum prices.`);
    if (item.recordedCostPaisa !== null && (!Number.isSafeInteger(item.recordedCostPaisa) || item.recordedCostPaisa < 0)) errors.push(`${item.name || 'An item'} has an invalid recorded cost.`);
    if (!item.sellable || !item.bundleEligible) errors.push(`${item.name} is not marked sellable and bundle-eligible.`);
    if (!Number.isSafeInteger(part.unitsPerBundle) || part.unitsPerBundle < 1) { errors.push(`Enter a whole positive quantity for ${item.name}.`); continue; }
    capacity = Math.min(capacity, Math.floor(item.stockUnits / part.unitsPerBundle));
    const partFloor = part.unitsPerBundle * item.clearanceFloorPaisa;
    const partRegular = part.unitsPerBundle * item.regularPricePaisa;
    if (!Number.isSafeInteger(partFloor) || !Number.isSafeInteger(partRegular) || !Number.isSafeInteger(floor + partFloor) || !Number.isSafeInteger(regular + partRegular)) errors.push('Bundle prices exceed the supported exact-money range.');
    else { floor += partFloor; regular += partRegular; }
    if (item.recordedCostPaisa === null) costsKnown = false;
    else {
      const partCost = part.unitsPerBundle * item.recordedCostPaisa;
      if (!Number.isSafeInteger(partCost) || !Number.isSafeInteger(itemCost + partCost)) { errors.push('Recorded item costs exceed the supported exact-money range.'); costsKnown = false; }
      else itemCost += partCost;
    }
  }
  if (!Number.isSafeInteger(draft.bundlesToOffer) || draft.bundlesToOffer < 1) errors.push('Offer at least one bundle.');
  else if (draft.bundlesToOffer > capacity) errors.push(`Offer no more than ${Number.isFinite(capacity) ? capacity : 0} feasible bundles.`);
  if (!Number.isSafeInteger(draft.pricePaisa) || draft.pricePaisa <= 0) errors.push('Offer price must be greater than zero.');
  else if (draft.pricePaisa < floor || draft.pricePaisa > regular) errors.push(`Offer price must be between ${floor} and ${regular} paisa for this recipe.`);
  if (Number.isSafeInteger(draft.pricePaisa) && Number.isSafeInteger(draft.bundlesToOffer) && !Number.isSafeInteger(draft.pricePaisa * draft.bundlesToOffer)) errors.push('Conditional revenue exceeds the supported exact-money range.');
  if (costsKnown && Number.isSafeInteger(draft.bundlesToOffer) && !Number.isSafeInteger(draft.bundlesToOffer * (draft.pricePaisa - itemCost))) errors.push('The cost comparison exceeds the supported exact-money range.');
  return { errors, capacity, floor, regular, costsKnown, itemCost };
}
