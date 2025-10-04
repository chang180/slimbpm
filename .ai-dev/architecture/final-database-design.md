# SlimBPM 最終資料庫設計

## 設計原則
- **完整性**: 支援所有功能需求，避免後續大幅修改
- **擴展性**: 預留未來功能擴展空間
- **簡潔性**: 保持 Slim 定位，避免過度複雜
- **效能**: 針對 50 人以下組織優化

## 核心資料表設計

### 1. 用戶管理 (擴展現有)
```sql
-- 擴展 users 表
ALTER TABLE users ADD COLUMN organization_id BIGINT;
ALTER TABLE users ADD COLUMN role ENUM('admin', 'manager', 'user') DEFAULT 'user';
ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT true;
```

### 2. 組織架構
```sql
-- 組織設定表
CREATE TABLE organization_settings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL DEFAULT '我的公司',
    settings JSON, -- 組織設定
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- 部門表 (可選功能)
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

-- 用戶部門關聯表
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

### 3. 流程管理 (完整版)
```sql
-- 流程模板表
CREATE TABLE workflow_templates (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    definition JSON NOT NULL, -- 完整流程定義
    version VARCHAR(50) DEFAULT '1.0.0',
    parent_id BIGINT NULL, -- 父版本
    is_current BOOLEAN DEFAULT true, -- 是否為當前版本
    is_active BOOLEAN DEFAULT true,
    created_by BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (parent_id) REFERENCES workflow_templates(id)
);

-- 流程實例表
CREATE TABLE workflow_instances (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    template_id BIGINT,
    title VARCHAR(255) NOT NULL,
    form_data JSON, -- 表單資料
    status ENUM('running', 'completed', 'cancelled', 'suspended') DEFAULT 'running',
    active_steps JSON, -- 當前活躍的步驟 ID 陣列
    parallel_mode BOOLEAN DEFAULT false, -- 是否為並行模式
    started_by BIGINT,
    started_at TIMESTAMP,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES workflow_templates(id),
    FOREIGN KEY (started_by) REFERENCES users(id)
);

