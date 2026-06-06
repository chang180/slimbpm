# Phase 3H：Pest Browser 煙霧測試（可選）

| 項目 | 內容 |
|------|------|
| **階段** | Phase 3H |
| **狀態** | ⬜ 待批准（需負責人同意加依賴） |
| **協調者** | Cursor |
| **前置** | Phase 3A–3F 大部分完成 |
| **前置閱讀** | `docs/04-known-issues-and-backlog.md`（P3 Browser E2E） |

---

## 背景

目前策略為 **Feature + Inertia** 低成本測試。Pest Browser 可補 JS 互動（notification bell、mobile menu）但需新增 dev 依賴：

```bash
composer require pestphp/pest-plugin-browser --dev
npm install playwright@latest
npx playwright install
```

**本階段預設不派工**，除非負責人明確批准。

---

## 目標（若批准）

1. 安裝 Pest Browser + Playwright。
2. 新增 `tests/Browser/SmokeTest.php` — 3–5 條 smoke：
   - 登入後 dashboard 無 JS error
   - /forms、/workflows 可載入
   - notification bell 可開啟（不要求 mark-read）
3. 更新 `docs/06-development-workflow.md` 執行方式。

---

## Exit Criteria

- [ ] 負責人書面批准（progress 註記）
- [ ] smoke tests 在 CI/本地可跑
- [ ] 不取代現有 Feature tests

---

## 回報方式

批准後填寫 [`progress.md`](./progress.md)。
