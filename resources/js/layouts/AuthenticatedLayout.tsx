import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface AuthenticatedLayoutProps {
    user: User;
    header?: React.ReactNode;
    children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ user, header, children }) => {
    return (
        <AppLayout>
            <Head title="SlimBPM" />
            <div className="min-h-screen bg-gray-100">
                {header && (
                    <header className="bg-white shadow">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}
                <main>
                    {children}
                </main>
            </div>
        </AppLayout>
    );
};

export default AuthenticatedLayout;
