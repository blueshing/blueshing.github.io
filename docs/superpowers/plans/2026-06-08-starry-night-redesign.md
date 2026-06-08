# 星夜藍視覺改版 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把部落格改成星夜藍視覺、站名改「深藍咖啡」、首頁 hero 換成中文星空橫幅。

**Architecture:** 純樣式與內容調整。配色集中在 `theme.css` 的 CSS 變數 token，元件不動（都吃 `--color-*`）；站名改 config；slogan 走 i18n；hero 改寫 `index.astro` 並用 scoped `<style>` 做純 CSS 星空背景。無新依賴。

**Tech Stack:** Astro 6、Tailwind v4（`@theme inline` token）、TypeScript（i18n `UIStrings`）。

**驗證策略：** 視覺改版無單元測試框架，以三層把關取代 TDD —— (1) `grep` 斷言（英文殘留已除、token 已換、字串已加），(2) `npm run build`（含 astro check 型別檢查）零錯誤，(3) `npm run dev` 目視深淺兩模式。每個 Task 先驗證再實作、改完再驗證，最後 commit。

**參考規格：** `docs/superpowers/specs/2026-06-08-starry-night-redesign-design.md`

---

## File Structure

| 檔案 | 責任 |
|------|------|
| `astro-paper.config.ts` | 站台識別：`site.title` → 「深藍咖啡」 |
| `src/styles/theme.css` | 全站配色 token（深淺各 7 個 CSS 變數） |
| `src/i18n/types.ts` | `UIStrings.home` 介面新增 `heroTagline` |
| `src/i18n/lang/zh-TW.ts` | 中文 slogan |
| `src/i18n/lang/en.ts` | 英文 slogan（介面必填，避免 build 失敗） |
| `src/pages/index.astro` | hero 區塊改寫 + scoped 星空背景 CSS |

執行順序：先 token（Task 1）→ 站名（Task 2）→ i18n 字串（Task 3）→ hero 改寫（Task 4）→ 整體 build＋目視（Task 5）。前四個 Task 各自獨立可 commit，第五個是整合驗收。

---

## Task 1: 配色 token 換成星夜藍

**Files:**
- Modify: `src/styles/theme.css:15-36`

- [ ] **Step 1: 改寫淺色與深色兩組 token**

把 `src/styles/theme.css` 第 15–36 行（`:root, [data-theme="light"]` 與 `[data-theme="dark"]` 兩個區塊）整段換成下列內容：

```css
/* Light theme values — 晝藍 */
:root,
[data-theme="light"] {
  --background: #f6f9fd;
  --foreground: #16243f;
  --accent: #9a6a1b;
  --accent-foreground: #ffffff;
  --muted: #e4ecf7;
  --muted-foreground: #566584;
  --border: #d3deef;
}

/* Dark theme values — 午夜星空 */
[data-theme="dark"] {
  --background: #0d1b2e;
  --foreground: #e8eef9;
  --accent: #f5c518;
  --accent-foreground: #0d1b2e;
  --muted: #1a2c47;
  --muted-foreground: #9fb4d4;
  --border: #2a3f63;
}
```

`@theme inline` 區塊（第 1–13 行）與 `--font-app` 維持不動。

- [ ] **Step 2: 斷言舊配色已清除**

Run:
```bash
cd /Users/kimhaung/Dev/blog && grep -nE "#ff6b01|#212737|#ab4b08|#006cac|#fdfdfd" src/styles/theme.css || echo "CLEAN"
```
Expected: 輸出 `CLEAN`（舊的橘色／舊底色／舊邊框色全數消失）。

- [ ] **Step 3: 斷言新 accent 已就位**

Run:
```bash
cd /Users/kimhaung/Dev/blog && grep -c "#f5c518" src/styles/theme.css && grep -c "#9a6a1b" src/styles/theme.css
```
Expected: 兩行各輸出 `1`（深色星光金、淺色咖啡金各一）。

- [ ] **Step 4: Commit**

```bash
cd /Users/kimhaung/Dev/blog && git add src/styles/theme.css && git commit -m "style: 配色 token 換成星夜藍（深淺雙模式）

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: 站名改為「深藍咖啡」

**Files:**
- Modify: `astro-paper.config.ts:5`

- [ ] **Step 1: 改 site.title**

在 `astro-paper.config.ts` 把：
```ts
    title: "Kim's Blog",
```
改為：
```ts
    title: "深藍咖啡",
