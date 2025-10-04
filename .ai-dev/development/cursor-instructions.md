# Cursor 開發指示檔案

## 🎯 開發任務：Phase 4 - 表單系統

### 當前狀態
- **分支**: `feature/form-builder`
- **Linear Issue**: DEV-39 - Phase 4: 表單系統
- **開發者**: Cursor (總協調者)
- **開始時間**: 2025年10月4日

## 📋 開發任務清單

### 1. 表單設計器 UI
- [ ] 建立表單設計器組件
- [ ] 實作拖拽式欄位建立
- [ ] 支援多種欄位類型 (文字、數字、選擇、日期等)
- [ ] 欄位驗證規則設定
- [ ] 條件式欄位顯示

### 2. 動態表單渲染
- [ ] 建立動態表單渲染引擎
- [ ] 支援 JSON Schema 表單定義
- [ ] 表單驗證引擎
- [ ] 表單資料處理

### 3. 表單模板系統
- [ ] 表單模板 CRUD 操作
- [ ] 模板複製和分享功能
- [ ] 模板版本管理
- [ ] 模板分類和搜尋

### 4. 表單提交處理
- [ ] 表單提交 API
- [ ] 表單資料驗證
- [ ] 檔案上傳支援
- [ ] 表單資料匯出

### 5. 表單與流程整合
- [ ] 表單與流程模板關聯
- [ ] 表單資料在流程中的使用
- [ ] 表單欄位條件觸發流程
- [ ] 流程表單資料驗證

## 🏗️ 技術實作指南

### 1. 前端技術棧
```bash
# 安裝表單相關套件
npm install react-hook-form
npm install @hookform/resolvers
npm install zod
npm install react-dropzone
```

### 2. 表單設計器組件
```tsx
// resources/js/components/FormDesigner.tsx
import { useForm } from 'react-hook-form';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface FormDesignerProps {
  formTemplate?: FormTemplate;
  onSave: (definition: FormDefinition) => void;
}

const FormDesigner: React.FC<FormDesignerProps> = ({ formTemplate, onSave }) => {
  // 實作表單設計器邏輯
};
```

### 3. 動態表單渲染
```tsx
// resources/js/components/DynamicForm.tsx
interface DynamicFormProps {
  definition: FormDefinition;
  onSubmit: (data: FormData) => void;
  initialData?: Record<string, any>;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ definition, onSubmit, initialData }) => {
  // 實作動態表單渲染邏輯
};
```

### 4. 表單定義 JSON 結構
```typescript
// resources/js/types/FormTypes.ts
export interface FormDefinition {
  fields: FormField[];
  layout: FormLayout;
  validation: FormValidation;
}

export interface FormField {
  id: string;
  type: 'text' | 'number' | 'email' | 'select' | 'textarea' | 'date' | 'file';
  label: string;
  required: boolean;
  validation?: FieldValidation;
  options?: SelectOption[];
  conditional?: ConditionalLogic;
}
```

### 5. 後端 API 實作
```php
// app/Http/Controllers/Api/FormController.php
class FormController extends Controller
{
    public function index() // 取得表單模板列表
    public function store(Request $request) // 建立新表單模板
    public function show(FormTemplate $form) // 取得表單模板詳情
    public function update(Request $request, FormTemplate $form) // 更新表單模板
    public function destroy(FormTemplate $form) // 刪除表單模板
    public function submit(Request $request, FormTemplate $form) // 提交表單
}
```

### 6. 表單驗證引擎
```php
// app/Services/FormValidationEngine.php
class FormValidationEngine
{
    public function validateField(FormField $field, $value): ValidationResult
    {
        // 實作欄位驗證邏輯
    }
    
    public function validateForm(FormTemplate $template, array $data): ValidationResult
    {
        // 實作表單驗證邏輯
    }
    
    public function checkConditionalLogic(FormField $field, array $formData): bool
    {
        // 實作條件式邏輯檢查
    }
}
```

## 📊 資料庫結構參考

### 已建立的資料表
- `form_templates` - 表單模板
- `form_submissions` - 表單提交
- `workflow_templates` - 流程模板 (關聯)
- `workflow_instances` - 流程實例 (關聯)

### 表單定義 JSON 結構
```json
{
  "fields": [
    {
      "id": "title",
      "type": "text",
      "label": "申請標題",
      "required": true,
      "validation": {
        "minLength": 2,
        "maxLength": 100
      }
    },
    {
      "id": "amount",
      "type": "number",
      "label": "金額",
      "required": true,
      "validation": {
        "min": 0,
        "max": 999999
      }
    }
  ],
  "layout": {
    "sections": [
      {
        "title": "基本資訊",
        "fields": ["title", "amount"]
      }
    ]
  }
}
```

## 🧪 測試要求

### 1. 建立測試檔案
```bash
php artisan make:test --pest FormDesignerTest
php artisan make:test --pest FormValidationTest
php artisan make:test --pest FormSubmissionTest
```

### 2. 前端測試
```bash
# 安裝測試套件
npm install --save-dev @testing-library/react @testing-library/jest-dom
npm install --save-dev vitest jsdom
```

### 3. 測試案例
- 表單設計器 UI 測試
- 動態表單渲染測試
- 表單驗證測試
- API 端點測試

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
git commit -m "feat: Add form designer UI with drag-and-drop

- Implement FormDesigner component with field types
- Add dynamic form rendering engine
- Create form validation system
- Add form template management

Progress: Form Designer UI completed (1/5 tasks)
Next: Dynamic form rendering implementation"
```

### 3. 進度更新
- 在 commit message 中記錄進度
- 更新開發文件
- 記錄遇到的問題和解決方案
- 使用 git commit 來追蹤進度

## 🚨 注意事項

### 1. 前端架構
- 使用 React 19 + TypeScript
- React Hook Form 用於表單管理
- 拖拽式表單設計器
- 動態表單渲染引擎

### 2. 表單驗證
- 前端即時驗證
- 後端安全驗證
- 條件式驗證規則
- 自定義驗證邏輯

### 3. 效能考量
- 大型表單的渲染效能
- 表單資料的處理效能
- 檔案上傳的處理
- 資料庫查詢優化

## 📞 支援資源

### 1. 文件參考
- React Hook Form 官方文件
- Laravel 12 官方文件
- React 19 官方文件
- Tailwind CSS 4 文件

### 2. 現有程式碼
- 查看 `app/Models/` 中的 Form 相關 Model
- 參考 `database/migrations/` 中的表單相關資料表
- 查看 `resources/js/` 中的現有組件

### 3. 問題回報
- 遇到問題時在 commit message 中記錄
- 提供詳細的錯誤訊息和重現步驟
- 包含相關的程式碼片段
- 使用 git commit 來追蹤問題和解決方案

## 🎯 完成標準

### 1. 功能完成
- [ ] 表單設計器 UI 正常運作
- [ ] 動態表單渲染完整
- [ ] 表單驗證系統完整
- [ ] API 端點測試通過

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
**預估完成時間**: 2025年10月25日 (3週)  
**負責 AI**: Cursor (總協調者)  
**Linear Issue**: DEV-39