-- 流程步驟實例表 (新增)
CREATE TABLE workflow_step_instances (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    workflow_instance_id BIGINT,
    step_id INT NOT NULL,
    step_key VARCHAR(100) NOT NULL,
    status ENUM('pending', 'in_progress', 'approved', 'rejected', 'skipped') DEFAULT 'pending',
    assigned_to BIGINT,
    assigned_at TIMESTAMP,
    completed_at TIMESTAMP NULL,
    comments TEXT,
    data JSON, -- 步驟相關資料
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (workflow_instance_id) REFERENCES workflow_instances(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- 流程歷史記錄表 (新增)
CREATE TABLE workflow_histories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    workflow_instance_id BIGINT,
    action VARCHAR(100) NOT NULL, -- started, approved, rejected, etc.
    performed_by BIGINT,
    performed_at TIMESTAMP,
    data JSON, -- 動作相關資料
    comments TEXT,
    FOREIGN KEY (workflow_instance_id) REFERENCES workflow_instances(id),
    FOREIGN KEY (performed_by) REFERENCES users(id)
);
```

### 4. 表單系統
```sql
-- 表單模板表
CREATE TABLE form_templates (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    definition JSON NOT NULL, -- 表單定義
    workflow_template_id BIGINT NULL, -- 關聯流程模板
    is_active BOOLEAN DEFAULT true,
    created_by BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (workflow_template_id) REFERENCES workflow_templates(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 表單提交表
CREATE TABLE form_submissions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    form_template_id BIGINT,
    workflow_instance_id BIGINT NULL, -- 關聯流程實例
    data JSON NOT NULL, -- 表單資料
    submitted_by BIGINT,
    submitted_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (form_template_id) REFERENCES form_templates(id),
    FOREIGN KEY (workflow_instance_id) REFERENCES workflow_instances(id),
    FOREIGN KEY (submitted_by) REFERENCES users(id)
);
```

### 5. 通知系統
```sql
-- 通知設定表
CREATE TABLE notification_settings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    email_notifications BOOLEAN DEFAULT true,
    line_notifications BOOLEAN DEFAULT false,
    telegram_notifications BOOLEAN DEFAULT false,
    whatsapp_notifications BOOLEAN DEFAULT false,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 通知記錄表
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    type ENUM('email', 'line', 'telegram', 'whatsapp') NOT NULL,
    subject VARCHAR(255),
    content TEXT NOT NULL,
    status ENUM('pending', 'sent', 'failed') DEFAULT 'pending',
    sent_at TIMESTAMP NULL,
    created_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 流程定義 JSON 結構 (完整版)

```json
{
  "version": "1.0.0",
  "settings": {
    "allow_skip_optional": true,
    "require_all_approvers": false,
    "auto_advance": true,
    "parallel_mode": false,
    "timeout_hours": 24
  },
  "steps": [
    {
      "id": 1,
      "key": "start",
      "name": "提交申請",
      "type": "start",
      "assignee": "submitter",
      "position": {"x": 100, "y": 100}
    },
    {
      "id": 2,
      "key": "department_approval",
      "name": "部門主管審核",
      "type": "approval",
      "assignee_type": "department_manager",
      "department_id": 1,
      "approvers": ["manager1", "manager2"],
      "timeout_hours": 24,
      "allow_delegate": true,
      "position": {"x": 200, "y": 100}
    },
    {
      "id": 3,
      "key": "condition_check",
      "name": "金額判斷",
      "type": "condition",
      "condition": "amount > 10000",
      "true_path": 4,
      "false_path": 5,
      "position": {"x": 300, "y": 100}
    },
    {
      "id": 4,
      "key": "manager_approval",
      "name": "總經理審核",
      "type": "approval",
      "assignee_type": "role",
      "role": "admin",
      "position": {"x": 400, "y": 50}
    },
    {
      "id": 5,
      "key": "complete",
      "name": "完成",
      "type": "end",
      "position": {"x": 500, "y": 100}
    }
  ],
  "connections": [
    {"from": 1, "to": 2},
    {"from": 2, "to": 3},
    {"from": 3, "to": 4, "condition": "true"},
    {"from": 3, "to": 5, "condition": "false"},
    {"from": 4, "to": 5}
  ]
}
```

## 表單定義 JSON 結構

```json
{
  "fields": [
    {
      "id": "title",
      "label": "申請標題",
      "type": "text",
      "required": true,
      "validation": {
        "minLength": 2,
        "maxLength": 100
      }
    },
    {
      "id": "amount",
      "label": "金額",
      "type": "number",
      "required": true,
      "validation": {
        "min": 0,
        "max": 999999
      }
    },
    {
      "id": "description",
      "label": "申請說明",
      "type": "textarea",
      "required": true,
      "validation": {
        "maxLength": 1000
      }
    }
  ],
  "layout": {
    "sections": [
      {
        "title": "基本資訊",
        "fields": ["title", "amount", "description"]
      }
    ]
  }
}
```

## 索引設計 (效能優化)

```sql
-- 流程實例索引
CREATE INDEX idx_workflow_instances_status ON workflow_instances(status);
CREATE INDEX idx_workflow_instances_started_by ON workflow_instances(started_by);
CREATE INDEX idx_workflow_instances_created_at ON workflow_instances(created_at);

-- 流程步驟實例索引
CREATE INDEX idx_workflow_step_instances_workflow_instance_id ON workflow_step_instances(workflow_instance_id);
CREATE INDEX idx_workflow_step_instances_status ON workflow_step_instances(status);
CREATE INDEX idx_workflow_step_instances_assigned_to ON workflow_step_instances(assigned_to);

-- 流程歷史索引
CREATE INDEX idx_workflow_histories_workflow_instance_id ON workflow_histories(workflow_instance_id);
CREATE INDEX idx_workflow_histories_performed_at ON workflow_histories(performed_at);

-- 表單提交索引
CREATE INDEX idx_form_submissions_form_template_id ON form_submissions(form_template_id);
CREATE INDEX idx_form_submissions_submitted_by ON form_submissions(submitted_by);
CREATE INDEX idx_form_submissions_submitted_at ON form_submissions(submitted_at);
```

## 資料庫遷移順序

1. **Phase 1**: 基礎架構
   - 組織設定表
   - 部門管理表
   - 用戶部門關聯表

2. **Phase 2**: 流程管理
   - 流程模板表
   - 流程實例表
   - 流程步驟實例表
   - 流程歷史記錄表

3. **Phase 3**: 表單系統
   - 表單模板表
   - 表單提交表

4. **Phase 4**: 通知系統
   - 通知設定表
   - 通知記錄表

## 預估資料量 (50人組織)

- **用戶**: 50 筆
- **部門**: 10 筆
- **流程模板**: 20 筆
- **流程實例**: 1000 筆/月
- **流程步驟實例**: 5000 筆/月
- **表單提交**: 1000 筆/月

**總計**: 約 10,000 筆記錄/月，SQLite 完全足夠。

## 結論

這個設計：
1. **完整支援**所有功能需求
2. **預留擴展空間**，避免後續大幅修改
3. **保持簡潔**，符合 Slim 定位
4. **效能優化**，適合中小企業使用
5. **遷移順序**，支援分階段開發

建議採用此設計，避免後續各分支 AI 需要大幅修改資料庫結構。
