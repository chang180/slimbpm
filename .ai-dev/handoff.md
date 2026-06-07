# SlimBPM 開發 Handoff

> 中文交接文件，供專案負責人掌握狀況。  
> **技術規格與模組狀態以 `docs/` 為準（英文）；本文件只記錄協調決策與短期交接。**

---

## 最後更新：2026-06-07（今日收工 · 3.5E 表單流程待續）

**遠端基線：** `main` @ `8cc4ed5`（表單 design 路由 + metadata 修正 + 文件標記，已推送）

---

## 給下次開工的第一眼（請先讀這段）

**表單模組在自動化測試上標為 Green，但產品上「表單還沒做好」。**

目前使用者實際走 `/forms/create` → 詳情 → 「開始設計表單」時，進入的是 **canvas 原型設計器**，操作體驗差、難以建立可用表單。建立表單之後的 **設計 → 填寫/預覽 → 提交 → 看結果** 整條動線，也**尚未**逐段驗收與打磨。

因此：

- **不要**因為 `FormPagesTest` 全過，就假設 Forms 可以接工作流或進 Phase 4。
- **不要**把「表單設計器 UX v2」理解成 3.5E **之後**的獨立大項；它是 **3.5E 底下的子計畫**。
- **3.5E 尚未完成** — 原定的 staging smoke 還沒跑，表單全流程收斂也剛確認要納入 3.5E。

---

## 今日停點（2026-06-07）

| 已完成 | 說明 |
|--------|------|
| 表單 metadata 修正 | 分類下拉、標籤建議、`is_public`、日期、`creator_name` 等 |
| Design 路由接線 | `GET /forms/{id}/design` + `Forms/Design.tsx` 可存 `definition` |
| 手動試用回饋 | 設計器操作「一整個很奇怪」— 確認原型 UX 不可交付 |
| 決策 | 表單問題歸 **3.5E 項下**，非 3.5 結案後才處理 |
| Git | commit `8cc4ed5` 已 push |

| 未做 / 下次繼續 | 說明 |
|-----------------|------|
| 3.5E staging smoke | 尚未依 `08-deployment.md` 建環境、填 checklist |
| 表單欄位設計器 UX | 見 3.5E-2，[`forms-designer-ux-v2/plan.md`](./tasks/forms-designer-ux-v2/plan.md) |
| 建立後全流程 | 設計器之外，show / submit / results 等動線可能還需修（範圍待 3.5E-2 執行時盤點） |

---

## Phase 3.5 進度總覽

**主規格：** [`.ai-dev/tasks/phase-3.5-mvp-convergence/plan.md`](./tasks/phase-3.5-mvp-convergence/plan.md)  
**執行紀錄：** [`.ai-dev/tasks/phase-3.5-mvp-convergence/progress.md`](./tasks/phase-3.5-mvp-convergence/progress.md)

| 子項 | 狀態 |
|------|------|
| 3.5A Department org scoping | ✅ |
| 3.5B 模組 Yellow → Green | ✅ |
| 3.5C Demo 殘留清理 | ✅ |
| 3.5D Flaky test 修復 | ✅ |
| **3.5E MVP 上線前驗證** | ⏳ **進行中（未結案）** |

### 3.5E 項下計畫

3.5E 不只是「部署到 staging 點一遍」，而是 **上線前最後一輪實際可用性驗證**，表單是目前的最大缺口。

#### 3.5E-1 · Staging 部署與 smoke checklist

- 依 [`docs/08-deployment.md`](../docs/08-deployment.md) 建 staging（或記錄 blocker）
- 手動走：login · dashboard · create form · start workflow · approve · reports index
- 結果寫入 [`phase-3.5-mvp-convergence/progress.md`](./tasks/phase-3.5-mvp-convergence/progress.md)

**注意：** 在 3.5E-2 完成前，smoke 裡的「create form」只能驗證 **路由與資料有存**，不能代表 **表單設計可用**。

#### 3.5E-2 · 表單建立後全流程收斂（當前開發重點）

使用者動線（理想）：

```
/forms/create（基本資訊）
    → /forms/{id}/design（欄位設計）   ← 現況：原型 UX，實質未完成
    → /forms/{id}/submit（填寫/預覽）  ← 待與設計結果對齊、逐段驗收
    → /forms/{id}/results（結果）      ← 同上
    → （工作流引用表單）               ← 依賴上面先有可用表單
```

| 步驟 | 規格 / 備註 |
|------|-------------|
| 欄位設計器 UX v2 | [`tasks/forms-designer-ux-v2/plan.md`](./tasks/forms-designer-ux-v2/plan.md) — **3.5E-2 第一步** |
| 建立後動線盤點 | 設計器完成後，逐頁試 show / submit / results，缺的開子項修 |
| `/form-builder` | localStorage demo；UX v2 穩定後 redirect 或移除 |

