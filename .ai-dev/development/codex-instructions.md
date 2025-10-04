# Codex 開發指示檔案

## 🎯 開發任務：Phase 3 - 流程設計器

### 當前狀態
- **分支**: `feature/workflow-designer`
- **Linear Issue**: DEV-38 - Phase 3: 流程設計器
- **開發者**: Codex
- **開始時間**: 2025年10月4日

## 📋 開發任務清單

### 1. 流程設計器 UI (React Flow)
- [ ] 安裝和設定 React Flow
- [ ] 建立流程設計器組件
- [ ] 實作拖拽式節點建立
- [ ] 支援多種節點類型 (開始、審核、條件、結束)
- [ ] 節點連接和流程線

### 2. 流程定義 API
- [ ] 建立 WorkflowController API 端點
- [ ] 流程模板的 CRUD 操作
- [ ] 流程定義的驗證和儲存
- [ ] 流程版本管理

### 3. 流程執行引擎
- [ ] 建立 WorkflowEngine 核心類別
- [ ] 實作流程狀態管理
- [ ] 支援條件式流程
- [ ] 並行處理支援

### 4. 流程狀態管理
- [ ] 流程實例狀態追蹤
- [ ] 步驟實例狀態管理
- [ ] 流程歷史記錄
- [ ] 狀態轉換邏輯

### 5. 條件式流程支援
- [ ] 條件節點實作
- [ ] 條件表達式解析
- [ ] 分支邏輯處理
- [ ] 預設路徑設定

### 6. 流程模板系統
- [ ] 預設流程模板
- [ ] 模板複製功能
- [ ] 模板匯入匯出
- [ ] 模板版本管理

## 🏗️ 技術實作指南

### 1. 前端技術棧
```bash
# 安裝 React Flow
npm install reactflow

# 安裝其他必要套件
npm install @types/react @types/react-dom
npm install react-hook-form
npm install zustand
```

### 2. 流程設計器組件
```tsx
// resources/js/components/WorkflowDesigner.tsx
import ReactFlow, { Node, Edge } from 'reactflow';

interface WorkflowDesignerProps {
  workflow?: WorkflowTemplate;
  onSave: (definition: WorkflowDefinition) => void;
}

const WorkflowDesigner: React.FC<WorkflowDesignerProps> = ({ workflow, onSave }) => {
  // 實作流程設計器邏輯
};
```

### 3. 節點類型定義
```typescript
// resources/js/types/WorkflowTypes.ts
export interface WorkflowNode {
  id: string;
  type: 'start' | 'approval' | 'condition' | 'end';
  position: { x: number; y: number };
  data: {
    label: string;
    config: NodeConfig;
  };
}

export interface NodeConfig {
  assigneeType?: 'role' | 'department_manager' | 'specific_users';
  assignees?: string[];
  condition?: string;
  timeout?: number;
}
```

### 4. 流程引擎實作
```php
// app/Services/WorkflowEngine.php
class WorkflowEngine
{
    public function startWorkflow(WorkflowTemplate $template, array $data, User $user): WorkflowInstance
    {
        // 實作流程啟動邏輯
    }
    
    public function executeStep(WorkflowStepInstance $step, array $data): void
    {
        // 實作步驟執行邏輯
    }
    
    public function handleCondition(WorkflowStep $step, array $data): string
    {
        // 實作條件處理邏輯
    }
}
```

### 5. API 端點實作
```php
// app/Http/Controllers/Api/WorkflowController.php
class WorkflowController extends Controller
{
    public function index() // 取得流程模板列表
    public function store(Request $request) // 建立新流程模板
    public function show(WorkflowTemplate $workflow) // 取得流程模板詳情
    public function update(Request $request, WorkflowTemplate $workflow) // 更新流程模板
    public function destroy(WorkflowTemplate $workflow) // 刪除流程模板
    public function execute(Request $request, WorkflowTemplate $workflow) // 執行流程
}
```

## 📊 資料庫結構參考

### 已建立的資料表
- `workflow_templates` - 流程模板
- `workflow_instances` - 流程實例
- `workflow_step_instances` - 流程步驟實例
- `workflow_histories` - 流程歷史記錄

