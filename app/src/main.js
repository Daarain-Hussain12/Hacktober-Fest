import { formatInputPaisa, formatPaisa, parsePaisa } from './money.js';
import { eligibleItems, generateOffers } from './offers.js';
import { deriveRecipe } from './offers.js';
import { validateDraft, validateItem } from './validation.js';
import { emptyState, loadState, newId, saveState, STORAGE_KEY } from './state.js';
import { offerSvg, offerText } from './share.js';

const $ = selector => document.querySelector(selector);
const dom = {
  notice: $('#notice'), storageWarning: $('#storage-warning'), sampleBanner: $('#sample-banner'), stockList: $('#stock-list'), emptyStock: $('#empty-stock'), itemCount: $('#item-count'),
  addForm: $('#add-item-form'), addError: $('#add-error'), offerStatus: $('#offer-status'), offerList: $('#offer-list'), reviewState: $('#review-state'), reviewEmpty: $('#review-empty'),
  reviewContent: $('#review-content'), reviewFields: $('#review-fields'), composition: $('#composition'), priceRange: $('#price-range'), revenue: $('#revenue-value'), cost: $('#cost-value'), costDisclosure: $('#cost-disclosure'), reviewErrors: $('#review-errors'),
  copyPreview: $('#copy-preview'), copyPreviewWrap: $('#copy-preview-wrap'), copyButton: $('#copy-offer'), downloadButton: $('#download-card'), confirmButton: $('#confirm-offer'),
};

const loaded = loadState();
let state = loaded.state;
let storageError = loaded.error;
let noticeTimer;

