# SlimBPM 協調者工作流

本目錄供**人類負責人**與**執行 AI** 協作。技術規格仍以 [`docs/`](../docs/README.md) 為準。

## 角色分工

| 角色 | 負責人 | 產出 |
|------|--------|------|
| **協調者** | Cursor（本 session 的 AI） | 撰寫各階段 `plan.md`、review `progress.md`、更新 `handoff.md` |
| **執行者** | 你派出的其他 AI | 依 `plan.md` 開發，完成後撰寫 `progress.md` 交回 |
| **負責人** | 你 | 派工、決策卡關項、批准 commit |

## 目錄結構

```
.ai-dev/
├── handoff.md              # 協調者維護：整體狀態（中文）
├── README.md               # 本文件
├── archived/               # Phase 1–3 已完成任務（plan + progress）
│   ├── README.md
│   ├── historical/         # 更早期的規劃快照（僅供考古）
│   └── phase-*/
└── tasks/
    ├── INDEX.md            # 任務總覽
    └── phase-3.5-*/        # 進行中
        ├── plan.md
        └── progress.md     # 執行者填寫
```

## 標準流程

```
1. 協調者寫 plan.md
       ↓
2. 你派給執行 AI（附上 plan.md 路徑）
       ↓
3. 執行 AI 依 plan 開發，填寫 progress.md
       ↓
4. 你交回協調者 review
       ↓
5. 協調者驗收 → 更新 handoff / docs → 寫下一階段 plan.md
```

## 派工時請給執行 AI 的指令範本

```text
請依 .ai-dev/tasks/phase-3.5-mvp-convergence/plan.md 執行。
開工前先讀 docs/01-current-state.md 與 docs/03-module-status.md。
完成後填寫同目錄的 progress.md，不要自行宣稱驗收通過。
```

## 驗收標準

協調者 review 時會對照：

- `plan.md` 的 Exit Criteria 是否全部滿足
- `progress.md` 是否附真實指令輸出（非口頭宣稱）
- `php artisan test` 是否仍全過
- 是否擅自擴大 scope 或修改無關檔案

## 目前進行中

見 [`tasks/INDEX.md`](tasks/INDEX.md)。
