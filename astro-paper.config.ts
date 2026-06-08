import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://blueshing.github.io",
    title: "深藍咖啡",
    description: "技術與生活的混合筆記 — FinOps、雲端、AI 與日常",
    author: "Kim Huang",
    ogImage: "default-og.jpg",
    lang: "zh-TW",
    timezone: "Asia/Taipei",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
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
