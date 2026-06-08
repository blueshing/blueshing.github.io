# 星夜藍視覺改版 設計文件

**日期：** 2026-06-08
**目標：** 把整個部落格視覺改成「藍小星系列封面」的深藍星空調性，並把首頁 hero 從 AstroPaper 預設的英文介紹（Mingalaba）換成中文星空橫幅。

---

## 一、背景與範圍

目前部落格沿用 AstroPaper v6 預設配色（深色為 `#212737` 底＋橘色 `#ff6b01` accent），首頁 hero 區塊還是預設的英文 `Mingalaba` 標題＋AstroPaper 自我介紹＋README 連結，與站台中文定位、藍小星系列封面風格不一致。

**本次範圍（已定案）：**

- **配色：** 深淺兩種模式都改成星夜藍（決策 A — 雙模式都改）。
- **Hero：** 改成星空橫幅（決策 C），標題與介紹全中文。
- **不改：** 文章內容、版面結構（Card 列表、featured/recent 區塊維持）、giscus、search、OG 動態圖產生邏輯。只動「顏色 token」與「hero 區塊」兩處核心，外加預設 OG 圖待後續替換（列為非阻塞 todo）。

**非目標（YAGNI）：**

- 不新增多套配色切換（AstroPaper 支援，但用不到）。
- 不重寫元件結構、不動 Card/Header/Footer 版型。
- 不在這次處理 per-post 封面產生（維持固定系列封面策略）。

---

## 二、配色設計（星夜藍）

全部透過 `src/styles/theme.css` 的 CSS 變數 token 完成，元件不需改（都吃 `--color-*`）。

### 深色模式（主打：午夜星空）

| Token | 現值 | 新值 | 說明 |
|-------|------|------|------|
| `--background` | `#212737` | `#0d1b2e` | 午夜深藍 |
| `--foreground` | `#eaedf3` | `#e8eef9` | 星光白（微藍） |
| `--accent` | `#ff6b01` | `#6ba6e8` | 星藍（連結／重點） |
| `--accent-foreground` | `#ffffff` | `#0d1b2e` | accent 上的字（深底） |
| `--muted` | `#343f60` | `#1a2c47` | 次級區塊底 |
| `--muted-foreground` | `#afb9ca` | `#9fb4d4` | 次級文字 |
| `--border` | `#ab4b08` | `#2a3f63` | 分隔線（藍灰） |

### 淺色模式（晝藍）

| Token | 現值 | 新值 | 說明 |
|-------|------|------|------|
| `--background` | `#fdfdfd` | `#f6f9fd` | 冷調白 |
| `--foreground` | `#282728` | `#16243f` | 深海軍藍字 |
| `--accent` | `#006cac` | `#1d5fb5` | 深星藍（連結／重點） |
| `--accent-foreground` | `#ffffff` | `#ffffff` | accent 上的字 |
| `--muted` | `#e6e6e6` | `#e4ecf7` | 次級區塊底 |
| `--muted-foreground` | `#6b7280` | `#566584` | 次級文字 |
| `--border` | `#ece9e9` | `#d3deef` | 分隔線 |

> 對比度：深色 `#e8eef9` on `#0d1b2e`、淺色 `#16243f` on `#f6f9fd` 皆遠超 WCAG AA（≥ 7:1）。accent 作為連結色在兩模式對比皆 ≥ 4.5:1。實作時用 build 後目視＋必要時實測確認。

字型 `--font-app` 維持現狀（系統 CJK stack，已正確）。

---

## 三、Hero 星空橫幅設計

把 `src/pages/index.astro` 的 `#hero` 區塊（第 36–80 行）整段改寫。

### 內容（全中文，移除英文）

- **標題（h1）：** 用 `config.site.title`（目前 `Kim's Blog`）。
- **副標（p）：** 用 `config.site.description`（目前「技術與生活的混合筆記 — FinOps、雲端、AI 與日常」）。
- **移除：** 寫死的 `Mingalaba`、AstroPaper 英文介紹、README 連結。
- **保留：** RSS 連結 icon、社群連結（Socials）區塊。

### 視覺（星空橫幅）

- Hero 區塊加一層 **CSS 星空背景**：深藍漸層底 + `radial-gradient` 點綴星點（純 CSS，零額外圖檔、零額外請求）。
- 星空背景**只在深色模式**呈現完整星夜感；淺色模式用淡藍漸層 + 極淡星點，維持清爽。
- 標題與副標疊在星空上，加足夠 padding 與圓角，形成「橫幅卡片」感。
- 星點用 `::before`/`::after` 或單一背景 layer 實作，避免大量 DOM 節點。尊重 `prefers-reduced-motion`：星點不做動畫（靜態為主；若加微光動畫，reduced-motion 時關閉）。

### i18n

Hero 文字直接取自 config（已是中文），**不需新增 i18n 字串**。`home.socialLinks` 等沿用既有。

---

## 四、檔案異動清單

| 檔案 | 動作 | 說明 |
|------|------|------|
| `src/styles/theme.css` | 改 | 換掉深淺兩組 token 值（七個變數 × 2）；新增 hero 星空背景的 utility class 或 CSS 變數 |
| `src/pages/index.astro` | 改 | 改寫 `#hero` 區塊：中文標題/副標、星空橫幅 markup、移除英文與 README |
| `public/default-og.jpg`（或 config `ogImage`） | 待辦（非阻塞） | 預設 OG 圖換成星夜版，列為後續 todo |

星空背景 CSS 放哪：優先放 `theme.css`（與 token 同檔，集中管理）或 `index.astro` 的 `<style>`（僅首頁用）。實作時擇一，傾向 `index.astro` scoped style（hero 專用、不污染全域）。

---

## 五、驗證方式

1. `npm run build` 通過、無 astro check 錯誤（證據先於斷言）。
2. `npm run dev` 本地目視：
   - 首頁 hero 顯示中文標題＋副標＋星空橫幅，無任何英文殘留。
   - 深色／淺色切換，兩模式配色皆為星夜藍系、可讀性良好。
   - RSS、社群連結、featured/recent 文章列表正常。
3. 對比度確認（深淺模式正文與連結色）。
4. （選用）cross-review：依使用者偏好，視覺改版以目視為主，可略過或輕量化。

---

## 六、風險與代價

- **風險低：** 只動顏色 token 與單一 hero 區塊，不碰結構與資料流，回滾容易（git revert 兩個檔案）。
- **代價：** 星空背景純 CSS，無效能負擔；唯一需斟酌的是星點密度與淺色模式的呈現，需 build 後目視微調。
- **待辦（非阻塞）：** 預設 OG 圖仍是舊版，分享首頁時封面與新視覺不一致 —— 另開 todo 處理，不擋本次上線。
