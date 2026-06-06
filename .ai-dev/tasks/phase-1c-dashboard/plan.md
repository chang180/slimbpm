# Phase 1C：儀表板真實操作與路由修復

| 項目 | 內容 |
|------|------|
| **階段** | Phase 1C |
| **狀態** | 可派工 |
| **協調者** | Cursor |
| **前置** | Phase 1B 已驗收（2026-06-06） |
| **前置閱讀** | `docs/03-module-status.md`（Dashboard 章節） |

---

## 背景

Dashboard 後端 `DashboardController` 已提供真實 stats/chart 資料，但前端：

1. **`useDashboardActions.ts`** — 所有 handler 僅 `console.log`，未導航或呼叫 API。
2. **`dashboard.tsx`** — 把 `handleSendInvitation` 等 spread 給子元件，但 `ManagerDashboard` 期望 `onSendInvitation` 等 prop 名稱 → TypeScript 報錯。
3. **`QuickActions.tsx` / `WorkflowMenu.tsx`** — 連到不存在路由：
   - `/workflows/instances`
   - `/workflows/reports`
   - `/organization/permissions`
   - `/organization/backup`
   - `/organization/export`

---

## 協調者決策

### 不存在路由的處理

| 原連結 | 決策 |
|--------|------|
| `/workflows/instances` | 改為 `/workflows`（現有 WorkflowInstance index） |
| `/workflows/reports` | 改為 `/reports/workflow-performance` |
| `/organization/permissions` | **移除**（Phase 4 才實作） |
| `/organization/backup` | **移除** |
| `/organization/export` | **移除** |

### 邀請操作

Dashboard 邀請 widget 應呼叫既有 API（`api.invitations.*`）或導向 `/invitations` 管理頁。優先：

- 發送/重送/取消 → `router.post/delete` 至 Wayfinder `@/routes/api/invitations` 或等效 API path
- 「邀請成員」快捷 → Link 至 `/invitations`

### 工作流程操作

- 啟動模板 → `router.get('/workflows/start')` 或 `@/routes/workflows` 的 start route
- 查看實例 → `router.get(workflowsRoutes.show.url({ workflowInstance: id }))`
- 批准/拒絕 → 若 dashboard 無 inline UI，改為導向 workflow show 頁（**不要**留 console.log）

---

## 目標

1. 移除 dashboard 相關 `console.log` 假 handler。
2. 修正 `dashboard.tsx` 與 `UserDashboard` / `ManagerDashboard` 的 prop 對接。
3. 修復或移除所有壞連結。
4. Dashboard 相關 TypeScript 錯誤清零。

---

## 範圍內

### Task 1：重寫 `useDashboardActions.ts`

- [ ] 使用 `router` from `@inertiajs/react` 做導航。
- [ ] 邀請 CRUD 呼叫 `/api/v1/invitations`（或 Wayfinder `@/routes/api/invitations`）。
- [ ] 工作流程 handler 改為導向真實頁面。
- [ ] 成功/失敗後 `router.reload({ only: [...] })` 刷新 invitations/stats（若需要）。

### Task 2：修正 `dashboard.tsx` prop mapping

- [ ] 將 `handleSendInvitation` 等映射為 `onSendInvitation` 等，或統一子元件 prop 命名。
- [ ] 確保 `UserDashboard` / `ManagerDashboard` props 與傳入值一致。
- [ ] 移除多餘的 `maxUsers` prop 錯誤（若子元件未宣告則補 interface 或移除傳遞）。

### Task 3：修復 QuickActions / WorkflowMenu

- [ ] 依上表替換或移除壞連結。
- [ ] `QuickActions.tsx` 的 `onClick` union type 錯誤一併修復（TS2339）。
- [ ] 確認 Phase 1B 已改的 `/forms/create` 連結仍正確。

### Task 4：測試

- [ ] `php artisan test` — 217+ 全過。
- [ ] 新增 `tests/Feature/DashboardPageTest.php`（至少：admin 可載入 dashboard Inertia 頁、props 含 stats）。
- [ ] `npm run types` — dashboard 相關檔案 0 error：
  - `resources/js/pages/dashboard.tsx`
  - `resources/js/hooks/useDashboardActions.ts`
  - `resources/js/components/dashboard/*`
- [ ] `npm run build` 通過。

---

## 範圍外

| 項目 | 階段 |
|------|------|
| Organization 設定持久化 | Phase 1D |
| 新增 permissions/backup/export 頁面 | Phase 4 |
| Dashboard 視覺重設計 | 不在 scope |

---

## Exit Criteria

- [ ] Dashboard 上每個可點擊項目要麼導向真實頁面，要麼呼叫真 API，要麼從 UI 移除
- [ ] 無 `console.log` 假 handler 殘留於 `useDashboardActions.ts`
- [ ] dashboard 相關 TS errors = 0
- [ ] `php artisan test` 全過
- [ ] `progress.md` 含修前/修後 dashboard TS error 數

---

## 建議 Commit 訊息

```
fix: wire dashboard actions to real routes and invitation API
```

---

## 回報方式

完成後填寫 [`progress.md`](./progress.md)，交協調者 review。
