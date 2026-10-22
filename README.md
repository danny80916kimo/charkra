# VENETIA 七脈輪・日常指引

全新設計的單頁抽牌體驗，以 VENETIA 官網的奶油白 `#fffff5`、灰綠 `#48554f` 與植感綠 `#5a725a` 為基礎。

## 本機預覽

需要 Python 3；不需要安裝套件。

```sh
npm run dev
```

開啟 http://127.0.0.1:4173 。也可以直接執行 `python3 -m http.server 4173 --bind 127.0.0.1`。ES modules 需要 HTTP 伺服器，請勿用 `file://` 開啟。

## 體驗

- 首頁 → 3.6 秒吸吐氣引導（可跳過）→ 七張牌展開 → 選牌置中 → 3D 翻牌 → 今日解讀。
- 桌面採扇形展牌；手機採上四、下三，方便觸控。
- 每次重新抽牌都會洗牌，七張牌各出現一次；解讀網址記錄牌卡 ID，重新整理、返回與分享都保留相同結果。
- 收藏按鈕產生 1080 × 1440 PNG 提醒小卡；「領取優惠折扣碼」連到獨立的七脈輪系列優惠頁。
- 優惠頁保留來源牌卡，可返回該次解讀；一點即可複製折扣碼，再前往官網選購。
- 支援鍵盤操作、讀屏提示和系統「減少動態效果」設定。
- 舊版 `choose_card.html` 與 `reveal_card.html` 入口會導向新版對應畫面。

## 修改內容

- `cards.js`：七張牌的名稱、主題、提醒、解讀與日常練習。
- `assets/cards/*.svg`：七張全新植物線條牌面，無外部圖片或字型依賴。
- `app.js`：路由、狀態、動畫流程、圖片輸出與優惠入口。
- `coupon.html` / `coupon.js`：優惠頁、領取與複製流程。
- `offer.js`：已在官網建立的折扣碼、優惠內容、條件與活動起訖時間。
- `style.css`：品牌色票、版面、動畫與響應式斷點。
- `index.html`：共用頁首、頁尾、SEO 與原有 Google Analytics 設定。

使用原生 ES modules、CSS 3D transforms、Web Animations、ResizeObserver 與 Canvas；不需建置或第三方前端套件。保留原有 GitHub Pages / CNAME 部署方式，網站根目錄可直接發佈。舊圖片留在專案中，但新版只引用品牌標誌與新 SVG。

## 更新與快取

GitHub Pages 的靜態檔案可能被快取 10 分鐘。CSS 與 JavaScript 的引用帶有版本參數，避免新 HTML 混用舊版樣式或程式。發佈修改時，請同步更新 `index.html` 的 CSS / JS 版本、`app.js` 匯入 `cards.js` / `coupon.js` 與 `coupon.js` 匯入 `offer.js` 的版本，以及 `package.json` 的版本。若瀏覽器仍顯示舊頁面，可用強制重新整理載入新版 HTML（Mac：Command + Shift + R；Windows：Ctrl + F5）。

## 檢查

```sh
npm run check
```

```sh
npm test
```

修改互動時，另以瀏覽器檢查呼吸／跳過、七個選牌按鈕、翻牌、重新抽牌、網址重新整理、優惠頁入口與返回、領取／複製及 PNG 收藏，並檢查手機與減少動態效果設定。

## 優惠設定

先在 VENETIA 商店後台建立對應的折扣活動，再將折扣碼與使用規則填入 `offer.js`。此頁提供折扣碼展示與複製，不會在商店建立折扣活動、加入會員帳戶或驗證核銷。請確認官網後台的適用商品、門檻、期限和頁面一致。

目前優惠碼為 `dailyaroma`，購買任一七脈輪系列商品現折 100 元；選購連結指向 `/collections/venetia_chakra`。將 `enabled` 設為 `false` 可暫停優惠；必須提供非空白的 `code`、`benefit`、`terms` 才能啟用，資料未完成時顯示「優惠即將開放」。活動起訖時間請含 `+08:00`，若沒有起訖限制可保留 `null`；到期或尚未開始時停止領取。

優惠頁可直接使用 `coupon.html`，或使用 `coupon.html?card=sacral` 保留牌卡來源。此版本採免填個人資料的公開折扣碼方式。
