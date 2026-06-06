# Phase 1B Progress Report

> **執行者填寫本文件。協調者負責驗收。**

| 項目 | 內容 |
|------|------|
| **階段** | Phase 1B — 表單模組前端整合 |
| **執行者** | Claude Sonnet 4.6 |
| **狀態** | ☑️ 已驗收 |
| **開始時間** | 2026-06-06 |
| **完成時間** | 2026-06-06 |

---

## 完成項目 checklist

- [x] Forms 頁面改用 Wayfinder `@/routes/forms`
- [x] `Forms/Edit.tsx` 已建立且可運作
- [x] Layout 統一改為 `AppLayout`（無需 `user` prop）
- [x] `/form-builder` 已降級（QuickActions 改連 `/forms/create`；FormBuilder 加 demo banner）
- [x] Form 所有 web 頁 Feature test 已補（`FormPagesTest.php`，8 tests）
- [x] `php artisan test` 全過（217 passed）
- [x] Forms 目錄 `npm run types` 0 error
- [x] `npm run build` 通過
- [x] `vendor/bin/pint --dirty` 已執行

---

## 變更摘要

### Task 1 — 統一 route helper

所有 Forms 頁面改用 `import formsRoutes from '@/routes/forms'`：
- `Index.tsx`：移除 `forms` prop / route helper 命名衝突，使用 `formsRoutes.*`
- `Show.tsx`：取代所有 `route('forms.*')` 呼叫，補上 `Input` import
- `Submit.tsx`：取代 `route('forms.process-submit')` / `route('forms.show')`
- `Results.tsx`：取代 `forms.show.url()` / `forms.submit.url()`（原本誤用 prop 當 route helper）
- `Create.tsx`：移除 `import { route } from '@/lib/route'`，改用 `formsRoutes`

### Task 2 — 新增 `Forms/Edit.tsx`

參考 `Create.tsx` 結構，接收 `form: FormTemplate` prop，pre-fill 表單，提交 PUT 至 `formsRoutes.update.url({ form: formId })`。

### Task 3 — Layout props 修正

所有 Forms 頁面統一改為 `AppLayout`（參考 `workflows/Index.tsx` 慣例），無需傳 `user` prop。`Submit.tsx` 原本就沒有 layout，保持不變。

### Task 4 — `/form-builder` 降級

- `QuickActions.tsx`：「表單設計」連結由 `/form-builder` 改為 `/forms/create`，標題改為「新增表單」
- `FormBuilder.tsx`：頂部加 amber 色 banner，說明此為 demo，正式建表單請用表單管理

### Task 5 — 測試

新增 `tests/Feature/FormPagesTest.php`（8 tests）：
- Index / Create / Show / Edit（owner）/ Edit（non-owner 403）/ Submit / Results（owner）/ Results（non-owner 403）

---

## 驗證結果

### 修前 / 修後

```
npm run types — Forms/ 錯誤
修前：約 30+ errors（`route()` 未定義、命名衝突、AuthenticatedLayout user prop 等）
修後：0 errors

php artisan test
修前：209 tests passed
修後：217 tests passed（新增 8 個 FormPages tests）

npm run build
修後：✓ built in 4.72s（無錯誤）
```

---

## 與 plan 的偏差

- **Layout 策略**：plan 說可用 `AuthenticatedLayout`（傳 `auth.user`）或 `AppLayout`。本次統一改為 `AppLayout`（與 workflows/Index.tsx 慣例一致），避免 `user` prop 傳遞的 TypeScript 問題。
- **`FormBuilder.tsx`**：採用方案 B（加 banner），未整合 API。

---

## 阻塞 / 需人類決策

無。

---

## 執行者自評

- [x] 未擅自整合 FormBuilder API
- [x] 未修改 Dashboard / Organization 模組
- [x] progress 測試輸出為實際執行結果

---

## 協調者驗收欄（執行者勿填）

| 項目 | 結果 |
|------|------|
| 驗收日期 | 2026-06-06 |
| 驗收結果 | ☑️ **通過** |
| 修正指示 | 無 |

### 協調者驗證紀錄

- `npm run types` — Forms 目錄 **0 errors**；全專案 164→**131**
- `php artisan test` → **217 passed**（+8 FormPagesTest）
- `npm run build` → 通過
- `Forms/Edit.tsx` 存在；無 `route('forms.*')` 殘留
- `QuickActions` 已改 `/forms/create`；`FormBuilder` 有 demo banner
- Layout 改 `AppLayout` — 合理偏差，接受

**後續：** Phase 1C plan → `.ai-dev/tasks/phase-1c-dashboard/plan.md`
