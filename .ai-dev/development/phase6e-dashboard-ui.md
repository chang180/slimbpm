# Phase 6E: 儀表板介面開發指示

## 🎯 專案概述

**目標**: 實作儀表板和報表的前端介面，包括主要儀表板、統計報表、用戶活動報表、流程效能報表等功能。

**分支**: `feature/dashboard-ui` ✅ **已建立並切換**

**開發者**: Claude Code

**預估時間**: 2 天

**實際開始時間**: 2025-01-04

**狀態**: 🔄 **開發中**

## 📍 從這裡開始

### 1. 檢查現有基礎設施

✅ **後端 API 已完成**:
- 現有的 DashboardController 基礎架構
- 統計資料 API 端點
- 報表資料處理邏輯

✅ **前端基礎設施**:
- `resources/js/pages/dashboard.tsx` - 基礎儀表板頁面
- `resources/js/layouts/AuthenticatedLayout.tsx` - 認證佈局
- UI 組件庫已建立

### 2. 需要開發的功能

需要完善的功能:
```
resources/js/pages/
├── dashboard.tsx          # 主要儀表板頁面 (需完善)
└── reports/              # 報表頁面 (需新建)
    ├── Index.tsx          # 報表列表頁面
    ├── UserActivity.tsx   # 用戶活動報表
    ├── WorkflowPerformance.tsx # 流程效能報表
    └── SystemStats.tsx    # 系統統計報表
```

### 3. 路由設定

需要在 `routes/web.php` 中添加:
```php
Route::middleware(['auth', 'verified'])->group(function () {
    // 儀表板路由
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // 報表路由
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/', [ReportsController::class, 'index'])->name('index');
        Route::get('/user-activity', [ReportsController::class, 'userActivity'])->name('user-activity');
        Route::get('/workflow-performance', [ReportsController::class, 'workflowPerformance'])->name('workflow-performance');
        Route::get('/system-stats', [ReportsController::class, 'systemStats'])->name('system-stats');
    });
});
```

## 🛠️ 技術實作重點

### 1. 主要儀表板頁面 (`/dashboard`)

**功能需求**:
- 系統概覽卡片 (用戶數、表單數、流程數等)
- 快速操作按鈕
- 最近活動列表
- 統計圖表 (使用圖表庫)

**技術實作**:
```typescript
// 使用圖表庫 (建議使用 Chart.js 或 Recharts)
import { LineChart, BarChart, PieChart } from 'recharts';

// 儀表板資料結構
interface DashboardData {
  stats: {
    totalUsers: number;
    totalForms: number;
    totalWorkflows: number;
    activeWorkflows: number;
  };
  recentActivities: Activity[];
  charts: ChartData[];
}
```

**參考現有頁面**:
- 查看 `resources/js/pages/dashboard.tsx` 的現有實作
- 查看其他頁面的卡片和圖表實作

### 2. 報表系統 (`/reports`)

**功能需求**:
- 報表列表頁面
- 用戶活動報表
- 流程效能報表
- 系統統計報表
- 報表匯出功能

**表單欄位**:
```typescript
interface ReportFilters {
  dateRange: {
    start: string;
    end: string;
  };
  type: 'daily' | 'weekly' | 'monthly';
  department?: number;
}
```

### 3. 統計圖表功能

**技術重點**:
- 實現響應式圖表
- 支援多種圖表類型 (線圖、柱狀圖、圓餅圖)
- 圖表資料即時更新
- 圖表互動功能

**圖表實作**:
```typescript
// 建議使用 Recharts 或 Chart.js
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Legend } from 'recharts';

// 圖表組件
const StatsChart: React.FC<{ data: ChartData[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        {/* 圖表線條 */}
      </LineChart>
    </ResponsiveContainer>
  );
};
```

### 4. 資料匯出功能

**功能需求**:
- 支援 CSV 格式匯出
- 支援 PDF 格式匯出 (可選)
- 報表資料過濾和排序
- 匯出進度顯示

## 📚 參考資源