```
`description`、`author`、其餘欄位都不動。

- [ ] **Step 2: 斷言站名已更新**

Run:
```bash
cd /Users/kimhaung/Dev/blog && grep -n '深藍咖啡' astro-paper.config.ts && (grep -q "Kim's Blog" astro-paper.config.ts && echo "STILL HAS OLD" || echo "OLD REMOVED")
```
Expected: 印出含「深藍咖啡」的那行，且第二段輸出 `OLD REMOVED`。

- [ ] **Step 3: Commit**

```bash
cd /Users/kimhaung/Dev/blog && git add astro-paper.config.ts && git commit -m "feat: 站名改為深藍咖啡

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: 新增 hero slogan i18n 字串

**Files:**
- Modify: `src/i18n/types.ts:28-33`
- Modify: `src/i18n/lang/zh-TW.ts:30-35`
- Modify: `src/i18n/lang/en.ts`（`home` 區塊）

- [ ] **Step 1: 在 UIStrings 介面加欄位**

`src/i18n/types.ts` 的 `home` 區塊（第 28–33 行）改為：
```ts
  home: {
    socialLinks: string;
    heroTagline: string;
    featured: string;
    recentPosts: string;
    allPosts: string;
  };
```

- [ ] **Step 2: 中文字串加 slogan**

`src/i18n/lang/zh-TW.ts` 的 `home` 區塊（第 30–35 行）改為：
```ts
  home: {
    socialLinks: "社群連結",
    heroTagline: "在星空下，喝杯咖啡寫點東西",
    featured: "精選",
    recentPosts: "最新文章",
    allPosts: "所有文章",
  },
```

- [ ] **Step 3: 英文字串補對應 slogan（介面必填）**

開啟 `src/i18n/lang/en.ts`，在其 `home` 物件中、`socialLinks` 之後加入一行：
```ts
    heroTagline: "Coffee, a few words, under a sky full of stars",
```
（其餘 `home` 欄位維持原樣，僅插入這一行。）

- [ ] **Step 4: 斷言三檔都有 heroTagline**

Run:
```bash
cd /Users/kimhaung/Dev/blog && grep -rl heroTagline src/i18n | sort
```
Expected: 三行 —— `src/i18n/lang/en.ts`、`src/i18n/lang/zh-TW.ts`、`src/i18n/types.ts`。

- [ ] **Step 5: Commit**

```bash
cd /Users/kimhaung/Dev/blog && git add src/i18n/types.ts src/i18n/lang/zh-TW.ts src/i18n/lang/en.ts && git commit -m "feat(i18n): 新增 hero slogan 字串 heroTagline

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: 改寫 hero 為中文星空橫幅

**Files:**
- Modify: `src/pages/index.astro:36-80`（hero 區塊）
- Modify: `src/pages/index.astro`（檔尾新增 scoped `<style>`）

- [ ] **Step 1: 改寫 #hero 區塊**

把 `src/pages/index.astro` 第 36–80 行（`<section id="hero" …>` … `</section>`）整段換成：

```astro
    <section id="hero" class="starry-hero border-border mb-2 border-b">
      <div class="starry-hero__inner">
        <div class="flex items-center gap-x-3">
          <h1 class="text-4xl font-bold sm:text-5xl">
            {config.site.title}
          </h1>
          <a
            target="_blank"
            href={`${import.meta.env.BASE_URL.replace(/\/?$/, "/")}rss.xml`}
            class="inline-block"
            aria-label="RSS Feed"
            title="RSS Feed"
          >
            <IconRss
              width={20}
              height={20}
              class="stroke-accent scale-125 stroke-3 rtl:-rotate-90"
            />
            <span class="sr-only">RSS Feed</span>
          </a>
        </div>

        <p class="mt-4 text-lg">{t.home.heroTagline}</p>

        {
          socials.length > 0 && (
            <div class="mt-5 flex max-sm:flex-col sm:items-center">
              <div class="me-2 mb-1 whitespace-nowrap sm:mb-0">
                {t.home.socialLinks}:
              </div>
              <Socials />
            </div>
          )
        }
      </div>
    </section>
