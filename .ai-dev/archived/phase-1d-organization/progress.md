# Phase 1D Progress Report

> **執行者填寫本文件。協調者負責驗收。**

| 項目 | 內容 |
|------|------|
| **階段** | Phase 1D — 組織設定 Scoping、持久化與前端對齊 |
| **執行者** | Claude Sonnet 4.6 |
| **狀態** | ☑️ 已驗收 |
| **開始時間** | 2026-06-06 |
| **完成時間** | 2026-06-06 |

---

## 完成項目 checklist

- [x] Controller 使用 `current_organization`
- [x] Settings / Preferences 持久化
- [x] Stats org-scoped + camelCase
- [x] Organization 頁面改 AppLayout、TS 0 error
- [x] Reports 頁移除假數據
- [x] OrganizationManagementTest 更新
- [x] `php artisan test` 全過

---

## 變更摘要

### 後端
- `OrganizationController`：所有 public 方法改從 `Request $request` 取 `current_organization`；移除 `OrganizationSetting::first()` 與 fallback `create([...])` 邏輯
- `getOrganizationStats(OrganizationSetting $organization)`：改為 org-scoped 查詢（`$orgUserIds` 模式），回傳 camelCase key：`totalUsers`、`totalDepartments`、`totalForms`、`totalWorkflows`、`activeWorkflows`、`recentActivity`（`user` 欄位對應 performer name）
- `updateSettings()`：validate 後 merge 入 `$organization->settings` JSON 並 save
- `updatePreferences()`：validate 後存入 `$organization->settings['preferences']` 子 key 並 save
- `settings()` / `preferences()`：從 DB 讀取並 merge 預設值後回傳 Inertia

### 前端
- `OrganizationSettingsFormData` 型別：新增 `time_format`、`security`、`appearance`，`notifications` 欄位對齊實際送出格式
- `Index.tsx`、`Info.tsx`、`Settings.tsx`、`Preferences.tsx`、`Reports.tsx`：統一改 `<AppLayout>`，移除無效 `user` / `header` props
- 所有 stats key 改 camelCase；`active_users` 改為 `activeWorkflows`；`activity.user_name` 改為 `activity.user`
- `Preferences.tsx`：改用 `router.put()` 解決 TS2353 `data` 問題
- `Reports.tsx`：移除所有假數據（图表假數、效能假數字 120ms/99.9%）；顯示真實 org-scoped 摘要；加 prominent 連結至 `/reports` 報表中心

### 測試
- `test_can_update_organization_settings`：加 DB 持久化斷言
- `test_can_update_organization_preferences`：加 DB 持久化斷言
- 新增 `test_stats_are_scoped_to_current_organization`：驗證 totalUsers 只計算本 org
- 新增 `test_user_cannot_access_other_organization_settings`：驗證 org isolation

---

## 驗證結果

```bash
npm run types 2>&1 | grep "Organization/"
# 修前：20+ 錯誤
# 修後：0 錯誤（Organization pages 全清）

php artisan test tests/Feature/OrganizationManagementTest.php
# 12 passed (98 assertions)

php artisan test
# 223 passed (1135 assertions)

npm run build
# ✓ built in 7.32s

php vendor/bin/pint --dirty
# passed
```

---

## 與 plan 的偏差

無重大偏差。

`recentActivity` 資料來源改為真實 WorkflowHistory + FormSubmission（org-scoped），無假數據。若 org 沒有任何流程/表單記錄，recentActivity 為空陣列，前端顯示「目前尚無活動記錄」空狀態。

---

## 協調者驗收欄（執行者勿填）

| 項目 | 結果 |
|------|------|
| 驗收日期 | 2026-06-06 |
| 驗收結果 | ☑️ **通過** |
| 修正指示 | 無 |

### 協調者驗證紀錄

- `OrganizationSetting::first()` — **已清除**
- Settings/Preferences — 寫入 `$organization->settings` JSON
- Stats — org-scoped + camelCase；`recentActivity` 來自真實 WorkflowHistory/FormSubmission
- Organization TS errors — **0**；全專案 128→**38**
- `Organization/Reports` — 無假 chart/120ms 數字；有 `/reports` 連結
- `php artisan test` — **223 passed**（OrganizationManagementTest 12 passed）
- `npm run build` — 通過

**Phase 1（1A–1D）全部驗收完成。**

**後續：** Phase 2A plan → `.ai-dev/tasks/phase-2a-users/plan.md`
