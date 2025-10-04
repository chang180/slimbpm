import { Shield, Database, Zap } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">S</span>
                            </div>
                            <span className="text-xl font-bold">SlimBPM</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            企業級多租戶工作流程管理系統，為每個企業提供專屬的獨立環境。
                        </p>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-semibold mb-4">企業服務</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>企業註冊</li>
                            <li>數據隔離</li>
                            <li>角色權限管理</li>
                            <li>組織架構設定</li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-semibold mb-4">核心功能</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>表單設計器</li>
                            <li>工作流程引擎</li>
                            <li>數據分析報表</li>
                            <li>通知系統</li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-semibold mb-4">技術支援</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>24/7 線上支援</li>
                            <li>快速部署服務</li>
                            <li>數據安全保證</li>
                            <li>系統維護升級</li>
                        </ul>
                    </div>
                </div>
                
                <div className="border-t border-gray-800 mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-gray-400 text-sm mb-4 md:mb-0">
                            &copy; 2025 SlimBPM. 保留所有權利。
                        </div>
                        <div className="flex items-center space-x-6 text-gray-400 text-sm">
                            <div className="flex items-center">
                                <Shield className="w-4 h-4 mr-2" />
                                <span>企業級安全</span>
                            </div>
                            <div className="flex items-center">
                                <Database className="w-4 h-4 mr-2" />
                                <span>數據隔離</span>
                            </div>
                            <div className="flex items-center">
                                <Zap className="w-4 h-4 mr-2" />
                                <span>快速部署</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
