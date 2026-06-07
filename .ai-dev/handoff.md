# SlimBPM 開發 Handoff

> 中文交接文件，供專案負責人掌握狀況。  
> **技術規格與模組狀態以 `docs/` 為準（英文）；本文件只記錄協調決策與短期交接。**

---

## 最後更新：2026-06-07

---

## 一句話現況

**Phase 0–3 已全部驗收；核心 BPM 閉環可跑，但 8 個模組仍為 Yellow，整體約 60%，尚未達 MVP 上線標準。**

---

## 已具備的核心能力

- E2E 工作流：建表單 → 啟流程 → 審批（`EndToEndWorkflowFeatureTest`）
- **258 tests** 全過（253 Feature/Unit + 5 Browser）· TS 0 errors
- 部署指南：[`docs/08-deployment.md`](../docs/08-deployment.md)
- Browser smoke：[`tests/Browser/SmokeTest.php`](../tests/Browser/SmokeTest.php)

技術棧與驗證細節見 [`docs/01-current-state.md`](../docs/01-current-state.md)。

---

## MVP 前必補缺口

| 優先 | 項目 | 說明 |
|------|------|------|
| P0 | Department org scoping | `DepartmentController` 尚未依 organization 過濾 |
| P0 | 模組 Yellow → Green | 依 Quality Gate 逐模組驗收（見 Phase 3.5B） |
| P1 | Demo 殘留 | `/form-builder` localStorage demo；Forms Submit 草稿僅 `console.log` |
| P1 | Flaky test | `UserManagementUITest` 偶發 `can search users` 失敗 |
| P1 | Staging 試跑 | 依部署指南建 staging，手動驗收核心流程 |

完整待辦見 [`docs/04-known-issues-and-backlog.md`](../docs/04-known-issues-and-backlog.md)。

---

## 下一步：Phase 3.5 MVP 收斂

**現行任務規格：** [`.ai-dev/tasks/phase-3.5-mvp-convergence/plan.md`](./tasks/phase-3.5-mvp-convergence/plan.md)  
**路線圖：** [`docs/07-roadmap.md`](../docs/07-roadmap.md)

| 子項 | 內容 |
|------|------|
| 3.5A | Department org scoping + Feature test |
| 3.5B | 核心模組 Yellow → Green 驗收 |
| 3.5C | FormBuilder / Submit 草稿 demo 清理 |
| 3.5D | 穩定 flaky UserManagementUITest |
| 3.5E | Staging 部署試跑 |

Phase 4（排程報表、PWA、權限頁、設計器節點）**延後**，待 Phase 3.5 MVP exit criteria 達成後再開。

### 派工指令範本

```text
請依 .ai-dev/tasks/phase-3.5-mvp-convergence/plan.md 執行。
開工前先讀 docs/01-current-state.md 與 docs/03-module-status.md。
完成後填寫同目錄 progress.md，交回協調者 review。
```

---

## 模組速覽

| 模組 | 判定 | 摘要 |
|------|------|------|
| 身份驗證 / 個人設定 | 🟡 | Fortify + 2FA 頁面與測試齊全 |
| 儀表板 | 🟡 | 主要操作已接真 API；審批導向 workflow show |
| 組織管理 | 🟡 | Wayfinder + settings/preferences 持久化 |
| 表單 | 🟡 | CRUD 完整；FormBuilder 仍為 demo |
| 工作流程 | 🟡 | 引擎 + 設計器 + 監控；缺獨立 template edit 頁 |
| 報表 | 🟡 | 日期 filter + export 已接 |
| 用戶 / 部門 | 🟡 | Layout 統一；Department 缺 org scoping |
| 邀請 / 通知 | 🟡 | 分頁 + mark-read 測試覆蓋 |

詳細表格見 [`docs/03-module-status.md`](../docs/03-module-status.md)。

---

## 協調者工作流

1. 協調者撰寫 `plan.md` → [`.ai-dev/tasks/`](./tasks/)
2. 派給執行 AI 依 plan 開發
3. 執行者填 `progress.md` 交回
4. 協調者 review → 更新本文件與 `docs/`

詳見 [`.ai-dev/README.md`](./README.md) 與 [`.ai-dev/tasks/INDEX.md`](./tasks/INDEX.md)。  
Phase 1–3 已完成任務封存於 [`.ai-dev/archived/`](./archived/)。

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
| 已完成任務封存 | [`.ai-dev/archived/`](./archived/) |

---

## 驗證指令

```bash
php artisan test                    # 258 passed (253 Feature/Unit + 5 Browser)
npm run types                       # 0 errors
npm run build                       # 前端建置
php artisan test tests/Browser      # 需先 build
```

---

*Phase 3.5 MVP 收斂進行中。Phase 1–3 詳情見 `.ai-dev/archived/`。*
