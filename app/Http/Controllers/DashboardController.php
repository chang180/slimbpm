<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\FormSubmission;
use App\Models\FormTemplate;
use App\Models\Invitation;
use App\Models\User;
use App\Models\WorkflowHistory;
use App\Models\WorkflowInstance;
use App\Models\WorkflowTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request, string $slug): Response
    {
        $organization = $request->get('current_organization');
        $user = Auth::user();

        $orgUserIds = User::where('organization_id', $organization->id)->pluck('id');

        $totalUsers = $orgUserIds->count();

        $stats = [
            'totalUsers' => $totalUsers,
            'totalDepartments' => Department::where('organization_id', $organization->id)->count(),
            'totalForms' => FormTemplate::whereIn('created_by', $orgUserIds)->count(),
            'totalWorkflows' => WorkflowTemplate::whereIn('created_by', $orgUserIds)->where('is_current', true)->count(),
            'activeWorkflows' => WorkflowTemplate::whereIn('created_by', $orgUserIds)->where('is_current', true)->where('is_active', true)->count(),
        ];

        $departmentStats = Department::where('organization_id', $organization->id)
            ->withCount('users')
            ->orderBy('users_count', 'desc')
            ->limit(5)
            ->get()
            ->map(fn ($dept) => [
                'name' => $dept->name,
                'users_count' => $dept->users_count,
                'percentage' => $totalUsers > 0
                    ? round(($dept->users_count / $totalUsers) * 100, 1)
                    : 0,
            ]);

        $workflowInstances = WorkflowInstance::with('starter')
            ->whereIn('started_by', $orgUserIds)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(fn ($instance) => [
                'id' => (string) $instance->id,
                'name' => $instance->title,
                'status' => $instance->status,
                'currentStep' => match ($instance->status) {
                    'completed' => '已完成',
                    'cancelled' => '已取消',
                    'suspended' => '已暫停',
                    default => ! empty($instance->active_steps) ? '進行中' : '進行中',
                },
                'assignee' => $instance->starter->name ?? '未知',
                'dueDate' => null,
                'priority' => 'medium',
                'createdAt' => $instance->created_at->toISOString(),
            ]);

        $workflowTemplates = WorkflowTemplate::withCount('instances')
            ->whereIn('created_by', $orgUserIds)
            ->where('is_current', true)
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(fn ($tpl) => [
                'id' => (string) $tpl->id,
                'name' => $tpl->name,
                'description' => $tpl->description ?? '',
                'category' => '工作流程',
                'isActive' => (bool) $tpl->is_active,
                'usageCount' => $tpl->instances_count,
            ]);

        $invitations = Invitation::where('organization_id', $organization->id)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(fn ($inv) => [
                'id' => (string) $inv->id,
                'email' => $inv->email,
                'role' => $inv->role,
                'status' => $inv->status,
                'sentAt' => $inv->sent_at?->toISOString() ?? $inv->created_at->toISOString(),
                'expiresAt' => $inv->expires_at?->toISOString(),
            ]);

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentActivities' => $this->getRecentActivities($orgUserIds),
            'chartData' => $this->getChartData($organization->id, $orgUserIds),
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

    private function getRecentActivities(Collection $orgUserIds): array
    {
        $actionLabels = [
            'started' => '啟動了工作流程',
            'approved' => '審批通過',
            'rejected' => '拒絕審批',
            'completed' => '完成了工作流程',
            'suspended' => '暫停了工作流程',
            'resumed' => '恢復了工作流程',
            'cancelled' => '取消了工作流程',
            'commented' => '新增了評論',
        ];

        $histories = WorkflowHistory::with(['performer', 'workflowInstance'])
            ->whereHas('workflowInstance.starter', fn ($q) => $q->whereIn('id', $orgUserIds))
            ->orderBy('performed_at', 'desc')
            ->limit(5)
            ->get()
            ->map(fn ($h) => [
                'id' => 'wh_'.$h->id,
                'type' => $h->action,
                'description' => ($actionLabels[$h->action] ?? $h->action).'：'.($h->workflowInstance->title ?? ''),
                'user_name' => $h->performer->name ?? '系統',
                'created_at' => $h->performed_at?->toISOString() ?? now()->toISOString(),
            ]);

        $submissions = FormSubmission::with(['submitter', 'formTemplate'])
            ->whereIn('submitted_by', $orgUserIds)
            ->orderBy('submitted_at', 'desc')
            ->limit(5)
            ->get()
            ->map(fn ($s) => [
                'id' => 'fs_'.$s->id,
                'type' => 'form_submit',
                'description' => '提交了「'.($s->formTemplate->name ?? '表單').'」',
                'user_name' => $s->submitter->name ?? '用戶',
                'created_at' => $s->submitted_at?->toISOString() ?? $s->created_at->toISOString(),
            ]);

        return $histories->concat($submissions)
            ->sortByDesc('created_at')
            ->take(8)
            ->values()
            ->toArray();
    }

    private function getChartData(int $organizationId, Collection $orgUserIds): array
    {
        $chartData = [];

        for ($i = 5; $i >= 0; $i--) {
            $base = now()->subMonths($i);
            $start = $base->copy()->startOfMonth();
            $end = $base->copy()->endOfMonth();

            $chartData[] = [
                'month' => $base->format('n月'),
                'users' => User::where('organization_id', $organizationId)
                    ->whereBetween('created_at', [$start, $end])
                    ->count(),
                'forms' => FormSubmission::whereIn('submitted_by', $orgUserIds)
                    ->whereBetween('submitted_at', [$start, $end])
                    ->count(),
                'workflows' => WorkflowInstance::whereIn('started_by', $orgUserIds)
                    ->whereBetween('created_at', [$start, $end])
                    ->count(),
            ];
        }

        return $chartData;
    }
}
