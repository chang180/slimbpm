# Phase 2B：Departments 模組前端修復

| 項目 | 內容 |
|------|------|
| **階段** | Phase 2B |
| **狀態** | 可派工 |
| **協調者** | Cursor |
| **前置** | Phase 2A 已驗收（2026-06-06） |
| **前置閱讀** | `docs/03-module-status.md`（Departments 章節） |

---

## 背景

Phase 2A 後全專案 TS 剩 **9 errors**，其中 **Departments Create/Edit 各 2 個**（`Cannot find namespace 'JSX'`）。

Index/Show 仍用 `AuthenticatedLayout`；Create/Edit 已有 Select import，但 JSX 型別寫法與 React 19 專案不一致。

後端 `DepartmentController` 與 `DepartmentTest` / `DepartmentManagementTest` 已存在。

---

## 目標

1. `Departments/Create.tsx`、`Departments/Edit.tsx` TS errors = 0。
2. CRUD 頁面可正常 render 與 submit。
3. 現有 Department 相關測試全過。

---

## 範圍內

### Task 1：修 Create / Edit JSX 型別

**檔案：**

- `resources/js/pages/Departments/Create.tsx`
- `resources/js/pages/Departments/Edit.tsx`

**要求：**

- [ ] 將 `JSX.Element[]` 等改為 `React.ReactNode` 或 `ReactElement[]`（參考 Forms/Users 同專案寫法）。
- [ ] 確認 `useForm` submit 無非法 options。
- [ ] 可選：Layout 統一為 `AppLayout`（與 Users Create/Edit 一致）。

### Task 2：驗證 Index

- [ ] `Departments/Index.tsx` 分頁 props 對齊 Laravel 扁平結構（參考 `@/lib/pagination.ts`）。
- [ ] 列表 → 建立 → 編輯流程可達。

### Task 3：測試

- [ ] `php artisan test tests/Feature/DepartmentTest.php tests/Feature/DepartmentManagementTest.php`
- [ ] `npm run types` — `resources/js/pages/Departments/**` 0 error
- [ ] `npm run build` 通過

---

## 範圍外

| 項目 | 階段 |
|------|------|
| Users Index/Show Layout 統一 | 後續 polish |
| invitations 型別修正 | Phase 2C |
| app-header / DynamicForm 雜項 TS | Phase 2E |

---

## Exit Criteria

- [ ] Departments 目錄 TS errors = 0
- [ ] Department 相關測試全過
- [ ] `progress.md` 含修前/修後 TS error 數

---

## 回報方式

完成後填寫 [`progress.md`](./progress.md)，交協調者 review。
