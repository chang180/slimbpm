# SlimBPM 開發 Handoff 文件

> 此文件記錄每次開發進度的交接狀態，供下次接手時快速掌握背景。
> **每完成一個功能區塊就更新此文件。**

---

## 📅 最後更新：2026-06-06（低成本 Feature/Inertia regression 補強）

---

## ✅ 已完成 (截至 2026-06-06)

### 核心業務功能（全部 100%）

| 功能 | 後端 | 前端 | 測試 |
|------|------|------|------|
| 基礎架構 / 身份驗證 | ✅ | ✅ | ✅ |
| 用戶管理 | ✅ | ✅ | ✅ |
| 部門管理 | ✅ | ✅ | ✅ |
| 組織設定 | ✅ | ✅ | ✅ |
| 表單設計器 | ✅ | ✅ | ✅ |
| 表單管理與提交 | ✅ | ✅ | ✅ |
| 工作流程設計器 | ✅ | ✅ | ✅ |
| 工作流程執行 (啟動/審批/暫停/恢復/取消) | ✅ | ✅ | ✅ |
| 工作流程監控 (admin/manager) | ✅ | ✅ | ✅ |
| 成員邀請系統 | ✅ | ✅ | ✅ |
| 通知系統 (中心 + 下拉 + 徽章) | ✅ | ✅ | ✅ |
| 儀表板 (真實資料 + 6 個月圖表) | ✅ | ✅ | ✅ |
| 個人設定 (資料/密碼/外觀/2FA) | ✅ | ✅ | ✅ |

### 報表系統（100%）

| 報表頁面 | 狀態 |
|---------|------|
| 報表中心 (`/reports`) — 真實 org 統計 | ✅ |
| 用戶活動報表 — 真實資料 + 圖表 | ✅ |
| 流程效能報表 — 真實資料 + 圖表 | ✅ |
| 系統統計報表 — 真實資料 + 圖表 | ✅ |
| 部門分析報表 — 表格 + 進度條 | ✅ |
| CSV 匯出 (ExportService) — 真實資料 + org scoping | ✅ |

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

無重大待修正問題。ExportService 已於 2026-06-06 完整修正。

### Pest Browser E2E 前置條件
目前專案尚未安裝 `pestphp/pest-plugin-browser`，因此真正的 Pest 4 Browser `visit()` 測試尚不能加入/執行。
若要開始 `tests/Browser/`，需先取得依賴變更同意，並安裝：
- `composer require pestphp/pest-plugin-browser --dev`
- `npm install playwright@latest`
- `npx playwright install`

---

## 📋 下一步開發順序

### 🎯 後續任務 (依優先順序)
1. **低成本 regression 測試補強**（目前採用）
   - 優先用 Laravel Feature + Inertia endpoint tests，不新增 Playwright/Cypress/Dusk
   - 下一批可補：通知中心頁面 props、邀請流程 Web 頁面、設定頁權限/2FA 邊界
2. **行動端響應式審查** — 現有頁面在小螢幕的排版
3. **生產部署文件** — `.env.production` 範本、安裝步驟
4. **E2E 瀏覽器測試** (可選)
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
| 工作流程監控前端 | `resources/js/pages/workflows/Monitor.tsx` |
| 部門分析報表前端 | `resources/js/pages/reports/DepartmentAnalysis.tsx` |
| 工作流程監控測試 | `tests/Feature/WorkflowMonitorTest.php` |
| 報表頁面 org scoping 測試 | `tests/Feature/ReportsPagesTest.php` |
| Sidebar 導覽列 | `resources/js/components/app-sidebar.tsx` |
| Web 路由 | `routes/web.php` |
| Feature E2E 工作流程測試 | `tests/Feature/EndToEndWorkflowFeatureTest.php` |

---

## 🧪 最近一次驗證

2026-06-06 本段已執行：

```bash
php artisan test tests/Feature/EndToEndWorkflowFeatureTest.php
php artisan test tests/Feature/EndToEndWorkflowFeatureTest.php tests/Feature/WorkflowInstanceApiTest.php tests/Feature/WorkflowDesignerPageTest.php
php artisan test tests/Feature/ReportsPagesTest.php
php artisan test tests/Feature/ReportsPagesTest.php tests/Feature/ReportsExportTest.php tests/Feature/EndToEndWorkflowFeatureTest.php
php vendor/bin/pint --dirty
```

結果：
- 16 個測試 / 151 個斷言通過（報表頁面 + 報表匯出 + Feature E2E 工作流程）
- Pint dirty 通過
- 尚未重跑全套測試；上次全套紀錄仍為 205 個測試 / 970 個斷言通過

---

## 📊 整體進度

- **核心業務功能**: 100% ✅
- **報表系統**: 100% ✅
- **整體完成度**: ~92%
- **剩餘**: 低成本 regression 補強、行動端、部署文件；Browser E2E 暫列可選

---

*下次接手請先閱讀此文件，再從「立即任務」開始。*

