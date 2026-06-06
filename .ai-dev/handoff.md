# SlimBPM 開發 Handoff

> 中文交接文件，供專案負責人掌握狀況。  
> **技術規格與模組狀態以 `docs/` 為準（英文）；本文件只記錄協調決策與短期交接。**

---

## 最後更新：2026-06-06（**Phase 3 全部驗收完成，含 3H**）

---

## 協調者工作流

本專案改由**協調者 AI**（本 session）逐步派工：

1. 協調者撰寫各階段 **`plan.md`** → 放在 `.ai-dev/tasks/phase-*/`
2. 你派給**執行 AI** 依 plan 開發
3. 執行 AI 完成後填 **`progress.md`** 交回
4. 協調者 **review 驗收** → 更新本文件與 `docs/` → 撰寫下一階段 plan

詳見 [`.ai-dev/README.md`](./README.md) 與 [`.ai-dev/tasks/INDEX.md`](./tasks/INDEX.md)。

### Phase 3 已完成 ✅

3A–3H 全部驗收。詳見 [`.ai-dev/tasks/INDEX.md`](./tasks/INDEX.md)。

| 階段 | 摘要 |
|------|------|
| 3F | 響應式 — DashboardHeader、WorkflowMenu、Forms/Show |
| 3G | [`docs/08-deployment.md`](../docs/08-deployment.md) 部署指南 |
| 3H | Pest Browser smoke — `tests/Browser/SmokeTest.php`（5 tests） |

### 下一階段

| 項目 | 說明 |
|------|------|
| **Phase 4** | 產品擴充 → [`docs/07-roadmap.md`](../docs/07-roadmap.md) |

### 派工指令範本（Phase 4 前可先做）

```text
請依 docs/07-roadmap.md Phase 4 中指定項目執行，或先處理 Department org scoping。
完成後更新 progress / docs，交回協調者 review。
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
| 身份驗證 / 個人設定 | 🟡 | 後端與頁面有；Phase 1A 已修 Wayfinder `.form()` |
| 儀表板 | 🟡 | Phase 1C + **3F** 響應式 polish |
| 組織管理 | 🟡 | Phase 1D + **3A**：Wayfinder 導航/settings PUT 已接線 |
| 表單 | 🟡 | Phase 1B + **3F** Forms/Show 響應式 |
| 工作流程 | 🟡 | Phase 2D Monitor UX；**3E** workflows 分頁 polish |
| 報表 `/reports/*` | 🟡 | **3E** 日期 filter + export 子頁確認 |
| 用戶 / 部門 | 🟡 | **3B** Layout；**3C** DepartmentPagesTest |
| 邀請 / 通知 | 🟡 | **3D** mark-read tests + 分頁 polish |

詳細表格見 [`docs/03-module-status.md`](../docs/03-module-status.md)。

---

## 已知高優先問題

1. ~~**`npm run types` 仍失敗**~~ — Phase 2E 已清零（0 errors）。
2. ~~**Organization 壞連結**~~ — Phase 3A 已驗收（Wayfinder）。
3. ~~**Layout 不統一**~~ — Phase 3B 已驗收（Users/Departments Index·Show → AppLayout）。
4. **Department org scoping** — Controller 尚未依 organization 過濾（Phase 4+ 或獨立任務）。
5. **UserManagementUITest flaky** — 全套偶發 `can search users` 失敗（3F 已記錄）。

完整清單見 [`docs/04-known-issues-and-backlog.md`](../docs/04-known-issues-and-backlog.md)。

---

## 下一步開發計畫

**正式路線圖：[`docs/07-roadmap.md`](../docs/07-roadmap.md)**

### 現在該做什麼

**Phase 3 已完成。** 可進入 Phase 4 或處理已知後續項（Department org scoping、flaky test）。

| 選項 | 說明 |
|------|------|
| Phase 4 | 排程報表、PWA、權限頁等 → [`docs/07-roadmap.md`](../docs/07-roadmap.md) |
| 部署試跑 | 依 [`docs/08-deployment.md`](../docs/08-deployment.md) 建 staging |
| Browser smoke | `php artisan test tests/Browser`（需先 `npm run build`） |

---

## 文件怎麼讀

| 用途 | 路徑 |
|------|------|
| AI / 開發者入口 | [`docs/README.md`](../docs/README.md) |
| 驗證過的事實 | [`docs/01-current-state.md`](../docs/01-current-state.md) |
| 架構與 org scoping | [`docs/02-project-structure.md`](../docs/02-project-structure.md) |
| 開發流程 | [`docs/06-development-workflow.md`](../docs/06-development-workflow.md) |
| 路線圖 | [`docs/07-roadmap.md`](../docs/07-roadmap.md) |
| 部署指南 | [`docs/08-deployment.md`](../docs/08-deployment.md) |
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
php artisan test                    # 258 passed (253 Feature/Unit + 5 Browser)
npm run build                       # 通過
npm run types                       # 0 errors
php artisan test tests/Browser      # 5 passed（需先 build）
```

---

## 整體進度

- **核心業務**：約 55–65%（後端多、前端整合缺口大）
- **報表 `/reports/*`**：約 70%
- **整體**：約 **60%**，仍在積極開發中

---

*Phase 3 全部完成（258 tests，含 Browser smoke）。部署見 `docs/08-deployment.md`；下一階段 Phase 4。*
