<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\FormTemplate;
use App\Models\User;
use App\Models\WorkflowTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * 顯示儀表板
     */
    public function index(Request $request, string $slug): Response
    {
        // 從中間件獲取當前組織
        $organization = $request->get('current_organization');
        $user = Auth::user();

        // 獲取該組織的統計資料
        $stats = [
            'totalUsers' => User::where('organization_id', $organization->id)->count(),
            'totalDepartments' => Department::where('organization_id', $organization->id)->count(),
            'totalForms' => FormTemplate::where('organization_id', $organization->id)->count(),
            'totalWorkflows' => WorkflowTemplate::where('organization_id', $organization->id)->count(),
            'activeWorkflows' => WorkflowTemplate::where('organization_id', $organization->id)->where('is_active', true)->count(),
        ];

        // 獲取最近活動 (模擬資料)
        $recentActivities = [
            [
                'id' => 1,
                'type' => 'user_login',
                'description' => '新用戶登入系統',
                'user_name' => '張三',
                'created_at' => now()->subMinutes(5)->toISOString(),
            ],
            [
                'id' => 2,
                'type' => 'form_submit',
                'description' => '提交了請假申請表',
                'user_name' => '李四',
                'created_at' => now()->subMinutes(15)->toISOString(),
            ],
            [
                'id' => 3,
                'type' => 'workflow_complete',
                'description' => '完成採購審批流程',
                'user_name' => '王五',
                'created_at' => now()->subMinutes(30)->toISOString(),
            ],
            [
                'id' => 4,
                'type' => 'department_create',
                'description' => '建立了新的部門',
                'user_name' => '趙六',
                'created_at' => now()->subHour()->toISOString(),
            ],
        ];

        // 獲取圖表資料 (模擬資料)
        $chartData = [
            ['month' => '1月', 'users' => 120, 'forms' => 45, 'workflows' => 12],
            ['month' => '2月', 'users' => 135, 'forms' => 52, 'workflows' => 18],
            ['month' => '3月', 'users' => 148, 'forms' => 61, 'workflows' => 25],
            ['month' => '4月', 'users' => 162, 'forms' => 73, 'workflows' => 31],
            ['month' => '5月', 'users' => 175, 'forms' => 85, 'workflows' => 38],
            ['month' => '6月', 'users' => 189, 'forms' => 92, 'workflows' => 42],
        ];

        // 獲取部門統計
        $departmentStats = Department::where('organization_id', $organization->id)
            ->withCount('users')
            ->orderBy('users_count', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($dept) {
                return [
                    'name' => $dept->name,
                    'users_count' => $dept->users_count,
                    'percentage' => 0, // 稍後計算
                ];
            });

        // 計算百分比
        $totalUsers = $stats['totalUsers'];
        if ($totalUsers > 0) {
            $departmentStats = $departmentStats->map(function ($dept) use ($totalUsers) {
                $dept['percentage'] = round(($dept['users_count'] / $totalUsers) * 100, 1);

                return $dept;
            });
        }

        // 獲取工作流程實例 (模擬資料)
        $workflowInstances = [
            [
                'id' => '1',
                'name' => '請假申請流程',
                'status' => 'pending',
                'currentStep' => '部門主管審核',
                'assignee' => '李主管',
                'dueDate' => now()->addDays(3)->toISOString(),
                'priority' => 'medium',
                'createdAt' => now()->subDays(1)->toISOString(),
            ],
            [
                'id' => '2',
                'name' => '採購申請流程',
                'status' => 'in_progress',
                'currentStep' => '財務審核',
                'assignee' => '王會計',
                'dueDate' => now()->addDays(5)->toISOString(),
                'priority' => 'high',
                'createdAt' => now()->subDays(2)->toISOString(),
            ],
            [
                'id' => '3',
                'name' => '設備維修申請',
                'status' => 'completed',
                'currentStep' => '已完成',
                'assignee' => '張技師',
                'dueDate' => now()->subDays(1)->toISOString(),
                'priority' => 'low',
                'createdAt' => now()->subDays(5)->toISOString(),
            ],
        ];

        // 獲取工作流程模板 (模擬資料)
        $workflowTemplates = [
            [
                'id' => '1',
                'name' => '請假申請流程',
                'description' => '員工請假申請的標準流程',
                'category' => '人事管理',
                'isActive' => true,
                'usageCount' => 15,
            ],
            [
                'id' => '2',
                'name' => '採購申請流程',
                'description' => '物品採購申請的審批流程',
                'category' => '財務管理',
                'isActive' => true,
                'usageCount' => 8,
            ],
            [
                'id' => '3',
                'name' => '設備維修申請',
                'description' => '設備故障維修的申請流程',
                'category' => '設備管理',
                'isActive' => true,
                'usageCount' => 12,
            ],
        ];

        // 獲取邀請記錄 (模擬資料)
        $invitations = [
            [
                'id' => '1',
                'email' => 'newuser1@company.com',
                'role' => 'user',
                'status' => 'sent',
                'sentAt' => now()->subDays(1)->toISOString(),
                'expiresAt' => now()->addDays(6)->toISOString(),
            ],
            [
                'id' => '2',
                'email' => 'newuser2@company.com',
                'role' => 'manager',
                'status' => 'pending',
                'sentAt' => now()->subHours(2)->toISOString(),
                'expiresAt' => now()->addDays(6)->toISOString(),
            ],
        ];

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentActivities' => $recentActivities,
            'chartData' => $chartData,
            'departmentStats' => $departmentStats,
            'workflowInstances' => $workflowInstances,
            'workflowTemplates' => $workflowTemplates,
            'invitations' => $invitations,
            'organization' => [
                'id' => $organization->id,
                'name' => $organization->name,
                'slug' => $organization->slug,
            ],
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ]);
    }
}
