# Phase 1A：TypeScript 基線與路由命名衝突

| 項目 | 內容 |
|------|------|
| **階段** | Phase 1A |
| **狀態** | 可派工 |
| **協調者** | Cursor |
| **預估影響** | 主要 `routes/`、`resources/js/routes/`（Wayfinder 生成）、auth/2FA 前端 |
| **前置閱讀** | `docs/01-current-state.md`、`docs/02-project-structure.md`、`docs/04-known-issues-and-backlog.md` |

---

## 背景

`npm run types` 目前有 **176 個錯誤**。其中 Phase 1A 要解的是**根因級**問題，不是把全部 176 個修完：

1. **Web 與 API 路由同名**，Wayfinder 生成的 `resources/js/routes/forms/`、`resources/js/routes/workflows/` 指向 API，與 Web Inertia 頁面預期不符。
2. **Fortify auth 頁面的 `.form()` helper** 在 Inertia 3 / Wayfinder 下型別不存在（約 5 處）。

Forms、Dashboard、Organization 頁面的大量型別錯誤屬 **Phase 1B–1D**，本階段**不要**一併重構那些頁面。

---

## 目標

1. 消除 `forms.*`、`workflows.*`、`departments.*` 的 Web/API 路由名稱衝突。
2. 重新生成 Wayfinder routes，使 `resources/js/routes/workflows/index.ts` 不再出現 template vs instance 參數型別衝突。
3. 修復 auth / 2FA 相關 `.form()` 型別錯誤。
4. 確保現有 PHP 測試仍全數通過。

---

## 範圍內

### Task 1：API 路由加 `api.` 前綴

**問題：** `routes/api.php` 的 `apiResource` 產生 `forms.index`、`workflows.index` 等名稱，與 `routes/web.php` 的 `forms.*`、`workflows.*` 衝突。

**參考做法：** Web 的 users 已用 `web.users.*` 前綴（見 `routes/web.php` L96–106）；API invitations 已用 `api.invitations.*`（見 `routes/api.php` L56–59）。

**要求：**

- [ ] 為 API v1 的 `forms`、`workflows`、`departments`（及必要時 `organizations`、`users`）設定明確的 `api.*` route names。
- [ ] 額外的 workflow 路由（`workflows.duplicate`、`workflows.export`、`workflows.import`）一併改名，例如 `api.workflows.duplicate`。
- [ ] 搜尋並更新**所有** PHP 測試、Controller、前端中引用舊 API route name 的地方。
- [ ] **不要**修改 Web route names（`forms.*`、`workflows.*` 保留給 Inertia 頁面）。

**驗證：**

```bash
php artisan route:list --name=forms
php artisan route:list --name=workflows
php artisan route:list --name=api.forms
php artisan route:list --name=api.workflows
```

預期：Web 與 API 名稱不再重疊。

### Task 2：重新生成 Wayfinder routes

- [ ] 執行專案慣用的 Wayfinder 生成指令（通常 `npm run build` 或 `php artisan wayfinder:generate`，請先查 `package.json` / vite config）。
- [ ] 確認 `resources/js/routes/workflows/index.ts` 不再有 `workflow` vs `workflowInstance` 參數型別衝突錯誤。
- [ ] **不要**手改 generated 檔案當永久解法；若必須暫改，在 `progress.md` 說明原因。

### Task 3：修復 auth / 2FA 的 `.form()` 型別錯誤

已知錯誤檔案：

- `resources/js/components/two-factor-recovery-codes.tsx`
- `resources/js/components/two-factor-setup-modal.tsx`
- `resources/js/pages/auth/confirm-password.tsx`
- `resources/js/pages/auth/two-factor-challenge.tsx`

**要求：**

- [ ] 對照專案內其他已正常運作的 `<Form>` 或 `useForm` 用法（例如 `resources/js/pages/settings/*`）。
- [ ] 移除或替換不存在的 `.form()` helper，改用 Inertia 3 建議寫法。
- [ ] 保持原有 UX 行為不變。

### Task 4：回歸測試

- [ ] `php artisan test` — 必須 209 tests 全過（或更多，不可減少）。
- [ ] `npm run build` — 必須通過。
- [ ] `npm run types` — 記錄修前/修後錯誤數；本階段**不要求**全綠，但 auth/2FA 與 workflows route 相關錯誤應消失。
- [ ] 若有 PHP 變更：`php vendor/bin/pint --dirty`

---

## 範圍外（留給後續階段）

| 項目 | 負責階段 |
|------|----------|
| `Forms/Index.tsx` 把 paginated data 當 route helper 用 | Phase 1B |
| `Forms/Show.tsx`、`Submit.tsx` 缺 `route` import | Phase 1B |
| Dashboard props / `useDashboardActions` | Phase 1C |
| Organization prop 命名 (`total_users` vs `totalUsers`) | Phase 1D |
| Departments JSX namespace 錯誤 | Phase 2 |
| Users Select import 錯誤 | Phase 2 |

**若發現必須動到上述檔案才能完 Task 1–3，在 progress.md 說明並最小化改動。**

---

## Exit Criteria（協調者驗收用）

- [ ] `php artisan route:list` 顯示 Web `forms.*` / `workflows.*` 與 API `api.forms.*` / `api.workflows.*` 無同名衝突
- [ ] `resources/js/routes/workflows/index.ts` 的 TS2345 衝突錯誤消失
- [ ] auth / 2FA 四個檔案的 `.form()` TS2339 錯誤消失
- [ ] `php artisan test` 全過
- [ ] `npm run build` 通過
- [ ] `progress.md` 已填寫，含修前/修後 `npm run types` 錯誤數

---

## 建議 Commit 訊息

```
fix: resolve API/web route name collisions and auth form typing
```

PHP 路由與前端型別修復可同一 commit；若改動大，可拆兩個 commit。

---

## 回報方式

完成後編輯同目錄 [`progress.md`](./progress.md)，並告知負責人交協調者 review。**不要自行更新 `handoff.md` 或宣稱驗收通過。**
