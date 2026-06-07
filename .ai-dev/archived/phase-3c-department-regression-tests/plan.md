# Phase 3C：Department 頁面回歸測試

| 項目 | 內容 |
|------|------|
| **階段** | Phase 3C |
| **狀態** | ✅ 已驗收 |
| **協調者** | Cursor |
| **前置** | Phase 2B 已驗收；可與 3B 並行 |
| **前置閱讀** | `tests/Feature/FormPagesTest.php`、`tests/Feature/UserManagementUITest.php` |

---

## 背景

`tests/Feature/DepartmentManagementTest.php` 僅測 **JSON API**（`/api/v1/departments`），沒有 Inertia 頁面覆蓋。

Users 已有 `UserManagementUITest.php`（index/create/show Inertia）。Departments 缺對等測試，Phase 2B 前端修復後仍無頁面級回歸保護。

---

## 目標

1. 新增 `tests/Feature/DepartmentPagesTest.php`（Pest）。
2. 覆蓋 Departments web resource 關鍵 Inertia 路徑。
3. 測試數增加；全套仍全過。

---

## 範圍內

### Task 1：新增 DepartmentPagesTest

建議測試案例（依實際 controller 調整）：

- [ ] GET `/departments` → `Departments/Index`，含 `departments` 分頁 props
- [ ] GET `/departments/create` → `Departments/Create`
- [ ] POST `/departments` 建立成功 redirect
- [ ] GET `/departments/{id}` → `Departments/Show`
- [ ] GET `/departments/{id}/edit` → `Departments/Edit`
- [ ] 未登入 guest redirect `/login`
- [ ] org scoping：若 controller 有過濾，assert 只看見同 org 資料

參考 factory：`Department::factory()`、`OrganizationSetting::factory()`、`User::factory()`。

### Task 2：可選補強 Users

- [ ] 若 `UserManagementUITest` 缺 Show/Edit Inertia assert，補 1–2 案例（小改動即可）。

### Task 3：驗證

- [ ] `php artisan test tests/Feature/DepartmentPagesTest.php`
- [ ] `php artisan test` 全過

---

## 範圍外

| 項目 | 階段 |
|------|------|
| Layout 遷移 | Phase 3B |
| Pest Browser | Phase 3G（可選） |
| API 測試重寫 | 保留現有 DepartmentManagementTest |

---

## Exit Criteria

- [ ] 新測試檔 ≥ 5 個 meaningful cases
- [ ] 全套 tests 全過
- [ ] `progress.md` 附測試計數（修前/修後）

---

## 回報方式

完成後填寫 [`progress.md`](./progress.md)，交協調者 review。
