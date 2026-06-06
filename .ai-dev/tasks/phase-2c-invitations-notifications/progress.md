# Phase 2C Progress Report

> **執行者填寫本文件。協調者負責驗收。**

| 項目 | 內容 |
|------|------|
| **階段** | Phase 2C — Invitations 與 Notifications 前端對齊 |
| **執行者** | Claude Sonnet 4.6 |
| **狀態** | ✅ 已驗收（2026-06-06） |

---

## 完成項目 checklist

- [x] invitations/Index.tsx TS errors = 0
- [x] Wayfinder API 路徑與 Dashboard 一致
- [x] InvitationsPageTest 新增並通過
- [x] NotificationsPageTest 新增並通過
- [x] `php artisan test` 全過
- [x] `npm run build` 通過

---

## 變更摘要

### Task 1：修 `invitations/Index.tsx`

**檔案：** `resources/js/pages/invitations/Index.tsx`

- **型別** — 移除舊 `{ data, meta: { current_page, last_page, total } }` 介面，改為 `LengthAwarePaginator<InvitationRecord>`（`@/lib/pagination`），與 Laravel 扁平 paginator 結構一致，消除 `invitations.total` TS error。
- **API** — 三個 `router.*('/api/v1/invitations…')` 硬編碼路徑全改為 Wayfinder：
  - `router.post(apiInvitations.store.url(), …)`
  - `router.delete(apiInvitations.destroy.url(id), …)`
  - `router.post(apiInvitations.resend.url(id), {}, …)`
- **麵包屑** — 加入 `useSlug()` hook，dashboard href 從固定 `/dashboard` 改為 `/dashboard/${slug}`（slug 不存在時 fallback `/dashboard-redirect`）。

### Task 2：新增 `tests/Feature/InvitationsPageTest.php`

5 個測試：
- admin 可讀取 → 200 + `invitations/Index` component
- manager 可讀取 → 200
- 一般 user → 403
- 未登入 → 302 redirect to `/login`
- 驗證 props 含扁平 `total`, `current_page`, `last_page`

### Task 3：新增 `tests/Feature/NotificationsPageTest.php`

5 個測試：
- 登入 user（含組織）可讀取 → 200 + `notifications/Index` component
- 未登入 → 302 redirect to `/login`
- 只顯示當前 user 的通知
- `unreadCount` 正確計算
- `status` filter 正常運作

---

## 驗證結果

### TS errors（修前 / 修後）

| 範圍 | 修前 | 修後 |
|------|------|------|
| `invitations/Index.tsx` | **1 error**（`invitations.total` 型別不符） | **0 errors** |
| 全專案 | 5 errors | **4 errors**（其餘屬 Phase 2E 範圍）|

### 測試結果

```
php artisan test tests/Feature/InvitationApiTest.php tests/Feature/InvitationsPageTest.php tests/Feature/NotificationsPageTest.php tests/Feature/NotificationSystemTest.php
Tests: 34 passed (135 assertions)

php artisan test
Tests: 234 passed (1225 assertions)
```

### Build 結果

```
npm run build → ✓ built in ~5s（無錯誤）
```

---

## 協調者驗收欄（執行者勿填）

| 項目 | 結果 |
|------|------|
| 驗收日期 | 2026-06-06 |
| 驗收結果 | ✅ **通過** |

### 驗收備註

1. **型別與 API** — `LengthAwarePaginator` + Wayfinder 與 `useDashboardActions` 一致；`invitations/Index` TS = 0。
2. **測試** — 新增 10 個 Feature tests；協調者複跑相關 34 tests + 全套 **234 tests** 均通過。
3. **麵包屑** — `useSlug()` + `/dashboard-redirect` fallback 合理。
4. **尚未 commit** — 程式與測試檔仍在 working tree，需 commit/push。

### 剩餘 4 TS errors（Phase 2E）

- `app-header.tsx`（2）
- `DynamicForm.tsx`（1）
- `enhanced-select.tsx`（1）

### 協調者實測指令

```bash
npm run types 2>&1 | rg "invitations/Index"   # 0
php artisan test tests/Feature/InvitationsPageTest.php tests/Feature/NotificationsPageTest.php
php artisan test                               # 234 passed
npm run build
```
