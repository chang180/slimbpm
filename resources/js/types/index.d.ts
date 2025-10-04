import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface PageProps {
    auth: Auth;
    [key: string]: unknown;
}

export interface Organization {
    id: number;
    name: string;
    slug: string;
    contact_person?: string;
    contact_email?: string;
    industry?: string;
    description?: string;
    email?: string;
    phone?: string;
    website?: string;
    address?: string;
    created_at: string;
    updated_at: string;
}

export interface OrganizationStats {
    totalUsers: number;
    totalDepartments: number;
    totalForms: number;
    totalWorkflows: number;
    activeWorkflows: number;
    recentActivity: Array<{
        id: number;
        type: string;
        description: string;
        user: string;
        created_at: string;
    }>;
}

export interface OrganizationSettingsFormData {
    name: string;
    description?: string;
    email?: string;
    phone?: string;
    website?: string;
    address?: string;
    industry?: string;
    timezone?: string;
    language?: string;
    date_format?: string;
    currency?: string;
    notifications?: {
        email: boolean;
        sms: boolean;
        push: boolean;
    };
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    organization_id?: number;
    organization?: Organization;
    role: 'admin' | 'manager' | 'user';
    is_active?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Department {
    id: number;
    name: string;
    description?: string;
    parent_id?: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    parent?: Department;
    children?: Department[];
    users?: User[];
    users_count?: number;
}
