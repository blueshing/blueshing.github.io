# 個人部落格（Astro + AstroPaper v6）實作計畫

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `~/Dev/blog` 建立繁體中文個人部落格（混合型內容），含搜尋、留言、分析，部署到 Cloudflare Pages 免費子網域。

**Architecture:** 以 AstroPaper v6.1.0 主題為基底（Astro 6 靜態輸出），客製站台設定與中文化，giscus（GitHub Discussions）留言、Pagefind 搜尋（主題內建）、Cloudflare Web Analytics。GitHub push → Cloudflare Pages 自動部署。

**Tech Stack:** Astro ^6.4.2、AstroPaper v6.1.0、Tailwind 4、Pagefind、giscus、Cloudflare Pages。Node v22.22.3（已確認 ≥ 22.12）、npm（無 pnpm）、gh CLI（已登入 blueshing）。

**驗證原則:** 本專案是主題客製＋內容，無單元測試；守門機制是 `npm run build`（含 `astro check` 型別檢查 + content schema 驗證）必須零錯誤，每個 Task 結束都要跑。

**既有狀態:** `~/Dev/blog` 已是 git repo（main 分支），內含 `docs/` 設計文件。spec 位於 `docs/superpowers/specs/2026-06-07-personal-blog-design.md`。

---

### Task 1: 取得 AstroPaper v6 骨架

**Files:**
- Create: 整個 AstroPaper 專案骨架（`package.json`、`src/`、`astro-paper.config.ts` 等）

- [ ] **Step 1: 用官方模板 scaffold 到暫存目錄**（`~/Dev/blog` 非空，不能直接 scaffold）

```bash
cd /Users/kimhaung/Dev
npm create astro@latest blog-tmp -- --template satnaing/astro-paper --no-install --no-git -y
```

Expected: 建立 `/Users/kimhaung/Dev/blog-tmp`，內含 AstroPaper 檔案。

- [ ] **Step 2: 搬入 blog 目錄並清掉暫存**

```bash
rsync -a /Users/kimhaung/Dev/blog-tmp/ /Users/kimhaung/Dev/blog/
rm -rf /Users/kimhaung/Dev/blog-tmp
ls /Users/kimhaung/Dev/blog
```

Expected: `blog/` 同時有 `docs/`（原有）與 `package.json`、`src/`、`astro-paper.config.ts`（新搬入）。

- [ ] **Step 3: 安裝相依套件**

```bash
cd /Users/kimhaung/Dev/blog && npm install
```

Expected: 安裝成功，無 engine 警告（Node 22.22.3 符合需求）。

- [ ] **Step 4: 確認 .gitignore 涵蓋產出物**

讀 `.gitignore`，確認包含 `node_modules`、`dist`；若缺 `public/pagefind/`（build 時自動複製進來的搜尋索引）則補上一行：

```
public/pagefind/
```

- [ ] **Step 5: 首次 build 驗證骨架完整**

```bash
npm run build
```

