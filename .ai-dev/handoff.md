# SlimBPM 開發 Handoff 文件

> 此文件記錄每次開發進度的交接狀態，供下次接手時快速掌握背景。
> **每完成一個功能區塊就更新此文件。**

---

## 📅 最後更新：2026-06-06（立即任務改為建立 AI-first 開發文件庫）

---

## ⚠️ 目前真實狀態 (2026-06-06 盤點後)

> 先前 handoff 寫成「核心業務功能 100% / 報表系統 100%」不準確。
> 目前比較接近「後端多數 CRUD/API 已有雛形，前端多處仍是 demo、壞連結或未接 API」。

### 核心功能盤點

| 功能 | 後端 | 前端 | 測試 | 目前判定 |
|------|------|------|------|---------|
| 基礎架構 / 身份驗證 | 🟡 | 🟡 | ✅ | Fortify/Inertia 基本可用，但 `npm run types` 顯示 2FA/Wayfinder form helper 型別錯誤 |
| 用戶管理 | 🟡 | 🔴 | 🟡 | Controller/API 有，但 `Users/Create.tsx`、`Users/Edit.tsx` 缺 Select imports/type errors |
| 部門管理 | 🟡 | 🟡 | 🟡 | 基本頁面/API 有，TypeScript 有 JSX namespace 錯誤 |
| 組織設定 / 偏好 | 🔴 | 🔴 | 🟡 | Controller 使用 `OrganizationSetting::first()`，未使用 current org；update 只回 JSON，不持久化；前端型別大量不匹配 |
| 組織報表 (`/organization/reports`) | 🔴 | 🔴 | ❌ | 前端含模擬圖表、硬編效能數字、匯出只 `console.log` |
| 表單列表 / 建立 / 顯示 / 提交 / 結果 | 🟡 | 🔴 | 🟡 | 後端有，但前端多處使用錯誤/缺失 route helper；`Forms/Edit.tsx` 不存在但 controller render `Forms/Edit` |
| 獨立表單設計器 (`/form-builder`) | 🔴 | 🔴 | ❌ | localStorage demo，`alert()` 儲存，不接 `form_templates` |
| 工作流程設計器 | 🟡 | 🟡 | ✅ | API 可建立 template，ReactFlow 設計器可存；但 Wayfinder route type 有衝突 |
| 工作流程執行 / 審批 | 🟡 | 🟡 | ✅ | API/頁面可跑主要流程；dashboard 上的審批快捷操作只是 `console.log` |
| 工作流程監控 | 🟡 | 🟡 | ✅ | admin/manager monitor 有實作與測試，需再確認前端 cancel/suspend/resume UX |
| 成員邀請系統 | 🟡 | 🔴 | 🟡 | `/invitations` 頁面/API 有；dashboard 的邀請元件只接 `useDashboardActions` console.log |
| 通知系統 | 🟡 | 🟡 | 🟡 | 通知中心/下拉/API 有，尚需實測全部 mark-read/filter 行為 |
| 儀表板 | 🟡 | 🔴 | 🟡 | 後端 stats/chart 使用真資料；前端 quick actions 多個壞連結與假 handler |
| 個人設定 / 2FA | 🟡 | 🟡 | 🟡 | 後端/頁面有測試，但 TypeScript 顯示 Wayfinder `.form()` helper 型別錯誤 |

### 報表系統盤點

| 報表頁面 | 狀態 |
|---------|------|
| `/reports` 報表中心 | 🟡 真資料 + org scoping 測試已補 |
| `/reports/user-activity` | 🟡 Controller 真資料，前端需互動/匯出手動驗證 |
| `/reports/workflow-performance` | 🟡 真資料 + org scoping 測試已補 |
| `/reports/system-stats` | 🟡 Controller 真資料，前端需互動/匯出手動驗證 |
| `/reports/department-analysis` | 🟡 真資料 + org scoping 測試已補 |
| CSV 匯出 (ExportService) | ✅ 已有 org scoping 測試 |

