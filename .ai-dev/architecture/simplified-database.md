# SlimBPM 簡化資料庫設計

## 設計理念
針對 50 人以下中小企業/家族使用，採用極簡設計：
- **核心表單**: 只保留必要欄位
- **流程簡化**: 線性流程為主，避免複雜分支
- **權限簡化**: 基本角色管理即可
- **部署簡單**: 單一資料庫檔案，零配置

## 核心資料表 (精簡版)

### 1. 用戶管理 (使用 Laravel 預設)
```sql
-- users 表 (Laravel 預設，無需修改)
-- 只需要添加 organization_id 欄位
ALTER TABLE users ADD COLUMN organization_id BIGINT;
ALTER TABLE users ADD COLUMN role ENUM('admin', 'manager', 'user') DEFAULT 'user';
```

### 2. 組織架構 (彈性版)
```sql
-- 組織設定表
CREATE TABLE organization_settings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL DEFAULT '我的公司',
    settings JSON, -- 組織設定
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- 部門表 (可選，使用者自行決定是否使用)
CREATE TABLE departments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id BIGINT NULL, -- 支援層級部門
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES departments(id)
);

-- 用戶部門關聯 (可選)
CREATE TABLE user_departments (
    user_id BIGINT,
    department_id BIGINT,
    is_manager BOOLEAN DEFAULT false, -- 是否為部門主管
    created_at TIMESTAMP,
    PRIMARY KEY (user_id, department_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);
```

### 3. 流程管理 (精簡版)
```sql
-- 流程模板表
CREATE TABLE workflow_templates (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    steps JSON NOT NULL, -- 簡化的步驟定義
    is_active BOOLEAN DEFAULT true,
    created_by BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 流程實例表
CREATE TABLE workflow_instances (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    template_id BIGINT,
    title VARCHAR(255) NOT NULL,
    form_data JSON, -- 表單資料
    current_step INT DEFAULT 1,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    submitted_by BIGINT,
    approved_by BIGINT NULL,
    submitted_at TIMESTAMP,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES workflow_templates(id),
    FOREIGN KEY (submitted_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
);
```

### 4. 表單系統 (極簡版)
```sql
-- 表單模板表
CREATE TABLE form_templates (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    fields JSON NOT NULL, -- 表單欄位定義
    is_active BOOLEAN DEFAULT true,
    created_by BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

## 簡化流程設計

### 1. 流程步驟定義 (彈性 JSON 格式)
```json
{
  "steps": [
    {
      "id": 1,
      "name": "提交申請",
      "type": "submit",
      "assignee": "submitter"
    },
    {
      "id": 2, 
      "name": "部門主管審核",
      "type": "approval",
      "assignee_type": "department_manager", // 部門主管
      "department_id": 1, // 可選：指定部門
      "approvers": ["manager1", "manager2"]
    },
    {
      "id": 3,
      "name": "跨部門會簽", // 可選步驟
      "type": "approval",
      "assignee_type": "specific_users",
      "approvers": ["user1", "user2"],
      "is_optional": true // 可選步驟
    },
    {
      "id": 4,
      "name": "總經理審核",
      "type": "approval",
      "assignee_type": "role",
      "role": "admin"
    },
    {
      "id": 5,
      "name": "完成",
      "type": "complete"
    }
  ],
  "settings": {
    "allow_skip_optional": true, // 允許跳過可選步驟
    "require_all_approvers": false, // 是否需要所有審核者同意
    "auto_advance": true // 自動推進到下一步
  }
}
```

### 2. 表單欄位定義 (JSON 格式)
```json
{
  "fields": [
    {
      "id": "title",
      "label": "申請標題",
      "type": "text",
      "required": true
    },
    {
      "id": "description", 
      "label": "申請說明",
      "type": "textarea",
      "required": true
    },
    {
      "id": "amount",
      "label": "金額",
      "type": "number",
      "required": false
    }
  ]
}
```

## 權限系統 (極簡版)

### 1. 角色定義
```php
// 簡化角色系統
enum UserRole: string
{
    case ADMIN = 'admin';      // 系統管理員
    case MANAGER = 'manager';  // 主管
    case USER = 'user';        // 一般用戶
}
```

### 2. 權限檢查 (彈性版)
```php
// 彈性權限檢查
class PermissionChecker
{
    public function canApprove(User $user, WorkflowInstance $instance, array $stepConfig): bool
    {
        // 系統管理員
        if ($user->role === 'admin') {
            return true;
        }
        
        // 根據步驟配置檢查權限
        switch ($stepConfig['assignee_type']) {
            case 'role':
                return $user->role === $stepConfig['role'];
                
            case 'department_manager':
                return $this->isDepartmentManager($user, $stepConfig['department_id'] ?? null);
                
            case 'specific_users':
                return in_array($user->id, $stepConfig['approvers']);
                
            default:
                return false;
        }
    }
    