**Phase 3.5 結案條件（更新理解）：** 3.5E-1 checklist 有紀錄 **且** 3.5E-2 表單全流程達可手動驗收標準。  
**Phase 4** 應在 **3.5E 全部完成** 後再開。

---

## 表單模組：測試 Green ≠ 產品完成

| 面向 | 現況 |
|------|------|
| 自動化測試 | `FormPagesTest`、`FormTemplateMetadataTest` 等通過；262 tests 全過 |
| API / 路由 / 持久化 | CRUD、design 路由、`definition` 可 PUT 儲存 |
| **欄位設計（產品）** | ❌ 原型 canvas，難以建立多欄位表單 |
| **建立後動線（產品）** | ❓ 未系統性驗收；可能有 show/submit/results 不一致 |
| 模組表上判定 | `03-module-status.md` 寫 **Green (technical)** — 僅代表後端與測試，**不代表可交付** |

`EndToEndWorkflowFeatureTest` 能跑通，是因為測試用 **factory 假資料** 建表單，**不是**走真實 UI 設計流程 — 不能當作「表單 UI 已 OK」的證據。

---

## 已具備、且與表單無關的核心能力

- **262 tests** 全過（257 Feature/Unit + 5 Browser）· TS 0 errors
- 多租戶 org scoping：Department、User、Form index 等
- 工作流引擎、設計器、監控（模組本身 Green）
- 部署指南：[`docs/08-deployment.md`](../docs/08-deployment.md)
- Browser smoke：[`tests/Browser/SmokeTest.php`](../tests/Browser/SmokeTest.php)

技術細節見 [`docs/01-current-state.md`](../docs/01-current-state.md)。

---

## 模組速覽

| 模組 | 判定 | 摘要 |
|------|------|------|
| 身份驗證 / 個人設定 | 🟢 | 可用 |
| 儀表板 | 🟢 | 可用 |
| 組織管理 | 🟢 | 可用 |
| **表單** | 🟡 **實質未完成** | 測試 Green；**設計器與建立後動線是 3.5E-2 缺口** |
| 工作流程 | 🟢 | 引擎 OK；**實務上受表單 UI 拖累** |
| 報表 | 🟢 | 可用 |
| 用戶 / 部門 | 🟢 | 可用 |
| 邀請 / 通知 | 🟢 | 可用 |

詳情見 [`docs/03-module-status.md`](../docs/03-module-status.md)（英文，表單仍標 technical Green — 以本 handoff 的產品判斷為準）。

---

## 下次開工建議步驟

1. 讀 [`tasks/forms-designer-ux-v2/plan.md`](./tasks/forms-designer-ux-v2/plan.md)
2. 從 **3.5E-2 欄位設計器 UX** 開工（列表式/區段式 builder，取代 canvas 原型）
3. 設計器可手動建多欄位表單後，**逐段走** submit → results，缺的記入 3.5E-2 子項
4. 表單動線 OK 後，再跑 **3.5E-1 staging smoke**，填 `progress.md`
5. 3.5E 結案 → 更新本文件與 `docs/07-roadmap.md` → 再規劃 Phase 4

**派工模板：**

```text
請依 .ai-dev/handoff.md「3.5E-2」與 tasks/forms-designer-ux-v2/plan.md 執行。
開工前先讀 handoff「給下次開工的第一眼」— 表單產品尚未完成。
完成後填 forms-designer-ux-v2/progress.md 與 phase-3.5-mvp-convergence/progress.md。
```

---

## 協調者工作流

1. 協調者撰寫 / 更新 `plan.md` → [`.ai-dev/tasks/`](./tasks/)
2. 派給執行 AI 依 plan 開發
3. 執行者填 `progress.md` 交回
4. 協調者 review → 更新本文件與 `docs/`

Phase 1–3 封存於 [`.ai-dev/archived/`](./archived/)。

---

## 文件導覽

| 用途 | 路徑 |
|------|------|
| AI / 開發者入口 | [`docs/README.md`](../docs/README.md) |
| 驗證過的事實 | [`docs/01-current-state.md`](../docs/01-current-state.md) |
| 模組現況（英文） | [`docs/03-module-status.md`](../docs/03-module-status.md) |
| 待辦與 blocker | [`docs/04-known-issues-and-backlog.md`](../docs/04-known-issues-and-backlog.md) |
| 路線圖 | [`docs/07-roadmap.md`](../docs/07-roadmap.md) |
| 部署 | [`docs/08-deployment.md`](../docs/08-deployment.md) |
| 任務總覽 | [`tasks/INDEX.md`](./tasks/INDEX.md) |

---

## 驗證指令

```bash
php artisan test                    # 262 passed (257 Feature/Unit + 5 Browser)
npm run types                       # 0 errors
npm run build                       # 前端建置（改動 pages 後必跑）
php artisan test tests/Browser      # 需先 build
```

---

*今日收工。Phase 3.5 尚未結案：3.5E（含表單全流程 3.5E-2）仍是唯一主線，Phase 4 暫不開。*
