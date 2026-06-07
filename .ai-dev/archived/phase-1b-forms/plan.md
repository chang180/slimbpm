# Phase 1B：表單模組前端整合

| 項目 | 內容 |
|------|------|
| **階段** | Phase 1B |
| **狀態** | 可派工 |
| **協調者** | Cursor |
| **前置** | Phase 1A 已驗收（2026-06-06） |
| **前置閱讀** | `docs/03-module-status.md`（Forms 章節）、`docs/02-project-structure.md` |

---

## 背景

Phase 1A 已分離 Web/API Wayfinder routes。表單模組仍有大量前端錯誤，主因：

1. **`Forms/Index.tsx`** 把 Inertia prop `forms`（分頁資料）與 route helper 同名混用。
2. **`Forms/Show.tsx`、`Submit.tsx`、`Create.tsx` 等** 使用未定義的 `route()` 函式（非 Wayfinder）。
3. **`Forms/Edit.tsx` 不存在**，但 `FormController@edit` 會 render 它 → 500。
4. **`AuthenticatedLayout` 缺 `user` prop** 在多個 Forms 頁面。
5. **`/form-builder`** 是 localStorage demo，與 `FormTemplate` 後端無關。

`npm run types` 目前 **164 errors**，其中 Forms 相關約佔 30+。

---

## 協調者決策（`/form-builder` 去留）

**本階段採用方案 B（最小改動）：**

- **保留** `/form-builder` 頁面檔案，但在頁面頂部加「開發中 / demo」提示。
- **移除** Dashboard `QuickActions.tsx` 中指向 `/form-builder` 的連結（改指向 `/forms/create`）。
- **不** 在本階段把 FormBuilder 接上 `FormTemplate` API（留 Phase 4）。
- Sidebar 已只連 `/forms`，無需改動。

若執行者認為方案 A（直接整合 API）更合理，須在 progress.md 說明並等負責人確認，**不可自行擴 scope**。

---

## 目標

1. 所有 Forms 頁面使用 Wayfinder web routes（`@/routes/forms`），不再用 `route()` 或 `resources/js/lib/route.ts`。
2. 新增 `Forms/Edit.tsx`，或明確移除 edit 路由（**協調者偏好：新增 Edit 頁**，參考 Create）。
3. Forms 頁面 TypeScript 錯誤清零（至少 Forms 目錄內）。
4. 現有 Form 相關 Feature 測試全過；必要時補一個 Edit 頁 Inertia 測試。

---

## 範圍內

### Task 1：統一 route helper 用法

**參考模式**（Users 頁面 + Phase 1A 後的 Wayfinder）：

```tsx
import forms from '@/routes/forms';
// prop 改名避免衝突
interface FormsIndexProps {
  forms: PaginatedForms; // 考慮 rename prop 為 formTemplates 若 controller 可改
}
// 使用
router.get(forms.index.url(), { ... });
<Link href={forms.create.url()}>
```

**要求：**

- [ ] `Forms/Index.tsx`：解決 `forms` prop 與 route import 命名衝突（rename import 為 `formsRoutes` 或 rename prop）。
- [ ] `Forms/Show.tsx`、`Submit.tsx`、`Create.tsx`、`Results.tsx`：改用 `@/routes/forms` Wayfinder helpers。
- [ ] 移除對 `route()` 全域函式的依賴；不要擴大使用 `resources/js/lib/route.ts`。
- [ ] `Show.tsx` 缺 `Input` import — 一併補上。

### Task 2：新增 `Forms/Edit.tsx`

- [ ] 參考 `Forms/Create.tsx` 結構。
- [ ] 接收 `form: FormTemplate` prop（controller 已提供）。
- [ ] 提交 `forms.update`（PUT）至 `FormController@update`。
- [ ] 權限：`canEdit` 邏輯與 Show 頁一致。

### Task 3：修正 Layout props

Forms 頁面使用 `AuthenticatedLayout` 時須傳 `user`（參考 `Users/Index.tsx` 的 `auth.user`）：

- [ ] `Forms/Create.tsx`
- [ ] `Forms/Index.tsx`
- [ ] `Forms/Results.tsx`
- [ ] `Forms/Show.tsx`
- [ ] `Forms/Edit.tsx`（新建）

若專案慣例已改用 `AppLayout`（如 `workflows/Index.tsx`），可統一改為 `AppLayout`，但 Forms 目錄內須一致。

### Task 4：`/form-builder` 降級處理

- [ ] `QuickActions.tsx`：`/form-builder` 連結改為 `/forms/create`。
- [ ] `FormBuilder.tsx`：加 banner 說明此為 demo，正式建表單請用「表單管理 → 新增表單」。

### Task 5：測試

- [ ] `php artisan test` — 209+ 全過。
- [ ] 新增或更新 Feature test：`FormController@edit` 回傳 200 Inertia 頁（可放在既有 form test 檔或新建 `tests/Feature/FormPagesTest.php`）。
- [ ] `npm run types` — Forms 目錄無 error。
- [ ] `npm run build` 通過。
- [ ] PHP 有改動時：`php vendor/bin/pint --dirty`

---

## 範圍外

| 項目 | 階段 |
|------|------|
| Dashboard 假 handler | Phase 1C |
| Organization prop 命名 | Phase 1D |
| FormBuilder 接 API | Phase 4 |
| Users/Departments TS 錯誤 | Phase 2 |

---

## Exit Criteria（協調者驗收用）

- [ ] 點擊 sidebar「表單管理」→ 列表 → 新增/檢視/編輯/提交/結果 路由皆可達（edit 不 500）
- [ ] `resources/js/pages/Forms/*.tsx` 在 `npm run types` 中 0 error
- [ ] 無 `route('forms.*')` 或未定義 `route()` 用法殘留於 Forms 頁面
- [ ] `php artisan test` 全過
- [ ] `progress.md` 含修前/修後 Forms 相關 error 數

---

## 建議 Commit 訊息

```
fix: wire Forms pages to Wayfinder routes and add Edit page
```

---

## 回報方式

完成後填寫 [`progress.md`](./progress.md)，交負責人轉協調者 review。
