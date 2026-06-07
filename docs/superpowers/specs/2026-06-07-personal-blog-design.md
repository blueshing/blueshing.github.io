# 個人部落格設計文件

日期：2026-06-07
狀態：已確認（使用者於 brainstorming 階段核准）

## 目標

建立個人部落格，作為既有「AI 公司」內容產線的出版終端：寫作 → `post-to-blog` 發佈 → `post-to-social` 社群導流。部落格本體須快速就位，讓產線能動起來，而非長期工程專案。

## 需求摘要

| 項目 | 決定 |
|------|------|
| 定位 | 混合型內容（技術＋生活），用 tags 區隔 |
| 語言 | 繁體中文為主（zh-TW） |
| 網域 | 先用免費子網域（`*.pages.dev`），之後可綁自訂網域 |
| 功能 | 留言、瀏覽分析、全站搜尋（第一版）；電子報（第二期） |

## 方案選擇

採用 **方案 A：現成 Astro 主題（AstroPaper）＋客製**。

- 搜尋（Pagefind）、深色模式、SEO、RSS、sitemap 主題內建
- 與出版部 `post-to-blog` skill 預期的 Astro 結構相容
- 落選方案：官方模板從零擴充（工期數倍）、託管平台 Ghost/Hashnode（與既有 git + markdown 產線 skill 不相容）

## 架構

```
~/Dev/blog/                  ← post-to-blog skill 預期的位置
├── src/
│   ├── data/blog/           ← 文章 markdown（content collection）
│   ├── assets/              ← 文章圖片（WebP）
│   └── config.ts            ← 站台設定（站名、作者、社群連結）
└── ...AstroPaper 主題結構（Astro 5、TypeScript、Tailwind）
```

- 版本控制：GitHub **公開** repo（giscus 留言需要公開 repo 開 Discussions）
- 部署：push 到 GitHub → Cloudflare Pages 自動建置上線（`xxx.pages.dev`）

## 內容結構

不另做分類系統，用 AstroPaper 內建 tags 做兩層慣例：

1. 第一個 tag 固定為大分類：`tech`／`life`（之後可加 `reading` 等）
2. 後面接細項 tag：`finops`、`claude`、`gcp`…

首頁照時間混排；分眾閱讀靠 tag 頁。

frontmatter 與 `post-to-blog` skill 的 schema 對齊：`title`、`description`、`pubDate`、`heroImage`、`tags`。slug 用英文 kebab-case（意譯，不用拼音）。

## 中文化

- 介面字串、日期格式改繁體中文（`zh-TW`）
- 字型：系統字型堆疊（`PingFang TC` 優先），不載入 webfont 以保持速度
- `og:locale`、RSS 語言標記同步設定為 `zh-TW`

## 功能接入

| 功能 | 做法 | 時程 |
|------|------|------|
| 搜尋 | AstroPaper 內建（Pagefind） | 隨主題自帶 |
| 留言 | giscus 元件嵌入文章頁（GitHub Discussions） | 第一版 |
| 分析 | Cloudflare Web Analytics（一行 script） | 第一版 |
| 電子報 | 先讓 RSS 上線；訂閱需求出現後再接第三方服務 | 第二期（YAGNI） |

## 錯誤處理與邊界

- 文章 frontmatter 不符 collection schema 時，Astro build 會直接失敗 — 以 build 為守門
- giscus、Analytics 為外部 script，載入失敗不影響文章閱讀（漸進增強）

## 驗證方式

- 本地：`npm run dev` 預覽、`npm run build` 零錯誤
- 上線後端到端驗證：用一篇真實文章跑完整產線（寫作 → `post-to-blog` 發佈 → `post-to-social` 備稿）

## Medium 聯播（第二期）

方向：Blog → Medium 聯播（文章先發 blog，再同步到 Medium）。

- Medium 已於 2025-01-01 停發新 API integration token，全自動 API 發佈不可行
- 採用 Medium 官方「Import a story」工具：貼上 blog 文章網址匯入，**自動設定 canonical 連結**指回 blog（SEO 保護內建）
- 第二期建 `post-to-medium` skill：用瀏覽器自動化（browser MCP）代操匯入流程，使用者做最後確認
- 對 blog 本體影響為零 — 只需文章有公開網址與正確 metadata（AstroPaper 內建）
- 出版部最終產線：寫作 → `post-to-blog` → `post-to-medium` → `post-to-social`

## 第二期（暫不實作）

- 電子報訂閱
- 自訂網域
- 中英雙語（i18n）
- `post-to-medium` skill（見上節）
