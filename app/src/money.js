export function parsePaisa(value, { required = true } = {}) {
  const text = String(value ?? '').trim();
  if (!text) return required ? { ok: false, error: 'Enter an amount.' } : { ok: true, value: null };
  if (!/^\d+(?:\.\d{1,2})?$/.test(text)) return { ok: false, error: 'Use a non-negative amount with up to two decimal places.' };
  const [whole, fraction = ''] = text.split('.');
  const amount = Number(whole) * 100 + Number((fraction + '00').slice(0, 2));
  if (!Number.isSafeInteger(amount)) return { ok: false, error: 'Amount is too large.' };
  return { ok: true, value: amount };
}

export function formatPaisa(paisa) {
  const negative = paisa < 0;
  const amount = Math.abs(paisa);
  const whole = Math.floor(amount / 100).toLocaleString('en-PK');
  return `${negative ? '−' : ''}PKR ${whole}.${String(amount % 100).padStart(2, '0')}`;
}

export function formatInputPaisa(paisa) {
  return `${Math.floor(paisa / 100)}.${String(paisa % 100).padStart(2, '0')}`;
}

export function suggestedPrice(regularPricePaisa, floorPaisa) {
  return Math.max(floorPaisa, Math.floor((9 * regularPricePaisa + 5) / 10));
}
