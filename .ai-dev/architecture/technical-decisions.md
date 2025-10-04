# SlimBPM 技術決策文件

## 資料庫設計決策 (簡化版)

### 1. 資料庫選擇
**決策**: SQLite (開發/測試) + MySQL (生產環境)
**理由**:
- 50人以下組織，資料量不大
- SQLite 足夠應付小型組織需求
- 降低部署複雜度
- 零配置，開箱即用

### 2. 流程引擎架構
**決策**: 極簡流程引擎
**理由**:
- 專注核心功能：申請 → 審核 → 完成
- 避免複雜的並行處理
- 簡單的線性流程為主
- 降低維護成本

### 3. 流程狀態管理
**決策**: 使用狀態機模式 + 事件驅動
**實作方式**:
```php
// 流程狀態枚舉
enum WorkflowStatus: string
{
    case DRAFT = 'draft';
    case ACTIVE = 'active';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';
    case SUSPENDED = 'suspended';
}

// 步驟狀態枚舉
enum StepStatus: string
{
    case PENDING = 'pending';
    case IN_PROGRESS = 'in_progress';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';
    case SKIPPED = 'skipped';
}
```

## 核心資料表設計

### 1. 組織架構表
```sql
-- 組織表
CREATE TABLE organizations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    settings JSON,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- 部門表
CREATE TABLE departments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    organization_id BIGINT,
    name VARCHAR(255) NOT NULL,
    parent_id BIGINT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id),
    FOREIGN KEY (parent_id) REFERENCES departments(id)
);
```

### 2. 流程定義表
```sql
-- 流程定義表
CREATE TABLE workflows (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    organization_id BIGINT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    definition JSON NOT NULL, -- 流程定義 JSON
    version VARCHAR(50) DEFAULT '1.0.0',
    status ENUM('draft', 'active', 'archived') DEFAULT 'draft',
    created_by BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 流程實例表
CREATE TABLE workflow_instances (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    workflow_id BIGINT,
    title VARCHAR(255) NOT NULL,
    data JSON, -- 流程資料
    status ENUM('running', 'completed', 'cancelled', 'suspended') DEFAULT 'running',
    started_by BIGINT,
    started_at TIMESTAMP,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (workflow_id) REFERENCES workflows(id),
    FOREIGN KEY (started_by) REFERENCES users(id)
);
```

### 3. 流程步驟表
```sql
-- 流程步驟定義表
CREATE TABLE workflow_steps (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    workflow_id BIGINT,
    step_key VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type ENUM('start', 'approval', 'condition', 'parallel', 'end') NOT NULL,
    config JSON, -- 步驟配置
    position_x INT DEFAULT 0,
    position_y INT DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (workflow_id) REFERENCES workflows(id)
);

-- 流程步驟實例表
CREATE TABLE workflow_step_instances (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    workflow_instance_id BIGINT,
    workflow_step_id BIGINT,
    step_key VARCHAR(100) NOT NULL,
    status ENUM('pending', 'in_progress', 'approved', 'rejected', 'skipped') DEFAULT 'pending',
    assigned_to BIGINT,
    assigned_at TIMESTAMP,
    completed_at TIMESTAMP NULL,
    comments TEXT,
    data JSON, -- 步驟資料
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (workflow_instance_id) REFERENCES workflow_instances(id),
    FOREIGN KEY (workflow_step_id) REFERENCES workflow_steps(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);
```

## 流程引擎設計

### 1. 核心類別架構
```php
// 流程引擎核心
class WorkflowEngine
{
    public function startWorkflow(Workflow $workflow, array $data, User $user): WorkflowInstance
    public function executeStep(WorkflowStepInstance $step, array $data): void
    public function completeStep(WorkflowStepInstance $step, string $action, array $data): void
    public function getNextSteps(WorkflowInstance $instance): Collection
}

// 流程執行器
class WorkflowExecutor
{
    public function execute(WorkflowInstance $instance): void
    public function processStep(WorkflowStepInstance $step): void
    public function handleCondition(WorkflowStep $step, array $data): string
}

// 狀態管理器
class WorkflowStateManager
{
    public function updateStatus(WorkflowInstance $instance, WorkflowStatus $status): void
    public function updateStepStatus(WorkflowStepInstance $step, StepStatus $status): void
    public function getCurrentState(WorkflowInstance $instance): array
}
```

