# SlimBPM (快簽)

專為中小團隊設計的輕量級 BPM / 工作流程管理系統。**核心 MVP 功能已就緒；staging 試跑完成後可進入 Phase 4 擴充。**

## 技術棧

- Laravel 13 · PHP 8.4
- React 19 · TypeScript · Inertia.js 3 · Tailwind CSS 4
- Pest 4（含 Browser smoke 測試）

## 目前狀態（2026-06-07）

| 面向 | 說明 |
|------|------|
| 後端 | **262 個測試全部通過**（257 Feature/Unit + 5 Browser） |
| 前端 | 10 個核心模組 **Green** · **`npm run types` 0 errors** |
| 品質 | Phase 3.5A–D 已驗收（org scoping、demo 清理、flaky test 修復） |
| 待辦 | Phase 3.5E staging 手動試跑（需建立 staging 環境） |

**下一階段：** 3.5E staging 完成後 → Phase 4 產品擴充 → 見 [`docs/07-roadmap.md`](docs/07-roadmap.md)

## 開發文件

給 AI / 開發者查閱的正式文件在 [`docs/`](docs/README.md)（英文）：

- [目前開發狀態](docs/01-current-state.md)
- [各模組現況](docs/03-module-status.md)
- [已知問題與待辦](docs/04-known-issues-and-backlog.md)
- [開發流程](docs/06-development-workflow.md)
- [開發路線圖](docs/07-roadmap.md)
- [部署指南](docs/08-deployment.md)

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
php artisan test              # 262 passed（含 Browser smoke）
npm run types                 # 0 errors
npm run build                 # 前端建置
```

Browser smoke 測試需先 `npm run build`，再執行：

```bash
php artisan test tests/Browser
```

詳見 [`docs/06-development-workflow.md`](docs/06-development-workflow.md)。

## 授權

MIT — 見 [LICENSE](LICENSE)。
