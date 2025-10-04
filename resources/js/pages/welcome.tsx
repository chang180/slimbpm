import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import DarkModeToggle from '@/components/DarkModeToggle';
import { Building2, Users, Workflow, BarChart3, Shield, ArrowRight, CheckCircle } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="SlimBPM (快簽) - 企業工作流程管理系統">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                {/* Navigation */}
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
                            
                            {auth.user ? (
                                <Link
                                    href={`/dashboard/${auth.user.organization?.slug || ''}`}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    進入系統
                                </Link>
                            ) : (
                                <Link
                                    href="/register"
                                    className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    企業註冊
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 py-20">
                        <div className="text-center">
                            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                                專為企業設計的
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                    工作流程管理
                                </span>
                                系統
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                                SlimBPM 為您的企業提供完整的工作流程解決方案，從表單設計到審批流程，
                                讓團隊協作更高效，管理更輕鬆。
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/register"
                                    className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
                                >
                                    立即註冊企業帳號
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Link>
                                <button 
                                    onClick={() => {
                                        document.getElementById('features')?.scrollIntoView({ 
                                            behavior: 'smooth' 
                                        });
                                    }}
                                    className="inline-flex items-center px-8 py-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-lg font-semibold"
                                >
                                    了解功能特色
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div id="features" className="py-20 bg-white dark:bg-gray-800">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                為什麼選擇 SlimBPM？
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300">
                                專為中小企業量身打造，簡單易用的工作流程管理平台
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Feature 1 - 多租戶架構 */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 p-8 rounded-2xl">
                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                                    <Building2 className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    多租戶架構
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    每個企業擁有獨立的系統環境，數據完全隔離，安全可靠。
                                </p>
                            </div>

                            {/* Feature 2 - 表單設計器 */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 p-8 rounded-2xl">
                                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    視覺化表單設計
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    拖拽式表單設計器，支援多種欄位類型，快速建立專業表單。
                                </p>
                            </div>

                            {/* Feature 3 - 工作流程 */}
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 p-8 rounded-2xl">
                                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                                    <Workflow className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    智能工作流程
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    靈活的審批流程設計，支援條件分支、並行審核、自動通知。
                                </p>
                            </div>

                            {/* Feature 4 - 數據分析 */}
                            <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-600 p-8 rounded-2xl">
                                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-6">
                                    <BarChart3 className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    數據分析報表
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    完整的數據分析儀表板，提供系統統計、用戶活動、流程效能報表。
                                </p>
                            </div>

                            {/* Feature 5 - 組織管理 */}
                            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600 p-8 rounded-2xl">
                                <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mb-6">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    企業級安全
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    完整的權限管理系統，支援角色分配、部門管理、數據隔離。
                                </p>
                            </div>

                            {/* Feature 6 - 易於使用 */}
                            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 p-8 rounded-2xl">
                                <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-6">
                                    <CheckCircle className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    快速上手
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    直觀的用戶界面，無需複雜設定，註冊即可開始使用。
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* How It Works Section */}
                <div className="py-20 bg-gray-50 dark:bg-gray-900">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                開始使用三步驟
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300">
                                簡單註冊，立即開始管理您的工作流程
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold text-white">1</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    註冊企業帳號
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    填寫企業資訊和管理員資料，獲得專屬的系統環境
                                </p>
                            </div>
                            
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold text-white">2</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    設定組織架構
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    建立部門、邀請員工、設定角色權限
                                </p>
                            </div>
                            
                            <div className="text-center">
                                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold text-white">3</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    開始使用
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    設計表單、建立流程、開始高效協作
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
                    <div className="max-w-4xl mx-auto text-center px-6">
                        <h2 className="text-4xl font-bold text-white mb-6">
                            準備好開始了嗎？
                        </h2>
                        <p className="text-xl text-blue-100 mb-8">
                            立即註冊您的企業帳號，體驗高效的工作流程管理
                        </p>
                        <Link
                            href="/register"
                            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-colors text-lg font-semibold"
                        >
                            免費註冊企業帳號
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-12">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div>
                                <div className="flex items-center space-x-2 mb-4">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">S</span>
                                    </div>
                                    <span className="text-xl font-bold">SlimBPM</span>
                                </div>
                                <p className="text-gray-400">
                                    專為中小企業設計的輕量級工作流程管理系統
                                </p>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-semibold mb-4">核心功能</h3>
                                <ul className="space-y-2 text-gray-400">
                                    <li>多租戶架構</li>
                                    <li>表單設計器</li>
                                    <li>工作流程引擎</li>
                                    <li>數據分析報表</li>
                                </ul>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-semibold mb-4">系統特色</h3>
                                <ul className="space-y-2 text-gray-400">
                                    <li>數據隔離安全</li>
                                    <li>直觀易用界面</li>
                                    <li>快速部署上線</li>
                                    <li>技術支援服務</li>
                                </ul>
                            </div>
                        </div>
                        
                        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                            <p>&copy; 2025 SlimBPM. 保留所有權利。</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}