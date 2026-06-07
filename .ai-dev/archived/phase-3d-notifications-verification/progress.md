# Phase 3D Progress Report

> **執行者填寫本文件。協調者負責驗收。**

| 項目 | 內容 |
|------|------|
| **階段** | Phase 3D — Notifications 標已讀驗證 |
| **執行者** | Claude Sonnet 4.6 |
| **狀態** | ✅ 完成（待協調者驗收） |

---

## 完成項目 checklist

- [x] mark-read Feature tests（7 個測試全過）
- [x] notifications Index 分頁改用 formatPaginationLabel（移除 `dangerouslySetInnerHTML`）
- [x] bell dropdown 手動驗證（程式碼已確認，瀏覽器驗證由協調者進行）
- [x] 全套 tests 全過（253/253）

---

## 變更摘要

| 檔案 | 變更 |
|------|------|
| `resources/js/pages/notifications/Index.tsx` | 加入 `formatPaginationLabel` import；分頁按鈕改用 `{formatPaginationLabel(link.label)}` 取代 `dangerouslySetInnerHTML` |
| `tests/Feature/NotificationMarkReadTest.php` | 新增 7 個 Pest Feature tests，涵蓋：單筆標已讀、未讀計數減少、全部標已讀、跨用戶隔離、禁止修改他人通知（403）、未授權存取（401） |

---

## 測試輸出

```
php artisan test tests/Feature/NotificationsPageTest.php tests/Feature/NotificationMarkReadTest.php

 PASS  Tests\Feature\NotificationsPageTest
  ✓  authenticated user can view the notifications page    2.40s
  ✓  guest is redirected to login from notifications page  0.03s
  ✓  notifications page shows user notifications only      2.09s
  ✓  notifications page reports correct unread count       2.14s
  ✓  notifications page accepts status filter              2.15s

 PASS  Tests\Feature\NotificationMarkReadTest
  ✓  authenticated user can mark a single notification as read   0.08s
  ✓  marking a single notification as read decreases the unread count  0.06s
  ✓  authenticated user can mark all notifications as read       0.07s
  ✓  mark all as read only affects the current user notifications 0.07s
  ✓  cannot mark another users notification as read              0.06s
  ✓  unauthenticated user cannot mark a notification as read     0.05s
  ✓  unauthenticated user cannot mark all notifications as read  0.05s

  Tests:    12 passed (56 assertions)
  Duration: 9.42s
```

```
php artisan test

  Tests:    253 passed (1420 assertions)
  Duration: 183.24s
```

```
npm run types  → 0 errors
npm run build  → ✓ built in 7.35s
```

---

## 手動驗證（NotificationBell）

> 前端功能正確性需由協調者在瀏覽器確認。以下為程式碼層面驗證結果：

| 操作 | 結果 |
|------|------|
| 開啟 dropdown 載入列表 | `notification-bell.tsx` 使用 `fetch` + CSRF token 呼叫 `/api/v1/notifications?per_page=8`，程式碼正確 |
| 單筆標已讀，badge 減 1 | 呼叫 `POST /api/v1/notifications/{id}/mark-as-read`，樂觀更新本地狀態，測試確認 DB status → `sent` |
| 全部已讀，badge 歸零 | 呼叫 `POST /api/v1/notifications/mark-all-as-read`，測試確認所有 `pending` → `sent` |

---

## Exit Criteria 確認

- [x] `NotificationMarkReadTest.php` 涵蓋 happy/failure/weird path（單筆、全部、跨用戶、401、403）
- [x] `formatPaginationLabel` 取代 `dangerouslySetInnerHTML`，無 XSS 風險
- [x] `npm run types` 0 errors；build 通過
- [x] 全套測試 253/253 通過

---

## 協調者驗收欄（執行者勿填）

| 項目 | 結果 |
|------|------|
| 驗收日期 | 2026-06-06 |
| 驗收結果 | ✅ 通過 |
| 協調者備註 | NotificationMarkReadTest 7 cases；notifications 分頁已無 dangerouslySetInnerHTML；253 tests。 |