### 測試統計
- **205 個測試 / 970 個斷言** — 全部通過 (100%)
- 執行時間約 7.71 秒

### 2026-06-06 本段新增
- 新增 `tests/Feature/EndToEndWorkflowFeatureTest.php`
  - 覆蓋已驗證組織使用者建立表單
  - 驗證 Web Inertia 表單詳情頁
  - 驗證工作流程啟動頁可列出同組織 active/current template
  - 透過 API 啟動工作流程、指定待審批 step、在 `/workflows` 顯示 my/pending workflow
  - 透過 step API 完成審批，確認 instance 轉為 `completed` 並寫入 `workflow_completed` history
- 新增 `tests/Feature/ReportsPagesTest.php`
  - 覆蓋 `/reports` 報表中心 summary 的 org scoping
  - 覆蓋 `/reports/workflow-performance` 的 workflow stats、template usage 與跨組織隔離
  - 覆蓋 `/reports/department-analysis` 的部門 row metrics、submissions/workflows 與跨組織隔離

---

## 🔧 目前已知問題 / 待修正

### 高優先級問題
1. **前端 TypeScript 未通過**
   - `npm run types` 失敗，涵蓋 Dashboard、Forms、Organization、Users、2FA、Wayfinder generated routes。
   - `npm run build` 仍可通過，因 Vite build 不等同 typecheck。
2. **Dashboard 多個假操作**
   - `resources/js/hooks/useDashboardActions.ts` 幾乎全是 `console.log`，包含邀請、流程啟動/查看/編輯/審批。
   - `QuickActions.tsx` 連到不存在路由：`/workflows/instances`、`/organization/permissions`、`/organization/backup`、`/organization/export`。
   - `WorkflowMenu.tsx` 連到不存在路由：`/workflows/instances`、`/workflows/reports`。
3. **表單前端路由/頁面缺口**
   - `resources/js/lib/route.ts` 只支援少數 route name，但 Forms pages 呼叫 `route('forms.*')`。
   - `Forms/Show.tsx`、`Forms/Submit.tsx` 使用 `route()` 但沒有正確 import。
   - `resources/js/pages/Forms/Edit.tsx` 不存在，`FormController@edit` 會 render missing component。
   - `/form-builder` 是 localStorage demo，未接後端。
4. **組織管理多處是 demo**
   - `OrganizationController` 多處使用 `OrganizationSetting::first()`，沒有 current org scoping。
   - `updateSettings()`、`updatePreferences()` 驗證後只回 JSON，沒有持久化。
   - `Organization/Reports.tsx` 使用模擬 chart data、硬編「120ms / 99.9% / 1,234」等假數據。
5. **Wayfinder / route name 衝突**
   - `api/v1/forms` 與 `forms`、`api/v1/workflows` 與 `workflows` 等同名 route 導致 generated routes 混雜，TypeScript 報錯。
   - Feature test 裡已遇到 `route('forms.show')` 解析到 API JSON 的問題。

### Pest Browser E2E 前置條件
目前專案尚未安裝 `pestphp/pest-plugin-browser`，因此真正的 Pest 4 Browser `visit()` 測試尚不能加入/執行。
若要開始 `tests/Browser/`，需先取得依賴變更同意，並安裝：
- `composer require pestphp/pest-plugin-browser --dev`
- `npm install playwright@latest`
- `npx playwright install`

---

## 📋 下一步開發順序

### 🚨 立即任務：建立可查詢的開發現狀文件庫

> 目前先暫停功能修復。原因：現有 handoff、README、`.ai-dev/` 文件互相矛盾，且多處高估完成度，導致人類與 AI 都難以掌握真實進度。

立即工作項目：

1. **盤點現在專案結構**
   - Laravel backend：controllers、models、requests、services、routes、tests。
   - React frontend：pages、components、hooks、generated routes、layout。
   - 標記哪些目錄是正式程式、哪些是 demo/歷史/生成檔。
