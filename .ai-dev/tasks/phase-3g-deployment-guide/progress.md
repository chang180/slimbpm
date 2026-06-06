# Phase 3G Progress Report

> **執行者填寫本文件。協調者負責驗收。**

| 項目 | 內容 |
|------|------|
| **階段** | Phase 3G — 生產部署指南 |
| **執行者** | Codex |
| **狀態** | ✅ 完成（待協調者驗收） |

---

## 新增 / 更新文件

| 路徑 | 說明 |
|------|------|
| `docs/08-deployment.md` | 新增 staging / production deployment guide，涵蓋 env vars、build、queue、scheduler、mail、DB migration、web server、SSR、post-deploy verification、rollback、known limitations |
| `docs/README.md` | Read order 加入 `08-deployment.md` |
| `docs/05-documentation-inventory.md` | Canonical documents inventory 加入 deployment guide |

---

## 驗證

- [x] `docs/08-deployment.md` 存在
- [x] 文件章節數 ≥ 8（實際 13 個 numbered sections）
- [x] `docs/README.md` 已連結 `08-deployment.md`
- [x] `docs/05-documentation-inventory.md` 已列出 `08-deployment.md`
- [x] Artisan 指令存在性已抽查：`config:cache`、`route:cache`、`view:cache`、`migrate`、`queue:work`、`queue:restart`、`schedule:run`、`storage:link`、`inertia:*`
- [x] 文件明確標註 SlimBPM 仍約 60% 完成，不宣稱 production-ready

---

## 協調者驗收欄（執行者勿填）

| 項目 | 結果 |
|------|------|
| 驗收日期 | 2026-06-06 |
| 驗收結果 | ✅ 通過 |
| 協調者備註 | `docs/08-deployment.md` 13 章節；README/inventory 已連結；誠實標註 ~60% 完成度。 |
