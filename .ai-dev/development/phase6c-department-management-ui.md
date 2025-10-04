# Phase 6C: 部門管理介面開發指示

## 🎯 開發任務：Phase 6C - 部門管理介面

### 當前狀態
- **分支**: `feature/department-management-ui`
- **開發者**: Cursor (總協調者)
- **開始時間**: 2025年10月10日
- **預估完成**: 2025年10月12日 (2天)

## 📋 開發任務清單

### 1. 部門列表頁面 (`/departments`)
- [ ] 部門列表顯示
- [ ] 層級結構顯示
- [ ] 搜尋和篩選
- [ ] 部門狀態管理

### 2. 部門新增頁面 (`/departments/create`)
- [ ] 部門表單設計
- [ ] 上級部門選擇
- [ ] 表單驗證
- [ ] 提交處理

### 3. 部門編輯頁面 (`/departments/{id}/edit`)
- [ ] 部門資料編輯
- [ ] 上級部門變更
- [ ] 部門狀態調整
- [ ] 成員管理

### 4. 部門層級管理介面
- [ ] 樹狀結構顯示
- [ ] 拖拽排序
- [ ] 層級調整
- [ ] 批量操作

### 5. 部門成員管理介面
- [ ] 成員列表顯示
- [ ] 成員新增/移除
- [ ] 角色指派
- [ ] 權限管理

## 🏗️ 技術實作指南

### 1. 頁面結構
```
resources/js/pages/Departments/
├── Index.tsx          # 部門列表
├── Create.tsx         # 新增部門
├── Edit.tsx           # 編輯部門
├── Hierarchy.tsx      # 層級管理
└── Members.tsx        # 成員管理
```

### 2. 組件設計
```typescript
// 部門樹狀組件
interface DepartmentTreeProps {
  departments: Department[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, parentId: string) => void;
}

// 部門表單組件
interface DepartmentFormProps {
  initialData?: Department;
  parentOptions: Department[];
  onSubmit: (data: DepartmentData) => void;
}
```

## 📊 完成標準

### 1. 功能完成
- [ ] 部門列表頁面正常運作
- [ ] 部門新增功能正常
- [ ] 部門編輯功能正常
- [ ] 層級管理功能正常
- [ ] 成員管理功能正常

### 2. 程式碼品質
- [ ] TypeScript 類型檢查通過
- [ ] ESLint 檢查通過
- [ ] 組件重構度良好

### 3. 測試覆蓋
- [ ] 單元測試覆蓋率 > 80%
- [ ] 整合測試覆蓋率 > 70%

---
**開始開發時間**: 2025年10月10日  
**預估完成時間**: 2025年10月12日 (2天)  
**負責 AI**: Cursor (總協調者)  
**分支**: `feature/department-management-ui`
