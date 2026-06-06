# Phase 3E：Reports 篩選與分頁 polish

| 項目 | 內容 |
|------|------|
| **階段** | Phase 3E |
| **狀態** | ✅ 已驗收 |
| **協調者** | Cursor |
| **前置** | Phase 2D 已驗收 |
| **前置閱讀** | `tests/Feature/ReportsPagesTest.php`、`tests/Feature/ReportsExportTest.php` |

---

## 背景

Phase 2D 已接 Reports Index 匯出與 UserActivity/SystemStats 頁面測試。

仍缺（`docs/04-known-issues-and-backlog.md`）：

1. **日期篩選** — 子頁 query string 與 `ReportsController` / `ExportService` 是否一致。
2. **Workflows 分頁** — `workflows/Index.tsx` 仍用 `dangerouslySetInnerHTML` 渲染 pagination labels。
3. **DepartmentAnalysis** — 若無 export 路由，Index 是否正確隱藏下載（2D 已做 Index；確認子頁一致）。

---

## 目標

1. 補 Reports 日期 filter 的 Feature test（至少 1–2 子頁）。
2. Workflows Index 分頁改用 `formatPaginationLabel()`。
3. 確認各 report 子頁 Inertia props 在帶 date query 時正確 scoped。

---

## 範圍內

### Task 1：Reports 日期篩選測試

**檔案：** `tests/Feature/ReportsPagesTest.php`

- [ ] 選定 1–2 子頁（如 `user-activity`、`workflow-performance`）加 `?start_date=&end_date=` assert。
- [ ] 對照 `ReportsController` 預期參數名稱（勿猜，讀 controller）。
- [ ] `ReportsExportTest` 若已有 date filter，對齊同一參數名。

### Task 2：Workflows 分頁

**檔案：** `resources/js/pages/workflows/Index.tsx`

- [ ] import `formatPaginationLabel` from `@/lib/pagination`
- [ ] 取代 `dangerouslySetInnerHTML={{ __html: link.label }}`

### Task 3：子頁 export 按鈕抽查

**檔案：** `resources/js/pages/reports/*.tsx`

- [ ] 確認各子頁 export 按鈕 POST 路徑與 `ReportsExportTest` 一致
- [ ] 無 export 的頁面不顯示下載（或 disabled + 說明）

### Task 4：驗證

- [ ] `php artisan test tests/Feature/ReportsPagesTest.php tests/Feature/ReportsExportTest.php`
- [ ] `npm run types`、`npm run build`

---

## 範圍外

| 項目 | 階段 |
|------|------|
| notifications 分頁 | Phase 3D |
| 新報表類型 | Phase 4 |
| Export 格式擴充（PDF 等） | Phase 4 |

---

## Exit Criteria

- [ ] Reports 日期 filter 至少 1 個 Feature test
- [ ] workflows/Index 無 pagination dangerouslySetInnerHTML
- [ ] 相關 tests 全過

---

## 回報方式

完成後填寫 [`progress.md`](./progress.md)，交協調者 review。
