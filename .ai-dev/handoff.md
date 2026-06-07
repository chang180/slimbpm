# SlimBPM 開發 Handoff

> 中文交接文件，供專案負責人掌握狀況。  
> **技術規格與模組狀態以 `docs/` 為準（英文）；本文件只記錄協調決策與短期交接。**

---

## 最後更新：2026-06-07（Phase 3.5A–D 驗收）

---

## 一句話現況

**Phase 3.5A–D 已完成；10 個核心模組均已 Green，262 tests 全過。僅剩 3.5E staging 手動試跑（需你建立 staging 環境）。**

---

## 已具備的核心能力

- E2E 工作流：建表單 → 啟流程 → 審批（`EndToEndWorkflowFeatureTest`）
- **262 tests** 全過（257 Feature/Unit + 5 Browser）· TS 0 errors
- 多租戶 org scoping：Department、User、Form index 等已補齊
- 部署指南：[`docs/08-deployment.md`](../docs/08-deployment.md)
- Browser smoke：[`tests/Browser/SmokeTest.php`](../tests/Browser/SmokeTest.php)

技術棧與驗證細節見 [`docs/01-current-state.md`](../docs/01-current-state.md)。

---

## 僅剩待辦

| 優先 | 項目 | 說明 |
|------|------|------|
| P1 | **3.5E Staging 試跑** | 依 [`docs/08-deployment.md`](../docs/08-deployment.md) 建 staging，填寫 [`progress.md`](./tasks/phase-3.5-mvp-convergence/progress.md) 煙霧測試 checklist |

已接受的 MVP 例外（見 `03-module-status.md`）：

- `/form-builder` 仍為 localStorage demo，但有警告 banner，無誤導入口
- 工作流模板無獨立 edit 頁（走 designer）
- Dashboard 審批導向 workflow show（by design）

---

## Phase 3.5 進度

**規格：** [`.ai-dev/tasks/phase-3.5-mvp-convergence/plan.md`](./tasks/phase-3.5-mvp-convergence/plan.md)  
**執行紀錄：** [`.ai-dev/tasks/phase-3.5-mvp-convergence/progress.md`](./tasks/phase-3.5-mvp-convergence/progress.md)

| 子項 | 狀態 |
|------|------|
| 3.5A Department org scoping | ✅ |
| 3.5B 模組 Yellow → Green | ✅ |
| 3.5C Demo 殘留清理 | ✅ |
| 3.5D Flaky test 修復 | ✅ |
| 3.5E Staging 試跑 | ⏳ 待 staging 環境 |

**3.5E 完成後** 可進入 Phase 4 產品擴充 → [`docs/07-roadmap.md`](../docs/07-roadmap.md)

---

## 模組速覽

| 模組 | 判定 | 摘要 |
|------|------|------|
| 身份驗證 / 個人設定 | 🟢 | Fortify + 2FA + 測試齊全 |
| 儀表板 | 🟢 | 真 API；審批導向 workflow show |
| 組織管理 | 🟢 | Wayfinder + 持久化 + org scoping |
| 表單 | 🟢 | CRUD 完整；FormBuilder 為標示 demo |
| 工作流程 | 🟢 | 引擎 + 設計器 + 監控 |
| 報表 | 🟢 | 日期 filter + export |
| 用戶 / 部門 | 🟢 | org scoping + 跨 org 404 測試 |
| 邀請 / 通知 | 🟢 | 分頁 + mark-read 測試 |

詳情見 [`docs/03-module-status.md`](../docs/03-module-status.md)。

---

## 協調者工作流

1. 協調者撰寫 `plan.md` → [`.ai-dev/tasks/`](./tasks/)
2. 派給執行 AI 依 plan 開發
3. 執行者填 `progress.md` 交回
4. 協調者 review → 更新本文件與 `docs/`

Phase 1–3 封存於 [`.ai-dev/archived/`](./archived/)。

---

## 文件導覽

| 用途 | 路徑 |
|------|------|
| AI / 開發者入口 | [`docs/README.md`](../docs/README.md) |
| 驗證過的事實 | [`docs/01-current-state.md`](../docs/01-current-state.md) |
| 模組現況 | [`docs/03-module-status.md`](../docs/03-module-status.md) |
| 待辦與 blocker | [`docs/04-known-issues-and-backlog.md`](../docs/04-known-issues-and-backlog.md) |
| 路線圖 | [`docs/07-roadmap.md`](../docs/07-roadmap.md) |
| 部署 | [`docs/08-deployment.md`](../docs/08-deployment.md) |

---

## 驗證指令

```bash
php artisan test                    # 262 passed (257 Feature/Unit + 5 Browser)
npm run types                       # 0 errors
npm run build                       # 前端建置
php artisan test tests/Browser      # 需先 build
```

---

*Phase 3.5E staging 試跑完成後，Phase 3.5 即結案，可規劃 Phase 4。*
