# SlimBPM 開發 Handoff

> 中文交接文件，供專案負責人掌握狀況。  
> **技術規格與模組狀態以 `docs/` 為準（英文）；本文件只記錄協調決策與短期交接。**

---

## 最後更新：2026-06-06（Phase 2C 驗收通過）

---

## 協調者工作流

本專案改由**協調者 AI**（本 session）逐步派工：

1. 協調者撰寫各階段 **`plan.md`** → 放在 `.ai-dev/tasks/phase-*/`
2. 你派給**執行 AI** 依 plan 開發
3. 執行 AI 完成後填 **`progress.md`** 交回
4. 協調者 **review 驗收** → 更新本文件與 `docs/` → 撰寫下一階段 plan

詳見 [`.ai-dev/README.md`](./README.md) 與 [`.ai-dev/tasks/INDEX.md`](./tasks/INDEX.md)。

### 目前可派工

| 階段 | plan | 說明 |
|------|------|------|
| ~~Phase 1A~~ | [plan](./tasks/phase-1a-typescript-baseline/plan.md) | ✅ 已驗收（176→164 TS） |
| ~~Phase 1B~~ | [plan](./tasks/phase-1b-forms/plan.md) | ✅ 已驗收 |
| ~~Phase 1C~~ | [plan](./tasks/phase-1c-dashboard/plan.md) | ✅ 已驗收（131→128 TS） |
| ~~Phase 1D~~ | [plan](./tasks/phase-1d-organization/plan.md) | ✅ 已驗收（128→38 TS） |
| ~~Phase 2A~~ | [plan.md](./tasks/phase-2a-users/plan.md) | ✅ 已驗收（Users TS 30→0） |
| ~~Phase 2B~~ | [plan.md](./tasks/phase-2b-departments/plan.md) | ✅ 已驗收（Departments TS 4→0；全專案 9→5） |
| ~~Phase 2C~~ | [plan.md](./tasks/phase-2c-invitations-notifications/plan.md) | ✅ 已驗收（TS 5→4；234 tests） |
| **Phase 2D** | [plan.md](./tasks/phase-2d-workflows-reports/plan.md) | Workflows Monitor + Reports 驗證 |

**Phase 1（1A–1D）已全部完成。** Phase 2 模組硬化進行中。

### 派工指令範本

```text
請依 .ai-dev/tasks/phase-2d-workflows-reports/plan.md 執行。
完成後填寫同目錄 progress.md，交回協調者 review。
```

---

## 協調者備註（文件整理輪）

Codex 上一手把 `.ai-dev/` 與根目錄 `README.md` 寫成接近完成，與程式實際狀態嚴重不符。本輪已完成：

1. **驗證並補強 `docs/`** — 對照程式與測試，`209 tests / 1018 assertions` 全數通過；`npm run types` 仍失敗；架構筆記併入 `docs/02-project-structure.md`。
2. **新增 `docs/07-roadmap.md`** — 後續開發計畫（Phase 0–4），取代已刪除的 `.ai-dev/development/*`。
3. **精簡 `.ai-dev/`** — 只保留本 `handoff.md`；其餘過期文件已刪除（內容已遷移或可在 git history 查閱）。
4. **重寫根目錄 `README.md`** — 不再宣稱 90% 完成；標明專案仍在開發中。

---

## 目前真實狀態（一句話）

**後端雛形與測試覆蓋率不錯，但前端多處仍是 demo、壞連結或未接 API；整體約 60%，不可當生產就緒。**

### 技術棧（2026-06-06 升級後）

| 項目 | 版本 |
|------|------|
| Laravel | 13.14.0 |
| Inertia Laravel | 3.1.0 |
| `@inertiajs/react` | 3.3.1 |
| PHP | 8.4.12 |
| React | 19 |
| Pest | 4.7.2 |

升級驗證：`composer validate --strict`、`npm run build`、`npm run build:ssr`、全套 PHP 測試均通過。

---

## 模組速覽