```

說明：`config.site.title` 作標題、`t.home.heroTagline` 作 slogan 副標；`Mingalaba`、AstroPaper 英文介紹、README `LinkButton` 全部移除（RSS icon、Socials 保留）。`config` 與 `t` 在檔案頂部已 import，無需新增。

- [ ] **Step 2: 在檔尾新增 scoped 星空背景 CSS**

在 `src/pages/index.astro` 最末（第二個 `<script>` 之後）加入：

```astro
<style>
  /* 星空橫幅：深藍漸層底 + 純 CSS 星點，零額外圖檔 */
  .starry-hero {
    border-radius: 0.75rem;
    background:
      radial-gradient(1.5px 1.5px at 18% 32%, var(--foreground) 50%, transparent 51%),
      radial-gradient(1px 1px at 52% 18%, var(--foreground) 50%, transparent 51%),
      radial-gradient(1.5px 1.5px at 76% 44%, var(--foreground) 50%, transparent 51%),
      radial-gradient(1px 1px at 34% 66%, var(--foreground) 50%, transparent 51%),
      radial-gradient(1px 1px at 88% 72%, var(--foreground) 50%, transparent 51%),
      radial-gradient(1.5px 1.5px at 64% 82%, var(--accent) 50%, transparent 51%),
      linear-gradient(160deg, var(--muted) 0%, var(--background) 70%);
    background-repeat: no-repeat;
  }
  .starry-hero__inner {
    padding: 2.5rem 1.75rem 2rem;
  }
  /* 淺色模式：星點過亮會雜，降低存在感、保留淡藍漸層 */
  :global([data-theme="light"]) .starry-hero {
    background:
      radial-gradient(1.5px 1.5px at 64% 82%, var(--accent) 50%, transparent 51%),
      linear-gradient(160deg, var(--muted) 0%, var(--background) 75%);
    background-repeat: no-repeat;
  }
  @media (max-width: 640px) {
    .starry-hero__inner {
      padding: 2rem 1.25rem 1.5rem;
    }
  }
</style>
```

說明：星點用 `radial-gradient` 疊層畫在背景，零 DOM 節點、零額外請求；顏色全取自 token（換主題自動適配）。靜態無動畫，天然符合 `prefers-reduced-motion`。

- [ ] **Step 3: 斷言英文殘留已清除**

Run:
```bash
cd /Users/kimhaung/Dev/blog && grep -nE "Mingalaba|AstroPaper is a|astro-paper#readme" src/pages/index.astro && echo "FOUND REMNANT" || echo "CLEAN"
```
Expected: 輸出 `CLEAN`。

- [ ] **Step 4: 斷言新 hero 元素就位**

Run:
```bash
cd /Users/kimhaung/Dev/blog && grep -c "starry-hero" src/pages/index.astro && grep -c "heroTagline" src/pages/index.astro
```
Expected: 第一行 ≥ `3`（class 用在 section、inner、style、light override），第二行 `1`。

- [ ] **Step 5: Commit**

```bash
cd /Users/kimhaung/Dev/blog && git add src/pages/index.astro && git commit -m "feat: 首頁 hero 改為中文星空橫幅

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: 整合驗收（build + 目視）

**Files:** 無（驗證 only）

- [ ] **Step 1: 全站 build**

Run:
```bash
cd /Users/kimhaung/Dev/blog && npm run build
```
Expected: build 成功結束、`astro check` 0 errors（型別檢查通過代表 i18n 介面與三檔一致）。若報錯 → 回對應 Task 修正，勿略過。

- [ ] **Step 2: 啟動 dev 目視**

Run:
```bash
cd /Users/kimhaung/Dev/blog && npm run dev
```
開瀏覽器看首頁，逐項確認：
- hero 標題顯示「深藍咖啡」、副標「在星空下，喝杯咖啡寫點東西」，**無任何英文殘留**。
- hero 區塊呈現星空橫幅（深色模式可見星點 + 深藍漸層）。
- 切換深／淺模式：兩模式皆星夜藍系，正文與連結（accent）清楚可讀。
- RSS icon、社群連結、featured/recent 文章列表、頁尾正常。

- [ ] **Step 3: 連結對比度確認**

於淺色模式檢查文章連結（accent `#9a6a1b`）在白底 `#f6f9fd` 上是否清晰可讀；若偏淡導致對比不足（目標 WCAG AA ≥ 4.5:1），把 `theme.css` 淺色 `--accent` 再往深調（例如 `#875c12`）並重跑 Step 1。

- [ ] **Step 4: 收尾**

dev 目視無誤後停掉 dev server。本計畫不含 push —— 依使用者規範，**push 上線需經深藍確認**，故停在本機驗證完成、待確認。

---

## 待辦（非阻塞，不屬本計畫）

- 預設 OG 圖 `public/default-og.jpg` 仍是舊版，分享首頁時封面與新視覺不一致 —— 另案處理，不擋本次上線。
