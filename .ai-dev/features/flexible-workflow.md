# 彈性流程設計功能

## 設計理念
在保持簡潔的基礎上，提供足夠的彈性讓使用者根據組織需求自行配置流程。

## 流程配置選項

### 1. 基本流程類型
- **簡單流程**: 提交 → 審核 → 完成
- **部門流程**: 提交 → 部門主管 → 跨部門會簽 → 完成
- **多層審核**: 提交 → 直屬主管 → 部門主管 → 總經理 → 完成
- **自定義流程**: 使用者完全自定義

### 2. 審核者指派方式
```json
{
  "assignee_types": [
    {
      "type": "role",
      "description": "依角色指派",
      "example": "所有主管都可以審核"
    },
    {
      "type": "department_manager", 
      "description": "部門主管",
      "example": "申請人部門的主管"
    },
    {
      "type": "specific_users",
      "description": "指定人員",
      "example": "特定幾位審核者"
    },
    {
      "type": "hierarchy",
      "description": "層級指派",
      "example": "申請人的上級主管"
    }
  ]
}
```

### 3. 流程步驟配置
```json
{
  "step_configuration": {
    "required_steps": [
      {
        "name": "提交申請",
        "type": "submit",
        "mandatory": true
      },
      {
        "name": "主管審核", 
        "type": "approval",
        "mandatory": true,
        "assignee_type": "department_manager"
      }
    ],
    "optional_steps": [
      {
        "name": "跨部門會簽",
        "type": "approval", 
        "mandatory": false,
        "assignee_type": "specific_users",
        "condition": "amount > 10000" // 條件觸發
      },
      {
        "name": "財務審核",
        "type": "approval",
        "mandatory": false,
        "assignee_type": "role",
        "role": "finance_manager"
      }
    ]
  }
}
```

## 部門管理功能

### 1. 部門設定 (可選功能)
```php
// 部門管理
class DepartmentManager
{
    public function createDepartment(string $name, ?int $parentId = null): Department
    {
        return Department::create([
            'name' => $name,
            'parent_id' => $parentId,
            'is_active' => true
        ]);
    }
    
    public function assignUserToDepartment(User $user, Department $department, bool $isManager = false): void
    {
        UserDepartment::create([
            'user_id' => $user->id,
            'department_id' => $department->id,
            'is_manager' => $isManager
        ]);
    }
    
    public function getDepartmentHierarchy(): Collection
    {
        return Department::with('children')
            ->whereNull('parent_id')
            ->get();
    }
}
```

### 2. 部門流程
```json
{
  "department_workflow_examples": {
    "small_company": {
      "description": "小公司 (10人以下)",
      "structure": "無部門劃分",
      "workflow": "提交 → 老闆審核 → 完成"
    },
    "medium_company": {
      "description": "中型公司 (10-30人)",
      "structure": "簡單部門劃分",
      "workflow": "提交 → 部門主管 → 總經理 → 完成"
    },
    "complex_company": {
      "description": "複雜組織 (30-50人)",
      "structure": "多層部門結構",
      "workflow": "提交 → 直屬主管 → 部門主管 → 跨部門會簽 → 總經理 → 完成"
    }
  }
}
```

## 流程模板系統

### 1. 預設模板
```php
// 流程模板管理
class WorkflowTemplateManager
{
    public function getDefaultTemplates(): array
    {
        return [
            'simple_approval' => [
                'name' => '簡單審核',
                'description' => '適用於小團隊的基本審核流程',
                'steps' => [
                    ['name' => '提交申請', 'type' => 'submit'],
                    ['name' => '主管審核', 'type' => 'approval', 'assignee_type' => 'role', 'role' => 'manager'],
                    ['name' => '完成', 'type' => 'complete']
                ]
            ],
            'department_approval' => [
                'name' => '部門審核',
                'description' => '包含部門主管審核的流程',
                'steps' => [
                    ['name' => '提交申請', 'type' => 'submit'],
                    ['name' => '部門主管審核', 'type' => 'approval', 'assignee_type' => 'department_manager'],
                    ['name' => '完成', 'type' => 'complete']
                ]
            ],
            'multi_level_approval' => [
                'name' => '多層審核',
                'description' => '多層級的審核流程',
                'steps' => [
                    ['name' => '提交申請', 'type' => 'submit'],
                    ['name' => '直屬主管審核', 'type' => 'approval', 'assignee_type' => 'hierarchy'],
                    ['name' => '部門主管審核', 'type' => 'approval', 'assignee_type' => 'department_manager'],
                    ['name' => '總經理審核', 'type' => 'approval', 'assignee_type' => 'role', 'role' => 'admin'],
                    ['name' => '完成', 'type' => 'complete']
                ]
            ]
        ];
    }
}
```

