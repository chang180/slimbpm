# Phase 3B：Users / Departments Layout 統一

| 項目 | 內容 |
|------|------|
| **階段** | Phase 3B |
| **狀態** | ✅ 已驗收 |
| **協調者** | Cursor |
| **前置** | Phase 2A、2B 已驗收（Create/Edit 已用 AppLayout） |
| **前置閱讀** | `resources/js/pages/Users/Create.tsx`、`resources/js/pages/Departments/Create.tsx` |

---

## 背景

Phase 2A/2B 已修 Create/Edit，但 **Index / Show** 仍用舊版 `AuthenticatedLayout`：

| 檔案 | 目前 Layout |
|------|-------------|
| `Users/Index.tsx` | AuthenticatedLayout |
| `Users/Show.tsx` | AuthenticatedLayout |
| `Departments/Index.tsx` | AuthenticatedLayout |
| `Departments/Show.tsx` | AuthenticatedLayout |

其餘模組（Forms、Notifications、Organization 等）已用 `AppLayout` + breadcrumbs + 側欄導航。不一致會造成導航、dark mode、通知鈴體驗不同。

---

## 目標

1. 四頁改用 `AppLayout`，與 Create/Edit 一致。
2. 補齊 breadcrumbs（含 dashboard 連結，優先 `useSlug()` + Wayfinder `dashboard(slug)`）。
3. 移除對 `AuthenticatedLayout` 的 `user` prop 依賴（AppLayout 從 shared auth 讀取）。
4. `npm run types` 維持 0 errors。

---

## 範圍內

### Task 1：Users Index / Show

**檔案：** `resources/js/pages/Users/Index.tsx`、`Users/Show.tsx`

- [ ] 改 `import AppLayout from '@/layouts/app-layout'`。
- [ ] 定義 `breadcrumbs`（參考 `Users/Create.tsx` 或 `notifications/Index.tsx`）。
- [ ] 移除 `AuthenticatedLayout` 的 `user={...}` wrapper。
- [ ] 保留現有表格、分頁、`formatPaginationLabel`（若已有）。

### Task 2：Departments Index / Show

**檔案：** `resources/js/pages/Departments/Index.tsx`、`Departments/Show.tsx`

- [ ] 同上模式遷移至 AppLayout。
- [ ] breadcrumbs：部門列表 → 部門詳情。

### Task 3：驗證

- [ ] `npm run types`
- [ ] `npm run build`
- [ ] `php artisan test tests/Feature/UserManagementUITest.php` 全過
- [ ] 手動確認四頁在桌面寬度下側欄與 header 正常（寫入 progress）

---

## 範圍外

| 項目 | 階段 |
|------|------|
| Department Inertia 頁面測試（目前僅 API 測試） | Phase 3C |
| Users Create/Edit 邏輯變更 | 已完成 |
| 刪除 `AuthenticatedLayout.tsx` | Phase 3 結束後再評估 |

---

## Exit Criteria

- [ ] 四檔案無 `AuthenticatedLayout` import
- [ ] breadcrumbs 與 dark mode 與 sibling 頁一致
- [ ] `npm run types` 0 errors；build 通過
- [ ] `progress.md` 含手動驗證 checklist

---

## 回報方式

完成後填寫 [`progress.md`](./progress.md)，交協調者 review。
