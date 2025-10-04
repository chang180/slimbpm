import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
            
            {/* Main Content */}
            <div className="relative flex min-h-screen items-center justify-center p-6">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <Link
                            href={home()}
                            className="inline-flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white hover:opacity-80 transition-opacity"
                        >
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                <AppLogoIcon className="w-6 h-6 fill-white" />
                            </div>
                            <span>SlimBPM</span>
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">(快簽)</span>
                        </Link>
                        
                        <div className="mt-6 space-y-2">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {title}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                {description}
                            </p>
                        </div>
                    </div>

                    {/* Auth Form Card */}
                    <div className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-8">
                        {children}
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            輕量級工作流程管理系統
                        </p>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-indigo-100 dark:bg-indigo-900/30 rounded-full blur-xl"></div>
        </div>
    );
}
