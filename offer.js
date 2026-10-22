// Set these values to match a coupon already created in the store's admin.
// Set enabled to false to pause this offer without removing its configuration.
export const couponOffer = {
  enabled: true,
  code: 'dailyaroma',
  benefit: '現折 100 元',
  terms: [
    '購買任一七脈輪系列商品即可使用。',
    '結帳時輸入優惠碼 dailyaroma，現折 100 元。'
  ],
  // Use ISO timestamps with an explicit timezone, e.g. 2026-12-31T23:59:59+08:00.
  startsAt: null,
  expiresAt: null,
  shopUrl: 'https://www.venetia.tw/collections/venetia_chakra'
};

export function getOfferState(offer, now = Date.now()) {
  if (!offer.enabled || !offer.code.trim() || !offer.benefit.trim() || !offer.terms.length) return 'unavailable';
  const start = offer.startsAt === null ? null : Date.parse(offer.startsAt);
  const end = offer.expiresAt === null ? null : Date.parse(offer.expiresAt);
  if ((start !== null && !Number.isFinite(start)) || (end !== null && !Number.isFinite(end))) return 'unavailable';
  if (start !== null && end !== null && start >= end) return 'unavailable';
  if (end !== null && now >= end) return 'expired';
  if (start !== null && now < start) return 'scheduled';
  return 'active';
}
