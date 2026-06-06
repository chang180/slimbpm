# Phase 1A Progress Report

> **執行者填寫本文件。協調者負責驗收。**

| 項目 | 內容 |
|------|------|
| **階段** | Phase 1A — TypeScript 基線與路由命名衝突 |
| **執行者** | Claude Sonnet 4.6 |
| **狀態** | ☑️ 已驗收 |
| **開始時間** | 2026-06-06 |
| **完成時間** | 2026-06-06 |

---

## 完成項目 checklist

對照 `plan.md` Exit Criteria：

- [x] Web/API route names 無衝突
- [x] Wayfinder workflows route TS 衝突已消失
- [x] auth / 2FA `.form()` 錯誤已消失
- [x] `php artisan test` 全過
- [x] `npm run build` 通過
- [x] `progress.md` 含修前/修後 typecheck 數字

---

## 變更摘要

- **`routes/api.php`**：為所有 API v1 resources（`forms`, `workflows`, `departments`, `organizations`, `users`, `workflow-instances`）及額外 workflow 路由（`duplicate`, `export`, `import`, `steps.update`）加上明確的 `api.*` 前綴名稱，消除與 web route 的命名衝突。
- **`php artisan wayfinder:generate`**：重新生成 Wayfinder routes。API routes 移入 `resources/js/routes/api/` 子目錄，web routes 保持原位。`routes/workflows/index.ts` 與 `routes/forms/index.ts` 的重複 export 問題已解決。
- **`resources/js/components/two-factor-recovery-codes.tsx`**：將 `regenerateRecoveryCodes` 從 `@/routes/two-factor`（無 `.form()`）改為 `RecoveryCodeController` 從 `@/actions/Laravel/Fortify/Http/Controllers/RecoveryCodeController`。
- **`resources/js/components/two-factor-setup-modal.tsx`**：將 `confirm` 改為 `ConfirmedTwoFactorAuthenticationController` 從 actions。
- **`resources/js/pages/auth/confirm-password.tsx`**：將 `store` 改為 `ConfirmablePasswordController` 從 actions。
- **`resources/js/pages/auth/two-factor-challenge.tsx`**：將 `store` 改為 `TwoFactorAuthenticatedSessionController` 從 actions。
- **`resources/js/pages/settings/two-factor.tsx`**：將 `disable`、`enable` 改為 `TwoFactorAuthenticationController` 從 actions（此檔案不在原計畫列表但同屬根因）。

---

## 驗證結果

### 修前 baseline

```
176 errors（依 plan.md 背景說明）
```

### 修後

```bash
php artisan test
# Tests: 209 passed (1018 assertions)
# Duration: 111.46s

npm run build
# ✓ built in 4.62s（無錯誤）

npm run types
# 164 errors（較修前 176 減少 12）
# auth/2FA .form() 相關錯誤：0
# workflows/index.ts TS2345 衝突：0
# 剩餘錯誤主要在 Forms/Index.tsx（Phase 1B）、Users/Edit.tsx（Phase 2）、
# Dashboard（Phase 1C）、Organization（Phase 1D）

php vendor/bin/pint --dirty
# Fixed: routes/api.php（fully_qualified_strict_types, ordered_imports）
```

### route:list 抽查

```
php artisan route:list --name=forms
  api/v1/forms → api.forms.index / api.forms.store
  api/v1/forms/{form} → api.forms.show / api.forms.update / api.forms.destroy
  forms → forms.index / forms.store / forms.create ...

php artisan route:list --name=api.forms
  （同上 api.* 路由）
```

Web `forms.*` 與 API `api.forms.*` 無同名衝突。`workflows.*` / `api.workflows.*` 同。

---

## 與 plan 的偏差

`resources/js/pages/settings/two-factor.tsx` 不在 plan 原列的 4 個檔案中，但有相同的 `.form()` TS2339 錯誤（`disable.form()`, `enable.form()`）。因屬同一根因且修改極小，一併修復。已記錄於此。

---

## 阻塞 / 需人類決策

無。

---

## 執行者自評

- [x] 我確認未修改 plan 範圍外的模組（Forms 頁面重構、Dashboard、Organization 等）
- [x] 我確認未手改 Wayfinder 生成檔作為永久解法（routes 重新生成，非手動修改）
- [x] 我確認 progress 中的測試輸出為實際執行結果

**備註：** Wayfinder 的 `vite.config.ts` 中設有 `routes: false`（僅對 Vite plugin HMR 有效），artisan `wayfinder:generate` 不受此設定影響，可正常執行。

---

## 協調者驗收欄（執行者勿填）

| 項目 | 結果 |
|------|------|
| 驗收日期 | 2026-06-06 |
| 驗收結果 | ☑️ **通過** |
| 修正指示 | 無 |

### 協調者驗證紀錄

獨立重跑結果與 progress 一致：

- `php artisan test` → 209 passed / 1018 assertions
- `npm run build` → 通過
- `npm run types` → **164 errors**（修前 176，減 12）
- auth/2FA `.form()` TS2339 → **0**
- `workflows/index.ts` TS2345 → **0**
- `resources/js/routes/forms/index.ts` 現指向 Web `FormController`（`/forms`）
- API routes 分離至 `resources/js/routes/api/forms/`
- `routes/api.php` 已加 `api.*` 前綴

**備註：** `settings/two-factor.tsx` 一併修復屬合理偏差，接受。

**後續：** Phase 1B plan 已撰寫 → `.ai-dev/tasks/phase-1b-forms/plan.md`
