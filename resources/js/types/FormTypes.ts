// 表單欄位類型定義
export type FieldType = 
  | 'text' 
  | 'email' 
  | 'number' 
  | 'textarea' 
  | 'select' 
  | 'checkbox' 
  | 'radio' 
  | 'date' 
  | 'file' 
  | 'phone'
  | 'url';

// 表單欄位介面
export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: FieldValidation;
  options?: SelectOption[];
  conditional?: ConditionalLogic;
  position: { x: number; y: number };
  size?: { width: number; height: number };
}

// 欄位驗證規則
export interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  custom?: string;
}

// 選擇選項
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// 條件式邏輯
export interface ConditionalLogic {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: any;
  action: 'show' | 'hide' | 'require' | 'optional';
}

// 表單定義
export interface FormDefinition {
  id?: string;
  name: string;
  description?: string;
  fields: FormField[];
  layout: FormLayout;
  settings: FormSettings;
  version: string;
  createdAt?: string;
  updatedAt?: string;
}

// 表單佈局
export interface FormLayout {
  sections: FormSection[];
  theme?: FormTheme;
}

// 表單區段
export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: string[]; // 欄位 ID 陣列
  order: number;
}

// 表單主題
export interface FormTheme {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  borderRadius: number;
  fontFamily: string;
}

// 表單設定
export interface FormSettings {
  allowMultipleSubmissions: boolean;
  requireAuthentication: boolean;
  showProgressBar: boolean;
  autoSave: boolean;
  submitButtonText: string;
  successMessage: string;
  redirectUrl?: string;
}

// 表單提交資料
export interface FormSubmission {
  id?: string;
  formId: string;
  data: Record<string, any>;
  submittedBy?: string;
  submittedAt: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
}

// 表單模板
export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  definition: FormDefinition;
  category: string;
  tags: string[];
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
