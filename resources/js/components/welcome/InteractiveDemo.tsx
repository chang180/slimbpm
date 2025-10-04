import { useState } from 'react';
import { 
    Building2, 
    Lock, 
    Users, 
    Workflow, 
    Key, 
    CheckCircle, 
    Shield, 
    Zap, 
    BarChart3 
} from 'lucide-react';

interface DemoStep {
    id: string;
    title: string;
    description: string;
    icon: any;
    color: string;
}

const demoSteps: DemoStep[] = [
    {
        id: 'step1',
        title: '企業註冊',
        description: '填寫企業基本資訊，系統自動生成專屬的企業環境',
        icon: Building2,
        color: 'from-blue-500 to-indigo-600'
    },
    {
        id: 'step2', 
        title: '數據隔離',
        description: '每個企業擁有獨立的數據空間，完全隔離，安全可靠',
        icon: Lock,
        color: 'from-green-500 to-emerald-600'
    },
    {
        id: 'step3',
        title: '用戶管理',
        description: '建立部門架構，邀請員工，設定角色權限',
        icon: Users,
        color: 'from-purple-500 to-pink-600'
    },
    {
        id: 'step4',
        title: '工作流程',
        description: '設計表單和審批流程，自動化業務處理',
        icon: Workflow,
        color: 'from-orange-500 to-red-600'
    }
];

export default function InteractiveDemo() {
    const [activeDemo, setActiveDemo] = useState<string | null>(null);

    return (
        <div id="demo" className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        互動功能演示
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                        點擊下方步驟，了解 SlimBPM 如何為您的企業提供完整解決方案
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {demoSteps.map((step, index) => {
                        const IconComponent = step.icon;
                        return (
                            <button
                                key={step.id}
                                onClick={() => setActiveDemo(activeDemo === step.id ? null : step.id)}
                                className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                                    activeDemo === step.id
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                            >
                                <div className={`w-12 h-12 bg-gradient-to-r ${step.color} rounded-lg flex items-center justify-center mb-4`}>
                                    <IconComponent className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    {index + 1}. {step.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {step.description}
                                </p>
                            </button>
                        );
                    })}
                </div>

                {/* Demo Content */}
                {activeDemo && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                        {activeDemo === 'step1' && (
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">企業註冊流程</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <Building2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                        <h4 className="font-semibold text-gray-900 dark:text-white">企業資訊</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">填寫公司名稱、聯絡人、行業等基本資料</p>
                                    </div>
                                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <Key className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                        <h4 className="font-semibold text-gray-900 dark:text-white">自動生成</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">系統自動生成 UUID 企業標識符</p>
                                    </div>
                                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                        <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                        <h4 className="font-semibold text-gray-900 dark:text-white">立即使用</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">註冊完成後自動登入，開始使用</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeDemo === 'step2' && (
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">數據隔離機制</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                        <Lock className="w-12 h-12 text-red-600 mx-auto mb-4" />
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">完全隔離</h4>
                                        <p className="text-gray-600 dark:text-gray-300">每個企業的數據完全獨立，無法互相訪問</p>
                                    </div>
                                    <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">安全可靠</h4>
                                        <p className="text-gray-600 dark:text-gray-300">企業級安全措施，保護您的敏感數據</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeDemo === 'step3' && (
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">用戶管理系統</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                        <h4 className="font-semibold text-gray-900 dark:text-white">部門管理</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">建立組織架構，設定部門層級</p>
                                    </div>
                                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <Key className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                        <h4 className="font-semibold text-gray-900 dark:text-white">角色權限</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">設定管理員、主管、一般用戶權限</p>
                                    </div>
                                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                        <Zap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                        <h4 className="font-semibold text-gray-900 dark:text-white">快速邀請</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">一鍵邀請員工，自動分配權限</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeDemo === 'step4' && (
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">工作流程引擎</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <Workflow className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">表單設計器</h4>
                                        <p className="text-gray-600 dark:text-gray-300">拖拽式表單設計，支援多種欄位類型</p>
                                    </div>
                                    <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <BarChart3 className="w-12 h-12 text-green-600 mx-auto mb-4" />
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">審批流程</h4>
                                        <p className="text-gray-600 dark:text-gray-300">靈活的審批流程設計，支援條件分支</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
