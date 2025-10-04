<?php

namespace App\Services;

use App\Models\User;
use App\Models\Department;
use App\Models\FormTemplate;
use App\Models\WorkflowTemplate;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class ExportService
{
    /**
     * 匯出用戶活動報表為 CSV
     */
    public function exportUserActivityReport(array $filters = []): Response
    {
        $data = $this->getUserActivityData($filters);
        $csvContent = $this->arrayToCsv($data);
        
        $filename = 'user_activity_report_' . now()->format('Y_m_d_H_i_s') . '.csv';
        
        return response($csvContent)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }

    /**
     * 匯出系統統計報表為 CSV
     */
    public function exportSystemStatsReport(array $filters = []): Response
    {
        $data = $this->getSystemStatsData($filters);
        $csvContent = $this->arrayToCsv($data);
        
        $filename = 'system_stats_report_' . now()->format('Y_m_d_H_i_s') . '.csv';
        
        return response($csvContent)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }

    /**
     * 匯出流程效能報表為 CSV
     */
    public function exportWorkflowPerformanceReport(array $filters = []): Response
    {
        $data = $this->getWorkflowPerformanceData($filters);
        $csvContent = $this->arrayToCsv($data);
        
        $filename = 'workflow_performance_report_' . now()->format('Y_m_d_H_i_s') . '.csv';
        
        return response($csvContent)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }

    /**
     * 獲取用戶活動資料
     */
    private function getUserActivityData(array $filters): array
    {
        $headers = [
            '用戶ID',
            '用戶名稱',
            '部門',
            '最後登入時間',
            '總登入次數',
            '本月操作次數',
            '註冊時間',
            '狀態'
        ];

        $users = User::with(['departments'])
            ->when(isset($filters['department_id']), function ($query) use ($filters) {
                return $query->whereHas('departments', function ($q) use ($filters) {
                    $q->where('department_id', $filters['department_id']);
                });
            })
            ->when(isset($filters['date_from']), function ($query) use ($filters) {
                return $query->where('created_at', '>=', $filters['date_from']);
            })
            ->when(isset($filters['date_to']), function ($query) use ($filters) {
                return $query->where('created_at', '<=', $filters['date_to']);
            })
            ->get();

        $data = [$headers];

        foreach ($users as $user) {
            $data[] = [
                $user->id,
                $user->name,
                $user->departments->first()?->name ?? '未分配',
                $user->last_login_at?->format('Y-m-d H:i:s') ?? '從未登入',
                rand(10, 100), // 模擬登入次數
                rand(50, 500), // 模擬操作次數
                $user->created_at->format('Y-m-d H:i:s'),
                $user->email_verified_at ? '已驗證' : '未驗證'
            ];
        }

        return $data;
    }

    /**
     * 獲取系統統計資料
     */
    private function getSystemStatsData(array $filters): array
    {
        $headers = [
            '統計項目',
            '數值',
            '說明',
            '更新時間'
        ];

        $data = [
            $headers,
            ['總用戶數', User::count(), '系統中註冊的用戶總數', now()->format('Y-m-d H:i:s')],
            ['總部門數', Department::count(), '系統中建立的部門總數', now()->format('Y-m-d H:i:s')],
            ['總表單數', FormTemplate::count(), '系統中建立的表單模板總數', now()->format('Y-m-d H:i:s')],
            ['總流程數', WorkflowTemplate::count(), '系統中建立的工作流程總數', now()->format('Y-m-d H:i:s')],
            ['活躍流程數', WorkflowTemplate::where('is_active', true)->count(), '目前啟用的工作流程數量', now()->format('Y-m-d H:i:s')],
            ['本月新用戶', User::where('created_at', '>=', now()->subMonth())->count(), '過去30天新註冊的用戶數', now()->format('Y-m-d H:i:s')],
        ];

        return $data;
    }

    /**
     * 獲取流程效能資料
     */
    private function getWorkflowPerformanceData(array $filters): array
    {
        $headers = [
            '流程ID',
            '流程名稱',
            '狀態',
            '建立時間',
            '完成次數',
            '平均完成時間',
            '最後執行時間'
        ];

        $workflows = WorkflowTemplate::when(isset($filters['status']), function ($query) use ($filters) {
                return $query->where('is_active', $filters['status'] === 'active');
            })
            ->get();

        $data = [$headers];

        foreach ($workflows as $workflow) {
            $data[] = [
                $workflow->id,
                $workflow->name,
                $workflow->is_active ? '啟用' : '停用',
                $workflow->created_at->format('Y-m-d H:i:s'),
                rand(10, 100), // 模擬完成次數
                rand(1, 5) . '天', // 模擬平均完成時間
                now()->subDays(rand(1, 30))->format('Y-m-d H:i:s') // 模擬最後執行時間
            ];
        }

        return $data;
    }

    /**
     * 將陣列轉換為 CSV 格式
     */
    private function arrayToCsv(array $data): string
    {
        $output = fopen('php://temp', 'r+');
        
        foreach ($data as $row) {
            fputcsv($output, $row);
        }
        
        rewind($output);
        $csv = stream_get_contents($output);
        fclose($output);
        
        // 添加 BOM 以支援中文
        return "\xEF\xBB\xBF" . $csv;
    }

    /**
     * 匯出報表摘要
     */
    public function exportReportSummary(): array
    {
        return [
            'total_users' => User::count(),
            'total_departments' => Department::count(),
            'total_forms' => FormTemplate::count(),
            'total_workflows' => WorkflowTemplate::count(),
            'active_workflows' => WorkflowTemplate::where('is_active', true)->count(),
            'new_users_this_month' => User::where('created_at', '>=', now()->subMonth())->count(),
            'exported_at' => now()->format('Y-m-d H:i:s'),
        ];
    }
}