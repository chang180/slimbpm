import { createContext, useContext, type ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

interface OrganizationContextType {
    slug: string | null;
    organization: any | null;
}

const OrganizationContext = createContext<OrganizationContextType | null>(null);

interface OrganizationProviderProps {
    children: ReactNode;
}

export function OrganizationProvider({ children }: OrganizationProviderProps) {
    const { auth } = usePage<SharedData>().props;
    
    // 從當前用戶的組織信息中獲取 slug
    const slug = auth.user?.organization?.slug || null;
    const organization = auth.user?.organization || null;

    return (
        <OrganizationContext.Provider value={{ slug, organization }}>
            {children}
        </OrganizationContext.Provider>
    );
}

export function useOrganization() {
    const context = useContext(OrganizationContext);
    if (!context) {
        throw new Error('useOrganization must be used within an OrganizationProvider');
    }
    return context;
}
