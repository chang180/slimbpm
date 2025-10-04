# DEV-50: 重構 Dashboard 頁面組件架構

## 📋 需求概述

重構 Dashboard 頁面，將其從單一大文件（384行）拆分為多個小組件，並實現完整的企業管理後台功能。

## 🎯 主要目標

### 1. UI/UX 重新設計
- [ ] 重新設計 Dashboard 整體樣式
- [ ] 從小圖示到整個 sidebar 選單項目重新設計
- [ ] 擺脫 starter-kit 的樣式限制
- [ ] 實現現代化的企業管理界面

### 2. 組件架構重構
- [ ] **DashboardHeader** - 歡迎標題和狀態指示器
- [ ] **StatsCards** - 統計卡片區域（用戶數、部門數、表單數等）
- [ ] **ChartsSection** - 圖表區域（趨勢圖、部門分布圖）
- [ ] **RecentActivities** - 最近活動列表
- [ ] **QuickActions** - 快速操作按鈕
- [ ] **DepartmentStats** - 部門統計圖表
- [ ] **MemberInvitation** - 成員邀請功能
- [ ] **WorkflowMenu** - 公文流程使用選單

### 3. 企業管理功能
- [ ] **成員邀請系統**
  - [ ] 生成邀請連結（基於 slug）
  - [ ] 發送邀請郵件功能
  - [ ] 批次發送邀請
  - [ ] 企業人數限制（50人）
- [ ] **權限控制系統**
  - [ ] 角色權限判斷（admin, manager, user）
  - [ ] 部門級權限控制
  - [ ] 功能級權限顯示
- [ ] **公文流程功能**
  - [ ] 管理人員也是使用者
  - [ ] 公文流程使用選單
  - [ ] 權限判斷顯示

### 4. 技術改進
- [ ] 使用 React 函數組件和 TypeScript
- [ ] 實現響應式設計和深色模式支援
- [ ] 優化圖表組件的性能
- [ ] 改善數據處理邏輯
- [ ] 統一的 props 接口設計

## 📊 現有功能分析

### ✅ 已完成的基礎功能
- **統計報表系統**: 使用 Recharts 圖表庫
- **通知系統**: 多管道支援 (Email, Line, Telegram, WhatsApp)
- **用戶管理**: 完整的 CRUD + 權限
- **組織管理**: 多租戶架構
- **表單系統**: 設計器 + 動態渲染

### 🔧 需要整合的功能
- **NotificationService**: 現有的通知服務
- **統計數據**: 現有的圖表化展示
- **權限系統**: 現有的角色管理
- **多租戶**: 現有的 slug 架構

## 🏗️ 技術架構

### 組件結構
```
resources/js/components/dashboard/
├── DashboardHeader.tsx          # 歡迎標題和狀態
├── StatsCards.tsx              # 統計卡片
├── ChartsSection.tsx           # 圖表區域
├── RecentActivities.tsx        # 最近活動
├── QuickActions.tsx            # 快速操作
├── DepartmentStats.tsx         # 部門統計
├── MemberInvitation.tsx        # 成員邀請
├── WorkflowMenu.tsx            # 公文流程選單
└── index.ts                    # 統一導出
```

### 權限控制
```typescript
interface PermissionConfig {
  admin: string[];
  manager: string[];
  user: string[];
}

const permissions: PermissionConfig = {
  admin: ['*'], // 所有權限
  manager: ['dashboard', 'users', 'departments', 'forms', 'workflows'],
  user: ['dashboard', 'forms', 'workflows']
};
```

### 邀請系統
```typescript
interface InvitationData {
  email: string;
  role: 'admin' | 'manager' | 'user';
  department_id?: number;
  expires_at: Date;
  organization_slug: string;
}
```

## 📝 開發計劃

### Phase 1: 組件拆分 (1-2天)
1. 創建組件目錄結構
2. 拆分現有 Dashboard 組件
3. 實現基礎組件功能
4. 測試組件獨立性

### Phase 2: UI/UX 重設計 (2-3天)
1. 重新設計整體樣式
2. 更新 sidebar 選單
3. 實現響應式設計
4. 深色模式支援

### Phase 3: 企業管理功能 (3-4天)
1. 實現成員邀請系統
2. 權限控制系統
3. 公文流程選單
4. 批次邀請功能

### Phase 4: 整合測試 (1-2天)
1. 功能整合測試
2. 權限測試
3. 響應式測試
4. 性能優化

## 🎯 預期效果

- **代碼行數**: 從 384 行減少到約 50 行主文件
- **組件可重用性**: 提高 80%
- **代碼可讀性**: 提升 90%
- **維護性**: 提升 85%
- **TypeScript 類型安全**: 100%

## 🔗 相關文件

- **Linear Issue**: DEV-50
- **分支**: `chang180/dev-50-refactor-dashboard-components`
- **相關文件**: 
  - `resources/js/pages/dashboard.tsx` (384行)
  - `app/Services/NotificationService.php`
  - `resources/js/components/app-sidebar.tsx`

## 📋 檢查清單

### 開發前準備
- [x] 確認現有功能完整性
- [x] 分析權限需求
- [x] 設計組件架構
- [x] 準備測試數據

### 開發中
- [x] 組件拆分
- [x] UI/UX 重設計
- [x] 功能實現
- [x] 權限控制
- [x] 邀請系統

### 開發後
- [ ] 功能測試
- [ ] 權限測試
- [ ] 響應式測試
- [ ] 性能測試
- [ ] 文檔更新

## ✅ 已完成功能

### 1. 組件架構重構
- [x] **DashboardHeader** - 歡迎標題和狀態指示器
- [x] **EnterpriseStats** - 企業統計卡片
- [x] **MemberInvitation** - 成員邀請管理
- [x] **WorkflowMenu** - 公文流程使用選單
- [x] **QuickActions** - 快速操作按鈕

### 2. 角色權限控制
- [x] **一般用戶 (user)**: 主要看到公文流程使用選單
- [x] **部門主管 (manager)**: 看到管理功能 + 公文流程
- [x] **系統管理員 (admin)**: 看到所有功能

### 3. 企業管理功能
- [x] **成員邀請系統**: 生成邀請連結、發送邀請郵件
- [x] **企業人數限制**: 50人上限檢查
- [x] **邀請狀態管理**: 待發送、已發送、已接受、已過期
- [x] **批次邀請功能**: 支援多個郵件地址

### 4. 公文流程功能
- [x] **流程模板管理**: 查看、啟動流程模板
- [x] **待處理流程**: 顯示需要處理的流程
- [x] **流程狀態管理**: 批准、拒絕、查看、編輯
- [x] **權限控制**: 根據角色顯示不同操作

### 5. 用戶體驗優化
- [x] **響應式設計**: 支援各種螢幕尺寸
- [x] **深色模式**: 完整的深色模式支援
- [x] **直觀導航**: 清晰的視覺層次和操作流程
- [x] **狀態指示**: 清楚的狀態和進度顯示

---

*最後更新: 2025年10月4日*
*負責人: 張某人（chang180）*
*狀態: 進行中*
