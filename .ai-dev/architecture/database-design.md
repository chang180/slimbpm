# SlimBPM 資料庫設計

## 核心實體分析

### 1. 用戶管理
- **users** (已存在，Laravel 預設)
  - 擴展現有結構以支援組織層級

### 2. 組織架構
- **organizations** - 組織/公司
- **departments** - 部門
- **positions** - 職位
- **user_roles** - 用戶角色關聯

### 3. 流程管理
- **workflows** - 流程定義
- **workflow_steps** - 流程步驟
- **workflow_instances** - 流程實例
- **workflow_step_instances** - 步驟實例

### 4. 表單系統
- **forms** - 表單定義
- **form_fields** - 表單欄位
- **form_submissions** - 表單提交
- **form_field_values** - 欄位值

### 5. 權限系統
- **permissions** - 權限定義
- **roles** - 角色定義
- **role_permissions** - 角色權限關聯

### 6. 通知系統
- **notification_channels** - 通知管道
- **notification_templates** - 通知模板
- **notifications** - 通知記錄

## 需要討論的設計議題

### 1. 資料庫選擇
- **開發環境**: SQLite (當前)
- **生產環境**: MySQL vs PostgreSQL
- **效能考量**: 是否需要 Redis 快取

### 2. 流程引擎設計
- **狀態管理**: 如何追蹤流程狀態
- **並行處理**: 多個審核者同時處理
- **回退機制**: 流程回退和重新指派

### 3. 表單系統複雜度
- **動態表單**: 支援條件式顯示
- **欄位驗證**: 複雜驗證規則
- **檔案上傳**: 附件管理

### 4. 權限粒度
- **組織層級**: 跨部門權限
- **流程層級**: 特定流程權限
- **資料層級**: 敏感資料保護

## 待確認的技術決策

1. **流程引擎**: 自建 vs 使用現有套件
2. **檔案儲存**: 本地 vs 雲端儲存
3. **通知整合**: 第三方服務整合方式
4. **多租戶**: 是否需要支援多租戶架構