### 2. 自定義流程建立
```php
// 流程建立器
class WorkflowBuilder
{
    public function createWorkflow(array $config): WorkflowTemplate
    {
        $workflow = WorkflowTemplate::create([
            'name' => $config['name'],
            'description' => $config['description'],
            'steps' => $this->validateSteps($config['steps']),
            'settings' => $config['settings'] ?? []
        ]);
        
        return $workflow;
    }
    
    private function validateSteps(array $steps): array
    {
        // 驗證步驟配置
        foreach ($steps as $step) {
            $this->validateStep($step);
        }
        return $steps;
    }
}
```

## 條件式流程

### 1. 條件觸發
```json
{
  "conditional_workflow": {
    "steps": [
      {
        "name": "提交申請",
        "type": "submit"
      },
      {
        "name": "部門主管審核",
        "type": "approval",
        "assignee_type": "department_manager"
      },
      {
        "name": "財務審核",
        "type": "approval",
        "assignee_type": "role",
        "role": "finance_manager",
        "condition": "amount > 5000", // 金額大於5000才需要財務審核
        "is_optional": true
      },
      {
        "name": "總經理審核", 
        "type": "approval",
        "assignee_type": "role",
        "role": "admin",
        "condition": "amount > 10000" // 金額大於10000才需要總經理審核
      },
      {
        "name": "完成",
        "type": "complete"
      }
    ]
  }
}
```

### 2. 條件引擎
```php
class ConditionEvaluator
{
    public function evaluate(array $conditions, array $formData): bool
    {
        foreach ($conditions as $condition) {
            if (!$this->checkCondition($condition, $formData)) {
                return false;
            }
        }
        return true;
    }
    
    private function checkCondition(string $condition, array $formData): bool
    {
        // 簡單的條件檢查邏輯
        // 例如: "amount > 5000"
        if (preg_match('/(\w+)\s*([><=]+)\s*(\d+)/', $condition, $matches)) {
            $field = $matches[1];
            $operator = $matches[2];
            $value = (int) $matches[3];
            
            $fieldValue = $formData[$field] ?? 0;
            
            return match($operator) {
                '>' => $fieldValue > $value,
                '>=' => $fieldValue >= $value,
                '<' => $fieldValue < $value,
                '<=' => $fieldValue <= $value,
                '=' => $fieldValue == $value,
                default => false
            };
        }
        
        return false;
    }
}
```

## 使用者體驗設計

### 1. 流程建立精靈
```typescript
// 流程建立精靈步驟
const WorkflowWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [workflowConfig, setWorkflowConfig] = useState({});
  
  const steps = [
    { title: '基本資訊', component: BasicInfoStep },
    { title: '組織架構', component: OrganizationStep },
    { title: '流程設計', component: WorkflowDesignStep },
    { title: '審核設定', component: ApprovalStep },
    { title: '完成', component: ReviewStep }
  ];
  
  return (
    <div className="workflow-wizard">
      <StepIndicator current={currentStep} steps={steps} />
      {steps[currentStep - 1].component}
    </div>
  );
};
```

### 2. 流程預覽
```typescript
// 流程預覽組件
const WorkflowPreview = ({ workflow }) => {
  return (
    <div className="workflow-preview">
      <h3>流程預覽</h3>
      <div className="workflow-steps">
        {workflow.steps.map((step, index) => (
          <div key={index} className="workflow-step">
            <div className="step-number">{index + 1}</div>
            <div className="step-content">
              <h4>{step.name}</h4>
              <p>{step.description}</p>
              {step.is_optional && <span className="optional-badge">可選</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

這樣的設計既保持了簡潔性，又提供了足夠的彈性讓不同規模的組織都能找到適合的配置方式。
