# 流程設計功能規格與資料庫規劃符合度分析

## 分析結果

### ✅ 符合的功能
1. **基本流程定義**: JSON 格式儲存流程步驟
2. **彈性審核者指派**: 支援角色、部門主管、指定人員
3. **組織架構**: 部門管理和用戶關聯
4. **表單整合**: 表單資料與流程實例關聯

### ⚠️ 需要調整的部分

#### 1. 流程步驟實例追蹤
**問題**: 目前只有 `current_step` 整數，無法追蹤多個並行步驟
**解決方案**: 新增 `workflow_step_instances` 表

```sql
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
    data JSON,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (workflow_instance_id) REFERENCES workflow_instances(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);
```

#### 2. 條件節點支援
**問題**: JSON 結構缺少條件表達式支援
**解決方案**: 擴展 JSON 結構

```json
{
  "steps": [
    {
      "id": 3,
      "name": "條件判斷",
      "type": "condition",
      "condition": "amount > 5000",
      "true_path": 4,
      "false_path": 5
    }
  ]
}
```

#### 3. 並行處理支援
**問題**: 無法處理多個並行審核
**解決方案**: 修改流程實例狀態管理

```sql
-- 修改 workflow_instances 表
ALTER TABLE workflow_instances 
ADD COLUMN active_steps JSON, -- 當前活躍的步驟
ADD COLUMN parallel_mode BOOLEAN DEFAULT false; -- 是否為並行模式
```

#### 4. 流程版本管理
**問題**: 缺少版本控制
**解決方案**: 新增版本欄位

```sql
-- 修改 workflow_templates 表
ALTER TABLE workflow_templates 
ADD COLUMN version VARCHAR(50) DEFAULT '1.0.0',
ADD COLUMN parent_id BIGINT NULL, -- 父版本
ADD COLUMN is_current BOOLEAN DEFAULT true; -- 是否為當前版本
```

#### 5. 流程歷史記錄
**問題**: 缺少詳細的執行歷史
**解決方案**: 新增歷史記錄表

```sql
CREATE TABLE workflow_histories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    workflow_instance_id BIGINT,
    action VARCHAR(100) NOT NULL, -- started, approved, rejected, etc.
    performed_by BIGINT,
    performed_at TIMESTAMP,
    data JSON,
    comments TEXT,
    FOREIGN KEY (workflow_instance_id) REFERENCES workflow_instances(id),
    FOREIGN KEY (performed_by) REFERENCES users(id)
);
```

## 建議的完整資料庫結構

### 1. 流程模板表 (增強版)
```sql
CREATE TABLE workflow_templates (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    definition JSON NOT NULL, -- 完整的流程定義
    version VARCHAR(50) DEFAULT '1.0.0',
    parent_id BIGINT NULL,
    is_current BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_by BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (parent_id) REFERENCES workflow_templates(id)
);
```

### 2. 流程實例表 (增強版)
```sql
CREATE TABLE workflow_instances (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    template_id BIGINT,
    title VARCHAR(255) NOT NULL,
    form_data JSON,
    status ENUM('running', 'completed', 'cancelled', 'suspended') DEFAULT 'running',
    active_steps JSON, -- 當前活躍的步驟
    parallel_mode BOOLEAN DEFAULT false,
    started_by BIGINT,
    started_at TIMESTAMP,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES workflow_templates(id),
    FOREIGN KEY (started_by) REFERENCES users(id)
);
```

### 3. 流程步驟實例表 (新增)
```sql
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
    data JSON,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (workflow_instance_id) REFERENCES workflow_instances(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);
```

### 4. 流程歷史記錄表 (新增)
```sql
CREATE TABLE workflow_histories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    workflow_instance_id BIGINT,
    action VARCHAR(100) NOT NULL,
    performed_by BIGINT,
    performed_at TIMESTAMP,
    data JSON,
    comments TEXT,
    FOREIGN KEY (workflow_instance_id) REFERENCES workflow_instances(id),
    FOREIGN KEY (performed_by) REFERENCES users(id)
);
```

## 建議的 JSON 結構 (增強版)

### 流程定義 JSON
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
      "assignee": "submitter"
    },
    {
      "id": 2,
      "key": "department_approval",
      "name": "部門主管審核",
      "type": "approval",
      "assignee_type": "department_manager",
      "department_id": 1,
      "approvers": ["manager1", "manager2"],
      "timeout": 86400, // 24小時
      "allow_delegate": true
    },
    {
      "id": 3,
      "key": "condition_check",
      "name": "金額判斷",
      "type": "condition",
      "condition": "amount > 10000",
      "true_path": 4,
      "false_path": 5
    },
    {
      "id": 4,
      "key": "manager_approval",
      "name": "總經理審核",
      "type": "approval",
      "assignee_type": "role",
      "role": "admin"
    },
    {
      "id": 5,
      "key": "complete",
      "name": "完成",
      "type": "end"
    }
  ]
}
```

## 結論

目前的資料庫設計基本符合流程設計功能規格，但需要以下增強：

1. **新增流程步驟實例表** - 支援詳細的步驟追蹤
2. **增強流程實例表** - 支援並行處理和活躍步驟管理
3. **新增流程歷史表** - 支援完整的執行歷史記錄
4. **擴展 JSON 結構** - 支援條件節點和更複雜的流程邏輯
5. **新增版本管理** - 支援流程模板的版本控制

這些調整將使資料庫設計完全符合流程設計器的功能需求。
