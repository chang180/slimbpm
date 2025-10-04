import { Head, Link } from '@inertiajs/react';
import { Building2, ArrowRight, Play } from 'lucide-react';

export default function Hero() {
    return (
        <>
            <Head title="SlimBPM (快簽) - 企業工作流程管理系統">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>
            
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-40" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
                
                <div className="relative max-w-7xl mx-auto px-6 py-20">
                    <div className="text-center">
                        <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
                            <Building2 className="w-4 h-4 mr-2" />
                            多租戶企業級解決方案
                        </div>
                        
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                            每個企業都有
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                專屬的工作流程
                            </span>
                            管理平台
                        </h1>
                        
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                            SlimBPM 提供企業級多租戶架構，讓每個企業擁有獨立的系統環境。
                            從企業註冊到工作流程設計，一體化的解決方案讓您的業務更高效。
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <Link
                                href="/register"
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                免費註冊企業帳號
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                            <button 
                                onClick={() => {
                                    document.getElementById('demo')?.scrollIntoView({ 
                                        behavior: 'smooth' 
                                    });
                                }}
                                className="inline-flex items-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-lg font-semibold"
                            >
                                <Play className="w-5 h-5 mr-2" />
                                觀看功能演示
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">100%</div>
                                <div className="text-gray-600 dark:text-gray-300">數據隔離</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">5分鐘</div>
                                <div className="text-gray-600 dark:text-gray-300">快速部署</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">24/7</div>
                                <div className="text-gray-600 dark:text-gray-300">技術支援</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
