import { 
    Building2, 
    Users, 
    Workflow, 
    Lock, 
    Shield, 
    Globe, 
    Zap 
} from 'lucide-react';

export default function HowItWorks() {
    return (
        <div className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        企業註冊到使用，只需三步驟
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                        每個企業都擁有獨立的系統環境，數據完全隔離
                    </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center group">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                            <Building2 className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                            1. 企業註冊
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            填寫企業基本資訊（公司名稱、聯絡人、行業等）
                        </p>
                        <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                            系統自動生成 UUID 企業標識符
                        </div>
                    </div>
                    
                    <div className="text-center group">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                            2. 組織設定
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            建立部門架構，邀請員工，設定角色權限
                        </p>
                        <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                            管理員自動獲得後台登入權限
                        </div>
                    </div>
                    
                    <div className="text-center group">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                            <Workflow className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                            3. 開始工作
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            設計表單、建立工作流程、開始高效協作
                        </p>
                        <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                            數據完全隔離，安全可靠
                        </div>
                    </div>
                </div>

                {/* Enterprise Benefits */}
                <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            企業級優勢
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            每個企業都擁有獨立的系統環境，享受企業級的安全保障
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center">
                            <Lock className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">數據隔離</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">每個企業數據完全獨立</p>
                        </div>
                        <div className="text-center">
                            <Shield className="w-12 h-12 text-green-600 mx-auto mb-3" />
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">企業安全</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">企業級安全措施</p>
                        </div>
                        <div className="text-center">
                            <Globe className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">獨立環境</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">專屬的系統環境</p>
                        </div>
                        <div className="text-center">
                            <Zap className="w-12 h-12 text-orange-600 mx-auto mb-3" />
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">快速部署</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">5分鐘即可開始使用</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
