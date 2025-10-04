<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Department;
use App\Models\FormTemplate;
use App\Models\WorkflowTemplate;
use App\Services\ExportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportsController extends Controller
{
    protected ExportService $exportService;

    public function __construct(ExportService $exportService)
    {
        $this->exportService = $exportService;
    }

    /**
     * 顯示報表中心
     */
    public function index(): Response
    {
        return Inertia::render('reports/Index');
    }

    /**
     * 顯示用戶活動報表
     */
    public function userActivity(): Response
    {
        // 獲取用戶活動統計
        $userStats = [
            'totalUsers' => User::count(),
            'activeUsers' => User::where('last_login_at', '>=', now()->subDay())->count(),
            'newUsers' => User::where('created_at', '>=', now()->subMonth())->count(),
            'avgSessionTime' => '2.5h', // 模擬資料
        ];

        // 獲取用戶活動圖表資料 (模擬資料)
        $activityData = [
            ['date' => '1月', 'logins' => 120, 'actions' => 450, 'newUsers' => 15],
            ['date' => '2月', 'logins' => 135, 'actions' => 520, 'newUsers' => 18],
            ['date' => '3月', 'logins' => 148, 'actions' => 610, 'newUsers' => 22],
            ['date' => '4月', 'logins' => 162, 'actions' => 730, 'newUsers' => 25],
            ['date' => '5月', 'logins' => 175, 'actions' => 850, 'newUsers' => 28],
            ['date' => '6月', 'logins' => 189, 'actions' => 920, 'newUsers' => 32],
        ];

        // 獲取部門活動統計
        $departmentStats = Department::withCount('users')
            ->orderBy('users_count', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($dept) {
                return [
                    'name' => $dept->name,
                    'users_count' => $dept->users_count,
                    'activity_percentage' => rand(60, 95), // 模擬活躍度
                ];
            });

        return Inertia::render('reports/UserActivity', [
            'userStats' => $userStats,
            'activityData' => $activityData,
            'departmentStats' => $departmentStats,
        ]);
    }

    /**
     * 顯示流程效能報表
     */
    public function workflowPerformance(): Response
    {
        // 獲取流程效能統計
        $workflowStats = [
            'totalWorkflows' => WorkflowTemplate::count(),
            'activeWorkflows' => WorkflowTemplate::where('is_active', true)->count(),
            'completedToday' => 45, // 模擬資料
            'avgCompletionTime' => '2.3天', // 模擬資料
        ];

        // 獲取流程效能圖表資料 (模擬資料)
        $performanceData = [
            ['month' => '1月', 'completed' => 120, 'pending' => 45, 'avgTime' => 2.5],
            ['month' => '2月', 'completed' => 135, 'pending' => 52, 'avgTime' => 2.3],
            ['month' => '3月', 'completed' => 148, 'pending' => 61, 'avgTime' => 2.1],
            ['month' => '4月', 'completed' => 162, 'pending' => 73, 'avgTime' => 2.0],
            ['month' => '5月', 'completed' => 175, 'pending' => 85, 'avgTime' => 1.9],
            ['month' => '6月', 'completed' => 189, 'pending' => 92, 'avgTime' => 1.8],
        ];

        return Inertia::render('reports/WorkflowPerformance', [
            'workflowStats' => $workflowStats,
            'performanceData' => $performanceData,
        ]);
    }

    /**
     * 顯示系統統計報表
     */
    public function systemStats(): Response
    {
        // 獲取系統統計
        $systemStats = [
            'totalUsers' => User::count(),
            'totalDepartments' => Department::count(),
            'totalForms' => FormTemplate::count(),
            'totalWorkflows' => WorkflowTemplate::count(),
            'systemUptime' => '99.9%', // 模擬資料
            'avgResponseTime' => '150ms', // 模擬資料
        ];

        // 獲取系統使用統計 (模擬資料)
        $usageData = [
            ['date' => '1月', 'forms' => 45, 'workflows' => 12, 'users' => 120],
            ['date' => '2月', 'forms' => 52, 'workflows' => 18, 'users' => 135],
            ['date' => '3月', 'forms' => 61, 'workflows' => 25, 'users' => 148],
            ['date' => '4月', 'forms' => 73, 'workflows' => 31, 'users' => 162],
            ['date' => '5月', 'forms' => 85, 'workflows' => 38, 'users' => 175],
            ['date' => '6月', 'forms' => 92, 'workflows' => 42, 'users' => 189],
        ];

        return Inertia::render('reports/SystemStats', [
            'systemStats' => $systemStats,
            'usageData' => $usageData,
        ]);
    }

    /**
     * 匯出用戶活動報表
     */
    public function exportUserActivity(Request $request)
    {
        $filters = $request->only(['department_id', 'date_from', 'date_to']);
        return $this->exportService->exportUserActivityReport($filters);
    }

    /**
     * 匯出系統統計報表
     */
    public function exportSystemStats(Request $request)
    {
        $filters = $request->only(['date_from', 'date_to']);
        return $this->exportService->exportSystemStatsReport($filters);
    }

    /**
     * 匯出流程效能報表
     */
    public function exportWorkflowPerformance(Request $request)
    {
        $filters = $request->only(['status', 'date_from', 'date_to']);
        return $this->exportService->exportWorkflowPerformanceReport($filters);
    }
}
