# Phase 2D Progress Report

> **執行者填寫本文件。協調者負責驗收。**

| 項目 | 內容 |
|------|------|
| **階段** | Phase 2D — Workflows 與 Reports 前端驗證 |
| **執行者** | Claude Code |
| **狀態** | ✅ 已驗收（2026-06-06） |

---

## 完成項目 checklist

- [x] Workflow Monitor 操作路徑驗證
- [x] Reports 匯出與篩選驗證
- [x] 相關 Feature tests 全過
- [x] 手動驗證 checklist 已填

---

## 變更摘要

### Task 1：Workflow Monitor UX（`resources/js/pages/workflows/Monitor.tsx`）

1. **`credentials: 'same-origin'`** — 在 `handleAction` fetch 中補上，確保 session cookie 隨請求送出。
2. **錯誤反饋** — 加入 `actionError` state；API 回傳非 200 或網路例外時，於表格上方顯示中文錯誤訊息 banner，不再僅寫 console。
3. **分頁標籤** — 將 `dangerouslySetInnerHTML={{ __html: link.label }}` 改為 `{formatPaginationLabel(link.label)}`，與 Users 頁一致，避免 XSS 風險。

### Task 2：Reports 頁面（`resources/js/pages/reports/Index.tsx`）

- 報表卡下載按鈕原本完全未接路由。現在：
  - 用戶活動、流程效能、系統統計三張卡各自呼叫 `router.post(exportHref)` 連接對應 POST 匯出路由。
  - 部門分析無匯出端點，隱藏下載按鈕。
- 各子頁（UserActivity / WorkflowPerformance / SystemStats）匯出按鈕原已正確使用 `<Link method="post" as="button">`，路由與 `ReportsExportTest` 一致，無需更改。
- 日期 filter：後端 ExportService 接受 `date_from`/`date_to` query 參數；前端目前無 UI（超出本階段範圍），屬已知設計限制。

### Task 3：測試

新增兩個缺少的 Inertia 頁面測試到 `ReportsPagesTest.php`：

- `it renders user activity report page with correct props`
- `it renders system stats report page with correct props`

---

## 手動驗證 checklist

| 項目 | 結果 | 備註 |
|------|------|------|
| Monitor cancel/suspend/resume 使用 `credentials: 'same-origin'` | ✅ 程式碼已修正 | fetch 新增 `credentials` 欄位 |
| Monitor 操作失敗時顯示中文 error banner | ✅ 程式碼已修正 | `actionError` state + 紅色 banner |
| Monitor 分頁標籤改用 `formatPaginationLabel()` | ✅ 程式碼已修正 | 移除 `dangerouslySetInnerHTML` |
| Reports 子頁匯出 POST 路由與 `ReportsExportTest` 一致 | ✅ 已確認 | `/reports/export/{type}` |
| Reports Index 下載按鈕接路由 | ✅ 程式碼已修正 | 3 個有端點的報表卡已接線 |

---

## 測試結果

```
php artisan test tests/Feature/WorkflowMonitorTest.php tests/Feature/ReportsPagesTest.php tests/Feature/ReportsExportTest.php
Tests: 24 passed (194 assertions)

php artisan test
Tests: 236 passed (1253 assertions)

npm run build → ✓ built in ~8s
```

---

## 協調者驗收欄（執行者勿填）

| 項目 | 結果 |
|------|------|
| 驗收日期 | 2026-06-06 |
| 驗收結果 | ✅ **通過** |

### 驗收備註

1. **Monitor** — `credentials: 'same-origin'`、`actionError` banner、`formatPaginationLabel` 與 plan 一致。
2. **Reports Index** — 三張可匯出報表卡已接 `router.post('/reports/export/...')`，部門分析正確隱藏下載；路由與 `web.php` 一致。
3. **測試** — 協調者複跑 WorkflowMonitor + Reports 24 tests + 全套 **236 tests** 均通過；`npm run build` 通過。
4. **小缺** — Monitor 麵包屑仍硬編碼 `/dashboard`（非阻擋項；可後續用 `useSlug()` 統一）。
5. **小缺** — Monitor 麵包屑仍硬編碼 `/dashboard`（非阻擋項）。

### 協調者實測指令

```bash
php artisan test tests/Feature/WorkflowMonitorTest.php tests/Feature/ReportsPagesTest.php tests/Feature/ReportsExportTest.php
php artisan test
npm run build
```
