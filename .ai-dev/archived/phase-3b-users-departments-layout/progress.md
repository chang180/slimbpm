# Phase 3B Progress Report

> **執行者填寫本文件。協調者負責驗收。**

| 項目 | 內容 |
|------|------|
| **階段** | Phase 3B — Users/Departments Layout 統一 |
| **執行者** | Claude Sonnet 4.6 |
| **狀態** | ✅ 完成（待協調者驗收） |

---

## 完成項目 checklist

- [x] Users/Index、Users/Show → AppLayout
- [x] Departments/Index、Departments/Show → AppLayout
- [x] breadcrumbs 已補齊（含 `useSlug()` + `/dashboard-redirect` fallback）
- [x] `npm run types` = 0 errors
- [x] `npm run build` 通過
- [x] UserManagementUITest 全過（13/13）

---

## 變更摘要

| 檔案 | 變更 |
|------|------|
| `resources/js/pages/Users/Index.tsx` | `AuthenticatedLayout` → `AppLayout`；移除 `auth` prop；加入 `useSlug` + `useMemo` breadcrumbs（儀表板 → 用戶管理）；header 移入內容區域並加 `dark:text-gray-200` |
| `resources/js/pages/Users/Show.tsx` | 同上；breadcrumbs 多一層（用戶管理 → {user.name}）；返回/編輯/刪除按鈕移入 `mb-6` 標題列 |
| `resources/js/pages/Departments/Index.tsx` | `AuthenticatedLayout` → `AppLayout`；breadcrumbs（儀表板 → 部門管理） |
| `resources/js/pages/Departments/Show.tsx` | 同上；breadcrumbs（儀表板 → 部門管理 → {department.name}） |

### 共同模式

```tsx
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useSlug } from '@/hooks/useSlug';

const slug = useSlug();
const breadcrumbs = useMemo<BreadcrumbItem[]>(() => [
    { title: '儀表板', href: slug ? `/dashboard/${slug}` : '/dashboard-redirect' },
    { title: '用戶管理', href: '/users' },
], [slug]);

return <AppLayout breadcrumbs={breadcrumbs}>...</AppLayout>;
```

---

## 測試輸出

```
php artisan test tests/Feature/UserManagementUITest.php

 PASS  Tests\Feature\UserManagementUITest
  ✓  can view users index page          2.36s
  ✓  can view user create page          2.11s
  ✓  can create new user                0.04s
  ✓  can view user show page            2.10s
  ✓  can view user edit page            2.09s
  ✓  can update user                    0.03s
  ✓  can delete user                    0.03s
  ✓  can search users                   2.09s
  ✓  can filter users by role           2.10s
  ✓  can filter users by status         2.09s
  ✓  requires authentication to access users  0.03s
  ✓  validates user creation data       0.03s
  ✓  validates user update data         0.03s

  Tests:    13 passed (112 assertions)
  Duration: 15.26s
```

```
php artisan test

  Tests:    244 passed (1354 assertions)
  Duration: 168.23s
```

```
npm run types  → 0 errors
npm run build  → ✓ built in 5.65s
```

---

## 手動驗證

> 前端功能正確性需由協調者在瀏覽器確認。以下為程式碼層面驗證結果：

| 頁面 | AppLayout | breadcrumbs | dark mode h2 |
|------|-----------|-------------|--------------|
| /users | ✅ | ✅ 儀表板 → 用戶管理 | ✅ `dark:text-gray-200` |
| /users/{id} | ✅ | ✅ 儀表板 → 用戶管理 → {name} | ✅ |
| /departments | ✅ | ✅ 儀表板 → 部門管理 | ✅ |
| /departments/{id} | ✅ | ✅ 儀表板 → 部門管理 → {name} | ✅ |

---

## Exit Criteria 確認

- [x] 四檔案無 `AuthenticatedLayout` import
- [x] breadcrumbs 與 dark mode 與 sibling 頁（invitations、notifications）一致
- [x] `npm run types` 0 errors；build 通過
- [x] `progress.md` 含手動驗證 checklist

---

## 協調者驗收欄（執行者勿填）

| 項目 | 結果 |
|------|------|
| 驗收日期 | 2026-06-06 |
| 驗收結果 | ✅ 通過 |
| 協調者備註 | 四頁已無 AuthenticatedLayout；breadcrumbs 一致；UserManagementUITest 13/13。 |
