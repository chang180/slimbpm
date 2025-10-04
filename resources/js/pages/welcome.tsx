import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import DarkModeToggle from '@/components/DarkModeToggle';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="SlimBPM (快簽) - 輕量級工作流程管理系統">
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
                                    href={dashboard()}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    進入系統
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                                    >
                                        登入
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        免費註冊
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 py-20">
                        <div className="text-center">
                            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                                輕量級
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                    工作流程
                                </span>
                                管理系統
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                                專為中小企業設計的輕量級 BPM 系統，讓您的工作流程管理變得簡單高效。
                                支援表單設計、審批流程、通知系統，讓團隊協作更順暢。
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href={auth.user ? dashboard() : register()}
                                    className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
                                >
                                    立即開始使用
                                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                                <button 
                                    onClick={() => {
                                        // 滾動到功能展示區域
                                        document.getElementById('features-demo')?.scrollIntoView({ 
                                            behavior: 'smooth' 
                                        });
                                    }}
                                    className="inline-flex items-center px-8 py-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-lg font-semibold"
                                >
                                    查看功能演示
                                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="py-20 bg-white dark:bg-gray-800">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                核心功能特色
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300">
                                為中小企業量身打造的工作流程管理解決方案
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Feature 1 - 表單設計器 ✅ 已實作 */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 p-8 rounded-2xl">
                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    表單設計器
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    視覺化表單設計器，支援多種欄位類型，讓您快速建立專業的表單模板。
                                </p>
                            </div>

                            {/* Feature 2 - 工作流程引擎 ⚠️ 部分實作 */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 p-8 rounded-2xl">
                                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    工作流程引擎
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    基礎工作流程引擎，支援審批流程和狀態管理，讓業務流程更加規範。
                                </p>
                            </div>

                            {/* Feature 3 - 用戶管理 ✅ 已實作 */}
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 p-8 rounded-2xl">
                                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    用戶與部門管理
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    完整的用戶管理系統，支援角色分配、部門管理，建立清晰的組織架構。
                                </p>
                            </div>

                            {/* Feature 4 - 通知系統 ✅ 已實作 */}
                            <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-600 p-8 rounded-2xl">
                                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h6v-2H4v2zM4 11h6V9H4v2zM4 7h6V5H4v2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    通知系統
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    多管道通知系統，支援 Email、LINE、Telegram 等管道，確保重要訊息及時送達。
                                </p>
                            </div>

                            {/* Feature 5 - 數據分析 ✅ 已實作 */}
                            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600 p-8 rounded-2xl">
                                <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    數據分析報表
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    專業的數據分析儀表板，提供系統統計、用戶活動、流程效能等詳細報表。
                                </p>
                            </div>

                            {/* Feature 6 - 組織管理 ✅ 已實作 */}
                            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 p-8 rounded-2xl">
                                <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    組織管理
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    完整的組織架構管理，支援組織設定、偏好配置，讓企業管理更加便利。
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Interactive Demo Section */}
                <div id="features-demo" className="py-20 bg-gray-50 dark:bg-gray-900">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                功能演示
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300">
                                體驗 SlimBPM 的核心功能
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Demo 1: 表單設計器 */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            表單設計器演示
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                                            拖拽式表單建立
                                        </p>
                                    </div>
                                </div>
                                
                                {/* 模擬表單設計器界面 */}
                                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">範例：請假申請表</div>
                                    <div className="space-y-3">
                                        <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                                            <label className="block text-sm font-medium mb-1">員工姓名</label>
                                            <div className="h-8 bg-gray-100 dark:bg-gray-600 rounded"></div>
                                        </div>
                                        <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                                            <label className="block text-sm font-medium mb-1">請假類型</label>
                                            <div className="h-8 bg-gray-100 dark:bg-gray-600 rounded"></div>
                                        </div>
                                        <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                                            <label className="block text-sm font-medium mb-1">請假日期</label>
                                            <div className="h-8 bg-gray-100 dark:bg-gray-600 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <span className="text-xs text-blue-600 dark:text-blue-400">✨ 支援多種欄位類型：文字、選擇、日期、檔案上傳</span>
                                    </div>
                                </div>
                            </div>

                            {/* Demo 2: 儀表板 */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            數據分析儀表板
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                                            即時統計與圖表
                                        </p>
                                    </div>
                                </div>
                                
                                {/* 模擬儀表板界面 */}
                                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="bg-white dark:bg-gray-800 p-3 rounded text-center">
                                            <div className="text-2xl font-bold text-blue-600">156</div>
                                            <div className="text-xs text-gray-600 dark:text-gray-400">總用戶數</div>
                                        </div>
                                        <div className="bg-white dark:bg-gray-800 p-3 rounded text-center">
                                            <div className="text-2xl font-bold text-green-600">23</div>
                                            <div className="text-xs text-gray-600 dark:text-gray-400">活躍流程</div>
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 p-3 rounded">
                                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">系統使用趨勢</div>
                                        <div className="h-16 bg-gradient-to-r from-blue-200 to-green-200 dark:from-blue-800 dark:to-green-800 rounded flex items-end justify-around">
                                            <div className="w-2 bg-blue-500 h-8 rounded-t"></div>
                                            <div className="w-2 bg-blue-500 h-12 rounded-t"></div>
                                            <div className="w-2 bg-green-500 h-10 rounded-t"></div>
                                            <div className="w-2 bg-green-500 h-14 rounded-t"></div>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <span className="text-xs text-green-600 dark:text-green-400">📊 互動式圖表：線圖、柱狀圖、圓餅圖</span>
                                    </div>
                                </div>
                            </div>

                            {/* Demo 3: 工作流程 */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            工作流程引擎
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                                            審批流程自動化
                                        </p>
                                    </div>
                                </div>
                                
                                {/* 模擬工作流程界面 */}
                                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">範例：請假審批流程</div>
                                    <div className="flex items-center justify-between">
                                        <div className="text-center">
                                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                                            <div className="text-xs mt-1">提交申請</div>
                                        </div>
                                        <div className="flex-1 h-0.5 bg-gray-300 dark:bg-gray-600 mx-2"></div>
                                        <div className="text-center">
                                            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                                            <div className="text-xs mt-1">主管審核</div>
                                        </div>
                                        <div className="flex-1 h-0.5 bg-gray-300 dark:bg-gray-600 mx-2"></div>
                                        <div className="text-center">
                                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                                            <div className="text-xs mt-1">完成</div>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <span className="text-xs text-purple-600 dark:text-purple-400">🔄 支援條件分支、並行審核、自動通知</span>
                                    </div>
                                </div>
                            </div>

                            {/* Demo 4: 用戶管理 */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            用戶與部門管理
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                                            組織架構管理
                                        </p>
                                    </div>
                                </div>
                                
                                {/* 模擬用戶管理界面 */}
                                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">組織架構範例</div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">CEO</span>
                                            </div>
                                            <span className="text-sm">總經理</span>
                                        </div>
                                        <div className="ml-4 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                                    <span className="text-xs font-bold text-green-600 dark:text-green-400">IT</span>
                                                </div>
                                                <span className="text-sm">資訊部 (5人)</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                                                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400">HR</span>
                                                </div>
                                                <span className="text-sm">人資部 (3人)</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <span className="text-xs text-orange-600 dark:text-orange-400">👥 支援角色分配、權限管理、部門層級</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Demo CTA */}
                        <div className="text-center mt-12">
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                想要體驗完整功能？立即註冊開始使用！
                            </p>
                            <Link
                                href={auth.user ? dashboard() : register()}
                                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
                            >
                                開始免費試用
                                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
                    <div className="max-w-4xl mx-auto text-center px-6">
                        <h2 className="text-4xl font-bold text-white mb-6">
                            準備好開始您的工作流程數位化之旅了嗎？
                        </h2>
                        <p className="text-xl text-blue-100 mb-8">
                            立即註冊，體驗輕量級工作流程管理系統帶來的效率提升
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href={auth.user ? dashboard() : register()}
                                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-colors text-lg font-semibold"
                            >
                                免費開始使用
                                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                            <button className="inline-flex items-center px-8 py-4 border border-blue-300 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold">
                                聯繫我們
                                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </button>
                        </div>
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
                                            <li>表單設計器</li>
                                            <li>工作流程引擎</li>
                                            <li>用戶與部門管理</li>
                                            <li>通知系統</li>
                                            <li>數據分析報表</li>
                                            <li>組織管理</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">系統特色</h3>
                                        <ul className="space-y-2 text-gray-400">
                                            <li>輕量級設計</li>
                                            <li>易於使用</li>
                                            <li>快速部署</li>
                                            <li>成本效益高</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                                    <p>&copy; 2025 SlimBPM (快簽). 版權所有。</p>
                                </div>
                            </div>
                        </footer>
            </div>
        </>
    );
}