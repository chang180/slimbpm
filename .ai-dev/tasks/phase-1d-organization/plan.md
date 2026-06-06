# Phase 1D：組織設定 Scoping、持久化與前端對齊

| 項目 | 內容 |
|------|------|
| **階段** | Phase 1D |
| **狀態** | 可派工 |
| **協調者** | Cursor |
| **前置** | Phase 1C 已驗收（2026-06-06） |
| **前置閱讀** | `docs/02-project-structure.md`（org scoping）、`docs/03-module-status.md`（Organization） |

---

## 背景

Organization 模組後端有頁面與路由，但：

1. **`OrganizationController`** 多處使用 `OrganizationSetting::first()`，忽略 `org.access` 注入的 `current_organization`。
2. **`updateSettings()` / `updatePreferences()`** 驗證後只回 JSON，**未寫入** `organization_settings.settings`。
3. **`getOrganizationStats()`** 用全域 `User::count()` 且回傳 **snake_case**，前端 `OrganizationStats` 型別為 **camelCase** → 大量 TS 錯誤。
4. **Organization 頁面** 使用 `<AppLayout user={...} header={...}>`，但 `AppLayout` 不接受 `user` prop。
5. **`Organization/Reports.tsx`** 含硬編假數據（120ms、99.9% 等）。

Organization 相關 TS 錯誤約 **20+**（全專案 128）。

---

## 協調者決策

### Stats 命名

**後端改 camelCase** 對齊 `resources/js/types/index.d.ts` 的 `OrganizationStats`：

```php
[
    'totalUsers' => ...,
    'totalDepartments' => ...,
    'totalForms' => ...,
    'totalWorkflows' => ...,
    'activeWorkflows' => ...,
    'recentActivity' => [...],  // user 欄位對應 activity 的 user_name
]
```

前端 **不要** 再使用 `total_users` 等 snake_case。

### Settings 持久化 schema

存入 `OrganizationSetting.settings` JSON（已有 `array` cast）：

```php
$organization->settings = array_merge($organization->settings ?? [], [
    'timezone' => ...,
    'language' => ...,
    // ... validated settings fields
    'preferences' => [...],  // 或獨立 key 'org_preferences'
]);
$organization->save();
```

讀取時 merge 預設值，避免 null 欄位。

### Organization Reports 頁

**方案 B（最小改動）：**

- 移除硬編 chart 假數據與假效能數字。
- 改顯示 `getOrganizationStats()` 的真實 org-scoped 摘要。
- 加 prominent 連結至 `/reports` 報表中心（完整報表已在該區實作）。

不可留「看起來是真資料其實是假數字」的 UI。

### Layout

Organization 頁面統一改 **`AppLayout`**（參考 Forms / Dashboard），移除無效的 `user` / `header` props；頁面標題用 `<Head>` + 內部 header 區塊。

---

## 目標

1. 所有 OrganizationController 方法使用 `$request->get('current_organization')`。
2. Settings / Preferences 可持久化並在 reload 後保留。
3. Stats org-scoped + camelCase。
4. Organization 頁面 TS errors = 0。

---

## 範圍內

### Task 1：Controller org scoping

**檔案：** `app/Http/Controllers/OrganizationController.php`

- [ ] 所有 public 方法改從 `Request $request` 取 `current_organization`。
- [ ] 移除 `OrganizationSetting::first()` 與 fallback `create([...])` demo 組織邏輯。
- [ ] `getOrganizationStats(OrganizationSetting $organization)` 改 org-scoped（參考 `DashboardController` 的 `$orgUserIds` 模式）。

### Task 2：持久化 settings / preferences

- [ ] `updateSettings`：驗證後 merge 進 `$organization->settings` 並 `save()`。
- [ ] `updatePreferences`：同上（可用 `settings.preferences` 子 key）。
- [ ] `settings()` / `preferences()`：從 DB 讀取 merge 預設值後傳 Inertia。
- [ ] 若前端用 Inertia `router.put`，考慮改回 Inertia redirect + flash，或維持 JSON 但前端要處理 success reload（對照 `Organization/Settings.tsx` 現況）。

### Task 3：前端 Organization 頁面

**檔案：** `resources/js/pages/Organization/*.tsx`

- [ ] 改用 `AppLayout`；移除 `user` prop。
- [ ] 使用 camelCase stats keys（或後端已改則對照確認）。
- [ ] `Preferences.tsx`：修正 `useForm` submit options（TS2353 `data` 問題）。
- [ ] `Reports.tsx`：移除假 chart/metrics；顯示真 stats + 連結 `/reports`。

### Task 4：測試

- [ ] 更新 `tests/Feature/OrganizationManagementTest.php`：
  - settings update 後 DB 有持久化值
  - 不同 org 使用者看不到他 org 的 stats（org isolation）
- [ ] `php artisan test` — 221+ 全過
- [ ] `npm run types` — `resources/js/pages/Organization/**` 0 error
- [ ] `npm run build` 通過
- [ ] `php vendor/bin/pint --dirty`

---

## 範圍外

| 項目 | 階段 |
|------|------|
| 完整 Organization Reports 圖表 | 使用 `/reports/*` |
| 新增 permissions 頁 | Phase 4 |
| Users / Departments TS | Phase 2 |

---

## Exit Criteria

- [ ] Controller 無 `OrganizationSetting::first()`
- [ ] Settings 更新後 reload 仍保留
- [ ] Stats 為 current org 資料且 camelCase
- [ ] Organization 頁面 TS errors = 0
- [ ] `Organization/Reports` 無硬編假數據
- [ ] `php artisan test` 全過
- [ ] `progress.md` 含修前/修後 Organization TS error 數

---

## 建議 Commit 訊息

```
fix: scope organization pages to current org and persist settings
```

---

## 回報方式

完成後填寫 [`progress.md`](./progress.md)，交協調者 review。