| 模組 | 判定 | 摘要 |
|------|------|------|
| 身份驗證 / 個人設定 | 🟡 | 後端與頁面有，Wayfinder `.form()` 型別錯誤 |
| 儀表板 | 🟡 | Phase 1C 完成：真 API/導航、無假 handler |
| 組織管理 | 🟡 | Phase 1D 完成：scoping、持久化、真 stats |
| 表單 | 🟡 | Phase 1B 完成：Wayfinder 整合、Edit 頁、8 tests |
| 工作流程 | 🟡 | 執行/監控/設計器較完整 |
| 報表 `/reports/*` | 🟡 | 後端與 org scoping 測試較完整；前端匯出需手動驗證 |
| 用戶 / 部門 | 🟡 | Users（2A）、Departments Create/Edit（2B）已修；Index/Show Layout 待統一 |
| 邀請 / 通知 | 🟡 | Phase 2C 完成：Invitations Wayfinder + 頁面測試 |

詳細表格見 [`docs/03-module-status.md`](../docs/03-module-status.md)。

---

## 已知高優先問題

1. **`npm run types` 仍失敗（4 errors）** — app-header、DynamicForm、enhanced-select（Phase 2E）。
2. ~~**invitations 分頁型別**~~ — Phase 2C 已驗收。
2. ~~**Users Create/Edit 白屏**~~ — Phase 2A 已驗收。
3. ~~**Departments JSX 型別**~~ — Phase 2B 已驗收。
4. ~~**Dashboard 假操作**~~ — Phase 1C 已驗收。
5. ~~**表單前端路由缺口**~~ — Phase 1B 已驗收。
6. ~~**組織設定 demo 化**~~ — Phase 1D 已驗收。

完整清單見 [`docs/04-known-issues-and-backlog.md`](../docs/04-known-issues-and-backlog.md)。

---

## 下一步開發計畫

**正式路線圖：[`docs/07-roadmap.md`](../docs/07-roadmap.md)**

### 現在該做什麼（Phase 1）

| 順序 | 任務 | 說明 |
|------|------|------|
| 1 | Phase 1A | 修 TypeScript + Wayfinder `forms.*` / `workflows.*` 路由衝突 |
| 2 | Phase 1B | 表單模組：補 Edit 或移除路由、決定 `/form-builder` 去留 |
| 3 | Phase 1C | 儀表板：假 handler 改真導航/API、移除壞連結 |
| 4 | Phase 1D | 組織：改用 `current_organization`、設定持久化 |

Phase 2 起才是 Users、Departments、Notifications 等模組硬化；Phase 4 新功能**暫緩**，等 Phase 1–3 達標。

---

## 文件怎麼讀

| 用途 | 路徑 |
|------|------|
| AI / 開發者入口 | [`docs/README.md`](../docs/README.md) |
| 驗證過的事實 | [`docs/01-current-state.md`](../docs/01-current-state.md) |
| 架構與 org scoping | [`docs/02-project-structure.md`](../docs/02-project-structure.md) |
| 開發流程 | [`docs/06-development-workflow.md`](../docs/06-development-workflow.md) |
| 路線圖 | [`docs/07-roadmap.md`](../docs/07-roadmap.md) |
| 協調者工作流 | [`.ai-dev/README.md`](./README.md) |
| 任務總覽 | [`.ai-dev/tasks/INDEX.md`](./tasks/INDEX.md) |
| 本交接（中文） | `.ai-dev/handoff.md` |

---

## 重要檔案索引

| 用途 | 路徑 |
|------|------|
| Dashboard 假操作 | `resources/js/hooks/useDashboardActions.ts` |
| Dashboard 壞連結 | `resources/js/components/dashboard/QuickActions.tsx` |
| localStorage 表單 demo | `resources/js/pages/FormBuilder.tsx` |
| 組織 Controller 問題 | `app/Http/Controllers/OrganizationController.php` |
| 不完整 route helper | `resources/js/lib/route.ts` |
| E2E Feature 測試 | `tests/Feature/EndToEndWorkflowFeatureTest.php` |
| 報表 org scoping 測試 | `tests/Feature/ReportsPagesTest.php` |

---

## 最近一次驗證（2026-06-06）

```bash
php artisan test                    # 209 passed / 1018 assertions
npm run build                       # 通過
npm run types                       # 失敗（前端型別債）
php vendor/bin/pint --dirty         # 通過
```

---

## 整體進度

- **核心業務**：約 55–65%（後端多、前端整合缺口大）
- **報表 `/reports/*`**：約 70%
- **整體**：約 **60%**，仍在積極開發中

---

*Phase 2C 已驗收。下一階段：Phase 2D → `.ai-dev/tasks/phase-2d-workflows-reports/plan.md`*

> **注意：** Phase 2C 程式尚未 commit；派工前請 commit/push。