Expected: `astro check` 通過、`astro build` 完成、pagefind 索引產生，exit code 0。

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: AstroPaper v6.1.0 骨架"
```

---

### Task 2: 站台設定（astro-paper.config.ts）

**Files:**
- Modify: `astro-paper.config.ts`

- [ ] **Step 1: 讀現有檔案**，保留 import 與 `defineAstroPaperConfig` 結構，只改值。

- [ ] **Step 2: 改成以下設定**（`url` 為暫定值，Task 8 部署後以實際網址回填）：

```typescript
export default defineAstroPaperConfig({
  site: {
    url: "https://kim-blog.pages.dev", // Task 8 部署後若實際網址不同，回來更新
    title: "Kim's Blog",
    description: "技術與生活的混合筆記 — FinOps、雲端、AI 與日常",
    author: "Kim Huang",
    lang: "zh-TW",
    timezone: "Asia/Taipei",
    dir: "ltr",
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: { enabled: false },
    search: "pagefind",
  },
  socials: [
    { name: "github", url: "https://github.com/blueshing" },
    { name: "mail", url: "mailto:blueshing@gmail.com" },
  ],
  shareLinks: [
    { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
    { name: "x", url: "https://x.com/intent/post?url=" },
    { name: "mail", url: "mailto:?subject=分享文章&body=" },
  ],
});
```

注意：`posts` 區塊省略（沿用預設 perPage/perIndex）。若原檔型別要求欄位與上面不同（v6 小版本差異），以原檔型別為準調整，意圖不變。

- [ ] **Step 3: build 驗證**

```bash
npm run build
```

Expected: exit code 0。

- [ ] **Step 4: Commit**

```bash
git add astro-paper.config.ts
git commit -m "feat: 站台設定（Kim's Blog、zh-TW、Asia/Taipei、社群連結）"
```

---

### Task 3: 介面中文化

**Files:**
- Modify: `src/i18n/` 下的字串資源檔（實際檔名以 repo 為準）
- Modify: `astro.config.ts`（i18n locales）
- Modify: `src/styles/global.css`（字型堆疊）

- [ ] **Step 1: 讀 `src/i18n/` 目錄結構**，理解字串資源格式（v6 將 UI 字串集中於此）。

- [ ] **Step 2: 依下表翻譯所有 UI 字串**（左：英文原文，右：繁中譯文；資源檔裡沒有的就跳過，有遺漏的英文字串比照風格翻譯）：

| 英文 | 繁中 |
|------|------|
| Home | 首頁 |
| Posts | 文章 |
| All Posts | 所有文章 |
| Recent Posts | 最新文章 |
| Featured | 精選 |
| Tags | 標籤 |
| Tag | 標籤 |
| Archives | 封存 |
| About | 關於 |
| Search | 搜尋 |
| Skip to content | 跳至主要內容 |
| Table of contents | 目錄 |
| Published: | 發佈於： |
| Updated: | 更新於： |
| Back | 返回 |
| Go back | 返回上頁 |
| Back to Top | 回到頂端 |
| Next | 下一頁 |
| Previous / Prev | 上一頁 |
| Share this post on: | 分享這篇文章： |
| Suggest Changes | 建議修改 |
| Page not found | 找不到頁面 |
| Go back home | 回到首頁 |
| Rss feed | RSS 訂閱 |
| Light mode / Dark mode | 淺色模式／深色模式 |

- [ ] **Step 3: 處理 `astro.config.ts` 的 i18n 設定**。原值為 `locales: ["en"], defaultLocale: "en"`。若 i18n 資源檔以 locale 為 key（如 `en.ts`），新增 `zh-TW` 資源並把設定改為：

```typescript
i18n: {
  locales: ["zh-TW"],
  defaultLocale: "zh-TW",
  routing: { prefixDefaultLocale: false },
},
```

若主題的字串資源不分 locale（單一字串表），直接改字串值即可，`astro.config.ts` 的 locales 仍改為 `["zh-TW"]` 讓 html lang 與 sitemap 正確。

- [ ] **Step 4: 字型堆疊**。讀 `src/styles/global.css`，找到字型定義（Tailwind 4 的 `--font-*` 變數或 `font-family`），在西文字型後、`sans-serif` 前插入繁中字型：

```css
"PingFang TC", "Noto Sans TC", "Microsoft JhengHei"
```

不新增 webfont 下載（效能優先，用系統字型）。

- [ ] **Step 5: 本地預覽人工確認**

```bash
npm run dev
```

開 `http://localhost:4321`：導覽列、頁尾、文章列表標題應顯示繁中；日期格式應為台北時區。確認後關閉 dev server。

- [ ] **Step 6: build 驗證 + Commit**

```bash
npm run build
git add -A
git commit -m "feat: 介面中文化（zh-TW 字串、locale、繁中字型堆疊）"
```

---

### Task 4: 清範例內容、建立第一篇文章與 About 頁

**Files:**
- Delete: `src/content/posts/` 下所有範例文章
- Create: `src/content/posts/launching-blog-with-ai-company.md`
- Modify: `src/content/pages/about.md`（檔名以實際為準）

- [ ] **Step 1: 刪除範例文章**

```bash
rm -rf /Users/kimhaung/Dev/blog/src/content/posts/*
```

- [ ] **Step 2: 建立第一篇文章** `src/content/posts/launching-blog-with-ai-company.md`：

```markdown
---
title: 開站：讓一群 AI 員工把部落格生出來
description: 這個部落格從需求訪談、方案比較、設計文件到部署上線，整個流程由一間「AI 公司」協作完成 — 這是開站記，也是流程記錄。
pubDatetime: 2026-06-07T12:00:00+08:00
tags:
  - tech
  - claude
  - ai-company
---

這個部落格上線了。

它的誕生方式有點不一樣：整個過程由一間「AI 公司」協作完成 —
需求訪談釐清定位（混合型內容、繁中、免費起步）、比較了三個方案、
寫成設計文件，然後照著實作計畫一步步把站建起來。

## 技術選擇

- **Astro + AstroPaper 主題**：靜態輸出、內建搜尋與 RSS
- **Cloudflare Pages**：免費部署與分析
- **giscus**：用 GitHub Discussions 當留言系統

## 接下來

這裡會混著寫：FinOps 與雲端成本、AI 工具的實際使用心得，
偶爾也會有技術以外的生活紀錄。文章用第一個標籤區分大類
（`tech`／`life`），想只看某一類的讀者可以從標籤頁進。
```

- [ ] **Step 3: 改寫 About 頁**。讀 `src/content/pages/` 找到 about 檔案，保留 frontmatter 欄位結構，內容改為：

```markdown
---
title: 關於
description: 關於 Kim Huang 與這個部落格。
---

我是 Kim Huang，在雲端成本（FinOps）與資料平台領域工作，
平常跟 GCP、BigQuery 和各種 AI 工具打交道。

這個部落格是技術與生活的混合筆記：

- **tech** — FinOps、雲端、AI 工具與工作流
- **life** — 技術以外的紀錄

文章歡迎透過下方留言或 [GitHub](https://github.com/blueshing) 交流。
```

- [ ] **Step 4: build 驗證**（同時驗證 frontmatter 符合 collection schema）

```bash
npm run build
```

Expected: exit code 0；若 schema 報錯（欄位名差異），以 `src/content.config.ts` 實際定義修正 frontmatter。

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: 第一篇文章與關於頁，移除範例內容"
```

---

### Task 5: 建立 GitHub repo 並推送

**Files:** 無程式碼變更（基礎建設）

- [ ] **Step 1: 建立公開 repo 並推送**（giscus 需要公開 repo）

```bash
cd /Users/kimhaung/Dev/blog
gh repo create blog --public --source=. --remote=origin --push
```

Expected: 建立 `blueshing/blog` 並推上 main。

- [ ] **Step 2: 驗證**

```bash
gh repo view blueshing/blog --json url,visibility -q '.url + " " + .visibility'
```

Expected: `https://github.com/blueshing/blog PUBLIC`。

---

### Task 6: giscus 留言

**Files:**
- Create: `src/components/Comments.astro`
- Modify: `src/layouts/PostLayout.astro`

- [ ] **Step 1: 開啟 repo 的 Discussions**

```bash
gh api -X PATCH repos/blueshing/blog -f has_discussions=true -q .has_discussions
```

Expected: `true`。

- [ ] **Step 2:（使用者操作）安裝 giscus App 並取得 ID**

請使用者完成：
1. 到 `https://github.com/apps/giscus` 安裝，授權僅限 `blueshing/blog`
2. 到 `https://giscus.app/zh-TW`，repo 填 `blueshing/blog`，Discussion 分類選 **Announcements**，mapping 用 **pathname**
3. 把頁面產生的 `data-repo-id` 與 `data-category-id` 兩個值貼回來

**此步是檢查點：拿到兩個 ID 才能繼續。**

- [ ] **Step 3: 建立 `src/components/Comments.astro`**（`REPO_ID`、`CATEGORY_ID` 換成 Step 2 取得的實際值）：

```astro
---
// giscus 留言區 — 嵌在文章內容之後
---
<section id="giscus-comments" class="mx-auto mt-12 w-full max-w-3xl">
  <script
    src="https://giscus.app/client.js"
    data-repo="blueshing/blog"
    data-repo-id="REPO_ID"
    data-category="Announcements"
    data-category-id="CATEGORY_ID"
    data-mapping="pathname"
    data-strict="0"
    data-reactions-enabled="1"
    data-emit-metadata="0"
    data-input-position="bottom"
    data-theme="preferred_color_scheme"
    data-lang="zh-TW"
    crossorigin="anonymous"
    async
  ></script>
</section>
```

- [ ] **Step 4: 嵌入文章頁**。讀 `src/layouts/PostLayout.astro`，在文章內容（`<slot />` 或文章 article 區塊結尾）之後加入：

```astro
import Comments from "@/components/Comments.astro";   // 加在 frontmatter import 區（路徑別名以該檔既有 import 風格為準）
```

```astro
<Comments />   <!-- 放在文章內容結束、分享連結附近 -->
```

- [ ] **Step 5: 本地驗證**

```bash
npm run dev
```

開任一篇文章頁，文章下方應出現 giscus iframe（「以 GitHub 帳號登入後留言」）。確認後關閉。

- [ ] **Step 6: build + Commit + Push**

```bash
npm run build
git add -A
git commit -m "feat: giscus 留言（GitHub Discussions）"
git push
```

---

### Task 7: Cloudflare Pages 部署

**Files:**
- Modify: `astro-paper.config.ts`（回填實際網址）

- [ ] **Step 1:（使用者操作）在 Cloudflare dashboard 建立 Pages 專案**

請使用者完成（沒有 Cloudflare 帳號就先免費註冊）：
1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. 選 `blueshing/blog` repo
3. 建置設定：
   - Framework preset：**Astro**
   - Build command：`npm run build`
   - Build output directory：`dist`
   - 環境變數加 `NODE_VERSION` = `22.12.0`
4. Deploy，完成後把實際網址（`https://<專案名>.pages.dev`）貼回來

**此步是檢查點：拿到實際網址才能繼續。**

- [ ] **Step 2: 回填正式網址**。把 `astro-paper.config.ts` 的 `site.url` 改為實際網址（影響 sitemap、RSS、canonical、OG 連結）。

- [ ] **Step 3: build + Commit + Push（觸發自動重新部署）**

```bash
npm run build
git add astro-paper.config.ts
git commit -m "chore: 回填正式網址"
git push
```

- [ ] **Step 4: 線上煙霧測試**（網址以實際為準）：

逐項用瀏覽器或 curl 確認：
- 首頁載入、繁中介面
- 文章頁開啟、giscus 載入
- 搜尋頁 `/search` 能搜到第一篇文章關鍵字
- `/rss.xml` 與 `/sitemap-index.xml` 回 200

```bash
curl -s -o /dev/null -w "%{http_code}" https://<實際網址>/rss.xml
curl -s -o /dev/null -w "%{http_code}" https://<實際網址>/sitemap-index.xml
```

Expected: 兩者皆 `200`。

---

### Task 8: Cloudflare Web Analytics

**Files:** 通常無程式碼變更（Pages 內建開關）；備援方案才改 `src/layouts/Layout.astro`

- [ ] **Step 1:（使用者操作）一鍵啟用**

Cloudflare dashboard → 該 Pages 專案 → **Metrics／Settings** 內的 **Web Analytics** → Enable。Pages 會自動注入 beacon，無須改 code。

- [ ] **Step 2: 備援方案（僅當 dashboard 沒有一鍵選項時）**：到 Cloudflare → Web Analytics 手動新增站台取得 token，在 `src/layouts/Layout.astro` 的 `</head>` 前加入（`TOKEN` 換成實際值）：

```html
<script
  defer
  src="https://static.cloudflareinsights.com/beacon.min.js"
  data-cf-beacon='{"token": "TOKEN"}'
></script>
```

然後 `npm run build && git add -A && git commit -m "feat: Cloudflare Web Analytics" && git push`。

- [ ] **Step 3: 驗證**：瀏覽線上站台幾頁，回 dashboard 確認 Analytics 開始有資料（可能延遲數分鐘）。

---

### Task 9: 端到端產線驗證

**Files:** 無（流程驗證）

- [ ] **Step 1: 確認 `post-to-blog` skill 與本站相容**：該 skill 規定「先讀 collection 定義再寫 frontmatter」。確認它能找到 `~/Dev/blog` 與 `src/content.config.ts`，並注意本站日期欄位是 `pubDatetime`（非 skill 範例中的 `pubDate`）。若 skill 文件的範例會誤導，建議使用者更新 skill 的 frontmatter 範例。

- [ ] **Step 2: 跑一次完整產線**（之後有真文章時）：寫作 → `post-to-blog` 發佈 → 確認自動部署上線 → `post-to-social` 產社群備稿。

- [ ] **Step 3: 收尾**：回報上線網址、第一篇文章連結，並提醒第二期項目（電子報、自訂網域、`post-to-medium`）。

---

## 自我檢查紀錄

- **Spec 覆蓋**：混合型 tags 慣例（Task 4 文章示範）、繁中（Task 2/3）、免費子網域（Task 7）、搜尋（主題內建，Task 7 煙霧測試驗證）、留言（Task 6）、分析（Task 8）、電子報與 Medium 聯播明確列為第二期不在本計畫 — 全覆蓋。
- **外部模板的不確定性處理**：凡是依賴 AstroPaper 內部檔案結構的步驟（i18n 檔名、about 檔名、PostLayout 插入點），都先「讀檔再改」，並提供完整目標內容，非佔位符。
- **使用者檢查點**：Task 6 Step 2（giscus ID）、Task 7 Step 1（Cloudflare 網址）— 皆為外部服務的必要人工步驟。
