<?php

namespace App\Services;

use App\Models\Department;
use App\Models\FormSubmission;
use App\Models\FormTemplate;
use App\Models\OrganizationSetting;
use App\Models\User;
use App\Models\WorkflowInstance;
use App\Models\WorkflowTemplate;
use Illuminate\Http\Response;
use Illuminate\Support\Collection;

class ExportService
{
    public function exportUserActivityReport(OrganizationSetting $organization, Collection $orgUserIds, array $filters = []): Response
    {
        $data = $this->getUserActivityData($organization, $orgUserIds, $filters);
        $filename = 'user_activity_report_'.now()->format('Y_m_d_H_i_s').'.csv';

        return $this->csvResponse($data, $filename);
    }

    public function exportSystemStatsReport(OrganizationSetting $organization, Collection $orgUserIds): Response
    {
        $data = $this->getSystemStatsData($organization, $orgUserIds);
        $filename = 'system_stats_report_'.now()->format('Y_m_d_H_i_s').'.csv';

        return $this->csvResponse($data, $filename);
    }

    public function exportWorkflowPerformanceReport(OrganizationSetting $organization, Collection $orgUserIds, array $filters = []): Response
    {
        $data = $this->getWorkflowPerformanceData($orgUserIds, $filters);
        $filename = 'workflow_performance_report_'.now()->format('Y_m_d_H_i_s').'.csv';

        return $this->csvResponse($data, $filename);
    }

    private function getUserActivityData(OrganizationSetting $organization, Collection $orgUserIds, array $filters): array
    {
        $submissionCounts = FormSubmission::whereIn('submitted_by', $orgUserIds)
            ->selectRaw('submitted_by, count(*) as total')
            ->groupBy('submitted_by')
            ->pluck('total', 'submitted_by');

        $workflowCounts = WorkflowInstance::whereIn('started_by', $orgUserIds)
            ->selectRaw('started_by, count(*) as total')
            ->groupBy('started_by')
            ->pluck('total', 'started_by');

        $users = User::with('departments')
            ->where('organization_id', $organization->id)
            ->when(isset($filters['department_id']), fn ($q) => $q->whereHas('departments', fn ($dq) => $dq->where('departments.id', $filters['department_id'])))
            ->when(isset($filters['date_from']), fn ($q) => $q->where('created_at', '>=', $filters['date_from']))
            ->when(isset($filters['date_to']), fn ($q) => $q->where('created_at', '<=', $filters['date_to']))
            ->orderBy('name')
            ->get();

        $rows = [[
            '用戶ID', '用戶名稱', '電子郵件', '部門', '角色',
            '表單提交次數', '工作流程執行次數', '帳號狀態', '加入時間',
        ]];

        foreach ($users as $user) {
            $roleLabel = match ($user->role) {
                'admin' => '管理員',
                'manager' => '主管',
                default => '一般用戶',
            };

            $rows[] = [
                $user->id,
                $user->name,
                $user->email,
                $user->departments->first()?->name ?? '未分配',
                $roleLabel,
                $submissionCounts[$user->id] ?? 0,
                $workflowCounts[$user->id] ?? 0,
                $user->email_verified_at ? '已驗證' : '未驗證',
                $user->created_at->format('Y-m-d H:i:s'),
            ];
        }

        return $rows;
    }

