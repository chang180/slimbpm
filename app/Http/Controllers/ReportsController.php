<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\FormSubmission;
use App\Models\FormTemplate;
use App\Models\User;
use App\Models\WorkflowInstance;
use App\Models\WorkflowTemplate;
use App\Services\ExportService;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class ReportsController extends Controller
{
    public function __construct(protected ExportService $exportService) {}

    public function index(Request $request): Response
    {
        $organization = $request->get('current_organization');
        $orgUserIds = User::where('organization_id', $organization->id)->pluck('id');

        $summary = [
            'totalUsers' => $orgUserIds->count(),
            'totalWorkflowInstances' => WorkflowInstance::whereIn('started_by', $orgUserIds)->count(),
            'totalSubmissions' => FormSubmission::whereIn('submitted_by', $orgUserIds)->count(),
            'activeWorkflows' => WorkflowInstance::whereIn('started_by', $orgUserIds)->where('status', 'running')->count(),
        ];

        return Inertia::render('reports/Index', ['summary' => $summary]);
    }

    public function userActivity(Request $request): Response
    {
        $organization = $request->get('current_organization');
        $orgUserIds = User::where('organization_id', $organization->id)->pluck('id');

        $now = now();
        $thisMonthStart = $now->copy()->startOfMonth();
        $lastMonthStart = $now->copy()->subMonth()->startOfMonth();
        $lastMonthEnd = $now->copy()->subMonth()->endOfMonth();

        $totalUsers = $orgUserIds->count();
        $newThisMonth = User::where('organization_id', $organization->id)
            ->whereBetween('created_at', [$thisMonthStart, $now])
            ->count();
        $newLastMonth = User::where('organization_id', $organization->id)
            ->whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])
            ->count();

        $userStats = [
            'totalUsers' => $totalUsers,
            'newUsersThisMonth' => $newThisMonth,
            'newUsersLastMonth' => $newLastMonth,
            'totalSubmissions' => FormSubmission::whereIn('submitted_by', $orgUserIds)->count(),
        ];

        $activityData = $this->getMonthlyActivityData($organization->id, $orgUserIds);

        $departmentStats = Department::where('organization_id', $organization->id)
            ->withCount('users')
            ->orderBy('users_count', 'desc')
            ->limit(8)
            ->get()
            ->map(fn ($dept) => [
                'name' => $dept->name,
                'users_count' => $dept->users_count,
                'percentage' => $totalUsers > 0
                    ? round(($dept->users_count / $totalUsers) * 100, 1)
                    : 0,
            ]);

        return Inertia::render('reports/UserActivity', [
            'userStats' => $userStats,
            'activityData' => $activityData,
            'departmentStats' => $departmentStats,
        ]);
    }

    public function workflowPerformance(Request $request): Response
    {
        $organization = $request->get('current_organization');
        $orgUserIds = User::where('organization_id', $organization->id)->pluck('id');

        $completedInstances = WorkflowInstance::whereIn('started_by', $orgUserIds)
            ->where('status', 'completed')
            ->whereNotNull('completed_at')
            ->whereNotNull('started_at')
            ->get(['started_at', 'completed_at']);

        $avgCompletionDays = $completedInstances->isEmpty()
            ? null
            : round($completedInstances->average(
                fn ($i) => $i->started_at->diffInHours($i->completed_at) / 24
            ), 1);

        $workflowStats = [
            'totalTemplates' => WorkflowTemplate::whereIn('created_by', $orgUserIds)->where('is_current', true)->count(),
            'activeTemplates' => WorkflowTemplate::whereIn('created_by', $orgUserIds)->where('is_current', true)->where('is_active', true)->count(),
            'totalInstances' => WorkflowInstance::whereIn('started_by', $orgUserIds)->count(),
            'completedToday' => WorkflowInstance::whereIn('started_by', $orgUserIds)
                ->where('status', 'completed')
                ->whereDate('completed_at', today())
                ->count(),
            'running' => WorkflowInstance::whereIn('started_by', $orgUserIds)->where('status', 'running')->count(),
            'avgCompletionDays' => $avgCompletionDays,
        ];

        $performanceData = $this->getMonthlyWorkflowData($orgUserIds);

        $templateUsage = WorkflowTemplate::withCount('instances')
            ->whereIn('created_by', $orgUserIds)
            ->where('is_current', true)
            ->orderBy('instances_count', 'desc')
            ->limit(5)
            ->get()
            ->map(fn ($t) => [
                'name' => $t->name,
                'count' => $t->instances_count,
            ]);

        return Inertia::render('reports/WorkflowPerformance', [
            'workflowStats' => $workflowStats,
            'performanceData' => $performanceData,
            'templateUsage' => $templateUsage,
        ]);
    }

    public function systemStats(Request $request): Response
    {
        $organization = $request->get('current_organization');
        $orgUserIds = User::where('organization_id', $organization->id)->pluck('id');

        $systemStats = [
            'totalUsers' => $orgUserIds->count(),
            'totalDepartments' => Department::where('organization_id', $organization->id)->count(),
            'totalForms' => FormTemplate::whereIn('created_by', $orgUserIds)->count(),
            'totalWorkflows' => WorkflowTemplate::whereIn('created_by', $orgUserIds)->where('is_current', true)->count(),
            'totalSubmissions' => FormSubmission::whereIn('submitted_by', $orgUserIds)->count(),
            'totalWorkflowInstances' => WorkflowInstance::whereIn('started_by', $orgUserIds)->count(),
        ];

        $usageData = $this->getMonthlyActivityData($organization->id, $orgUserIds);

        return Inertia::render('reports/SystemStats', [
            'systemStats' => $systemStats,
            'usageData' => $usageData,
            'orgName' => $organization->name,
        ]);
    }

    public function departmentAnalysis(Request $request): Response
    {
        $organization = $request->get('current_organization');
        $orgUserIds = User::where('organization_id', $organization->id)->pluck('id');

        $departments = Department::where('organization_id', $organization->id)
            ->withCount('users')
            ->orderBy('users_count', 'desc')
            ->get();

        $totalOrgUsers = $orgUserIds->count();

        $departmentData = $departments->map(function ($dept) use ($totalOrgUsers) {
            $deptUserIds = $dept->users()->pluck('users.id');

            return [
                'id' => $dept->id,
                'name' => $dept->name,
                'users_count' => $dept->users_count,
                'percentage' => $totalOrgUsers > 0
                    ? round(($dept->users_count / $totalOrgUsers) * 100, 1)
                    : 0,
                'submissions' => FormSubmission::whereIn('submitted_by', $deptUserIds)->count(),
                'workflows' => WorkflowInstance::whereIn('started_by', $deptUserIds)->count(),
            ];
        });

        $stats = [
            'totalDepartments' => $departments->count(),
            'totalUsers' => $totalOrgUsers,
            'avgUsersPerDept' => $departments->count() > 0
                ? round($totalOrgUsers / $departments->count(), 1)
                : 0,
        ];

        return Inertia::render('reports/DepartmentAnalysis', [
            'departments' => $departmentData,
            'stats' => $stats,
        ]);
    }

    public function exportUserActivity(Request $request)
    {
        $filters = $request->only(['department_id', 'date_from', 'date_to']);

        return $this->exportService->exportUserActivityReport($filters);
    }

    public function exportSystemStats(Request $request)
    {
        $filters = $request->only(['date_from', 'date_to']);

        return $this->exportService->exportSystemStatsReport($filters);
    }

    public function exportWorkflowPerformance(Request $request)
    {
        $filters = $request->only(['status', 'date_from', 'date_to']);

        return $this->exportService->exportWorkflowPerformanceReport($filters);
    }

    private function getMonthlyActivityData(int $organizationId, Collection $orgUserIds): array
    {
        $data = [];

        for ($i = 5; $i >= 0; $i--) {
            $base = now()->subMonths($i);
            $start = $base->copy()->startOfMonth();
            $end = $base->copy()->endOfMonth();

            $data[] = [
                'month' => $base->format('n月'),
                'newUsers' => User::where('organization_id', $organizationId)
                    ->whereBetween('created_at', [$start, $end])
                    ->count(),
                'submissions' => FormSubmission::whereIn('submitted_by', $orgUserIds)
                    ->whereBetween('submitted_at', [$start, $end])
                    ->count(),
                'workflows' => WorkflowInstance::whereIn('started_by', $orgUserIds)
                    ->whereBetween('created_at', [$start, $end])
                    ->count(),
            ];
        }

        return $data;
    }

    private function getMonthlyWorkflowData(Collection $orgUserIds): array
    {
        $data = [];

        for ($i = 5; $i >= 0; $i--) {
            $base = now()->subMonths($i);
            $start = $base->copy()->startOfMonth();
            $end = $base->copy()->endOfMonth();

            $data[] = [
                'month' => $base->format('n月'),
                'started' => WorkflowInstance::whereIn('started_by', $orgUserIds)
                    ->whereBetween('created_at', [$start, $end])
                    ->count(),
                'completed' => WorkflowInstance::whereIn('started_by', $orgUserIds)
                    ->where('status', 'completed')
                    ->whereBetween('completed_at', [$start, $end])
                    ->count(),
                'cancelled' => WorkflowInstance::whereIn('started_by', $orgUserIds)
                    ->where('status', 'cancelled')
                    ->whereBetween('updated_at', [$start, $end])
                    ->count(),
            ];
        }

        return $data;
    }
}
