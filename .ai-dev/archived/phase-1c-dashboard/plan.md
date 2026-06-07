# Phase 1C：儀表板真實操作與路由修復

| 項目 | 內容 |
|------|------|
| **階段** | Phase 1C |
| **狀態** | 可派工 |
| **協調者** | Cursor |
| **前置** | Phase 1B 已驗收（2026-06-06） |
| **前置閱讀** | `docs/03-module-status.md`（Dashboard 章節）、Phase 1B 的 Wayfinder 用法 |

---

## 背景

Dashboard 後端 `DashboardController` 已提供真實 stats / chart / invitations / workflow 資料，但前端：

1. **`useDashboardActions.ts`** — 全部 handler 只有 `console.log`。
2. **`dashboard.tsx`** — spread `{...actions}` 傳 `handleSendInvitation`，子元件卻要 `onSendInvitation`；`UserDashboard` 還缺 `organizationSlug`。
3. **`QuickActions.tsx` / `WorkflowMenu.tsx`** — 含不存在路由與 TS union 錯誤（`onClick` vs `href`）。

目前 dashboard 相關 TS 錯誤約 **10+**（全專案 131）。

---

## 協調者決策

### 壞連結替換表

| 原 href | 處置 |
|---------|------|
| `/workflows/instances` | → `/workflows` |
| `/workflows/reports` | → `/reports/workflow-performance` |
| `/organization/permissions` | **移除**（Phase 4） |
| `/organization/backup` | **移除** |
| `/organization/export` | **移除** |

保留且已正確：`/forms/create`、`/workflows/designer`、`/reports`、`/organization/settings` 等。

### 邀請 API

使用既有 session-auth API（非 Sanctum token）：

| 操作 | Method | Path |
|------|--------|------|
| 發送 | POST | `/api/v1/invitations` |
| 重送 | POST | `/api/v1/invitations/{id}/resend` |
| 取消 | DELETE | `/api/v1/invitations/{id}` |

Payload 參考 `InvitationStoreRequest`：`emails`（string[]）、`role`、`message?`。

成功後建議：

```tsx
router.reload({ only: ['invitations', 'stats'] });
```

或使用 Inertia `router.post` / `router.delete` 至上述 path（需 `Accept: application/json` 或依 API 回應處理）。

快捷「邀請成員」→ `router.visit('/invitations')` 或展開現有 `MemberInvitation` 表單。

### 工作流程導航

```tsx
import workflowsRoutes from '@/routes/workflows';

// 啟動模板
router.get(workflowsRoutes.start.url());

// 查看實例
router.get(workflowsRoutes.show.url({ workflowInstance: Number(id) }));
```

批准/拒絕：Dashboard **不實作 inline API**；改導向 workflow show 頁讓使用者操作（避免半套 API 整合）。

---

## 目標

1. 移除 dashboard 模組所有 `console.log` 假 handler。
2. 修正 prop 命名對接（`handle*` → `on*`，補 `organizationSlug`）。
3. 修復 QuickActions union type 與 WorkflowMenu 壞連結。
4. dashboard 相關 TS errors = 0。

---

## 範圍內

### Task 1：重寫 `useDashboardActions.ts`

**檔案：** `resources/js/hooks/useDashboardActions.ts`

- [ ] 改回傳 **`on*`** 命名（與子元件 interface 一致），或只在 `dashboard.tsx` 做 mapping（二擇一，推薦 hook 直接回傳 `onSendInvitation` 等）。
- [ ] 邀請：實作 POST/DELETE/POST resend 至 `/api/v1/invitations*`，錯誤時 `console.error` 可保留，但不可只有 log 而不發 request。
- [ ] 工作流程：`onViewWorkflow` → `workflowsRoutes.show.url(...)`；`onStartWorkflow` → `workflowsRoutes.start.url()`。
- [ ] `onInviteMembers` / `onSendBulkInvites` → 導向 `/invitations` 或 toggle MemberInvitation UI（若子元件已有表單，可 scroll/focus 即可）。
- [ ] `onApproveWorkflow` / `onRejectWorkflow` → 導向 instance show 頁（同上 show url）。

### Task 2：修正 `dashboard.tsx`

**檔案：** `resources/js/pages/dashboard.tsx`

- [ ] 傳入 `organizationSlug: organization.slug` 給 `UserDashboard`（目前缺此 prop）。
- [ ] 確認 spread 的 action props 名稱與 `UserDashboardProps` / `ManagerDashboardProps` 一致。
- [ ] `maxUsers`：若子元件需要則保留；`UserDashboard` interface 若無 `maxUsers` 則不要傳（目前 TS 報錯來源之一）。

**參考 mapping：**

```tsx
const {
  onSendInvitation,
  onResendInvitation,
  // ...
} = useDashboardActions();

<UserDashboard
  {...safeProps}
  organizationSlug={organization.slug}
  onStartWorkflow={onStartWorkflow}
  // ...
/>
```

### Task 3：`QuickActions.tsx` + `WorkflowMenu.tsx`

**QuickActions：**

- [ ] 依上表改 href 或移除 systemActions 中三項未實作連結。
- [ ] 修 TS2339：將 action 型別拆成 `{ href: string; ... } | { onClick: () => void; ... }` discriminated union，render 時用 `'href' in action` 窄化。

**WorkflowMenu：**

- [ ] `/workflows/instances` → `/workflows`
- [ ] `/workflows/reports` → `/reports/workflow-performance`

### Task 4：測試

- [ ] 新增 `tests/Feature/DashboardPageTest.php`：
  - admin/manager 可 GET `/dashboard/{slug}` → 200 + Inertia `dashboard`
  - props 含 `stats`、`organization`、`user`
- [ ] `php artisan test` — 217+ 全過
- [ ] `npm run types` — 以下路徑 0 error：
  - `resources/js/pages/dashboard.tsx`
  - `resources/js/hooks/useDashboardActions.ts`
  - `resources/js/components/dashboard/**`
- [ ] `npm run build` 通過
- [ ] PHP 有改：`php vendor/bin/pint --dirty`

---

## 範圍外

| 項目 | 階段 |
|------|------|
| Organization 設定持久化 | Phase 1D |
| 新增 permissions/backup/export 頁 | Phase 4 |
| Dashboard UI 視覺重設計 | 不在 scope |
| Inline 審批 API 整合 | 不在 scope（導向 show 頁即可） |

---

## Exit Criteria

- [ ] 無 `console.log` 假 handler 於 `useDashboardActions.ts`（error log 除外）
- [ ] 所有 dashboard 可點項：真導航 / 真 API / 已移除
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
