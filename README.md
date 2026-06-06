# SlimBPM (快簽)

專為中小團隊設計的輕量級 BPM / 工作流程管理系統。**專案仍在積極開發中，尚未達到可上線使用的程度。**

## 技術棧

- Laravel 13 · PHP 8.4
- React 19 · TypeScript · Inertia.js 3 · Tailwind CSS 4
- Pest 4 測試框架

## 目前狀態（2026-06-06）

| 面向 | 說明 |
|------|------|
| 後端 | 已有大量 Controller、API 與 Model；**209 個測試全部通過** |
| 前端 | 部分頁面仍為 demo、路由未接好或缺頁；**`npm run types` 尚未通過** |
| 整體 | 約 **60%** 完成度 — 請勿參考舊文件宣稱的 90–100% |

近期工作：已升級至 Laravel 13 與 Inertia 3（2026 年 6 月）。

## 開發文件

給 AI / 開發者查閱的正式文件在 [`docs/`](docs/README.md)（英文）：

- [目前開發狀態](docs/01-current-state.md)
- [各模組現況](docs/03-module-status.md)
- [已知問題與待辦](docs/04-known-issues-and-backlog.md)
- [開發路線圖](docs/07-roadmap.md)

給專案負責人的中文交接： [`.ai-dev/handoff.md`](.ai-dev/handoff.md)

## 快速開始

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
composer run dev   # 或分別執行 php artisan serve 與 npm run dev
```

瀏覽 `http://localhost:8000`。

## 測試

```bash
php artisan test
npm run types   # 目前仍失敗，詳見 docs/04-known-issues-and-backlog.md
npm run build
```

## 授權

MIT — 見 [LICENSE](LICENSE)。
