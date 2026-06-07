# Phase 3F：響應式 / 行動版審查

| 項目 | 內容 |
|------|------|
| **階段** | Phase 3F |
| **狀態** | ✅ 已驗收 |
| **協調者** | Cursor |
| **前置** | 建議 3B 完成後（Layout 統一後審查較準）；可與 3E 並行 |
| **前置閱讀** | `docs/07-roadmap.md` Phase 3 |

---

## 背景

Phase 3 目標包含 **mobile/responsive review**。目前未系統性檢查以下高流量頁在 `< lg` / `< md` 視窗的可用性：

- Dashboard（`dashboard.tsx`、`components/dashboard/*`）
- Forms（`Forms/Index`、`Forms/Show`、`DynamicForm`）
- Workflows（`workflows/Index`、`workflows/Show`、`workflows/Monitor`）

AppHeader 已有 mobile Sheet 選單；各頁內容區可能仍有水平溢出、表格無 scroll、按鈕重疊等問題。

---

## 目標

1. 在 **375px（iPhone SE）** 與 **768px（tablet）** 寬度下審查上述頁面。
2. 修復**明顯** layout 問題（overflow、不可點擊、文字截斷無法閱讀）。
3. 不追求 Phase 4 的 PWA / mobile-first 重設計。

---

## 範圍內

### Task 1：審查清單

在 `progress.md` 填寫每頁結果（✅ / ⚠️ / ❌）：

| 頁面 | 375px | 768px | 問題摘要 |
|------|-------|-------|----------|
| /dashboard | | | |
| /forms | | | |
| /forms/{id} | | | |
| /workflows | | | |
| /workflows/monitor | | | |

使用 Chrome DevTools device mode 或瀏覽器 resize；**不需** Pest Browser。

### Task 2：CSS 修復（依審查結果）

常見修法（僅在發現問題時套用）：

- [ ] 寬表格加 `overflow-x-auto` wrapper
- [ ] flex 改 `flex-col` + `gap-*` on small screens（`sm:` / `md:` breakpoints）
- [ ] 過長 title 用 `truncate` 或 `break-words`
- [ ] Monitor 操作按鈕 stack vertically on mobile

**限制：** 只改與問題直接相關的 class；不 refactor 整頁。

### Task 3：驗證

- [ ] `npm run types`、`npm run build`
- [ ] `php artisan test` 全過（應無 PHP 變更）

---

## 範圍外

| 項目 | 階段 |
|------|------|
| Pest Browser 自動化 | Phase 3G（可選） |
| 全新 mobile navigation | Phase 4 |
| Users/Departments 響應式 | 3B 完成後可順手修，非必須 |

---

## Exit Criteria

- [ ] progress.md 含完整審查表格
- [ ] 所有 ❌ 項目已修或記錄為已知限制
- [ ] build 通過

---

## 回報方式

完成後填寫 [`progress.md`](./progress.md)，交協調者 review。
