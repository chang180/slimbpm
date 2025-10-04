# Linear.app 整合規劃

## 專案結構設計

### 主要專案
- **SlimBPM Core** - 核心功能開發
- **SlimBPM Frontend** - 前端介面開發  
- **SlimBPM Integration** - 第三方整合

### 開發階段規劃

#### Phase 1: 基礎架構 (2-3週)
**分支**: `feature/foundation`
- 資料庫設計與遷移
- 基礎認證系統
- 核心模型建立
- API 基礎架構

**相關 Issues**:
- [ ] 設計資料庫 Schema
- [ ] 建立核心 Model
- [ ] 設定 API 路由結構
- [ ] 建立基礎測試框架

#### Phase 2: 用戶管理 (1-2週)
**分支**: `feature/user-management`
- 組織架構管理
- 角色權限系統
- 用戶介面

**相關 Issues**:
- [ ] 組織架構 CRUD
- [ ] 角色權限管理
- [ ] 用戶管理介面
- [ ] 權限驗證中間件

#### Phase 3: 流程設計器 (3-4週)
**分支**: `feature/workflow-designer`
- 流程定義介面
- 流程引擎核心
- 流程執行引擎

**相關 Issues**:
- [ ] 流程設計器 UI
- [ ] 流程定義 API
- [ ] 流程執行引擎
- [ ] 流程狀態管理

#### Phase 4: 表單系統 (2-3週)
**分支**: `feature/form-builder`
- 動態表單建立
- 表單驗證系統
- 表單提交處理

**相關 Issues**:
- [ ] 表單設計器
- [ ] 動態表單渲染
- [ ] 表單驗證引擎
- [ ] 表單資料處理

#### Phase 5: 通知系統 (1-2週)
**分支**: `feature/notification-system`
- 多管道通知
- 通知模板管理
- 通知排程

**相關 Issues**:
- [ ] 通知管道介面
- [ ] 通知模板系統
- [ ] 通知排程器
- [ ] 通知歷史記錄

## Linear 設定建議

### Labels 設計
- `priority:high` - 高優先級
- `priority:medium` - 中優先級  
- `priority:low` - 低優先級
- `type:backend` - 後端開發
- `type:frontend` - 前端開發
- `type:database` - 資料庫相關
- `type:testing` - 測試相關
- `type:documentation` - 文件相關

### 狀態設計
- `Backlog` - 待處理
- `In Progress` - 開發中
- `In Review` - 程式碼審查
- `Testing` - 測試中
- `Done` - 完成

### 指派策略
- **Cursor**: 架構設計、專案管理、代碼整合
- **Claude Code**: 後端功能開發
- **Codex**: 前端功能開發

## 開發流程

### 1. Issue 建立
- 每個功能模組建立對應的 Epic
- 將 Epic 拆解為具體的 Task
- 設定適當的優先級和標籤

### 2. 分支管理
- 每個 Phase 建立對應分支
- 功能開發在子分支進行
- 定期同步主分支更新

### 3. 進度追蹤
- 每日更新 Issue 狀態
- 定期進行代碼審查
- 完成後進行整合測試

### 4. 品質控制
- 每個功能必須有對應測試
- 程式碼必須通過 Lint 檢查
- 重要功能需要文件說明
