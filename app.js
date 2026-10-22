import { cards } from './cards.js?v=2.1.1';
import { renderCoupon } from './coupon.js?v=2.1.1';

const app = document.querySelector('#app');
const announcer = document.querySelector('#announcer');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const mobile = matchMedia('(max-width: 759px)');
let scope;
let toastTimer;

const botanical = `<svg class="botanical" viewBox="0 0 110 150" aria-hidden="true">
  <circle cx="55" cy="72" r="44" opacity=".35"/><circle cx="55" cy="17" r="5"/>
  <path d="M55 130V45M55 107C31 108 20 91 23 77c19-1 32 11 32 30Zm0-21c24 1 35-16 32-30-19-1-32 11-32 30Zm0-19C41 68 34 57 36 48c12 0 19 7 19 19ZM55 107l-24-23M55 86l24-23M55 67 41 53"/>
  <path d="M37 132h36M43 137h24M47 142h16" opacity=".6"/>
  <path d="M13 32h8m-4-4v8M89 119h8m-4-4v8" opacity=".6"/>
</svg>`;
const cardBack = `<span class="card-back"><span class="card-back-label">VENETIA</span>${botanical}<span class="card-back-foot">日常・指引</span></span>`;
function icon(name) {
  const paths = {
    right: 'M4 12h16m-6-6 6 6-6 6',
    external: 'M7 17 17 7M7 7h10v10',
    down: 'M12 4v16m-6-6 6 6 6-6',
    restart: 'M3 11a9 9 0 1 1 2.9 6.7M3 4v7h7',
    back: 'M20 12H4m6-6-6 6 6 6',
    copy: 'M9 9h11v11H9zM15 9V4H4v11h5',
    check: 'M5 12l4 4L19 6',
    gift: 'M3 8h18v5H3zM5 13v8h14v-8M12 8v13M12 8H8a3 3 0 1 1 3-3l1 3Zm0 0h4a3 3 0 1 0-3-3l-1 3Z'
  };
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${paths[name]}"/></svg>`;
}
const arrow = icon('right');

function steps(active) {
  return `<nav class="steps" aria-label="抽牌進度">${['靜心', '選牌', '相遇'].map((name, i) => `${i ? '<span class="step-line" aria-hidden="true"></span>' : ''}<span class="step ${i === active ? 'current' : ''}" ${i === active ? 'aria-current="step"' : ''}><span>0${i + 1}</span><span>${name}</span></span>`).join('')}</nav>`;
}

