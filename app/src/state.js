export const STORAGE_KEY = 'rescueshelf:v1';

export function emptyState() {
  return { schemaVersion: 1, shop: { name: '', pickupDetails: '' }, items: [], selectedOffer: null, sampleData: false, revision: 0 };
}

export function loadState(storage) {
  try {
    const raw = (storage ?? globalThis.localStorage)?.getItem(STORAGE_KEY);
    if (!raw) return { state: emptyState(), error: '' };
    const parsed = JSON.parse(raw);
    if (parsed?.schemaVersion !== 1 || !Array.isArray(parsed.items) || !parsed.shop) throw new Error('This saved data has an unsupported format.');
    return { state: {
      ...emptyState(), ...parsed,
      shop: { name: String(parsed.shop.name ?? ''), pickupDetails: String(parsed.shop.pickupDetails ?? '') },
      items: parsed.items,
      revision: Number.isSafeInteger(parsed.revision) ? parsed.revision : 0,
      selectedOffer: parsed.selectedOffer && typeof parsed.selectedOffer === 'object' ? parsed.selectedOffer : null,
    }, error: '' };
  } catch (error) {
    return { state: emptyState(), error: `Saved data could not be read (${error.message}). Your current session can still be used; clearing data removes the saved copy.` };
  }
}

export function saveState(state, storage) {
  try {
    (storage ?? globalThis.localStorage)?.setItem(STORAGE_KEY, JSON.stringify(state));
    return '';
  } catch (error) {
    return `Changes are in this session but could not be saved in this browser (${error.message}).`;
  }
}

export function newId() {
  return globalThis.crypto?.randomUUID?.() ?? `item-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