function node(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function setNotice(message, tone = 'success') {
  clearTimeout(noticeTimer);
  if (!message) { dom.notice.hidden = true; dom.notice.textContent = ''; return; }
  dom.notice.textContent = message;
  dom.notice.className = tone === 'error' ? 'notice notice-error' : 'notice';
  dom.notice.hidden = false;
  noticeTimer = setTimeout(() => { dom.notice.hidden = true; }, 5200);
}

function persist() {
  storageError = saveState(state);
}

function markChanged({ sample = false } = {}) {
  state.revision += 1;
  if (!sample) state.sampleData = false;
  persist();
  render();
}

function label(text, control) {
  const wrap = node('label', 'review-field');
  wrap.append(node('span', '', text), control);
  return wrap;
}

function makeInput({ value = '', type = 'text', name, min, max, step, placeholder, maxLength, className = 'field-input', inputMode }) {
  const input = document.createElement('input');
  input.type = type;
  input.value = value;
  input.name = name;
  input.className = className;
  if (min !== undefined) input.min = min;
  if (max !== undefined) input.max = max;
  if (step !== undefined) input.step = step;
  if (placeholder) input.placeholder = placeholder;
  if (maxLength) input.maxLength = maxLength;
  if (inputMode) input.inputMode = inputMode;
  return input;
}

function checkbox(checked, labelText, field) {
  const wrap = node('label', 'check-label');
  const input = document.createElement('input');
  input.type = 'checkbox'; input.checked = checked; input.dataset.field = field;
  wrap.append(input, document.createTextNode(` ${labelText}`));
  return wrap;
}

function renderStock() {
  dom.stockList.replaceChildren();
  dom.itemCount.textContent = `${state.items.length} ${state.items.length === 1 ? 'item' : 'items'}`;
  dom.emptyStock.hidden = state.items.length > 0;
  for (const item of state.items) {
    const row = node('div', 'stock-row');
    row.dataset.itemId = item.id;
    const name = makeInput({ value: item.name, name: 'name', maxLength: 60, className: 'field-input item-name' });
    name.dataset.field = 'name'; name.setAttribute('aria-label', `${item.name} item name`);
    row.append(name);
    const quantity = makeInput({ value: String(item.stockUnits), type: 'number', min: '0', step: '1', name: 'stockUnits', className: 'field-input' });
    quantity.dataset.field = 'stockUnits'; quantity.setAttribute('aria-label', `Units left for ${item.name}`);
    const qWrap = node('label', 'cell-wrap', 'Units left'); qWrap.append(quantity); row.append(qWrap);
    for (const [field, title, value] of [['regularPricePaisa','Regular price',item.regularPricePaisa],['clearanceFloorPaisa','Minimum price',item.clearanceFloorPaisa],['recordedCostPaisa','Recorded cost',item.recordedCostPaisa]]) {
      const input = makeInput({ value: value === null ? '' : formatInputPaisa(value), name: field, inputMode: 'decimal', placeholder: field === 'recordedCostPaisa' ? 'Unknown' : '0.00', className: 'field-input' });
      input.dataset.field = field; input.setAttribute('aria-label', `${title} in PKR for ${item.name}`);
      const wrap = node('label', 'cell-wrap', title); wrap.append(input); row.append(wrap);
    }
    const checks = node('div', 'check-stack');
    checks.append(checkbox(item.sellable, 'Sellable', 'sellable'), checkbox(item.bundleEligible, 'Bundle eligible', 'bundleEligible'));
    row.append(checks);
    const remove = node('button', 'icon-button', '×');
    remove.type = 'button'; remove.dataset.action = 'remove-item'; remove.setAttribute('aria-label', `Remove ${item.name}`); row.append(remove);
    dom.stockList.append(row);
  }
}

function candidateName(candidate) {
  return candidate.recipe.map(part => {
    const item = state.items.find(entry => entry.id === part.itemId);
    return `${part.unitsPerBundle} × ${item?.name ?? 'Removed item'}`;
  }).join(' + ');
}

function renderOffers() {
  dom.offerList.replaceChildren();
  const eligible = eligibleItems(state.items);
  const result = generateOffers(state.items);
  if (result.error) {
    dom.offerStatus.textContent = result.error;
    dom.offerList.append(node('div', 'no-offers', result.error));
    return;
  }
  if (state.items.length === 0) dom.offerStatus.textContent = 'Add stock or load the fictional sample to see bundle options.';
  else if (eligible.length === 0) dom.offerStatus.textContent = 'No items are marked sellable and bundle-eligible with stock available.';
  else if (result.total === 0) dom.offerStatus.textContent = 'No feasible two or three item recipes yet. Check quantities and bundle eligibility.';
  else dom.offerStatus.textContent = `Showing ${Math.min(12, result.total)} of ${result.total} feasible combinations, ordered by recipe size and available bundle count.`;
  if (!result.offers.length) {
    const copy = eligible.length < 2 ? 'Select at least two sellable, bundle-eligible items with stock to create a bundle.' : 'Try adjusting item quantities or eligibility.';
    dom.offerList.append(node('div', 'no-offers', copy));
    return;
  }
  result.offers.slice(0, 12).forEach((offer, index) => {
    const card = node('article', 'offer-card');
    const top = node('div', 'offer-card-top');
    top.append(node('h3', '', candidateName(offer)), node('span', 'offer-index', `OPTION ${String(index + 1).padStart(2, '0')}`));
    card.append(top);
    const regular = formatPaisa(offer.regular);
    const floor = formatPaisa(offer.floor);
    card.append(node('p', 'offer-detail', `Up to ${offer.capacity} bundles · Range ${floor}–${regular} · 10% starting-price suggestion, adjusted to your floor.`));
    const bottom = node('div', 'offer-card-bottom');
    const priceWrap = node('div');
    priceWrap.append(node('span', 'offer-price', formatPaisa(offer.price)), node('span', 'offer-price-label', `Suggested · ${formatPaisa(offer.capacity * offer.price)} if all ${offer.capacity} sell`));
    const choose = node('button', 'button button-outline', 'Choose this offer');
    choose.type = 'button'; choose.dataset.action = 'choose-offer'; choose.dataset.index = String(index);
    bottom.append(priceWrap, choose); card.append(bottom); dom.offerList.append(card);
  });
  dom.offerList.dataset.offerIds = 'ready';
  dom._candidates = result.offers.slice(0, 12);
}

function selectedMetrics() {
  const validation = validateDraft(state.selectedOffer, state.items, state.revision);
  const shopErrors = [];
  if (!state.shop.name.trim()) shopErrors.push('Enter your shop name.');
  if (!state.shop.pickupDetails.trim()) shopErrors.push('Enter pickup window or location details.');
  return { validation, errors: [...validation.errors, ...shopErrors] };
}

function renderReview() {
  const draft = state.selectedOffer;
  dom.reviewContent.hidden = !draft;
  dom.reviewEmpty.hidden = Boolean(draft);
  if (!draft) {
    dom.reviewState.textContent = 'No offer selected'; dom.reviewState.className = 'state-pill';
    return;
  }
  const parts = deriveRecipe(draft, state.items);
  const derived = validateDraft(draft, state.items, state.revision);
  const shop = makeInput({ value: state.shop.name, name: 'shopName', maxLength: 60, placeholder: 'e.g. Dawood’s Bakery' });
  shop.dataset.reviewField = 'shopName';
  const pickup = makeInput({ value: state.shop.pickupDetails, name: 'pickupDetails', maxLength: 120, placeholder: 'e.g. Today, 6–7 pm · collect at the counter' });
  pickup.dataset.reviewField = 'pickupDetails';
  dom.reviewFields.replaceChildren(label('Shop name', shop), label('Pickup window or location', pickup));

  const editor = node('div', 'offer-editor'); editor.append(node('p', 'offer-editor-title', 'BUNDLE CONTENTS'));
  for (const part of parts) {
    const row = node('div', 'recipe-edit-row');
    const itemLabel = node('label'); itemLabel.append(node('strong', '', part.item.name), node('span', '', `Stock: ${part.item.stockUnits}`));
    const qty = makeInput({ value: String(part.unitsPerBundle), type: 'number', min: '1', max: String(Math.max(1, part.item.stockUnits)), step: '1', name: `quantity:${part.itemId}`, className: 'field-input' });
    qty.dataset.recipeQuantity = part.itemId; qty.setAttribute('aria-label', `Units of ${part.item.name} per bundle`);
    const remove = node('button', 'small-button', 'Remove'); remove.type = 'button'; remove.dataset.action = 'remove-recipe-item'; remove.dataset.itemId = part.itemId; remove.setAttribute('aria-label', `Remove ${part.item.name} from offer`);
    row.append(itemLabel, qty, remove); editor.append(row);
  }
  const available = eligibleItems(state.items).filter(item => !draft.recipe.some(part => part.itemId === item.id));
  if (available.length) {
    const addRow = node('div', 'add-recipe-row');
    const select = document.createElement('select'); select.dataset.action = 'add-recipe-item'; select.setAttribute('aria-label', 'Add eligible item to bundle');
    select.append(new Option('Add an eligible item…', ''));
    available.forEach(item => select.append(new Option(`${item.name} · ${item.stockUnits} left`, item.id)));
    addRow.append(label('Edit this bundle', select)); editor.append(addRow);
  }
  const price = makeInput({ value: formatInputPaisa(draft.pricePaisa), name: 'pricePaisa', inputMode: 'decimal', placeholder: '0.00' }); price.dataset.reviewField = 'pricePaisa';
  const count = makeInput({ value: String(draft.bundlesToOffer), name: 'bundlesToOffer', type: 'number', min: '1', max: String(Number.isFinite(derived.capacity) ? Math.max(1, derived.capacity) : 1), step: '1' }); count.dataset.reviewField = 'bundlesToOffer';
  const priceField = label('Offer price (PKR)', price); priceField.classList.add('review-field');
  const countField = label(`Bundles to offer (max ${Number.isFinite(derived.capacity) ? derived.capacity : 0})`, count);
  editor.append(priceField, countField);
  dom.reviewFields.append(editor);

  const metrics = selectedMetrics();
  const stale = draft.baseRevision !== state.revision;
  dom.reviewState.textContent = stale ? 'Changes need review' : metrics.errors.length ? 'Needs attention' : 'Ready to share';
  dom.reviewState.className = `state-pill${!stale && !metrics.errors.length ? ' is-ready' : ''}`;
  dom.priceRange.textContent = `Allowed: ${formatPaisa(derived.floor || 0)}–${formatPaisa(derived.regular || 0)}`;
  dom.composition.replaceChildren(
    node('div', '', `${draft.bundlesToOffer} ${draft.bundlesToOffer === 1 ? 'bundle' : 'bundles'} · ${formatPaisa(draft.pricePaisa)} each`),
    node('div', 'composition-detail', parts.map(part => `${part.unitsPerBundle} × ${part.item.name}`).join(' + ')),
  );
  const remaining = node('div', 'remaining-list');
  for (const item of state.items) {
    const used = draft.recipe.find(part => part.itemId === item.id);
    const units = used ? item.stockUnits - draft.bundlesToOffer * used.unitsPerBundle : item.stockUnits;
    remaining.append(node('span', 'remaining-chip', `${item.name}: ${Math.max(0, units)} left`));
  }
  dom.composition.append(remaining);
  dom.revenue.textContent = formatPaisa(draft.bundlesToOffer * draft.pricePaisa);
  dom.cost.textContent = derived.costsKnown && parts.length === draft.recipe.length ? formatPaisa(draft.bundlesToOffer * (draft.pricePaisa - derived.itemCost)) : 'Unavailable';
  dom.costDisclosure.textContent = derived.costsKnown ? 'Excludes selling fees, taxes, labour, overhead and other costs; this is not net profit.' : 'Enter a recorded cost for every included item to calculate this. Unknown costs are not treated as zero.';
  const shareErrors = metrics.errors.filter(error => !error.includes('out of date'));
  dom.reviewErrors.replaceChildren();
  if (metrics.errors.length) {
    const list = node('ul');
    for (const error of metrics.errors) list.append(node('li', '', error));
    dom.reviewErrors.append(list); dom.reviewErrors.hidden = false;
  } else dom.reviewErrors.hidden = true;
  const valid = !stale && shareErrors.length === 0;
  dom.copyPreviewWrap.hidden = !valid;
  dom.copyPreview.textContent = valid ? offerText(state) : '';
  dom.copyButton.disabled = !valid; dom.downloadButton.disabled = !valid;
  dom.copyButton.setAttribute('aria-disabled', String(!valid)); dom.downloadButton.setAttribute('aria-disabled', String(!valid));
  dom.confirmButton.disabled = !stale && metrics.validation.errors.length === 0;
}

function render() {
  dom.storageWarning.textContent = storageError;
  dom.storageWarning.hidden = !storageError;
  dom.sampleBanner.hidden = !state.sampleData;
  renderStock(); renderOffers(); renderReview();
}

function readPaisa(value, optional = false) {
  const parsed = parsePaisa(value, { required: !optional });
  return parsed.ok ? parsed.value : undefined;
}

dom.addForm.addEventListener('submit', event => {
  event.preventDefault();
  const form = new FormData(dom.addForm);
  const regular = readPaisa(form.get('regularPrice'));
  const floor = readPaisa(form.get('floorPrice'));
  const cost = readPaisa(form.get('recordedCost'), true);
  const stock = Number(form.get('stockUnits'));
  const item = { id: newId(), name: String(form.get('name') ?? '').trim(), stockUnits: stock, regularPricePaisa: regular, clearanceFloorPaisa: floor, recordedCostPaisa: cost === undefined ? NaN : cost, sellable: form.has('sellable'), bundleEligible: form.has('eligible') };
  const errors = [];
  if (regular === undefined) errors.push('Regular price: use PKR with up to two decimal places.');
  if (floor === undefined) errors.push('Minimum price: use PKR with up to two decimal places.');
  if (cost === undefined) errors.push('Recorded cost: use PKR with up to two decimal places, or leave blank.');
  if (errors.length) { dom.addError.textContent = errors.join(' '); dom.addError.hidden = false; return; }
  item.recordedCostPaisa = cost;
  errors.push(...validateItem(item, state.items));
  if (errors.length) { dom.addError.textContent = errors.join(' '); dom.addError.hidden = false; return; }
  state.items.push(item); dom.addForm.reset(); dom.addForm.elements.sellable.checked = true; dom.addForm.elements.eligible.checked = true; dom.addError.hidden = true;
  markChanged(); setNotice(`${item.name} added to your shelf.`);
});

dom.stockList.addEventListener('change', event => {
  const control = event.target;
  const row = control.closest('[data-item-id]');
  if (!row) return;
  const item = state.items.find(entry => entry.id === row.dataset.itemId);
  if (!item) return;
  const previous = { ...item };
  const field = control.dataset.field;
  if (field === 'sellable' || field === 'bundleEligible') item[field] = control.checked;
  else if (field === 'name') item.name = control.value.trim();
  else if (field === 'stockUnits') item.stockUnits = control.value === '' ? NaN : Number(control.value);
  else if (field === 'recordedCostPaisa') {
    const value = readPaisa(control.value, true);
    if (value === undefined) { setNotice('Cost was not saved. Use PKR with up to two decimal places, or leave it unknown.', 'error'); return render(); }
    item.recordedCostPaisa = value;
  } else if (field === 'regularPricePaisa' || field === 'clearanceFloorPaisa') {
    const value = readPaisa(control.value);
    if (value === undefined) { setNotice('Price was not saved. Use PKR with up to two decimal places.', 'error'); return render(); }
    item[field] = value;
  }
  const errors = validateItem(item, state.items);
  if (errors.length) { Object.assign(item, previous); setNotice(errors.join(' '), 'error'); return render(); }
  markChanged();
});

dom.stockList.addEventListener('click', event => {
  const button = event.target.closest('[data-action="remove-item"]');
  if (!button) return;
  const row = button.closest('[data-item-id]');
  const item = state.items.find(entry => entry.id === row?.dataset.itemId);
  if (!item) return;
  state.items = state.items.filter(entry => entry.id !== item.id);
  markChanged(); setNotice(`${item.name} removed. Review any offer that used it.`);
});

$('#load-sample').addEventListener('click', () => {
  if (state.items.length && !window.confirm('Replace your current shelf with fictional sample data?')) return;
  state = {
    schemaVersion: 1,
    shop: { name: 'The Green Apron Bakery', pickupDetails: 'Today, 6–7 pm · collect at the counter' },
    items: [
      { id: 'sample-pastry', name: 'Pastries', stockUnits: 12, regularPricePaisa: 15000, clearanceFloorPaisa: 10000, recordedCostPaisa: 8000, sellable: true, bundleEligible: true },
      { id: 'sample-drink', name: 'Drinks', stockUnits: 6, regularPricePaisa: 8000, clearanceFloorPaisa: 5000, recordedCostPaisa: 4000, sellable: true, bundleEligible: true },
    ], selectedOffer: null, sampleData: true, revision: state.revision + 1,
  };
  persist(); render(); setNotice('Fictional sample loaded.');
});

$('#clear-data').addEventListener('click', () => {
  if (!window.confirm('Clear the saved stock and shop details from this browser?')) return;
  try { localStorage.removeItem(STORAGE_KEY); storageError = ''; }
  catch (error) { storageError = `Saved data could not be cleared (${error.message}).`; }
  state = emptyState(); render(); setNotice('Your shelf is clear.');
});

$('#generate-offers').addEventListener('click', () => { renderOffers(); setNotice('Offer options refreshed from current stock.'); });

dom.offerList.addEventListener('click', event => {
  const button = event.target.closest('[data-action="choose-offer"]');
  if (!button) return;
  const candidate = dom._candidates?.[Number(button.dataset.index)];
  if (!candidate) return;
  state.selectedOffer = { recipe: candidate.recipe.map(part => ({ ...part })), bundlesToOffer: candidate.capacity, pricePaisa: candidate.price, baseRevision: state.revision };
  persist(); render(); document.querySelector('#review').scrollIntoView({ behavior: 'smooth' });
  setNotice('Offer selected. Check the quantity, price and pickup details before sharing.');
});

function invalidateDraft() {
  state.revision += 1;
  if (state.selectedOffer) state.selectedOffer.baseRevision = -1;
  state.sampleData = false;
  persist(); render();
}

dom.reviewFields.addEventListener('change', event => {
  const field = event.target.dataset.reviewField;
  if (!field || !state.selectedOffer) return;
  if (field === 'shopName') state.shop.name = event.target.value.trim();
  else if (field === 'pickupDetails') state.shop.pickupDetails = event.target.value.trim();
  else if (field === 'pricePaisa') {
    const value = readPaisa(event.target.value);
    if (value === undefined) { setNotice('Price was not changed. Use PKR with up to two decimal places.', 'error'); return render(); }
    state.selectedOffer.pricePaisa = value;
  } else if (field === 'bundlesToOffer') state.selectedOffer.bundlesToOffer = event.target.value === '' ? NaN : Number(event.target.value);
  invalidateDraft();
});

dom.reviewFields.addEventListener('change', event => {
  if (event.target.dataset.recipeQuantity) {
    const part = state.selectedOffer?.recipe.find(entry => entry.itemId === event.target.dataset.recipeQuantity);
    if (!part) return;
    part.unitsPerBundle = event.target.value === '' ? NaN : Number(event.target.value);
    invalidateDraft();
    return;
  }
  if (event.target.matches('select[data-action="add-recipe-item"]')) {
    const item = state.items.find(entry => entry.id === event.target.value);
    if (!item || !state.selectedOffer) return;
    state.selectedOffer.recipe.push({ itemId: item.id, unitsPerBundle: 1 });
    invalidateDraft();
  }
});

dom.reviewFields.addEventListener('click', event => {
  const button = event.target.closest('[data-action="remove-recipe-item"]');
  if (!button || !state.selectedOffer) return;
  if (state.selectedOffer.recipe.length <= 2) { setNotice('Keep at least two items in a bundle.', 'error'); return; }
  state.selectedOffer.recipe = state.selectedOffer.recipe.filter(part => part.itemId !== button.dataset.itemId);
  invalidateDraft();
});

dom.confirmButton.addEventListener('click', () => {
  if (!state.selectedOffer) return;
  state.selectedOffer.baseRevision = state.revision;
  const { errors } = selectedMetrics();
  if (errors.length) {
    state.selectedOffer.baseRevision = -1;
    persist(); renderReview();
    setNotice(errors.join(' '), 'error');
    return;
  }
  persist(); render(); setNotice('Offer is current and ready to share.');
});

dom.copyButton.addEventListener('click', async () => {
  const { errors } = selectedMetrics();
  if (errors.length) { setNotice(errors.join(' '), 'error'); return renderReview(); }
  const text = offerText(state);
  try {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
    else {
      const area = document.createElement('textarea'); area.value = text; area.setAttribute('readonly', ''); area.style.position = 'fixed'; area.style.opacity = '0'; document.body.append(area); area.select();
      const copied = document.execCommand('copy'); area.remove();
      if (!copied) throw new Error('Clipboard access is unavailable.');
    }
    setNotice('Offer text copied. Paste it into your usual shop channel.');
  } catch { setNotice('Could not copy automatically. Select and copy the offer text from the preview.', 'error'); }
});

dom.downloadButton.addEventListener('click', () => {
  const { errors } = selectedMetrics();
  if (errors.length) { setNotice(errors.join(' '), 'error'); return renderReview(); }
  const blob = new Blob([offerSvg(state)], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a'); link.href = url; link.download = 'rescueshelf-offer.svg'; document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  setNotice('Share card downloaded as rescueshelf-offer.svg.');
});

render();
