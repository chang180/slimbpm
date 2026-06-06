# SlimBPM 開發 Handoff 文件

> 此文件記錄每次開發進度的交接狀態，供下次接手時快速掌握背景。
> **每完成一個功能區塊就更新此文件。**

---

## 📅 最後更新：2026-06-06（ExportService 修正完成）

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

---

## 🔧 目前已知問題 / 待修正

無重大待修正問題。ExportService 已於 2026-06-06 完整修正。

---

## 📋 下一步開發順序

### 🎯 後續任務 (依優先順序)
1. **E2E 瀏覽器測試** (Pest 4 Browser) — `tests/Browser/`
   - 關鍵流程：登入 → 建立表單 → 啟動工作流程 → 審批
2. **行動端響應式審查** — 現有頁面在小螢幕的排版
3. **生產部署文件** — `.env.production` 範本、安裝步驟

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
| Sidebar 導覽列 | `resources/js/components/app-sidebar.tsx` |
| Web 路由 | `routes/web.php` |

---

## 📊 整體進度

- **核心業務功能**: 100% ✅
- **報表系統**: 100% ✅
- **整體完成度**: ~92%
- **剩餘**: E2E 測試、行動端、部署文件

---

*下次接手請先閱讀此文件，再從「立即任務」開始。*

