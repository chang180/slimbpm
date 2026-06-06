# Phase 3A：Organization 頁面 Wayfinder 接線

| 項目 | 內容 |
|------|------|
| **階段** | Phase 3A |
| **狀態** | ✅ 已驗收 |
| **協調者** | Cursor |
| **前置** | Phase 2E 已驗收 |
| **前置閱讀** | `docs/03-module-status.md`（Organization）、`docs/06-development-workflow.md` |

---

## 背景

Organization 四頁仍使用 `@/lib/route.ts` 的 `route()` helper，但該檔**只定義** `company.*`、`dashboard`、`portal.*` 等少數路由。

實際呼叫（會回傳 `#` 或 console.warn）：

| 檔案 | 使用的 route name |
|------|-------------------|
| `Organization/Index.tsx` | `organization.settings`, `.info`, `.preferences`, `.reports` |
| `Organization/Settings.tsx` | `organization.settings.update` |
| `Organization/Preferences.tsx` | `organization.preferences.update` |
| `Organization/Reports.tsx` | `reports.index`, `reports.user-activity`, … |

後端路由已定義於 `routes/web.php`（`organization.*`、`reports.*`）。應改為 **Wayfinder** `@/routes/organization`、`@/routes/reports`，與 Forms/Invitations 一致。

---

## 目標

1. Organization 頁面導航與表單 submit 使用正確 URL（不再 `#`）。
2. 移除或縮小 Organization 對 `@/lib/route.ts` 的依賴。
3. 補強 Feature/Inertia 測試證明 settings/preferences PUT 可達。

---

## 範圍內

### Task 1：Wayfinder 整合

**檔案：** `resources/js/pages/Organization/*.tsx`

- [ ] 執行 `php artisan wayfinder:generate`（若本地無 `resources/js/routes/`）。
- [ ] `Index.tsx` — 連結改用 `@/routes/organization` 匯出。
- [ ] `Settings.tsx` — `put()` 目標改用 Wayfinder URL（`organization.settings.update` 或等價）。
- [ ] `Preferences.tsx` — 同上。
- [ ] `Reports.tsx` — 報表連結改用 `@/routes/reports`。
- [ ] 確認 `npm run types` 仍 0 errors。

### Task 2：測試

**檔案：** `tests/Feature/OrganizationManagementTest.php`（或新增 `OrganizationPagesTest.php`）

- [ ] GET `/organization/settings`、`/organization/preferences` assert Inertia component。
- [ ] PUT settings/preferences 成功路徑（至少 happy path）。
- [ ] `php artisan test tests/Feature/OrganizationManagementTest.php`（或新檔）全過。

### Task 3：驗證

- [ ] `npm run build`
- [ ] `php artisan test` 全過（236+）

---

## 範圍外

| 項目 | 階段 |
|------|------|
| Users/Departments Layout | Phase 3B |
| 擴充 `@/lib/route.ts` 當長期解法 | 不建議；優先 Wayfinder |
| auth 頁的 `@/lib/route.ts`（RegisterCompany 等） | 維持現狀，除非順手且範圍小 |

---

## Exit Criteria

- [ ] Organization 頁無 `route('organization.*')` 呼叫 `@/lib/route.ts`
- [ ] 相關 Feature tests 全過
- [ ] `progress.md` 附測試指令輸出

---

## 回報方式

完成後填寫 [`progress.md`](./progress.md)，交協調者 review。
