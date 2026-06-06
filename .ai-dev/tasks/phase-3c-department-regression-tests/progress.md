# Phase 3C Progress Report

> **執行者填寫本文件。協調者負責驗收。**

| 項目 | 內容 |
|------|------|
| **階段** | Phase 3C — Department 頁面回歸測試 |
| **執行者** | Codex |
| **狀態** | ✅ 完成（待協調者驗收） |

---

## 修前 / 修後測試數

| 時間點 | tests passed |
|--------|--------------|
| 修前   | 236          |
| 修後   | 244          |

---

## 新增測試清單

- [x] GET `/departments` renders `Departments/Index` with top-level `departments` and `filters`
- [x] GET `/departments/create` renders `Departments/Create` with active parent departments
- [x] POST `/departments` creates a department and redirects to `/departments`
- [x] GET `/departments/{id}` renders `Departments/Show` with users and `users_count`
- [x] GET `/departments/{id}/edit` renders `Departments/Edit` and excludes the current department subtree from parent options
- [x] GET `/departments?search=...` filters index results and preserves filters
- [x] GET `/departments?status=inactive` filters index results and preserves filters
- [x] Guest access redirects to `/login` for index/create/store/show/edit

### 備註

`DepartmentController` 目前尚未依 `organization_id` 做 org scoping，且 index 回傳 collection 而非 paginator；本次測試依現有 controller 行為加上頁面級回歸保護，未加入會使現況失敗的 org-only 斷言。

---

## 測試輸出

```bash
php artisan test tests/Feature/DepartmentPagesTest.php
# PASS: 8 passed / 101 assertions

php artisan test
# PASS: 244 passed / 1354 assertions

vendor/bin/pint --dirty
# PASS
```

---

## 協調者驗收欄（執行者勿填）

| 項目 | 結果 |
|------|------|
| 驗收日期 | 2026-06-06 |
| 驗收結果 | ✅ 通過 |
| 協調者備註 | DepartmentPagesTest 8 cases；236→244 tests。org scoping 缺口已如實記錄，不阻擋驗收。 |