    private function getSystemStatsData(OrganizationSetting $organization, Collection $orgUserIds): array
    {
        $now = now()->format('Y-m-d H:i:s');

        return [
            ['統計項目', '數值', '說明', '更新時間'],
            ['組織名稱', $organization->name, '組織識別名稱', $now],
            ['總用戶數', $orgUserIds->count(), '組織內的用戶總數', $now],
            ['總部門數', Department::where('organization_id', $organization->id)->count(), '組織內的部門總數', $now],
            ['總表單模板數', FormTemplate::whereIn('created_by', $orgUserIds)->count(), '組織用戶建立的表單模板數', $now],
            ['總流程模板數', WorkflowTemplate::whereIn('created_by', $orgUserIds)->where('is_current', true)->count(), '組織用戶建立的流程模板數', $now],
            ['啟用流程模板數', WorkflowTemplate::whereIn('created_by', $orgUserIds)->where('is_current', true)->where('is_active', true)->count(), '目前啟用中的流程模板數', $now],
            ['表單提交總數', FormSubmission::whereIn('submitted_by', $orgUserIds)->count(), '組織內的表單提交記錄總數', $now],
            ['工作流程執行總數', WorkflowInstance::whereIn('started_by', $orgUserIds)->count(), '組織內啟動的工作流程總數', $now],
            ['進行中流程數', WorkflowInstance::whereIn('started_by', $orgUserIds)->where('status', 'running')->count(), '目前狀態為 running 的流程數', $now],
            ['本月新增用戶', User::where('organization_id', $organization->id)->where('created_at', '>=', now()->startOfMonth())->count(), '本月新加入的用戶數', $now],
        ];
    }

    private function getWorkflowPerformanceData(Collection $orgUserIds, array $filters): array
    {
        $templates = WorkflowTemplate::withCount([
            'instances as total_instances' => fn ($q) => $q->whereIn('started_by', $orgUserIds),
            'instances as completed_instances' => fn ($q) => $q->whereIn('started_by', $orgUserIds)->where('status', 'completed'),
            'instances as cancelled_instances' => fn ($q) => $q->whereIn('started_by', $orgUserIds)->where('status', 'cancelled'),
            'instances as running_instances' => fn ($q) => $q->whereIn('started_by', $orgUserIds)->where('status', 'running'),
        ])
            ->whereIn('created_by', $orgUserIds)
            ->where('is_current', true)
            ->when(isset($filters['status']), fn ($q) => $q->where('is_active', $filters['status'] === 'active'))
            ->orderBy('total_instances', 'desc')
            ->get();

        $rows = [[
            '流程模板名稱', '狀態', '執行總數', '完成次數', '取消次數', '進行中',
            '平均完成天數', '最後執行時間',
        ]];

        foreach ($templates as $tpl) {
            $avgDays = null;
            if ($tpl->completed_instances > 0) {
                $completed = WorkflowInstance::whereIn('started_by', $orgUserIds)
                    ->where('template_id', $tpl->id)
                    ->where('status', 'completed')
                    ->whereNotNull('started_at')
                    ->whereNotNull('completed_at')
                    ->get(['started_at', 'completed_at']);

                if ($completed->isNotEmpty()) {
                    $avgDays = round(
                        $completed->average(fn ($i) => $i->started_at->diffInHours($i->completed_at) / 24),
                        1
                    );
                }
            }

            $lastRun = WorkflowInstance::whereIn('started_by', $orgUserIds)
                ->where('template_id', $tpl->id)
                ->latest('created_at')
                ->value('created_at');

            $rows[] = [
                $tpl->name,
                $tpl->is_active ? '啟用' : '停用',
                $tpl->total_instances,
                $tpl->completed_instances,
                $tpl->cancelled_instances,
                $tpl->running_instances,
                $avgDays !== null ? $avgDays.' 天' : '—',
                $lastRun?->format('Y-m-d H:i:s') ?? '—',
            ];
        }

        return $rows;
    }

    private function csvResponse(array $data, string $filename): Response
    {
        $output = fopen('php://temp', 'r+');

        foreach ($data as $row) {
            fputcsv($output, array_map('strval', $row));
        }

        rewind($output);
        $csv = stream_get_contents($output);
        fclose($output);

        return response("\xEF\xBB\xBF".$csv)
            ->header('Content-Type', 'text/csv; charset=UTF-8')
            ->header('Content-Disposition', 'attachment; filename="'.$filename.'"');
    }
}
