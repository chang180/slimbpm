# Phase 2D：Workflows 與 Reports 前端驗證

| 項目 | 內容 |
|------|------|
| **階段** | Phase 2D |
| **狀態** | 可派工 |
| **協調者** | Cursor |
| **前置** | Phase 2C 已驗收 |
| **前置閱讀** | `docs/03-module-status.md`（Workflows / Reports 章節） |

---

## 背景

Phase 2C 後全專案 TS 剩 **4 errors**（均在 Phase 2E 範圍）。

Workflows 與 Reports 後端測試較完整（`WorkflowMonitorTest`、`ReportsPagesTest`、`ReportsExportTest`），但前端仍有待手動驗證項目：

1. **Workflow Monitor** — cancel/suspend/resume 按鈕是否正確打 API、錯誤時是否有 feedback。
2. **Reports 子頁** — 日期篩選、匯出按鈕是否連到正確 POST 路由。
3. **分頁標籤** — workflows/notifications 部分頁仍用 `dangerouslySetInnerHTML` 渲染 Laravel HTML labels；可統一為 `formatPaginationLabel()`。

---

## 目標

1. 確認 Monitor 與 Reports 關鍵操作路徑正確（Wayfinder 或明確 path）。
2. 補缺漏的 Inertia 頁面 smoke tests（若尚無）。
3. 手動驗證清單寫入 `progress.md`。

---

## 範圍內

### Task 1：Workflow Monitor UX

**檔案：** `resources/js/pages/workflows/Monitor.tsx`

- [ ] 確認 cancel/suspend/resume fetch 使用 session API（`credentials: 'same-origin'`）。
- [ ] 錯誤時顯示使用者可見訊息（非僅 console）。
- [ ] 分頁標籤改用 `formatPaginationLabel()`（可選，與 Users 一致）。

### Task 2：Reports 頁面

**檔案：** `resources/js/pages/Reports/*.tsx`（或實際路徑）

- [ ] 確認匯出 POST 路由與 `ReportsExportTest` 一致。
- [ ] 日期 filter query string 與 controller 預期一致。

### Task 3：測試

- [ ] `php artisan test tests/Feature/WorkflowMonitorTest.php`
- [ ] `php artisan test tests/Feature/ReportsPagesTest.php tests/Feature/ReportsExportTest.php`
- [ ] 必要時新增 `WorkflowMonitorPageTest.php` / 補強 Reports Inertia asserts
- [ ] `npm run build` 通過

---

## 範圍外

| 項目 | 階段 |
|------|------|
| app-header / DynamicForm / enhanced-select TS | Phase 2E |
| 新 workflow 節點類型 | Phase 4 |

---

## Exit Criteria

- [ ] Monitor / Reports 關鍵路徑有測試或 progress 內手動驗證紀錄
- [ ] 相關 Feature tests 全過
- [ ] `progress.md` 含手動驗證 checklist 結果

---

## 回報方式

完成後填寫 [`progress.md`](./progress.md)，交協調者 review。
