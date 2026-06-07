# Phase 3G：生產部署指南

| 項目 | 內容 |
|------|------|
| **階段** | Phase 3G |
| **狀態** | ✅ 已驗收 |
| **協調者** | Cursor |
| **前置** | 無（純文件；可與 3A–3F 並行） |
| **前置閱讀** | `.env.example`、`composer.json`、`package.json`、`docs/02-project-structure.md` |

---

## 背景

專案尚無正式 **deployment guide**。Phase 3 路線圖要求涵蓋：env vars、queue、mail、SQLite → production DB。

本任務**只寫文件**，不改 application code（除非發現 `.env.example` 缺關鍵變數且需補一行）。

---

## 目標

新增 `docs/08-deployment.md`（英文，與 `docs/` 風格一致），讓維運人員可部署 SlimBPM 至 staging/production。

---

## 範圍內

### 文件章節（建議）

1. **Prerequisites** — PHP 8.4、Node、Composer、DB（MySQL/PostgreSQL/SQLite dev vs prod）
2. **Environment variables** — 對照 `.env.example` 逐項說明（APP_KEY、DB_*、MAIL_*、QUEUE_CONNECTION、SESSION、CACHE）
3. **Build steps**
   ```bash
   composer install --no-dev --optimize-autoloader
   php artisan migrate --force
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   npm ci && npm run build
   ```
4. **Queue worker** — `php artisan queue:work` 或 supervisor 範例 config snippet
5. **Scheduler** — cron `* * * * * php artisan schedule:run`
6. **Mail** — 通知功能依賴；log driver vs SMTP
7. **SQLite → MySQL/PostgreSQL** — migrate 注意事項、備份
8. **Web server** — Nginx/Apache 指向 `public/` 要點（簡短）
9. **Post-deploy verification** — `php artisan test`（staging）、health checklist
10. **Known limitations** — 約 60% 完成度、非全功能 production ready 聲明

### Task 2：交叉引用

- [ ] 更新 `docs/README.md` 目錄加入 08-deployment
- [ ] 更新 `docs/05-documentation-inventory.md` 若存在該檔案列表

### Task 3：驗證

- [ ] 文件內所有 artisan 指令與專案 Laravel 13 一致
- [ ] 不宣稱專案已 production-ready

---

## 範圍外

| 項目 | 說明 |
|------|------|
| Docker / Sail 生產配置 | 可簡述 dev 用 Sail，不寫完整 Dockerfile |
| CI/CD pipeline | Phase 3 後續 |
| Pest Browser 安裝 | 見 3H |

---

## Exit Criteria

- [ ] `docs/08-deployment.md` 存在且 ≥ 8 個章節
- [ ] `docs/README.md` 已連結
- [ ] `progress.md` 列出新增/更新的 doc 路徑

---

## 回報方式

完成後填寫 [`progress.md`](./progress.md)，交協調者 review。