### 流程定義 JSON 結構
```json
{
  "version": "1.0.0",
  "settings": {
    "allow_skip_optional": true,
    "require_all_approvers": false,
    "auto_advance": true,
    "parallel_mode": false
  },
  "steps": [
    {
      "id": 1,
      "key": "start",
      "name": "提交申請",
      "type": "start",
      "position": {"x": 100, "y": 100}
    },
    {
      "id": 2,
      "key": "approval",
      "name": "主管審核",
      "type": "approval",
      "assigneeType": "department_manager",
      "position": {"x": 200, "y": 100}
    }
  ],
  "connections": [
    {"from": 1, "to": 2}
  ]
}
```

## 🧪 測試要求

### 1. 建立測試檔案
```bash
php artisan make:test --pest WorkflowDesignerTest
php artisan make:test --pest WorkflowEngineTest
php artisan make:test --pest WorkflowExecutionTest
```

### 2. 前端測試
```bash
# 安裝測試套件
npm install --save-dev @testing-library/react @testing-library/jest-dom
npm install --save-dev vitest jsdom
```

### 3. 測試案例
- 流程設計器 UI 測試
- 流程引擎邏輯測試
- API 端點測試
- 流程執行測試

## 🔧 開發環境設定

### 1. 確認環境
```bash
# 確認 Laravel 版本
php artisan --version

# 確認 Node.js 版本
node --version
npm --version

# 確認前端建置
npm run build
```

### 2. 前端開發
```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 建置生產版本
npm run build
```

### 3. 程式碼格式化
```bash
# PHP 格式化
vendor/bin/pint --dirty

# JavaScript 格式化
npm run format
```

## 📝 開發流程

### 1. 每日開發流程
1. 拉取最新主分支更新
2. 檢查當前分支狀態
3. 實作當日任務
4. 執行測試確保品質
5. 提交變動並推送到分支
6. 在 commit message 中記錄進度

### 2. 提交規範
```bash
# 提交格式 - 使用詳細的 commit message 來追蹤進度
git commit -m "feat: Add workflow designer UI with React Flow

- Implement WorkflowDesigner component with drag-and-drop
- Add support for multiple node types (start, approval, condition, end)
- Create workflow definition validation
- Add workflow template management

Progress: Workflow Designer UI completed (1/6 tasks)
Next: Workflow execution engine implementation"
```

### 3. 進度更新
- 在 commit message 中記錄進度
- 更新開發文件
- 記錄遇到的問題和解決方案
- 使用 git commit 來追蹤進度

## 🚨 注意事項

### 1. 前端架構
- 使用 React 19 + TypeScript
- React Flow 用於流程圖視覺化
- Zustand 用於狀態管理
- Tailwind CSS 4 用於樣式

### 2. 流程引擎設計
- 使用狀態機模式
- 支援條件式分支
- 並行處理支援
- 事件驅動架構

### 3. 效能考量
- 大型流程的渲染效能
- 流程執行的效能優化
- 前端組件的記憶體管理
- 資料庫查詢優化

## 📞 支援資源

### 1. 文件參考
- React Flow 官方文件
- Laravel 12 官方文件
- React 19 官方文件
- Tailwind CSS 4 文件

### 2. 現有程式碼
- 查看 `app/Models/` 中的 Workflow 相關 Model
- 參考 `database/migrations/` 中的流程相關資料表
- 查看 `resources/js/` 中的現有組件

### 3. 問題回報
- 遇到問題時在 commit message 中記錄
- 提供詳細的錯誤訊息和重現步驟
- 包含相關的程式碼片段
- 使用 git commit 來追蹤問題和解決方案

## 🎯 完成標準

### 1. 功能完成
- [ ] 流程設計器 UI 正常運作
- [ ] 流程執行引擎完整
- [ ] API 端點測試通過
- [ ] 條件式流程支援

### 2. 程式碼品質
- [ ] 程式碼通過 Lint 檢查
- [ ] 測試覆蓋率達到要求
- [ ] 程式碼文件完整
- [ ] 無明顯的效能問題

### 3. 文件更新
- [ ] API 文件更新
- [ ] 開發文件更新
- [ ] 測試文件更新
- [ ] 部署文件更新

---
**開始開發時間**: 2025年10月4日  
**預估完成時間**: 2025年10月18日 (2週)  
**負責 AI**: Codex  
**Linear Issue**: DEV-38
