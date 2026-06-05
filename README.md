# SlimBPM (快簽)

> 專為中小企業設計的輕量級工作流程管理系統

[![Laravel](https://img.shields.io/badge/Laravel-12.32.5-red.svg)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org)
[![PHP](https://img.shields.io/badge/PHP-8.4.12-purple.svg)](https://php.net)
[![Tests](https://img.shields.io/badge/Tests-110%20passed-green.svg)](#)

## 🎯 專案概述

SlimBPM (快簽) 是一個專為中小企業 (50人以下) 設計的輕量級 BPM (Business Process Management) 系統，提供直觀的工作流程管理、表單設計、審批流程等功能。

### 核心特色
- 🚀 **輕量快速**: 針對中小企業優化，部署簡單
- 🎨 **現代化 UI**: 基於 React 19 + Tailwind CSS 4 的響應式設計
- 📝 **表單設計器**: 拖拽式表單設計，支援 11 種欄位類型
- 🔄 **工作流程**: 彈性審批流程，支援條件分支
- 👥 **用戶管理**: 完整的組織架構和權限管理
- 📱 **響應式設計**: 支援桌面和行動裝置

## 🏗️ 技術架構

### 後端技術棧
- **Laravel 12.32.5** - PHP 框架
- **PHP 8.4.12** - 程式語言
- **SQLite** - 資料庫 (開發環境)
- **Pest 4** - 測試框架
- **Laravel Pint** - 程式碼格式化

### 前端技術棧
- **React 19** - UI 框架
- **TypeScript** - 類型安全
- **Inertia.js 2** - SPA 體驗
- **Tailwind CSS 4** - 樣式框架
- **Vite + Wayfinder** - 建置工具

## 📊 專案進度

### 整體進度: 70% 完成 ✨

SlimBPM 目前已完成核心架構與大部分管理功能，用戶可以進行企業註冊、用戶管理、部門管理、表單設計與工作流程設計。

### ✅ 已完成功能 (100%)
#### 核心系統
- ✅ **基礎架構**: 資料庫設計、模型關係、API 路由
- ✅ **身份驗證**: 企業註冊、登入、郵件驗證、密碼重置、雙因素認證
- ✅ **用戶管理**: 用戶 CRUD、角色管理 (admin/manager/user)、完整 UI
- ✅ **部門管理**: 層級架構、部門 CRUD、完整 UI
- ✅ **組織管理**: 組織設定、偏好設定、完整 UI

#### 業務功能
- ✅ **表單設計器**: 拖拽式設計、11種欄位類型、條件邏輯、驗證規則
- ✅ **表單管理**: 表單 CRUD、提交記錄、結果查看
- ✅ **工作流程設計器**: 視覺化設計、版本管理、匯入匯出
- ✅ **歡迎頁面**: 響應式設計、深色模式支援

#### 個人設定
- ✅ **個人資料**: 資料修改、頭像上傳
- ✅ **安全性**: 密碼變更、雙因素認證
- ✅ **外觀**: 深色/淺色模式切換

### 🔄 進行中功能 (40-80%)
- 🔄 **工作流程執行**: API 完成，前端操作介面開發中
- 🔄 **通知系統**: 後端完成，前端介面開發中
- 🔄 **儀表板**: UI 完成，數據連接優化中
- 🔄 **成員邀請**: UI 設計完成，後端開發中

### 📋 待開發功能 (0-20%)
- 📋 **報表系統**: 基礎框架完成，詳細報表待開發
- 📋 **系統設定**: 參數設定、郵件配置等
- 📋 **稽核日誌**: 操作記錄追蹤
- 📋 **行動端優化**: PWA 支援、觸控優化

### 📅 預計完成時間
根據目前進度，預計 **3-5 週**可完成所有核心功能的開發與測試。

## 🚀 快速開始

### 系統要求
- PHP 8.4+
- Node.js 18+
- Composer
- NPM/Yarn

### 安裝步驟

1. **克隆專案**
```bash
git clone <repository-url>
cd slimbpm
```

2. **安裝依賴**
```bash
# 後端依賴
composer install

# 前端依賴
npm install
```

3. **環境設定**
```bash
# 複製環境設定檔
cp .env.example .env

# 生成應用程式金鑰
php artisan key:generate
```

4. **資料庫設定**
```bash
# 執行遷移
php artisan migrate

# 執行種子資料 (可選)
php artisan db:seed
```

5. **啟動開發伺服器**
```bash
# 啟動 Laravel 伺服器
php artisan serve

# 啟動前端建置 (新終端)
npm run dev
```

6. **訪問應用程式**
- 前端: http://localhost:8000
- API: http://localhost:8000/api/v1

## 🧪 測試

SlimBPM 採用 **Pest 4** 測試框架，具備完整的測試覆蓋。

```bash
# 執行所有測試
php artisan test

# 執行特定測試檔案
php artisan test tests/Feature/UserManagementTest.php

# 使用篩選器執行特定測試
php artisan test --filter=WorkflowTest

# 執行瀏覽器測試
php artisan test tests/Browser/

# 執行測試並生成覆蓋率報告
php artisan test --coverage
```

**測試統計**:
- 📊 總測試數: **110 個測試**
- ✓ 總斷言數: **522 個斷言**
- ⚡ 執行時間: **~4.19 秒**
- ✅ 成功率: **100%**

**測試覆蓋範圍**:
- ✅ 身份驗證 (註冊、登入、驗證、密碼重置)
- ✅ 用戶管理 (CRUD + 權限)
- ✅ 部門管理 (CRUD + 層級結構)
- ✅ 組織管理 (設定 + 偏好)
- ✅ 表單系統 (設計器 + 動態渲染 + 提交)
- ✅ 工作流程 (模板 + 實例 + 引擎)
- ✅ 通知系統 (基礎 + 進階)
- ✅ 瀏覽器測試 (UI 互動測試)

## 📚 API 文檔

### 主要端點

#### 組織與用戶管理
- `GET|POST|PUT|DELETE /api/v1/organizations` - 組織管理 (完整 CRUD)
- `GET|POST|PUT|DELETE /api/v1/departments` - 部門管理 (完整 CRUD)
- `GET|POST|PUT|DELETE /api/v1/users` - 用戶管理 (完整 CRUD)

#### 工作流程管理
- `GET|POST|PUT|DELETE /api/v1/workflows` - 工作流程模板 (完整 CRUD)
- `POST /api/v1/workflows/{id}/duplicate` - 複製工作流程模板
- `GET /api/v1/workflows/{id}/export` - 匯出工作流程
- `POST /api/v1/workflows/import` - 匯入工作流程
- `GET|POST|PUT|DELETE /api/v1/workflow-instances` - 工作流程實例
- `PATCH /api/v1/workflow-instances/{id}/steps/{step}` - 更新工作流程步驟

#### 表單管理
- `GET|POST|PUT|DELETE /api/v1/forms` - 表單管理 (完整 CRUD)
- `POST /api/v1/forms/{id}/duplicate` - 複製表單
- `POST /api/v1/forms/{id}/submit` - 提交表單
- `GET /api/v1/forms/{id}/submissions` - 查詢表單提交記錄
- `GET|POST|PUT|DELETE /api/v1/form-submissions` - 表單提交管理

#### 通知管理
- `GET|POST|PUT|DELETE /api/v1/notifications` - 通知管理
- `GET /api/v1/notifications/unread-count` - 未讀通知數量
- `POST /api/v1/notifications/mark-all-as-read` - 標記所有為已讀
- `POST /api/v1/notifications/{id}/mark-as-read` - 標記單一通知為已讀
- `GET|POST|PUT|DELETE /api/v1/notification-settings` - 通知設定
- `POST /api/v1/notification-settings/reset` - 重置通知設定

### 認證方式
所有 API 端點都需要認證。SlimBPM 使用 Laravel Sanctum 進行 API 認證。

**請求標頭**:
```http
Authorization: Bearer {your-token}
Accept: application/json
Content-Type: application/json
```

**取得認證 Token**:
```bash
POST /login/{slug}
{
  "email": "user@example.com",
  "password": "password"
}
```

## 🎨 核心功能展示

### 🎯 表單設計器
SlimBPM 提供強大的拖拽式表單設計器，讓您輕鬆建立各種表單。

**功能特色**:
- 🎨 拖拽式介面設計
- 📝 支援 11 種欄位類型：
  - 文字欄位、多行文字、數字、日期、時間
  - 下拉選單、單選、多選、檔案上傳
  - 評分、簽名
- 👁️ 即時預覽功能
- ✅ 完整的表單驗證設定
- 🔗 條件邏輯支援 (顯示/隱藏欄位)
- 📊 自動儲存與進度追蹤

### 👥 用戶與部門管理
完整的組織架構管理系統，支援多層級部門結構。

**功能特色**:
- 🏢 組織架構管理
- 🌳 無限層級部門結構
- 👤 三種角色類型 (admin/manager/user)
- 🔐 完整的權限控制
- 📝 批量操作支援
- 📊 部門統計分析

### 🔄 工作流程設計器
視覺化的工作流程設計工具，讓您快速建立業務流程。

**功能特色**:
- 🎨 視覺化流程設計
- 👥 彈性審批者指派
- 🔀 條件分支支援
- 📋 多種節點類型
- 📦 版本管理與歷史記錄
- 💾 匯入/匯出功能
- 📊 流程監控與追蹤

### 📊 儀表板
根據角色顯示不同的儀表板內容。

**管理員/經理看到的內容**:
- 📈 企業統計數據
- 👥 成員邀請管理
- 🔄 工作流程概覽
- 📊 部門統計圖表

**一般用戶看到的內容**:
- 📝 我的工作流程
- ✅ 待處理事項
- 📋 最近活動
- 🚀 快速操作

## 💡 技術亮點

### 現代化技術棧
- ⚡ **Laravel 12**: 最新版 Laravel 框架，簡化結構
- ⚛️ **React 19**: 最新版 React，提供流暢的 UI 體驗
- 🎨 **Tailwind CSS 4**: 最新版 Tailwind，現代化樣式
- 🔄 **Inertia.js 2**: 無需 API 的 SPA 體驗
- 🧪 **Pest 4**: 現代化測試框架，包含瀏覽器測試

### 開發體驗
- 📝 **TypeScript**: 完整的類型安全
- 🎯 **代碼品質**: Laravel Pint + ESLint + Prettier
- 🧪 **測試驅動**: 110+ 測試案例，100% 通過率
- 🔧 **開發工具**: Vite + Wayfinder 快速建置
- 📊 **專案管理**: Linear.app 整合

### 安全性
- 🔐 **身份驗證**: Laravel Fortify + Sanctum
- ✉️ **郵件驗證**: 完整的郵件驗證流程
- 🔑 **雙因素認證**: 增強帳戶安全性
- 🛡️ **權限控制**: 基於角色的存取控制
- 🔒 **密碼安全**: BCrypt 雜湊演算法

## 📖 開發文件

### 專案文件位置
- **開發指南**: `.ai-dev/README.md` - 完整的開發進度與技術文件
- **架構設計**: `.ai-dev/architecture/` - 資料庫設計與技術決策
- **功能規格**: `.ai-dev/features/` - 詳細的功能規格文件
- **開發流程**: `.ai-dev/development/` - 開發流程與指示

### 當前開發狀態
- 🟢 **生產就緒**: 70% 的核心功能已完成並可用
- 🟡 **開發中**: 工作流程執行、通知系統前端
- 🔴 **計劃中**: 成員邀請、報表系統完善
- 📅 **預計完成**: 3-5 週

### 待完成重點功能
1. **工作流程執行介面** (高優先級)
   - 啟動工作流程頁面
   - 審批操作介面
   - 流程監控頁面

2. **成員邀請系統** (高優先級)
   - 邀請 API 與資料庫
   - 邀請郵件發送
   - 邀請管理介面

3. **通知前端介面** (中優先級)
   - 通知中心頁面
   - 通知下拉選單
   - 通知設定頁面

詳細的開發計畫請參閱 `.ai-dev/README.md`

## 🤝 貢獻指南

我們歡迎各種形式的貢獻！

### 開發流程
1. Fork 專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 撰寫測試並確保通過 (`php artisan test`)
4. 執行程式碼格式化 (`vendor/bin/pint`)
5. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
6. 推送到分支 (`git push origin feature/AmazingFeature`)
7. 開啟 Pull Request

### 程式碼規範
- 遵循 Laravel 最佳實踐
- 所有新功能必須包含測試
- 使用 Laravel Pint 格式化 PHP 代碼
- 使用 ESLint + Prettier 格式化 TypeScript/React 代碼
- 提交訊息使用清楚的描述

## 📄 授權條款

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案。

## 📞 聯絡資訊

- **專案維護者**: 開發團隊
- **Linear 專案**: [SlimBPM (快簽)](https://linear.app/devstream-core/project/slimbpm-快簽)
- **技術文件**: `.ai-dev/README.md`

## 🙏 致謝

特別感謝所有參與開發的團隊成員：
- **Cursor**: 架構設計與專案協調
- **Claude Code**: 功能開發
- **Codex**: 功能開發

---

<div align="center">

**SlimBPM (快簽)** - 讓工作流程管理變得簡單高效 🚀

Made with ❤️ by the SlimBPM Team

</div>