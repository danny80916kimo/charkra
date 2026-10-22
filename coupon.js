import { couponOffer, getOfferState } from './offer.js?v=2.1.1';

const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function renderCoupon({ app, card, signal, icon, announce, offer = couponOffer }) {
  document.title = '領取七脈輪系列優惠｜VENETIA 凡娜緹雅';
  const state = getOfferState(offer);
  const active = state === 'active';
  const status = {
    unavailable: '專屬優惠即將開放，讓香氣先陪你走進日常。',
    scheduled: '專屬優惠尚未開始，期待很快與你相遇。',
    expired: '這份優惠已結束，謝謝你和我們一起照顧日常。',
    active: '點一下複製折扣碼，讓這份小禮陪你走進日常。'
  }[state];
  const backUrl = card ? `index.html?v=2.1.1#reading/${card.id}` : 'index.html?v=2.1.1';
  const safeShopUrl = new URL(offer.shopUrl);
  if (safeShopUrl.protocol !== 'https:' || safeShopUrl.hostname !== 'www.venetia.tw') throw new Error('Coupon destination must be the VENETIA store.');
  const productName = card?.productUrl
    ? `<a class="offer-product-link" href="${escapeHtml(card.productUrl)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(card.name)}七脈輪滾珠精油，另開新分頁">${escapeHtml(card.name)} ${icon('external')}</a>`
    : card ? escapeHtml(card.name) : '';

  app.innerHTML = `<section class="offer-main" aria-labelledby="page-title">
    <a class="offer-back text-link" href="${backUrl}">${icon('back')} ${card ? '回到我的日常指引' : '回到日常指引首頁'}</a>
    <div class="offer-layout">
      <div class="offer-copy">
        <p class="eyebrow">A LITTLE GIFT FOR YOUR DAILY RITUAL</p>
        <h1 id="page-title" tabindex="-1">把今天的指引，<br>留在日常的<em>香氣裡。</em></h1>
        <p class="offer-intro">一張牌，是和自己相遇的開始。<br>一抹香氣，讓溫柔延續到生活裡。<br>為喜歡的七脈輪香氣，收下一份專屬小禮。</p>
        ${card ? `<div class="offer-reading"><img src="${card.image}" width="300" height="460" alt=""><div><span>今天，與你相遇的能量</span><p>${productName}<span> · ${card.theme}</span></p></div></div>` : ''}
        <p class="offer-caption">A small kindness, a softer everyday.</p>
      </div>

      <section class="offer-ticket" aria-labelledby="offer-title">
        <div class="offer-ticket-top"><span>VENETIA</span><span>日常香氣・專屬禮遇</span></div>
        <div class="offer-gift" aria-hidden="true">${icon('gift')}</div>
        <p class="eyebrow">A GIFT, JUST FOR YOU</p>
        <h2 id="offer-title">七脈輪系列<br>專屬優惠禮</h2>
        ${offer.benefit ? `<p class="offer-benefit">${escapeHtml(offer.benefit)}</p>` : '<p class="offer-benefit offer-benefit-pending">為自己，留一份香氣的心意。</p>'}
        <p class="offer-status" id="offer-status" role="status">${status}</p>
        <div class="offer-code-area" id="offer-code-area" ${active ? '' : 'hidden'}>
          <label for="offer-code">你的專屬折扣碼</label>
          <input id="offer-code" type="text" value="${active ? escapeHtml(offer.code.trim()) : ''}" readonly autocomplete="off" spellcheck="false" aria-describedby="offer-status">
        </div>
        <button class="button offer-claim" id="claim-offer" type="button" aria-describedby="offer-status" ${active ? '' : 'disabled'}>${active ? `一鍵複製折扣碼 ${icon('copy')}` : state === 'expired' ? '本次優惠已結束' : '優惠即將開放'}</button>
        <div class="offer-ticket-divider" aria-hidden="true"></div>
        <div class="offer-scope"><span>適用商品</span><p>任一七脈輪系列商品</p></div>
        ${offer.terms.length ? `<div class="offer-terms"><h3>這份小禮的使用方式</h3><ul>${offer.terms.map(term => `<li>${escapeHtml(term)}</li>`).join('')}</ul></div>` : ''}
      </section>
    </div>

    <section class="offer-guide" aria-label="優惠使用流程">
      <div><span>01</span><p>一鍵複製折扣碼<small>收下給自己的香氣小禮</small></p></div>
      <div><span>02</span><p>挑選七脈輪系列<small>找到適合此刻的日常香氣</small></p></div>
      <div><span>03</span><p>結帳輸入折扣碼<small>依活動條件享受專屬優惠</small></p></div>
    </section>
    <div class="offer-shop"><a class="button button-outline" href="${escapeHtml(safeShopUrl.href)}" target="_blank" rel="noopener noreferrer"><span id="offer-shop-label">探索七脈輪系列</span> ${icon('external')}</a><p>把自然與香氣，帶進日常的每一天。</p></div>
  </section>`;

  const button = app.querySelector('#claim-offer');
  const statusEl = app.querySelector('#offer-status');
  const codeInput = app.querySelector('#offer-code');
  codeInput.addEventListener('click', () => codeInput.select(), { signal });
  button.addEventListener('click', async () => {
    if (getOfferState(offer) !== 'active') {
      button.disabled = true;
      statusEl.textContent = '這份優惠目前無法領取，謝謝你的喜歡。';
      return;
    }
    button.disabled = true;
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(offer.code.trim());
      if (signal.aborted) return;
      statusEl.textContent = '折扣碼已複製，選好香氣後在結帳頁貼上即可。';
      button.innerHTML = `已複製折扣碼 ${icon('check')}`;
      announce('折扣碼已複製。');
    } catch {
      if (signal.aborted) return;
      codeInput.focus();
      codeInput.select();
      statusEl.textContent = '請複製上方已選取的折扣碼，再前往官網選購。';
    } finally {
      if (!signal.aborted) button.disabled = false;
    }
  }, { signal });
}
