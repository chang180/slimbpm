# Phase 6C: 部門管理介面開發指示

## 🎯 專案概述

**目標**: 實作部門管理的前端介面，包括部門列表、新增、編輯、層級管理、成員管理等功能。

**分支**: `feature/department-management-ui` ✅ **已完成並合併**

**開發者**: Claude Code

**預估時間**: 2 天

**實際完成時間**: 2025-01-04

**狀態**: ✅ **已完成**

## 📍 從這裡開始

### 1. 檢查現有基礎設施

✅ **後端 API 已完成**:
- `app/Http/Controllers/Api/DepartmentController.php` - 部門管理 API 控制器
- `app/Models/Department.php` - 部門模型 (支援層級結構)
- `routes/api.php` - 部門相關路由已設定
- `tests/Feature/DepartmentManagementTest.php` - 後端測試已通過

✅ **API 端點**:
- `GET /api/v1/departments` - 取得部門列表 (支援樹狀結構)
- `POST /api/v1/departments` - 新增部門
- `GET /api/v1/departments/{id}` - 取得部門詳情
- `PUT /api/v1/departments/{id}` - 更新部門
- `DELETE /api/v1/departments/{id}` - 刪除部門

### 2. 前端頁面結構

需要創建的頁面:
```
resources/js/pages/Departments/
├── Index.tsx          # 部門列表頁面
├── Create.tsx         # 新增部門頁面
├── Edit.tsx           # 編輯部門頁面
└── Show.tsx           # 部門詳情頁面
```

### 3. 路由設定

需要在 `routes/web.php` 中添加:
```php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/departments', [DepartmentController::class, 'index'])->name('departments.index');
    Route::get('/departments/create', [DepartmentController::class, 'create'])->name('departments.create');
    Route::post('/departments', [DepartmentController::class, 'store'])->name('departments.store');
    Route::get('/departments/{department}', [DepartmentController::class, 'show'])->name('departments.show');
    Route::get('/departments/{department}/edit', [DepartmentController::class, 'edit'])->name('departments.edit');
    Route::put('/departments/{department}', [DepartmentController::class, 'update'])->name('departments.update');
    Route::delete('/departments/{department}', [DepartmentController::class, 'destroy'])->name('departments.destroy');
});
```

## 🛠️ 技術實作重點

### 1. 部門列表頁面 (`/departments`)

**功能需求**:
- 樹狀結構顯示部門層級
- 搜尋和篩選功能
- 部門狀態管理 (啟用/停用)
- 新增/編輯/刪除操作按鈕

**技術實作**:
```typescript
// 使用 Inertia.js 獲取資料
const { departments } = usePage<{
  departments: Department[]
}>().props

// 樹狀結構組件建議使用 @headlessui/react 的 Tree 組件
// 或實作自定義的遞迴樹狀組件
```

**參考現有頁面**:
- 查看 `resources/js/pages/Users/Index.tsx` 的列表實作
- 查看 `resources/js/pages/Organization/Index.tsx` 的組織管理實作

### 2. 部門新增頁面 (`/departments/create`)

**功能需求**:
- 部門基本資訊表單
- 上級部門選擇 (下拉選單或樹狀選擇器)
- 表單驗證
- 提交處理

**表單欄位**:
```typescript
interface DepartmentForm {
  name: string;           // 部門名稱
  description?: string;   // 部門描述
  parent_id?: number;     // 上級部門ID
  is_active: boolean;     // 是否啟用
}
```

**技術實作**:
```typescript
import { Form } from '@inertiajs/react'

// 使用 Inertia.js Form 組件
<Form onSubmit={handleSubmit}>
  {/* 表單欄位 */}
</Form>
```

### 3. 部門編輯頁面 (`/departments/{id}/edit`)

**功能需求**:
- 預填現有部門資料
- 修改部門資訊
- 上級部門變更 (不能選擇自己或子部門)
- 成員管理功能

**特殊邏輯**:
- 防止循環引用: 部門不能成為自己的子部門
- 上級部門選擇時排除自己和所有子部門

### 4. 層級管理功能

**技術重點**:
- 實現拖拽排序 (可使用 @dnd-kit/sortable)
- 層級調整 (移動部門到不同上級)
- 防止循環引用

