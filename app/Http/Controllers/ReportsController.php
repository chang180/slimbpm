<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\FormSubmission;
use App\Models\FormTemplate;
use App\Models\User;
use App\Models\WorkflowInstance;
use App\Models\WorkflowTemplate;
use App\Services\ExportService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
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
        $filters = $this->dateFilters($request);

        $now = now();
        $thisMonthStart = $now->copy()->startOfMonth();
        $lastMonthStart = $now->copy()->subMonth()->startOfMonth();
        $lastMonthEnd = $now->copy()->subMonth()->endOfMonth();

        $totalUsers = $orgUserIds->count();
        $newThisMonthQuery = User::where('organization_id', $organization->id)
            ->whereBetween('created_at', [$thisMonthStart, $now]);
        $newLastMonthQuery = User::where('organization_id', $organization->id)
            ->whereBetween('created_at', [$lastMonthStart, $lastMonthEnd]);
        $totalSubmissionsQuery = FormSubmission::whereIn('submitted_by', $orgUserIds);

        $userStats = [
            'totalUsers' => $totalUsers,
            'newUsersThisMonth' => $this->applyDateFilters($newThisMonthQuery, 'created_at', $filters)->count(),
            'newUsersLastMonth' => $this->applyDateFilters($newLastMonthQuery, 'created_at', $filters)->count(),
            'totalSubmissions' => $this->applyDateFilters($totalSubmissionsQuery, 'submitted_at', $filters)->count(),
        ];

        $activityData = $this->getMonthlyActivityData($organization->id, $orgUserIds, $filters);

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
            'filters' => $filters,
        ]);
    }

    public function workflowPerformance(Request $request): Response
    {
        $organization = $request->get('current_organization');
        $orgUserIds = User::where('organization_id', $organization->id)->pluck('id');
        $filters = $this->dateFilters($request);

        $completedInstances = WorkflowInstance::whereIn('started_by', $orgUserIds)
            ->where('status', 'completed')
            ->whereNotNull('completed_at')
            ->whereNotNull('started_at');
        $this->applyDateFilters($completedInstances, 'completed_at', $filters);
        $completedInstances = $completedInstances->get(['started_at', 'completed_at']);

        $totalInstancesQuery = WorkflowInstance::whereIn('started_by', $orgUserIds);
        $completedTodayQuery = WorkflowInstance::whereIn('started_by', $orgUserIds)
            ->where('status', 'completed')
            ->whereDate('completed_at', today());
        $runningQuery = WorkflowInstance::whereIn('started_by', $orgUserIds)->where('status', 'running');

        $avgCompletionDays = $completedInstances->isEmpty()
            ? null
            : round($completedInstances->average(
                fn ($i) => $i->started_at->diffInHours($i->completed_at) / 24
            ), 1);

        $workflowStats = [
            'totalTemplates' => WorkflowTemplate::whereIn('created_by', $orgUserIds)->where('is_current', true)->count(),
            'activeTemplates' => WorkflowTemplate::whereIn('created_by', $orgUserIds)->where('is_current', true)->where('is_active', true)->count(),
            'totalInstances' => $this->applyDateFilters($totalInstancesQuery, 'created_at', $filters)->count(),
            'completedToday' => $this->applyDateFilters($completedTodayQuery, 'completed_at', $filters)->count(),
            'running' => $this->applyDateFilters($runningQuery, 'created_at', $filters)->count(),
            'avgCompletionDays' => $avgCompletionDays,
        ];

        $performanceData = $this->getMonthlyWorkflowData($orgUserIds, $filters);

        $templateUsage = WorkflowTemplate::withCount([
            'instances' => fn (Builder $query) => $this->applyDateFilters($query, 'created_at', $filters)
                ->whereIn('started_by', $orgUserIds),
        ])
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
            'filters' => $filters,
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
        abort_unless(in_array(Auth::user()->role, ['admin', 'manager']), 403);

        $organization = $request->get('current_organization');
        $orgUserIds = User::where('organization_id', $organization->id)->pluck('id');
        $filters = $request->only(['department_id', 'date_from', 'date_to']);

        return $this->exportService->exportUserActivityReport($organization, $orgUserIds, $filters);
    }

    public function exportSystemStats(Request $request)
    {
        abort_unless(in_array(Auth::user()->role, ['admin', 'manager']), 403);

        $organization = $request->get('current_organization');
        $orgUserIds = User::where('organization_id', $organization->id)->pluck('id');

        return $this->exportService->exportSystemStatsReport($organization, $orgUserIds);
    }

    public function exportWorkflowPerformance(Request $request)
    {
        abort_unless(in_array(Auth::user()->role, ['admin', 'manager']), 403);

        $organization = $request->get('current_organization');
        $orgUserIds = User::where('organization_id', $organization->id)->pluck('id');
        $filters = $request->only(['status', 'date_from', 'date_to']);

        return $this->exportService->exportWorkflowPerformanceReport($organization, $orgUserIds, $filters);
    }

    /**
     * @return array{date_from: string|null, date_to: string|null}
     */
    private function dateFilters(Request $request): array
    {
        return [
            'date_from' => $request->filled('date_from') ? (string) $request->input('date_from') : null,
            'date_to' => $request->filled('date_to') ? (string) $request->input('date_to') : null,
        ];
    }

    /**
     * @param  array{date_from?: string|null, date_to?: string|null}  $filters
     */
    private function applyDateFilters(Builder $query, string $column, array $filters): Builder
    {
        return $query
            ->when($filters['date_from'] ?? null, fn (Builder $query, string $date) => $query->where($column, '>=', $date.' 00:00:00'))
            ->when($filters['date_to'] ?? null, fn (Builder $query, string $date) => $query->where($column, '<=', $date.' 23:59:59'));
    }

    /**
     * @param  array{date_from?: string|null, date_to?: string|null}  $filters
     */
    private function getMonthlyActivityData(int $organizationId, Collection $orgUserIds, array $filters = []): array
    {
        $data = [];

        for ($i = 5; $i >= 0; $i--) {
            $base = now()->subMonths($i);
            $start = $base->copy()->startOfMonth();
            $end = $base->copy()->endOfMonth();

            $data[] = [
                'month' => $base->format('n月'),
                'newUsers' => $this->applyDateFilters(
                    User::where('organization_id', $organizationId)->whereBetween('created_at', [$start, $end]),
                    'created_at',
                    $filters
                )->count(),
                'submissions' => $this->applyDateFilters(
                    FormSubmission::whereIn('submitted_by', $orgUserIds)->whereBetween('submitted_at', [$start, $end]),
                    'submitted_at',
                    $filters
                )->count(),
                'workflows' => $this->applyDateFilters(
                    WorkflowInstance::whereIn('started_by', $orgUserIds)->whereBetween('created_at', [$start, $end]),
                    'created_at',
                    $filters
                )->count(),
            ];
        }

        return $data;
    }

    /**
     * @param  array{date_from?: string|null, date_to?: string|null}  $filters
     */
    private function getMonthlyWorkflowData(Collection $orgUserIds, array $filters = []): array
    {
        $data = [];

        for ($i = 5; $i >= 0; $i--) {
            $base = now()->subMonths($i);
            $start = $base->copy()->startOfMonth();
            $end = $base->copy()->endOfMonth();

            $data[] = [
                'month' => $base->format('n月'),
                'started' => $this->applyDateFilters(
                    WorkflowInstance::whereIn('started_by', $orgUserIds)->whereBetween('created_at', [$start, $end]),
                    'created_at',
                    $filters
                )->count(),
                'completed' => $this->applyDateFilters(
                    WorkflowInstance::whereIn('started_by', $orgUserIds)
                        ->where('status', 'completed')
                        ->whereBetween('completed_at', [$start, $end]),
                    'completed_at',
                    $filters
                )->count(),
                'cancelled' => $this->applyDateFilters(
                    WorkflowInstance::whereIn('started_by', $orgUserIds)
                        ->where('status', 'cancelled')
                        ->whereBetween('updated_at', [$start, $end]),
                    'updated_at',
                    $filters
                )->count(),
            ];
        }

        return $data;
    }
}
