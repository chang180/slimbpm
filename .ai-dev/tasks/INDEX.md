# 開發任務總覽

最後更新：2026-06-06（Phase 3B、3C 驗收通過）

## Phase 1–2 ✅

| 階段 | 目錄 | 狀態 |
|------|------|------|
| Phase 1A–1D | [phase-1a](./phase-1a-typescript-baseline/) … [phase-1d](./phase-1d-organization/) | ✅ 已驗收 |
| Phase 2A–2E | [phase-2a](./phase-2a-users/) … [phase-2e](./phase-2e-misc-typescript/) | ✅ 已驗收 |

---

## Phase 3 — 品質與發布準備（進行中）

| 階段 | 目錄 | 優先 | 說明 | 狀態 |
|------|------|------|------|------|
| ~~3A~~ | [phase-3a-organization-wayfinder](./phase-3a-organization-wayfinder/) | P0 | Organization Wayfinder | ✅ 已驗收 |
| ~~3B~~ | [phase-3b-users-departments-layout](./phase-3b-users-departments-layout/) | P1 | Index/Show → AppLayout | ✅ 已驗收 |
| ~~3C~~ | [phase-3c-department-regression-tests](./phase-3c-department-regression-tests/) | P1 | DepartmentPagesTest | ✅ 已驗收 |
| **3D** | [phase-3d-notifications-verification](./phase-3d-notifications-verification/) | P1 | mark-read + 分頁 polish | **可派工** |
| **3E** | [phase-3e-reports-pagination](./phase-3e-reports-pagination/) | P2 | Reports 日期 filter + workflows 分頁 | **可派工** |
| **3F** | [phase-3f-responsive-review](./phase-3f-responsive-review/) | P2 | Dashboard/Forms/Workflows 響應式 | **可派工** |
| **3G** | [phase-3g-deployment-guide](./phase-3g-deployment-guide/) | P2 | `docs/08-deployment.md` | **可派工** |
| 3H | [phase-3h-browser-smoke-optional](./phase-3h-browser-smoke-optional/) | ⚪ | Pest Browser（需批准） | 待批准 |

**基線：** **244 tests** · TS 0 errors

### 建議派工順序

```
3D + 3E 可並行 → 3F → 3G 可隨時
```

### 派工指令範本

```text
請依 .ai-dev/tasks/phase-3d-notifications-verification/plan.md 執行。
完成後填寫同目錄 progress.md，交回協調者 review。
```

---

## 路線圖

[`docs/07-roadmap.md`](../../docs/07-roadmap.md)
