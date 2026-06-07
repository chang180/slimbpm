# Phase 2A：Users 模組前端修復

| 項目 | 內容 |
|------|------|
| **階段** | Phase 2A |
| **狀態** | 可派工 |
| **協調者** | Cursor |
| **前置** | Phase 1D 已驗收（2026-06-06） |
| **前置閱讀** | `docs/03-module-status.md`（Users 章節） |

---

## 背景

Phase 1 完成後，全專案 TS 錯誤剩 **38**，其中 **Users Create/Edit 各 15 個**（佔 79%）。

主要問題：

1. **`Select` 元件未 import** — 使用了 `SelectTrigger` 等但未從 `@/components/ui/select` 引入。
2. **`useForm` submit options** — `data` 不是 Inertia 3 合法選項（同 Phase 1D Preferences 已修過的模式）。
3. **Layout** — 仍用 `AuthenticatedLayout` + `auth.user`；可改 `AppLayout` 或補齊 props（參考 Forms/Organization 慣例）。

後端 `UserController` 與 `UserManagementTest` / `UserManagementUITest` 已存在。

---

## 目標

1. `Users/Create.tsx`、`Users/Edit.tsx` TS errors = 0。
2. 表單可正常 submit（create/update）。
3. 現有 User 相關測試全過；必要時補 Inertia 頁面測試。

---

## 範圍內

### Task 1：修 Create / Edit 頁面

**檔案：**

- `resources/js/pages/Users/Create.tsx`
- `resources/js/pages/Users/Edit.tsx`

**要求：**

- [ ] 補上 Select 相關 import（或改用專案已有的 `SafeSelect` / `safe-select.tsx`，參考 `Users/Index.tsx`）。
- [ ] 修正 `useForm` submit：改用 `post()` / `put()` 或 `<Form>` 元件，不要用非法 `data` option。
- [ ] Layout 統一為 `AppLayout`（推薦）或正確傳 `AuthenticatedLayout` 的 `user` prop。
- [ ] 路由：優先 Wayfinder `@/routes` 或明確 path（`/users`、`/users/create`），勿用不完整 `route.ts`。

### Task 2：驗證 Index / Show

- [ ] 確認 `Users/Index.tsx`、`Users/Show.tsx` 無新增 TS 錯誤。
- [ ] 列表 → 建立 → 編輯 → 顯示 流程可達。

### Task 3：測試

- [ ] `php artisan test` — 223+ 全過
- [ ] `php artisan test tests/Feature/UserManagementUITest.php tests/Feature/UserManagementTest.php`
- [ ] `npm run types` — `resources/js/pages/Users/**` 0 error
- [ ] `npm run build` 通過

---

## 範圍外

| 項目 | 階段 |
|------|------|
| Departments JSX namespace | Phase 2B |
| app-header / DynamicForm 雜項 TS | Phase 2C 或順手修 |
| 用戶權限系統擴展 | Phase 4 |

---

## Exit Criteria

- [ ] Users 目錄 TS errors = 0
- [ ] Create/Edit 表單 submit 路徑正確
- [ ] `php artisan test` 全過
- [ ] `progress.md` 含修前/修後 Users TS error 數

---

## 建議 Commit 訊息

```
fix: repair Users create and edit page TypeScript and forms
```

---

## 回報方式

完成後填寫 [`progress.md`](./progress.md)，交協調者 review。