### 現有組件參考
✅ **已存在的頁面**:
- `resources/js/pages/dashboard.tsx` - 基礎儀表板頁面
- `resources/js/pages/Departments/Index.tsx` - 列表頁面實作
- `resources/js/pages/Users/Index.tsx` - 搜尋和篩選功能

✅ **可重用的組件**:
- `resources/js/components/ui/card.tsx` - 卡片組件
- `resources/js/components/ui/button.tsx` - 按鈕組件
- `resources/js/components/ui/select.tsx` - 選擇器組件

### 圖表庫選擇
推薦使用 Recharts (React 專用) 或 Chart.js:
```bash
npm install recharts
# 或
npm install chart.js react-chartjs-2
```

### 類型定義
查看 `resources/js/types/index.d.ts` 中的現有類型定義，並添加:
```typescript
interface DashboardStats {
  totalUsers: number;
  totalForms: number;
  totalWorkflows: number;
  activeWorkflows: number;
  totalDepartments: number;
}

interface Activity {
  id: number;
  type: 'user_login' | 'form_submit' | 'workflow_start' | 'workflow_complete';
  user_id: number;
  description: string;
  created_at: string;
  user?: User;
}

interface ChartData {
  date: string;
  value: number;
  label?: string;
}
```

### 樣式參考
- 使用 Tailwind CSS 4 進行樣式設計
- 參考現有頁面的設計模式
- 確保響應式設計

## 🔧 開發環境設定

### 1. 安裝圖表庫
```bash
npm install recharts
# 或選擇其他圖表庫
npm install chart.js react-chartjs-2
```

### 2. 啟動開發服務器
```bash
npm run dev
composer run dev
```

### 3. 運行測試
```bash
# 運行儀表板相關測試
php artisan test --filter="Dashboard"

# 運行所有測試
php artisan test
```

### 4. 程式碼格式化
```bash
vendor/bin/pint
npm run lint
```

## 📋 開發檢查清單

### Phase 1: 儀表板完善 (Day 1)
- [ ] 完善 `resources/js/pages/dashboard.tsx`
- [ ] 實作系統概覽卡片
- [ ] 實作快速操作按鈕
- [ ] 實作最近活動列表
- [ ] 實作統計圖表

### Phase 2: 報表系統 (Day 2)
- [ ] 創建 `resources/js/pages/reports/Index.tsx`
- [ ] 創建用戶活動報表頁面
- [ ] 創建流程效能報表頁面
- [ ] 創建系統統計報表頁面
- [ ] 實作報表匯出功能

### Phase 3: 測試和優化
- [ ] 編寫功能測試
- [ ] 測試響應式設計
- [ ] 優化圖表效能
- [ ] 程式碼審查

## 📊 完成標準

### 功能完成
- [ ] 主要儀表板正常運作
- [ ] 統計報表正常顯示
- [ ] 圖表功能正常
- [ ] 資料更新正常

### 程式碼品質
- [ ] TypeScript 類型檢查通過
- [ ] ESLint 檢查通過
- [ ] 組件重構度良好
- [ ] 無 console.log 或調試代碼

### 測試覆蓋
- [ ] 單元測試覆蓋率 > 80%
- [ ] 整合測試覆蓋率 > 70%
- [ ] 所有頁面功能測試通過

### 用戶體驗
- [ ] 響應式設計完成
- [ ] 載入時間 < 2 秒
- [ ] 圖表互動流暢
- [ ] 無明顯的 UI 錯誤

## 🚨 注意事項

1. **圖表效能**: 大量資料時需要實作虛擬化或分頁
2. **資料更新**: 實作即時資料更新機制
3. **匯出功能**: 確保匯出資料的正確性和完整性
4. **響應式設計**: 確保在各種螢幕尺寸下正常顯示
5. **無障礙設計**: 確保圖表和報表符合無障礙標準

## 📞 需要協助時

如果遇到問題，可以參考:
- 現有的儀表板頁面實作
- 部門管理頁面的卡片實作
- Recharts 或 Chart.js 官方文檔
- Tailwind CSS 4 文檔

---

**開始開發前，請確認已切換到 feature/dashboard-ui 分支並了解現有的儀表板基礎架構！** 🚀
