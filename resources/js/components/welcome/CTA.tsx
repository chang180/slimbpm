import { Link } from '@inertiajs/react';
import { Building2, ArrowRight, Play, CheckCircle } from 'lucide-react';

export default function CTA() {
    return (
        <div className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-40" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
            
            <div className="relative max-w-4xl mx-auto text-center px-6">
                <h2 className="text-4xl font-bold text-white mb-6">
                    準備好為您的企業建立專屬工作流程了嗎？
                </h2>
                <p className="text-xl text-blue-100 mb-8">
                    立即註冊企業帳號，獲得完全獨立的系統環境，享受企業級的安全保障
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/register"
                        className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-all duration-200 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <Building2 className="w-5 h-5 mr-2" />
                        免費註冊企業帳號
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                    <button 
                        onClick={() => {
                            document.getElementById('demo')?.scrollIntoView({ 
                                behavior: 'smooth' 
                            });
                        }}
                        className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200 text-lg font-semibold"
                    >
                        <Play className="w-5 h-5 mr-2" />
                        了解更多功能
                    </button>
                </div>
                
                {/* Trust Indicators */}
                <div className="mt-12 pt-8 border-t border-blue-500/30">
                    <p className="text-blue-200 text-sm mb-4">已為超過 100+ 企業提供服務</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 text-blue-200">
                        <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            <span className="text-sm">5分鐘快速部署</span>
                        </div>
                        <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            <span className="text-sm">數據完全隔離</span>
                        </div>
                        <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            <span className="text-sm">企業級安全</span>
                        </div>
                        <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            <span className="text-sm">24/7 技術支援</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
