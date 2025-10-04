import { Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import DarkModeToggle from '@/components/DarkModeToggle';
import { ArrowRight, LogIn, Building2 } from 'lucide-react';

export default function Navigation() {
    const { auth } = usePage<SharedData>().props;

    return (
        <nav className="relative z-10 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">S</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">SlimBPM</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">(快簽)</span>
                </div>
                <div className="flex items-center space-x-4">
                    {/* Dark Mode Toggle */}
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600 dark:text-gray-300">淺色</span>
                        <DarkModeToggle />
                        <span className="text-sm text-gray-600 dark:text-gray-300">深色</span>
                    </div>
                    
                    {auth.user && auth.user.organization?.slug ? (
                        <Link
                            href={`/dashboard/${auth.user.organization.slug}`}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            進入系統
                        </Link>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <Link
                                href="/login"
                                className="inline-flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                                <LogIn className="w-4 h-4 mr-2" />
                                企業登入
                            </Link>
                            <Link
                                href="/register"
                                className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                <Building2 className="w-4 h-4 mr-2" />
                                企業註冊
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
