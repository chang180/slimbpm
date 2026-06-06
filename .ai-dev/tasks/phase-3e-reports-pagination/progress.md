# Phase 3E Progress Report

> **執行者填寫本文件。協調者負責驗收。**

| 項目 | 內容 |
|------|------|
| **階段** | Phase 3E — Reports 篩選與分頁 polish |
| **執行者** | Codex |
| **狀態** | ✅ 完成（待協調者驗收） |

---

## 完成項目 checklist

- [x] Reports 日期 filter tests
- [x] workflows/Index formatPaginationLabel
- [x] 子頁 export 按鈕確認
- [x] tests + build 通過

---

## 變更摘要

| 檔案 | 變更 |
|------|------|
| `app/Http/Controllers/ReportsController.php` | `UserActivity` / `WorkflowPerformance` 支援 `date_from`、`date_to` query，並回傳 `filters` prop |
| `tests/Feature/ReportsPagesTest.php` | 新增 user activity 與 workflow performance 日期篩選 Inertia props 測試 |
| `resources/js/pages/workflows/Index.tsx` | 分頁 label 改用 `formatPaginationLabel()`，移除 `dangerouslySetInnerHTML` |

### 子頁 export 抽查

- [x] `reports/UserActivity.tsx` POST `/reports/export/user-activity`，與 `ReportsExportTest` 一致
- [x] `reports/WorkflowPerformance.tsx` POST `/reports/export/workflow-performance`，與 `ReportsExportTest` 一致
- [x] `reports/SystemStats.tsx` POST `/reports/export/system-stats`，與 `ReportsExportTest` 一致
- [x] `reports/DepartmentAnalysis.tsx` 沒有 export route，也沒有顯示下載按鈕

---

## 測試輸出

```bash
php artisan test tests/Feature/ReportsPagesTest.php tests/Feature/ReportsExportTest.php
# PASS: 19 passed / 171 assertions

vendor/bin/pint --dirty
# PASS

npm run types
# PASS: 0 errors

npm run build
# PASS
```

---

## 協調者驗收欄（執行者勿填）

| 項目 | 結果 |
|------|------|
| 驗收日期 | 2026-06-06 |
| 驗收結果 | ✅ 通過 |
| 協調者備註 | ReportsController date_from/date_to + 2 filter tests；workflows Index 分頁已改用 formatPaginationLabel。 |
