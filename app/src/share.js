import { formatPaisa } from './money.js';
import { deriveRecipe } from './offers.js';

const escapeXml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char]);

export function offerText(state) {
  const parts = deriveRecipe(state.selectedOffer, state.items);
  const offer = state.selectedOffer;
  return [
    state.shop.name.trim(),
    `Closing-time bundle: ${parts.map(({ item, unitsPerBundle }) => `${unitsPerBundle} × ${item.name}`).join(' + ')}`,
    `Price: ${formatPaisa(offer.pricePaisa)}`,
    `Available: ${offer.bundlesToOffer} ${offer.bundlesToOffer === 1 ? 'bundle' : 'bundles'}`,
    `Pickup: ${state.shop.pickupDetails.trim()}`,
  ].filter(Boolean).join('\n');
}

export function offerSvg(state) {
  const offer = state.selectedOffer;
  const parts = deriveRecipe(offer, state.items);
  const lines = parts.map(({ item, unitsPerBundle }) => `${unitsPerBundle} × ${item.name}`);
  const yStart = 340;
  const items = lines.map((line, index) => `<text x="64" y="${yStart + index * 38}" class="item">${escapeXml(line)}</text>`).join('\n');
  const pickupLines = wrapText(state.shop.pickupDetails.trim(), 42, 3);
  const pickup = pickupLines.map((line, index) => `<tspan x="64" dy="${index ? 42 : 0}">${escapeXml(line)}</tspan>`).join('');
  const shopName = state.shop.name.trim() || 'Your bakery';
  const shop = escapeXml(shopName);
  const shopSize = Math.max(26, 44 - Math.max(0, shopName.length - 28) * 0.55);
  const count = `${offer.bundlesToOffer} ${offer.bundlesToOffer === 1 ? 'bundle' : 'bundles'} available`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350" role="img" aria-labelledby="title desc">
  <title id="title">Closing-time offer from ${shop}</title><desc id="desc">${escapeXml(count)} for ${escapeXml(formatPaisa(offer.pricePaisa))}. Pickup: ${escapeXml(state.shop.pickupDetails.trim())}</desc>
  <rect width="1080" height="1350" fill="#f6f2e9"/><rect x="42" y="42" width="996" height="1266" rx="20" fill="#fffdf8" stroke="#e7e1d5" stroke-width="3"/>
  <circle cx="104" cy="112" r="28" fill="#315d43"/><text x="104" y="122" text-anchor="middle" class="mark">R</text>
  <text x="150" y="121" class="brand">RescueShelf</text><text x="64" y="220" class="label">A CLOSING-TIME OFFER</text>
  <text x="64" y="272" class="shop" style="font-size:${shopSize}px">${shop}</text>${items}
  <line x1="64" y1="478" x2="1016" y2="478" stroke="#e7e1d5" stroke-width="3"/>
  <text x="64" y="550" class="label">BUNDLE PRICE</text><text x="64" y="642" class="price">${escapeXml(formatPaisa(offer.pricePaisa))}</text>
  <rect x="64" y="690" width="952" height="82" rx="12" fill="#e8efe7"/><text x="92" y="742" class="count">${escapeXml(count)}</text>
  <text x="64" y="842" class="label">PICKUP DETAILS</text><text x="64" y="890" class="pickup">${pickup}</text>
  <line x1="64" y1="1190" x2="1016" y2="1190" stroke="#e7e1d5" stroke-width="3"/><text x="64" y="1244" class="footer">Share through your usual shop channels</text>
  <style>.brand,.footer{font:600 25px Arial,sans-serif;fill:#26382e}.mark{font:32px Georgia,serif;fill:#fff}.label{font:700 19px Arial,sans-serif;letter-spacing:3px;fill:#b85c35}.shop{font:44px Georgia,serif;fill:#26382e}.item{font:30px Arial,sans-serif;fill:#58665a}.price{font:64px Georgia,serif;fill:#315d43}.count{font:700 27px Arial,sans-serif;fill:#315d43}.pickup{font:30px Arial,sans-serif;fill:#26382e}.footer{font-size:20px;fill:#81877d}</style>
</svg>`;
}

function wrapText(value, limit, maxLines) {
  const words = String(value).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
    if (word.length > limit) {
      if (line) { lines.push(line); line = ''; }
      for (let i = 0; i < word.length; i += limit) lines.push(word.slice(i, i + limit));
      continue;
    }
    if (line && `${line} ${word}`.length > limit) { lines.push(line); line = word; }
    else line = line ? `${line} ${word}` : word;
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) { lines.length = maxLines; lines[maxLines - 1] = `${lines[maxLines - 1].slice(0, limit - 1)}…`; }
  return lines;
}
