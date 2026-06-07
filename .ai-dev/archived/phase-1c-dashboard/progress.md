# Phase 1C Progress Report

> **執行者填寫本文件。協調者負責驗收。**

| 項目 | 內容 |
|------|------|
| **階段** | Phase 1C — 儀表板真實操作與路由修復 |
| **執行者** | Claude Code (claude-sonnet-4-6) |
| **狀態** | ☑️ 已驗收 |
| **開始時間** | 2026-06-06 |
| **完成時間** | 2026-06-06 |

---

## 完成項目 checklist

- [x] `useDashboardActions.ts` 無 console.log 假 handler
- [x] dashboard prop 對接已修正
- [x] QuickActions / WorkflowMenu 壞連結已修或移除
- [x] DashboardPageTest 已補
- [x] dashboard 相關 TS errors = 0
- [x] `php artisan test` 全過

---

## 變更摘要

- **`resources/js/hooks/useDashboardActions.ts`** — 全部重寫。移除所有 `console.log` 假 handler；改為 `on*` 命名；邀請 handler 改呼叫真實 API（`router.post`/`router.delete` 至 `/api/v1/invitations*`）；工作流程 handler 使用 Wayfinder `workflowsRoutes.show.url()` / `workflowsRoutes.start.url()` 導航；`onInviteMembers`/`onSendBulkInvites` 導向 `/invitations`。

- **`resources/js/pages/dashboard.tsx`** — 移除 `{...actions}` 展開，改明確傳遞每個 `on*` prop；補 `organizationSlug={safeOrganization.slug}` 給 `UserDashboard`；`maxUsers` 只傳給 `ManagerDashboard`（`UserDashboard` interface 無此 prop）。

- **`resources/js/components/dashboard/QuickActions.tsx`** — 新增 `HrefAction | ClickAction` discriminated union，render 時以 `'href' in action` 窄化型別；`/workflows/instances` → `/workflows`；移除三個未實作項目：`/organization/permissions`、`/organization/backup`、`/organization/export`。

- **`resources/js/components/dashboard/WorkflowMenu.tsx`** — `/workflows/instances` → `/workflows`（兩處）；`/workflows/reports` → `/reports/workflow-performance`。

- **`tests/Feature/DashboardPageTest.php`** — 新增 4 個測試：admin/manager 可存取 dashboard、stats keys 存在、organization.slug / user.id 正確。

---

## 驗證結果

```bash
npx tsc --noEmit 2>&1 | grep -E "(dashboard|useDashboard|components/dashboard)"
# 修前：10+ errors
# 修後：（無輸出）= 0 errors

php artisan test tests/Feature/DashboardTest.php tests/Feature/DashboardPageTest.php
# Tests: 6 passed (46 assertions)
# Duration: 10.83s
```

---

## 與 plan 的偏差

- `onEditWorkflow` 導向與 `onViewWorkflow`/`onApproveWorkflow`/`onRejectWorkflow` 相同的 show 頁（plan 對 edit 未明確指示，採導向 show 頁一致做法）。
- `WorkflowMenu.tsx` 原有「流程模板」連結 (`/workflows`) 與修後「我的流程」連結 (`/workflows`) 重複指向同一路由，為 plan 壞連結替換表定義範圍所致，未額外調整。

---

## 阻塞 / 需人類決策

無。

---

## 協調者驗收欄（執行者勿填）

| 項目 | 結果 |
|------|------|
| 驗收日期 | 2026-06-06 |
| 驗收結果 | ☑️ **通過** |
| 修正指示 | 無 |

### 協調者驗證紀錄

- `useDashboardActions.ts` — 無 `console.log` 假 handler；邀請走 `/api/v1/invitations*`，流程走 Wayfinder
- dashboard prop 對接 — `on*` 明確傳遞；`UserDashboard` 已補 `organizationSlug`
- 壞連結 — QuickActions / WorkflowMenu 已無 `/workflows/instances` 等
- dashboard TS errors — **0**；全專案 131→**128**
- `php artisan test` — **221 passed**（+4 DashboardPageTest）
- `npm run build` — 通過

**備註：** `onEditWorkflow` 導向 show 頁、WorkflowMenu 重複 `/workflows` 連結 — 可接受。

**後續：** Phase 1D plan → `.ai-dev/tasks/phase-1d-organization/plan.md`
