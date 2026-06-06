# Phase 3D：Notifications 標已讀驗證

| 項目 | 內容 |
|------|------|
| **階段** | Phase 3D |
| **狀態** | ✅ 已驗收 |
| **協調者** | Cursor |
| **前置** | Phase 2C 已驗收 |
| **前置閱讀** | `resources/js/components/notification-bell.tsx`、`resources/js/pages/notifications/Index.tsx` |

---

## 背景

Phase 2C 已加 `NotificationsPageTest.php`（頁面 props、篩選、unreadCount）。

仍待驗證（見 `docs/04-known-issues-and-backlog.md`）：

1. **通知中心** — `router.post` 打 API 路由是否正確更新 DB 並 reload props。
2. **NotificationBell** — dropdown 內 mark-read / mark-all-read 與 unread badge 同步。
3. **分頁標籤** — `notifications/Index.tsx` 仍用 `dangerouslySetInnerHTML` 渲染 Laravel pagination labels（可改 `formatPaginationLabel()`）。

`notification-bell.tsx` 已用 `fetch` + `credentials: 'same-origin'`；`notifications/Index.tsx` 用 Inertia `router.post` 打 `/api/v1/notifications/...` — 需確認 Laravel 路由與 middleware 允許此用法。

---

## 目標

1. 確認 mark-read / mark-all-read 端到端可用（Feature test 層級）。
2. 修正若發現的 frontend bug（例如 419、404、reload 未更新 unreadCount）。
3. 分頁標籤改用 `@/lib/pagination` 的 `formatPaginationLabel()`（與 Users 一致）。

---

## 範圍內

### Task 1：後端 / 路由驗證

- [ ] 確認 `routes/api.php` 或 web 中 mark-read 路由存在且需 auth。
- [ ] 閱讀 `NotificationController`（或等價）mark 方法。

### Task 2：Feature 測試

**檔案：** `tests/Feature/NotificationsPageTest.php` 或新增 `NotificationMarkReadTest.php`

- [ ] POST mark-single：pending → sent，unread count 減 1
- [ ] POST mark-all-as-read：全部 pending → sent
- [ ] 未授權 401/403

### Task 3：前端修正（若測試或手動發現問題）

**檔案：** `notifications/Index.tsx`、`notification-bell.tsx`

- [ ] Index：必要時改為 `fetch` + CSRF（與 bell 一致）或確認 Inertia post 可行
- [ ] 錯誤時使用者可見 feedback（非 silent fail）
- [ ] 分頁：`formatPaginationLabel(link.label)` 取代 `dangerouslySetInnerHTML`

### Task 4：驗證

- [ ] `npm run types`、`npm run build`
- [ ] `php artisan test tests/Feature/NotificationsPageTest.php`（及新檔）全過

---

## 範圍外

| 項目 | 階段 |
|------|------|
| 新通知渠道（LINE/Telegram 等） | Phase 4 |
| Pest Browser 點擊 bell | Phase 3G |

---

## Exit Criteria

- [ ] mark-read / mark-all 有 Feature test 覆蓋
- [ ] 分頁無 `dangerouslySetInnerHTML`（notifications Index）
- [ ] `progress.md` 含手動驗證 bell dropdown 結果

---

## 回報方式

完成後填寫 [`progress.md`](./progress.md)，交協調者 review。
