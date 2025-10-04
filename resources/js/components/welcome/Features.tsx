import { 
    Database, 
    Zap, 
    Users, 
    Workflow, 
    BarChart3, 
    Monitor 
} from 'lucide-react';

export default function Features() {
    return (
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
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-200">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                            <Database className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            企業級多租戶
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            每個企業擁有獨立的數據空間，UUID 企業標識符確保完全隔離和安全。
                        </p>
                    </div>

                    {/* Feature 2 - 快速註冊 */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-200">
                        <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            5分鐘快速部署
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            簡單註冊流程，填寫企業資訊即可獲得專屬的系統環境。
                        </p>
                    </div>

                    {/* Feature 3 - 角色權限 */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-200">
                        <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            智能角色管理
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            管理員、主管、一般用戶三級權限，自動分流到後台或前台界面。
                        </p>
                    </div>

                    {/* Feature 4 - 表單設計 */}
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-600 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-200">
                        <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-6">
                            <Workflow className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            視覺化表單設計
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            拖拽式表單設計器，支援多種欄位類型，快速建立專業表單。
                        </p>
                    </div>

                    {/* Feature 5 - 數據分析 */}
                    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-200">
                        <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mb-6">
                            <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            企業數據分析
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            完整的企業數據分析儀表板，提供用戶活動、流程效能等統計報表。
                        </p>
                    </div>

                    {/* Feature 6 - 響應式設計 */}
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-200">
                        <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-6">
                            <Monitor className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            跨平台支援
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            支援桌面、平板、手機等多種設備，隨時隨地管理您的工作流程。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