2. **盤點可讀且可信的文件**
   - `.ai-dev/handoff.md`
   - `.ai-dev/README.md`
   - `.ai-dev/development/*`
   - `.ai-dev/features/*`
   - `.ai-dev/scratch/*`
   - root `README.md`
   - 明確標記「可信現況」「歷史規劃」「過期/不可採信完成度」。
3. **在專案根目錄建立 `docs/`**
   - `docs/README.md`：AI 讀取入口。
   - `docs/01-current-state.md`：目前真實開發狀態。
   - `docs/02-project-structure.md`：專案結構與重要檔案。
   - `docs/03-module-status.md`：各功能模組現況。
   - `docs/04-known-issues-and-backlog.md`：已知問題與修復順序。
   - `docs/05-documentation-inventory.md`：既有文件可信度盤點。
   - `docs/06-development-workflow.md`：後續 AI/人類協作流程。
4. **後續功能開發必須先查 `docs/`**
   - `.ai-dev/` 保留作為歷史與短期交接。
   - `docs/` 作為目前正式可查詢的開發文件庫。

### 🎯 文件庫完成後的後續任務 (暫定)

1. **先修前端可用性阻斷**：Forms、Dashboard、Organization 三大區塊。
2. **表單模組收斂**：`/form-builder` 去留、`Forms/Edit.tsx`、route helper。
3. **Dashboard 快捷操作接真功能**。
4. **組織設定/報表重做成真資料**。
5. **低成本 regression 測試補強**。
6. **行動端響應式審查**。
7. **生產部署文件**。
8. **E2E 瀏覽器測試** (可選)
   - 前置：需先安裝 `pestphp/pest-plugin-browser` 與 Playwright（依賴變更需使用者同意）
   - 僅保留少量 smoke flow：登入 → 建立表單 → 啟動工作流程 → 審批

---

## 🏗️ 重要架構筆記 (接手必讀)

### Org Scoping 模式
`workflow_templates`、`workflow_instances`、`form_templates` **沒有 `organization_id` 欄位**，
必須透過 user 中繼來過濾：

```php
$orgUserIds = User::where('organization_id', $organization->id)->pluck('id');
// 然後用 whereIn：
WorkflowInstance::whereIn('started_by', $orgUserIds)
WorkflowTemplate::whereIn('created_by', $orgUserIds)
FormTemplate::whereIn('created_by', $orgUserIds)
FormSubmission::whereIn('submitted_by', $orgUserIds)
```

### WorkflowInstance 有效狀態
DB CHECK constraint 只允許：`['running', 'completed', 'cancelled', 'suspended']`
**沒有 'pending'**。工廠、測試、Controller 都不能用 'pending'。

### Laravel 分頁器結構
分頁器 JSON 是**扁平結構**，不是巢狀：
- ✅ `instances.total`　❌ `instances.meta.total`
- ✅ `instances.current_page`　❌ `instances.meta.current_page`

### Wayfinder 衝突問題
若 API 和 Web controller 有同名方法，Wayfinder 會在同一個路由檔案產生 duplicate export 錯誤。
**處理方式**：移除那個 import，不要修改 Wayfinder 自動產生的檔案。

### Web/API route name 衝突
`forms.*`、`workflows.*` 同時存在 Web 與 API route name 時，Feature 測試中 `route('forms.show')` / `route('workflows.index')` 可能解析到 API。
測試 Web 頁面請優先使用明確 path，例如 `/forms/{id}`、`/workflows`，或先確認 `route:list`。

### 前端 route helper 注意
`resources/js/lib/route.ts` 不是完整 Ziggy/Wayfinder route helper，只包含少數 auth/dashboard route。
不要用它產生 `forms.*`、`organization.*` 等路由，否則可能回傳 `#`。

