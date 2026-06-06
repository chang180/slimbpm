# Phase 2C：Invitations 與 Notifications 前端對齊

| 項目 | 內容 |
|------|------|
| **階段** | Phase 2C |
| **狀態** | 可派工 |
| **協調者** | Cursor |
| **前置** | Phase 2B 已驗收（2026-06-06） |
| **前置閱讀** | `docs/03-module-status.md`（Invitations / Notifications 章節） |

---

## 背景

Phase 2B 後全專案 TS 剩 **5 errors**，其中 **invitations/Index.tsx 1 個**（paginator 型別仍宣告 `meta`，實際使用 `.total`）。

其他已知缺口：

1. **`/invitations` 頁面 API 路徑不一致** — Dashboard 的 `useDashboardActions` 已用 Wayfinder `@/routes/api/invitations`；`invitations/Index.tsx` 仍硬編碼 `/api/v1/invitations`。
2. **分頁型別** — 應改用 `@/lib/pagination.ts` 的 `LengthAwarePaginator`（與 Forms/Users 相同）。
3. **Notifications 頁面測試不足** — API 測試已有（`NotificationSystemTest` 等），但缺少 Inertia 頁面 smoke test；通知鈴 session API 已在 `731ab8e` 修復，需回歸驗證。

後端：`InvitationManagementController`、`Api/InvitationController`、`NotificationController` 已存在。

---

## 目標

1. `invitations/Index.tsx` TS errors = 0。
2. Dashboard 與 `/invitations` 使用**同一組** Wayfinder API 路由。
3. 補 Invitations / Notifications Inertia 頁面 Feature 測試。
4. 全專案 TS 從 5 → **≤4**（invitations 清零；其餘留 Phase 2E）。

---

## 範圍內

### Task 1：修 Invitations Index

**檔案：** `resources/js/pages/invitations/Index.tsx`

**要求：**

- [ ] Props 改為 `invitations: LengthAwarePaginator<InvitationRecord>`（`@/lib/pagination.ts`）。
- [ ] 統計卡、分頁（若有）使用 `invitations.total` 等扁平欄位。
- [ ] 將硬編碼 API 改為 Wayfinder：
  - `import apiInvitations from '@/routes/api/invitations'`
  - `router.post(apiInvitations.store.url(), …)`
  - `router.delete(apiInvitations.destroy.url({ invitation: id }), …)`
  - `router.post(apiInvitations.resend.url({ invitation: id }), …)`
- [ ] 對照 `useDashboardActions.ts` 確認 payload 形狀一致（`emails`, `role`）。
- [ ] 麵包屑 dashboard 連結改用 `useSlug()` + `dashboard(slug).url`（勿硬編碼 `/dashboard`）。

### Task 2：Invitations Inertia 測試

**新增：** `tests/Feature/InvitationsPageTest.php`

- [ ] Admin `GET /invitations` → 200，`Invitations/Index` component，含 `invitations.data` 與 `invitations.total`。
- [ ] 非 admin/manager → 403。
- [ ] 可選：assert paginator 扁平結構（`where('invitations.last_page', …)`）。

### Task 3：Notifications 頁面測試

**新增：** `tests/Feature/NotificationsPageTest.php`

- [ ] 登入使用者 `GET /notifications` → 200，`notifications/Index` component。
- [ ] Props 含 `notifications.data`、`unreadCount`。
- [ ] 現有 `NotificationSystemTest` 仍全過（勿破壞 API 測試）。

### Task 4：驗證

- [ ] `npm run types` — `invitations/Index.tsx` 0 error
- [ ] `php artisan test tests/Feature/InvitationApiTest.php tests/Feature/InvitationsPageTest.php`
- [ ] `php artisan test tests/Feature/NotificationsPageTest.php tests/Feature/NotificationSystemTest.php`
- [ ] `npm run build` 通過

---

## 範圍外

| 項目 | 階段 |
|------|------|
| app-header / DynamicForm / enhanced-select TS | Phase 2E |
| Users/Departments Index Layout 統一 | 後續 polish |
| Pest Browser 手動點擊通知鈴 | Phase 3 |

---

## Exit Criteria

- [ ] invitations 頁 TS = 0
- [ ] Dashboard 與 `/invitations` 共用 Wayfinder API 路徑
- [ ] 新增 Invitations + Notifications 頁面 Feature 測試
- [ ] `php artisan test` 全過
- [ ] `progress.md` 含修前/修後 TS 數與測試數

---

## 建議 Commit 訊息

```
fix: align invitations page with Wayfinder API and paginator types
```

---

## 回報方式

完成後填寫 [`progress.md`](./progress.md)，交協調者 review。