    public function canView(User $user, WorkflowInstance $instance): bool
    {
        return $user->id === $instance->submitted_by || 
               $user->role === 'admin' || 
               $this->isInvolvedInWorkflow($user, $instance);
    }
    
    private function isDepartmentManager(User $user, ?int $departmentId): bool
    {
        if (!$departmentId) {
            return $user->role === 'manager';
        }
        
        return $user->departments()
            ->where('department_id', $departmentId)
            ->where('is_manager', true)
            ->exists();
    }
    
    private function isInvolvedInWorkflow(User $user, WorkflowInstance $instance): bool
    {
        // 檢查是否為流程中的審核者
        $template = $instance->template;
        foreach ($template->steps as $step) {
            if ($step['assignee_type'] === 'specific_users' && 
                in_array($user->id, $step['approvers'])) {
                return true;
            }
        }
        return false;
    }
}
```

## 通知系統 (極簡版)

### 1. 通知設定
```sql
-- 通知設定表
CREATE TABLE notification_settings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    email_notifications BOOLEAN DEFAULT true,
    line_notifications BOOLEAN DEFAULT false,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 2. 通知模板 (硬編碼)
```php
// 簡化通知模板
class NotificationTemplates
{
    public static function workflowSubmitted(): string
    {
        return "您有一個新的申請需要審核：{title}";
    }
    
    public static function workflowApproved(): string
    {
        return "您的申請已通過：{title}";
    }
    
    public static function workflowRejected(): string
    {
        return "您的申請被拒絕：{title}";
    }
}
```

## 部署配置

### 1. 環境配置
```env
# 開發環境 - 使用 SQLite
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

# 生產環境 - 可選 MySQL
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=slimbpm
DB_USERNAME=root
DB_PASSWORD=
```

### 2. 資料庫遷移
```php
// 簡化的遷移檔案
Schema::create('workflow_templates', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->text('description')->nullable();
    $table->json('steps'); // 步驟定義
    $table->boolean('is_active')->default(true);
    $table->foreignId('created_by')->constrained('users');
    $table->timestamps();
});
```

## 效能考量 (簡化版)

### 1. 索引設計
```sql
-- 基本索引即可
CREATE INDEX idx_workflow_instances_status ON workflow_instances(status);
CREATE INDEX idx_workflow_instances_submitted_by ON workflow_instances(submitted_by);
CREATE INDEX idx_workflow_instances_created_at ON workflow_instances(created_at);
```

### 2. 快取策略
- 流程模板快取 (簡單的記憶體快取)
- 用戶權限快取 (Session 快取)

## 優勢總結

1. **部署簡單**: 單一 SQLite 檔案，零配置
2. **維護容易**: 表單結構簡單，易於理解
3. **效能足夠**: 50人以下組織，SQLite 完全夠用
4. **成本低廉**: 無需複雜的資料庫伺服器
5. **學習成本低**: 簡單的資料結構，容易上手

這個簡化設計更符合 "Slim" 的產品定位，專注於核心功能，避免過度工程化。