### Pint 執行 (Windows)
```bash
php vendor/bin/pint --dirty   # 注意必須加 php 前綴
```

### WorkflowHistory 欄位
使用 `performed_at`，**不是** `created_at`。

### Middleware: org.access
所有需要 org context 的 controller 方法，透過 `$request->get('current_organization')` 取得 `OrganizationSetting` 物件。這是由 `org.access` middleware 注入的。

---

## 📁 重要檔案索引

| 用途 | 路徑 |
|------|------|
| Dashboard (真實資料) | `app/Http/Controllers/DashboardController.php` |
| 報表後端 | `app/Http/Controllers/ReportsController.php` |
| 工作流程監控後端 | `app/Http/Controllers/WorkflowMonitorController.php` |
| CSV 匯出 | `app/Services/ExportService.php` |
| Dashboard 假操作來源 | `resources/js/hooks/useDashboardActions.ts` |
| Dashboard 壞連結來源 | `resources/js/components/dashboard/QuickActions.tsx` |
| Dashboard Workflow 壞連結來源 | `resources/js/components/dashboard/WorkflowMenu.tsx` |
| localStorage 表單設計 demo | `resources/js/pages/FormBuilder.tsx` |
| 組織設定/報表 Controller | `app/Http/Controllers/OrganizationController.php` |
| 工作流程監控前端 | `resources/js/pages/workflows/Monitor.tsx` |
| 部門分析報表前端 | `resources/js/pages/reports/DepartmentAnalysis.tsx` |
| 工作流程監控測試 | `tests/Feature/WorkflowMonitorTest.php` |
| 報表頁面 org scoping 測試 | `tests/Feature/ReportsPagesTest.php` |
| Sidebar 導覽列 | `resources/js/components/app-sidebar.tsx` |
| Web 路由 | `routes/web.php` |
| Feature E2E 工作流程測試 | `tests/Feature/EndToEndWorkflowFeatureTest.php` |
| AI-first 開發文件庫入口 | `docs/README.md` |
| 目前真實開發狀態 | `docs/01-current-state.md` |
| 專案結構文件 | `docs/02-project-structure.md` |
| 模組狀態文件 | `docs/03-module-status.md` |
| 已知問題與 backlog | `docs/04-known-issues-and-backlog.md` |
| 既有文件可信度盤點 | `docs/05-documentation-inventory.md` |
| 開發協作流程 | `docs/06-development-workflow.md` |

---

## 🧪 最近一次驗證

2026-06-06 本段已執行：

```bash
php artisan test tests/Feature/EndToEndWorkflowFeatureTest.php
php artisan test tests/Feature/EndToEndWorkflowFeatureTest.php tests/Feature/WorkflowInstanceApiTest.php tests/Feature/WorkflowDesignerPageTest.php
php artisan test tests/Feature/ReportsPagesTest.php
php artisan test tests/Feature/ReportsPagesTest.php tests/Feature/ReportsExportTest.php tests/Feature/EndToEndWorkflowFeatureTest.php
php vendor/bin/pint --dirty
npm run types
npm run build
```

結果：
- 16 個測試 / 151 個斷言通過（報表頁面 + 報表匯出 + Feature E2E 工作流程）
- Pint dirty 通過
- `npm run types` 失敗（大量前端型別/route/helper 問題，見「高優先級問題」）
- `npm run build` 通過（但不代表 typecheck 通過）
- 尚未重跑全套測試；上次全套紀錄仍為 205 個測試 / 970 個斷言通過

---

## 📊 整體進度

- **核心業務功能**: 約 55-65%（後端雛形多，前端整合缺口大）
- **報表系統**: 約 70%（`/reports/*` 較完整，`/organization/reports` 是 demo）
- **整體完成度**: 暫估 ~60%
- **剩餘**: 前端可用性阻斷、表單/儀表板/組織模組整合、低成本 regression、行動端、部署文件

---

*下次接手請先閱讀此文件，再從「立即任務」開始。*