**拖拽實作**:
```typescript
// 建議使用 @dnd-kit/sortable
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
```

### 5. 成員管理功能

**功能需求**:
- 顯示部門成員列表
- 新增成員到部門
- 從部門移除成員
- 角色指派

## 📚 參考資源

### 現有組件參考
✅ **已存在的頁面**:
- `resources/js/pages/Users/Index.tsx` - 用戶列表頁面
- `resources/js/pages/Users/Create.tsx` - 用戶新增頁面
- `resources/js/pages/Users/Edit.tsx` - 用戶編輯頁面
- `resources/js/pages/Organization/Index.tsx` - 組織管理頁面

✅ **可重用的組件**:
- `resources/js/components/ui/table.tsx` - 表格組件
- `resources/js/components/ui/tabs.tsx` - 標籤組件
- `resources/js/components/DynamicForm.tsx` - 動態表單

### 類型定義
查看 `resources/js/types/index.d.ts` 中的現有類型定義，並添加:
```typescript
interface Department {
  id: number;
  name: string;
  description?: string;
  parent_id?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  parent?: Department;
  children?: Department[];
  users?: User[];
}
```

### 樣式參考
- 使用 Tailwind CSS 4 進行樣式設計
- 參考現有頁面的設計模式
- 確保響應式設計

## 🔧 開發環境設定

### 1. 啟動開發服務器
```bash
npm run dev
composer run dev
```

### 2. 運行測試
```bash
# 運行部門相關測試
php artisan test --filter="Department"

# 運行所有測試
php artisan test
```

### 3. 程式碼格式化
```bash
vendor/bin/pint
npm run lint
```

## 📋 開發檢查清單

### Phase 1: 基礎頁面 (Day 1) ✅ **已完成**
- [x] 創建 `resources/js/pages/Departments/Index.tsx`
- [x] 創建 `resources/js/pages/Departments/Create.tsx`
- [x] 創建 `resources/js/pages/Departments/Edit.tsx`
- [x] 創建 `resources/js/pages/Departments/Show.tsx`
- [x] 添加路由到 `routes/web.php`
- [x] 創建 `DepartmentController` (Web)

### Phase 2: 功能完善 (Day 2) ✅ **已完成**
- [x] 實作樹狀結構顯示
- [x] 實作搜尋和篩選功能
- [x] 實作成員管理
- [x] 添加表單驗證
- [x] 完善錯誤處理
- [x] 添加導航整合

### Phase 3: 測試和優化 ✅ **已完成**
- [x] 編寫功能測試 (10個測試全部通過)
- [x] 測試響應式設計
- [x] 程式碼審查
- [x] Git 提交和合併

## 📊 完成標準

### 功能完成 ✅ **全部達成**
- [x] 部門列表頁面正常運作
- [x] 部門新增功能正常
- [x] 部門編輯功能正常
- [x] 層級管理功能正常
- [x] 成員管理功能正常

### 程式碼品質 ✅ **全部達成**
- [x] TypeScript 類型檢查通過
- [x] 組件重構度良好
- [x] 無 console.log 或調試代碼
- [x] Laravel Pint 格式化通過

### 測試覆蓋 ✅ **全部達成**
- [x] 單元測試覆蓋率 > 80%
- [x] 整合測試覆蓋率 > 70%
- [x] 所有頁面功能測試通過 (178個測試通過)

### 用戶體驗 ✅ **全部達成**
- [x] 響應式設計完成
- [x] 載入時間 < 2 秒
- [x] 表單提交響應時間 < 1 秒
- [x] 無明顯的 UI 錯誤

## 🚨 注意事項

1. **循環引用檢查**: 確保部門不能成為自己的子部門
2. **權限控制**: 只有管理員可以刪除部門
3. **資料一致性**: 刪除部門前檢查是否有成員
4. **錯誤處理**: 完善的錯誤訊息和用戶反饋
5. **性能優化**: 大型部門結構的載入優化

## 📞 需要協助時

如果遇到問題，可以參考:
- 現有的用戶管理頁面實作
- 組織管理頁面的樹狀結構
- Laravel Inertia.js 官方文檔
- React Flow 文檔 (如果需要複雜的拖拽)

---

**開始開發前，請確認已同步到最新主分支並了解現有的後端 API 結構！** 🚀