### 2. 事件系統
```php
// 流程事件
class WorkflowStarted
class WorkflowCompleted
class StepAssigned
class StepCompleted
class WorkflowSuspended

// 事件監聽器
class WorkflowEventListener
{
    public function handleWorkflowStarted(WorkflowStarted $event): void
    public function handleStepAssigned(StepAssigned $event): void
    public function handleWorkflowCompleted(WorkflowCompleted $event): void
}
```

## 表單系統設計

### 1. 動態表單結構
```sql
-- 表單定義表
CREATE TABLE forms (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    organization_id BIGINT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    definition JSON NOT NULL, -- 表單定義 JSON
    workflow_id BIGINT NULL, -- 關聯流程
    created_by BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id),
    FOREIGN KEY (workflow_id) REFERENCES workflows(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 表單提交表
CREATE TABLE form_submissions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    form_id BIGINT,
    workflow_instance_id BIGINT NULL,
    data JSON NOT NULL, -- 表單資料
    submitted_by BIGINT,
    submitted_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (form_id) REFERENCES forms(id),
    FOREIGN KEY (workflow_instance_id) REFERENCES workflow_instances(id),
    FOREIGN KEY (submitted_by) REFERENCES users(id)
);
```

### 2. 表單定義 JSON 結構
```json
{
  "fields": [
    {
      "id": "field_1",
      "type": "text",
      "label": "申請人姓名",
      "required": true,
      "validation": {
        "minLength": 2,
        "maxLength": 50
      }
    },
    {
      "id": "field_2", 
      "type": "select",
      "label": "申請類型",
      "options": [
        {"value": "leave", "label": "請假"},
        {"value": "expense", "label": "費用申請"}
      ],
      "required": true
    }
  ],
  "layout": {
    "sections": [
      {
        "title": "基本資訊",
        "fields": ["field_1", "field_2"]
      }
    ]
  }
}
```

## 權限系統設計

### 1. 角色權限表
```sql
-- 角色表
CREATE TABLE roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    organization_id BIGINT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- 權限表
CREATE TABLE permissions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    created_at TIMESTAMP
);

-- 角色權限關聯表
CREATE TABLE role_permissions (
    role_id BIGINT,
    permission_id BIGINT,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id)
);

-- 用戶角色關聯表
CREATE TABLE user_roles (
    user_id BIGINT,
    role_id BIGINT,
    organization_id BIGINT,
    PRIMARY KEY (user_id, role_id, organization_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
);
```

## 通知系統設計

### 1. 通知管道表
```sql
-- 通知管道表
CREATE TABLE notification_channels (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    organization_id BIGINT,
    name VARCHAR(255) NOT NULL,
    type ENUM('email', 'line', 'telegram', 'whatsapp') NOT NULL,
    config JSON NOT NULL, -- 管道配置
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- 通知模板表
CREATE TABLE notification_templates (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    organization_id BIGINT,
    name VARCHAR(255) NOT NULL,
    type ENUM('workflow_started', 'step_assigned', 'workflow_completed') NOT NULL,
    subject VARCHAR(255),
    content TEXT NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
);
```

## 效能優化策略

### 1. 索引設計
- workflow_instances: (workflow_id, status, started_at)
- workflow_step_instances: (workflow_instance_id, status, assigned_to)
- form_submissions: (form_id, submitted_at)

### 2. 快取策略
- 流程定義快取 (Redis)
- 用戶權限快取
- 組織設定快取

### 3. 分頁和查詢優化
- 使用 Laravel 的 lazy loading
- 實作適當的 API 分頁
- 避免 N+1 查詢問題
