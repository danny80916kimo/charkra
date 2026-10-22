import test from 'node:test';
import assert from 'node:assert/strict';
import { couponOffer, getOfferState } from './offer.js';

const now = Date.parse('2026-10-22T12:00:00+08:00');
const readyOffer = {
  enabled: true,
  code: 'TEST-ONLY',
  benefit: 'Test benefit',
  terms: ['Test terms'],
  startsAt: '2026-10-22T00:00:00+08:00',
  expiresAt: '2026-10-23T00:00:00+08:00'
};

test('an unfinished offer cannot be copied', () => {
  assert.equal(getOfferState({ ...couponOffer, enabled: false }, now), 'unavailable');
  for (const patch of [{ enabled: false }, { code: '  ' }, { benefit: '' }, { terms: [] }]) {
    assert.equal(getOfferState({ ...readyOffer, ...patch }, now), 'unavailable');
  }
});

test('availability follows Taiwan timestamps and exact start/end boundaries', () => {
  assert.equal(getOfferState(readyOffer, now), 'active');
  const start = Date.parse(readyOffer.startsAt);
  const end = Date.parse(readyOffer.expiresAt);
  assert.equal(getOfferState(readyOffer, start - 1), 'scheduled');
  assert.equal(getOfferState(readyOffer, start), 'active');
  assert.equal(getOfferState(readyOffer, end - 1), 'active');
  assert.equal(getOfferState(readyOffer, end), 'expired');
});

test('invalid or inverted dates do not expose a claimable offer', () => {
  for (const patch of [
    { startsAt: 'invalid' },
    { expiresAt: 'invalid' },
    { expiresAt: readyOffer.startsAt },
    { startsAt: readyOffer.expiresAt, expiresAt: readyOffer.startsAt }
  ]) assert.equal(getOfferState({ ...readyOffer, ...patch }, now), 'unavailable');
});
