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
- 收藏按鈕產生 1080 × 1440 PNG 提醒小卡；分享使用系統分享選單，或複製指引與連結。
- 支援鍵盤操作、讀屏提示和系統「減少動態效果」設定。
- 舊版 `choose_card.html` 與 `reveal_card.html` 入口會導向新版對應畫面。

## 修改內容

- `cards.js`：七張牌的名稱、主題、提醒、解讀與日常練習。
- `assets/cards/*.svg`：七張全新植物線條牌面，無外部圖片或字型依賴。
- `app.js`：路由、狀態、動畫流程、圖片輸出與分享。
- `style.css`：品牌色票、版面、動畫與響應式斷點。
- `index.html`：共用頁首、頁尾、SEO 與原有 Google Analytics 設定。

使用原生 ES modules、CSS 3D transforms、Web Animations、ResizeObserver 與 Canvas；不需建置或第三方前端套件。保留原有 GitHub Pages / CNAME 部署方式，網站根目錄可直接發佈。舊圖片留在專案中，但新版只引用品牌標誌與新 SVG。

## 檢查

```sh
npm run check
```

修改互動時，另以瀏覽器檢查呼吸／跳過、七個選牌按鈕、翻牌、重新抽牌、網址重新整理、分享與 PNG 收藏，並檢查手機與減少動態效果設定。
