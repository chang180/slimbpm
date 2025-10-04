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

### ✅ 已完成功能
- **Phase 1**: 基礎架構建設 (100%)
- **Phase 2**: 用戶管理系統 (100%)
- **Phase 4**: 表單系統 (100%)
- **Phase 5**: 通知系統 (100%)
- **Phase 6A**: 用戶管理介面 (100%)
- **Phase 6B**: 組織管理介面 (100%)
- **Phase 6F**: 歡迎頁面設計 (進行中)

### 🔄 開發中
- **Phase 3**: 流程設計器

### 📋 待開發
- **Phase 6C**: 部門管理介面
- **Phase 6D**: 表單系統介面完善
- **Phase 6E**: 儀表板介面
- **Phase 7**: 系統整合與測試

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

```bash
# 執行所有測試
php artisan test

# 執行特定測試檔案
php artisan test tests/Feature/UserManagementTest.php

# 執行測試並生成覆蓋率報告
php artisan test --coverage
```

**測試統計**:
- 總測試數: 110 個
- 總斷言數: 522 個
- 執行時間: ~4.19 秒
- 成功率: 100%

## 📚 API 文檔

### 主要端點
- `GET /api/v1/organizations` - 組織管理
- `GET /api/v1/departments` - 部門管理
- `GET /api/v1/users` - 用戶管理
- `GET /api/v1/workflows` - 工作流程管理
- `GET /api/v1/forms` - 表單管理

### 認證
所有 API 端點都需要認證。請在請求標頭中包含:
```
Authorization: Bearer {your-token}
```

## 🎨 功能展示

### 表單設計器
- 拖拽式介面設計
- 支援 11 種欄位類型
- 即時預覽功能
- 表單驗證設定

### 用戶管理
- 組織架構管理
- 部門層級結構
- 角色權限控制
- 批量操作支援

### 工作流程
- 視覺化流程設計
- 彈性審批者指派
- 條件分支支援
- 流程監控

## 🤝 貢獻指南

1. Fork 專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 授權條款

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案。

## 📞 聯絡資訊

- **專案維護者**: 開發團隊
- **Linear 專案**: [SlimBPM (快簽)](https://linear.app/devstream-core/project/slimbpm-快簽)

---

**SlimBPM (快簽)** - 讓工作流程管理變得簡單高效 🚀