export interface Organization {
  id: number;
  name: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  logo?: string;
  settings?: OrganizationSettings;
  users_count?: number;
  created_at: string;
  updated_at: string;
}

export interface OrganizationSettings {
  timezone: string;
  language: string;
  date_format: string;
  time_format: string;
  currency: string;
  notifications: {
    email_notifications: boolean;
    system_notifications: boolean;
    security_notifications: boolean;
  };
  security: {
    password_policy: {
      min_length: number;
      require_uppercase: boolean;
      require_lowercase: boolean;
      require_numbers: boolean;
      require_symbols: boolean;
    };
    session_timeout: number;
    two_factor_required: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    primary_color: string;
    logo_url?: string;
  };
}

export interface OrganizationStats {
  total_users: number;
  active_users: number;
  total_departments: number;
  total_workflows: number;
  total_forms: number;
  recent_activity: Activity[];
}

export interface Activity {
  id: number;
  type: 'user_created' | 'user_updated' | 'department_created' | 'workflow_created' | 'form_created';
  description: string;
  user_name: string;
  created_at: string;
}

export interface OrganizationFormData {
  name: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  logo?: string;
}

export interface OrganizationSettingsFormData {
  timezone: string;
  language: string;
  date_format: string;
  time_format: string;
  currency: string;
  notifications: {
    email_notifications: boolean;
    system_notifications: boolean;
    security_notifications: boolean;
  };
  security: {
    password_policy: {
      min_length: number;
      require_uppercase: boolean;
      require_lowercase: boolean;
      require_numbers: boolean;
      require_symbols: boolean;
    };
    session_timeout: number;
    two_factor_required: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    primary_color: string;
    logo_url?: string;
  };
}