function announce(text) { announcer.textContent = text; }
function toast(text) {
  const el = document.querySelector('#toast');
  clearTimeout(toastTimer);
  el.textContent = text;
  el.hidden = false;
  toastTimer = setTimeout(() => { el.hidden = true; }, 4000);
}
function wait(ms, signal) {
  return new Promise(resolve => {
    if (signal.aborted) return resolve(false);
    const done = () => { signal.removeEventListener('abort', abort); resolve(true); };
    const timer = setTimeout(done, reducedMotion.matches ? 0 : ms);
    const abort = () => { clearTimeout(timer); resolve(false); };
    signal.addEventListener('abort', abort, { once: true });
  });
}
function shuffledDeck() {
  const deck = [...cards];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function home() {
  document.title = '留一點時間，給自己。｜VENETIA 七脈輪日常指引';
  app.innerHTML = `<section class="home-main" aria-labelledby="page-title">
    <div class="home-copy">
      <p class="eyebrow">A LITTLE RITUAL, JUST FOR YOU</p>
      <h1 id="page-title" tabindex="-1">留一點時間，<br>給<em>自己。</em></h1>
      <p class="intro">在忙碌的日常裡，為心留一個安靜的角落。<br>跟著呼吸，選一張此刻與你相遇的牌，<br>讓自然與香氣，陪你找回自己的節奏。</p>
      <a class="button" href="#draw">開啟我的日常指引 ${arrow}</a>
      <p class="small-note">七種能量，一份此刻的溫柔提醒</p>
    </div>
    <div class="home-art" role="img" aria-label="三張自然色調的牌卡，圍繞著植物線條與圓環">
      <div class="art-orbit"></div>
      <div class="art-card left"><img src="assets/cards/heart.svg" alt="" width="300" height="460"></div>
      <div class="art-card right"><img src="assets/cards/crown.svg" alt="" width="300" height="460"></div>
      <div class="art-card middle">${cardBack}</div>
      <span class="art-caption">Come back to your own rhythm.</span>
    </div>
  </section>
  <div class="home-bottom" aria-hidden="true"><span>SEVEN CHAKRAS · DAILY INSPIRATION</span><div class="fine-line"></div><div class="chakra-dots">${cards.map(c => `<i style="--dot:${c.color}"></i>`).join('')}</div></div>`;
}

function draw(signal) {
  document.title = '選一張此刻的指引｜VENETIA';
  let state = 'idle';
  const deck = shuffledDeck();
  app.innerHTML = `<section class="ritual-main" aria-labelledby="page-title">
    <div id="ritual-steps">${steps(0)}</div>
    <div class="ritual-heading"><h1 id="page-title" tabindex="-1">先，把時間留給自己。</h1><p id="ritual-description">放鬆肩膀，讓呼吸慢下來。<br>暫時放下待辦，感受此刻的自己。</p></div>
    <div class="deck-stage" id="deck" role="group" aria-label="七張日常指引牌"><div class="breath-ring" aria-hidden="true"></div>
      ${deck.map((c, i) => `<button class="draw-card" type="button" data-index="${i}" aria-label="選擇第 ${i + 1} 張牌" disabled style="z-index:${i + 1}"><span class="card-inner"><span class="card-face">${cardBack}</span><span class="card-face card-front"><img src="${c.image}" alt="" width="300" height="460"></span></span></button>`).join('')}
    </div>
    <div class="ritual-controls"><button class="button" id="breathe" type="button">跟著呼吸，慢下來 ${arrow}</button><button class="text-link" id="skip" type="button">我準備好了，直接選牌</button><p class="ritual-note" id="deck-note" hidden>沒有標準答案，讓直覺帶你選擇。</p></div>
    <p class="ritual-quote">讓照顧自己，成為日常裡自然發生的美好片刻。</p>
  </section>`;
  const stage = document.querySelector('#deck');
  const buttons = [...stage.querySelectorAll('.draw-card')];
  const title = document.querySelector('#page-title');
  const description = document.querySelector('#ritual-description');
  const breathe = document.querySelector('#breathe');
  const skip = document.querySelector('#skip');
  const note = document.querySelector('#deck-note');
  function layout() {
    const spread = state === 'ready' || state === 'selecting';
    const spacing = mobile.matches ? Math.min(84, stage.clientWidth / 4.15) : Math.min(147, stage.clientWidth / 7.5);
    buttons.forEach((el, i) => {
      let x = (i - 3) * 3, y = 0, angle = (i - 3) * 2;
      if (spread) {
        if (mobile.matches) { x = (i < 4 ? i - 1.5 : i - 5) * spacing; y = i < 4 ? -85 : 58; angle = 0; }
        else { x = (i - 3) * spacing; y = (i - 3) ** 2 * 5 - 15; angle = (i - 3) * 4; }
      }
      el.style.setProperty('--x', `${x}px`);
      el.style.setProperty('--y', `${y}px`);
      el.style.setProperty('--angle', `${angle}deg`);
    });
  }
  layout();
  // Disconnect the observer when this screen is replaced.
  const resizeObserver = new ResizeObserver(layout);
  resizeObserver.observe(stage);
  signal.addEventListener('abort', () => resizeObserver.disconnect(), { once: true });
  function spread() {
    if (state === 'ready' || state === 'selecting' || signal.aborted) return;
    state = 'ready';
    stage.classList.remove('is-breathing');
    stage.classList.add('is-spread');
    document.querySelector('#ritual-steps').innerHTML = steps(1);
    title.textContent = '哪一張牌，讓你想多停留一會？';
    description.innerHTML = '不必想太多，輕輕選一張。<br>收下今天給自己的小提醒。';
    breathe.hidden = true;
    skip.hidden = true;
    note.hidden = false;
    buttons.forEach(el => { el.disabled = false; });
    layout();
    announce('七張牌已展開，請選擇一張牌。');
    // Move keyboard focus from the disappearing control to the first card.
    buttons[0].focus({ preventScroll: true });
  }
  skip.addEventListener('click', spread, { signal });
  breathe.addEventListener('click', async () => {
    if (state !== 'idle') return;
    if (reducedMotion.matches) return spread();
    state = 'breathing';
    breathe.disabled = true;
    breathe.textContent = '慢慢吸氣……';
    title.textContent = '吸氣，感受這一刻。';
    stage.classList.add('is-breathing');
    announce('慢慢吸氣。');
    if (!await wait(1800, signal) || state !== 'breathing') return;
    breathe.textContent = '輕輕吐氣……';
    title.textContent = '吐氣，把緊繃放下。';
    announce('輕輕吐氣。');
    if (!await wait(1800, signal) || state !== 'breathing') return;
    spread();
  }, { signal });
  buttons.forEach((el, i) => el.addEventListener('click', async () => {
    if (state !== 'ready') return;
    state = 'selecting';
    buttons.forEach(button => { button.disabled = true; });
    el.classList.add('is-selected');
    stage.classList.add('is-selecting');
    title.textContent = '有一份溫柔，正為你而來。';
    description.textContent = '讓這份小小的提醒，陪你走進今天。';
    note.textContent = '正在翻開你的日常指引……';
    announce('正在翻開你選擇的牌。');
    if (!await wait(750, signal)) return;
    el.classList.add('is-flipped');
    if (!await wait(1200, signal)) return;
    location.hash = `reading/${deck[i].id}`;
  }, { signal }));
}

function result(card, signal) {
  document.title = `${card.name}・今日的日常指引｜VENETIA`;
  app.innerHTML = `<section class="result-main" aria-labelledby="page-title" style="--card-color:${card.color};--card-tint:${card.tint}">
    <div class="result-kicker">${steps(2)}<h1 id="page-title" tabindex="-1">此刻，與你相遇的能量。</h1></div>
    <div class="result-layout">
      <div class="result-art"><img class="result-image" src="${card.image}" alt="${card.name}的植物線條牌卡" width="300" height="460"><span class="result-number"><span>0${cards.indexOf(card) + 1} / 07</span><span>· ${card.theme}</span></span></div>
      <div class="result-copy"><p class="eyebrow">A NOTE TO YOURSELF</p><h2>${card.name}</h2><p class="english-name">${card.english}</p>
        <p class="chakra-label">${card.chakra} · ${card.chakraEnglish}</p>
        <p class="affirmation">${card.affirmation}</p><p class="card-message">${card.message}</p>
        <div class="practice"><h3>給今天的一個小練習</h3><p>${card.practice}</p></div>
        <div class="result-actions"><button class="button" id="save-card" type="button">收藏這份提醒 ${icon('down')}</button><a class="button button-outline" id="coupon-link" href="coupon.html?v=2.1.1&card=${card.id}">領取優惠折扣碼 ${icon('gift')}</a></div>
      </div>
    </div>
    <div class="result-bottom"><a class="text-link" href="#draw">再給自己一個片刻 ${icon('restart')}</a>
      <div class="product-links"><a href="https://www.venetia.tw/collections/chakra-oil" target="_blank" rel="noopener noreferrer">探索七脈輪精油 ${icon('external')}</a><a href="https://www.venetia.tw/collections/chakra_spray" target="_blank" rel="noopener noreferrer">讓香氣陪伴日常 ${icon('external')}</a></div>
      <p class="reflection-note">牌卡是一份自我覺察的邀請。帶走有共鳴的話，依自己的步調前行。</p>
    </div>
  </section>`;
  document.querySelector('#save-card').addEventListener('click', () => saveCard(card), { signal });
  announce(`你抽到了${card.name}。${card.affirmation}`);
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  let line = '';
  for (const char of text) {
    if (ctx.measureText(line + char).width > maxWidth && line) { ctx.fillText(line, x, y); line = char; y += lineHeight; }
    else line += char;
  }
  if (line) ctx.fillText(line, x, y);
  return y + lineHeight;
}

async function saveCard(card) {
  const button = document.querySelector('#save-card');
  if (button.disabled) return;
  button.disabled = true;
  button.textContent = '正在準備圖片……';
  try {
    const image = new Image();
    image.src = card.image;
    await image.decode();
    await document.fonts.ready;
    const canvas = document.createElement('canvas');
    canvas.width = 1080; canvas.height = 1440;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fffff5'; ctx.fillRect(0, 0, 1080, 1440);
    ctx.strokeStyle = '#d4daca'; ctx.lineWidth = 2; ctx.strokeRect(45, 45, 990, 1350);
    ctx.fillStyle = '#5a725a'; ctx.textAlign = 'center'; ctx.font = '26px sans-serif'; ctx.fillText('V E N E T I A', 540, 115);
    ctx.font = '20px sans-serif'; ctx.fillText('七脈輪・日常指引', 540, 162);
    ctx.fillStyle = card.tint; ctx.beginPath(); ctx.arc(540, 418, 194, 0, Math.PI * 2); ctx.fill();
    ctx.save(); ctx.translate(540, 418); ctx.rotate(-.06); ctx.fillStyle = '#ffffff'; ctx.fillRect(-118, -176, 236, 352); ctx.drawImage(image, -108, -166, 216, 332); ctx.restore();
    ctx.fillStyle = '#48554f'; ctx.font = '52px serif'; ctx.fillText(card.name, 540, 680);
    ctx.fillStyle = '#777f72'; ctx.font = '22px sans-serif'; ctx.fillText(`${card.chakra} · ${card.theme}`, 540, 731);
    ctx.fillStyle = '#48554f'; ctx.font = '38px serif';
    wrapText(ctx, card.affirmation, 540, 817, 850, 58);
    ctx.fillStyle = '#697463'; ctx.font = '26px sans-serif';
    wrapText(ctx, card.message, 540, 945, 850, 46);
    ctx.strokeStyle = '#d4daca'; ctx.beginPath(); ctx.moveTo(180, 1190); ctx.lineTo(900, 1190); ctx.stroke();
    ctx.font = '22px serif'; ctx.fillText('把自然與香氣，帶進日常的每一天。', 540, 1273);
    ctx.font = '18px sans-serif'; ctx.fillText('EVERYDAY · AROMA · NATURAL', 540, 1324);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error('Image export failed');
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = `VENETIA-${card.name}-日常指引.png`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    toast('提醒小卡已準備好，願它陪你度過今天。');
  } catch { toast('圖片暫時無法儲存，請再試一次。'); }
  finally { button.disabled = false; button.innerHTML = `收藏這份提醒 ${icon('down')}`; }
}

function renderRoute(initial = false) {
  scope?.abort();
  scope = new AbortController();
  clearTimeout(toastTimer);
  document.querySelector('#toast').hidden = true;
  const route = location.hash.slice(1);
  if (document.body.dataset.page === 'coupon') {
    const card = cards.find(c => c.id === new URLSearchParams(location.search).get('card'));
    renderCoupon({ app, card, signal: scope.signal, icon, announce });
  }
  else if (route === 'draw') draw(scope.signal);
  else if (route === 'reading' || route.startsWith('reading/')) {
    let card = cards.find(c => c.id === route.split('/')[1]);
    if (!card) {
      card = cards[Math.floor(Math.random() * cards.length)];
      history.replaceState(null, '', `#reading/${card.id}`);
    }
    result(card, scope.signal);
  } else home();
  if (!reducedMotion.matches) app.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 450, easing: 'ease-out' });
  if (!initial) { document.querySelector('#page-title').focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: 'instant' }); }
}
document.querySelector('#year').textContent = new Date().getFullYear();
window.addEventListener('hashchange', () => renderRoute());
renderRoute(true);
