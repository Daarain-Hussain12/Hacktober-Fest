import { suggestedPrice } from './money.js';

export function eligibleItems(items) {
  return items.filter(item => item.sellable && item.bundleEligible && item.stockUnits > 0);
}

export function generateOffers(items) {
  const eligible = eligibleItems(items);
  if (eligible.length > 8) return { offers: [], total: 0, error: 'Choose up to eight items for bundle planning.' };
  const offers = [];
  for (let size = 2; size <= Math.min(3, eligible.length); size += 1) {
    const choose = (start, picked) => {
      if (picked.length === size) {
        const quantities = Array(size).fill(1);
        const expand = index => {
          if (index === size) {
            const recipe = picked.map((item, i) => ({ itemId: item.id, unitsPerBundle: quantities[i] }));
            const capacity = Math.min(...picked.map((item, i) => Math.floor(item.stockUnits / quantities[i])));
            if (capacity < 1) return;
            const regular = picked.reduce((sum, item, i) => sum + quantities[i] * item.regularPricePaisa, 0);
            const floor = picked.reduce((sum, item, i) => sum + quantities[i] * item.clearanceFloorPaisa, 0);
            if (!Number.isSafeInteger(regular) || !Number.isSafeInteger(floor) || !Number.isSafeInteger(9 * regular + 5) || !Number.isSafeInteger(capacity * regular)) return;
            offers.push({ recipe, capacity, regular, floor, price: suggestedPrice(regular, floor) });
            return;
          }
          for (let quantity = 1; quantity <= 2; quantity += 1) { quantities[index] = quantity; expand(index + 1); }
        };
        expand(0);
        return;
      }
      for (let i = start; i <= eligible.length - (size - picked.length); i += 1) {
        picked.push(eligible[i]); choose(i + 1, picked); picked.pop();
      }
    };
    choose(0, []);
  }
  offers.sort((a, b) => a.recipe.length - b.recipe.length || b.capacity - a.capacity || a.recipe.map(p => `${p.itemId}:${p.unitsPerBundle}`).join('|').localeCompare(b.recipe.map(p => `${p.itemId}:${p.unitsPerBundle}`).join('|')));
  return { offers, total: offers.length, error: null };
}

export function deriveRecipe(draft, items) {
  return (draft?.recipe ?? []).map(part => ({
    ...part,
    item: items.find(item => item.id === part.itemId),
  })).filter(part => part.item);
}
