# Phase 2E：剩餘 TypeScript 清零

| 項目 | 內容 |
|------|------|
| **階段** | Phase 2E |
| **狀態** | 可派工 |
| **協調者** | Cursor |
| **前置** | Phase 2D 已驗收 |
| **前置閱讀** | `docs/04-known-issues-and-backlog.md` |

---

## 背景

Phase 2D 後全專案 TS 剩 **4 errors**，全部在共用元件：

| 檔案 | 錯誤 |
|------|------|
| `resources/js/components/app-header.tsx` | `useSlug()` 回傳 `string \| null` 傳入需 `string \| undefined`；`dashboard()` 缺參數 |
| `resources/js/components/DynamicForm.tsx` | `undefined` 作為 index type |
| `resources/js/components/ui/enhanced-select.tsx` | Select 不支援 `className` prop |

修完後 **`npm run types` 應全綠**，達成 Phase 2 模組硬化 TS 目標。

---

## 目標

1. 全專案 `npm run types` = 0 errors。
2. 不破坏現有 Feature tests；`npm run build` 通過。

---

## 範圍內

### Task 1：`app-header.tsx`

- [ ] `getMainNavItems(slug ?? undefined)` 或 nullish coalesce。
- [ ] `dashboard(slug!)` / `dashboard({ slug })` — 對照 `@/routes` Wayfinder 簽名補齊參數。

### Task 2：`DynamicForm.tsx`

- [ ] 修 field key / index 存取，確保 index 前已 narrow 非 undefined。

### Task 3：`enhanced-select.tsx`

- [ ] 移除 Select 上不支援的 `className`，改包一層 `div` 或改用 `SelectTrigger` className。

### Task 4：驗證

- [ ] `npm run types` — 0 errors
- [ ] `npm run build`
- [ ] `php artisan test` 全過（236+）

---

## 範圍外

- 新功能、Layout 全面統一
- Pest Browser 測試

---

## Exit Criteria

- [ ] `npm run types` 0 errors
- [ ] `progress.md` 含修前/修後 error 數

---

## 回報方式

完成後填寫 [`progress.md`](./progress.md)，交協調者 review。
