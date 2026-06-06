<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\FormSubmission;
use App\Models\FormTemplate;
use App\Models\OrganizationSetting;
use App\Models\User;
use App\Models\WorkflowHistory;
use App\Models\WorkflowTemplate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class OrganizationController extends Controller
{
    /**
     * 顯示組織管理主頁面
     */
    public function index(Request $request): Response
    {
        $organization = $request->get('current_organization');
        $stats = $this->getOrganizationStats($organization);

        return Inertia::render('Organization/Index', [
            'organization' => $organization,
            'stats' => $stats,
        ]);
    }

    /**
     * 顯示組織設定頁面
     */
    public function settings(Request $request): Response
    {
        $organization = $request->get('current_organization');
        $stored = $organization->settings ?? [];

        $settings = array_merge([
            'timezone' => 'Asia/Taipei',
            'language' => 'zh-TW',
            'date_format' => 'Y-m-d',
            'time_format' => 'H:i',
            'currency' => 'TWD',
            'notifications' => [
                'email_notifications' => true,
                'system_notifications' => true,
                'security_notifications' => true,
            ],
            'security' => [
                'password_policy' => [
                    'min_length' => 8,
                    'require_uppercase' => true,
                    'require_lowercase' => true,
                    'require_numbers' => true,
                    'require_symbols' => false,
                ],
                'session_timeout' => 120,
                'two_factor_required' => false,
            ],
            'appearance' => [
                'theme' => 'auto',
                'primary_color' => '#3b82f6',
                'logo_url' => '',
            ],
        ], array_diff_key($stored, ['preferences' => null]));

        return Inertia::render('Organization/Settings', [
            'organization' => $organization,
            'settings' => $settings,
        ]);
    }

    /**
     * 更新組織設定
     */
    public function updateSettings(Request $request): JsonResponse
    {
        $organization = $request->get('current_organization');

        $validated = $request->validate([
            'timezone' => 'required|string',
            'language' => 'required|string',
            'date_format' => 'required|string',
            'time_format' => 'required|string',
            'currency' => 'required|string',
            'notifications' => 'required|array',
            'notifications.email_notifications' => 'boolean',
            'notifications.system_notifications' => 'boolean',
            'notifications.security_notifications' => 'boolean',
            'security' => 'required|array',
            'security.password_policy' => 'required|array',
            'security.password_policy.min_length' => 'required|integer|min:6|max:32',
            'security.password_policy.require_uppercase' => 'boolean',
            'security.password_policy.require_lowercase' => 'boolean',
            'security.password_policy.require_numbers' => 'boolean',
            'security.password_policy.require_symbols' => 'boolean',
            'security.session_timeout' => 'required|integer|min:5|max:1440',
            'security.two_factor_required' => 'boolean',
            'appearance' => 'required|array',
            'appearance.theme' => 'required|string|in:light,dark,auto',
            'appearance.primary_color' => 'required|string',
            'appearance.logo_url' => 'nullable|url',
        ]);

        $existing = $organization->settings ?? [];
        $organization->settings = array_merge($existing, $validated);
        $organization->save();

        return response()->json(['message' => '組織設定已成功更新！']);
    }

    /**
     * 顯示組織資訊頁面
     */
    public function info(Request $request): Response
    {
        $organization = $request->get('current_organization');
        $stats = $this->getOrganizationStats($organization);

        return Inertia::render('Organization/Info', [
            'organization' => $organization,
            'stats' => $stats,
        ]);
    }

    /**
     * 顯示組織偏好設定頁面
     */
    public function preferences(Request $request): Response
    {
        $organization = $request->get('current_organization');
        $stored = ($organization->settings ?? [])['preferences'] ?? [];

        $preferences = array_merge([
            'system' => [
                'auto_backup' => true,
                'backup_frequency' => 'daily',
                'data_retention_days' => 365,
                'log_level' => 'info',
            ],
            'notifications' => [
                'email_digest' => true,
                'digest_frequency' => 'weekly',
                'system_alerts' => true,
                'security_alerts' => true,
                'maintenance_notices' => true,
            ],
            'security' => [
                'session_timeout' => 120,
                'password_expiry_days' => 90,
                'failed_login_lockout' => true,
                'ip_whitelist' => [],
                'audit_logging' => true,
            ],
            'display' => [
                'default_theme' => 'auto',
                'language' => 'zh-TW',
                'timezone' => 'Asia/Taipei',
                'date_format' => 'Y-m-d',
                'items_per_page' => 20,
            ],
        ], $stored);

        return Inertia::render('Organization/Preferences', [
            'organization' => $organization,
            'preferences' => $preferences,
        ]);
    }

    /**
     * 更新組織偏好設定
     */
    public function updatePreferences(Request $request): JsonResponse
    {
        $organization = $request->get('current_organization');

        $validated = $request->validate([
            'system' => 'required|array',
            'system.auto_backup' => 'boolean',
            'system.backup_frequency' => 'required|string|in:daily,weekly,monthly',
            'system.data_retention_days' => 'required|integer|min:1|max:3650',
            'system.log_level' => 'required|string|in:debug,info,warning,error',
            'notifications' => 'required|array',
            'notifications.email_digest' => 'boolean',
            'notifications.digest_frequency' => 'required|string|in:daily,weekly,monthly',
            'notifications.system_alerts' => 'boolean',
            'notifications.security_alerts' => 'boolean',
            'notifications.maintenance_notices' => 'boolean',
            'security' => 'required|array',
            'security.session_timeout' => 'required|integer|min:5|max:1440',
            'security.password_expiry_days' => 'required|integer|min:0|max:365',
            'security.failed_login_lockout' => 'boolean',
            'security.ip_whitelist' => 'array',
            'security.audit_logging' => 'boolean',
            'display' => 'required|array',
            'display.default_theme' => 'required|string|in:light,dark,auto',
            'display.language' => 'required|string',
            'display.timezone' => 'required|string',
            'display.date_format' => 'required|string',
            'display.items_per_page' => 'required|integer|min:10|max:100',
        ]);

        $existing = $organization->settings ?? [];
        $existing['preferences'] = $validated;
        $organization->settings = $existing;
        $organization->save();

        return response()->json(['message' => '偏好設定已成功更新！']);
    }

    /**
     * 顯示組織統計報表頁面
     */
    public function reports(Request $request): Response
    {
        $organization = $request->get('current_organization');
        $stats = $this->getOrganizationStats($organization);

        return Inertia::render('Organization/Reports', [
            'organization' => $organization,
            'stats' => $stats,
        ]);
    }

    /**
     * 取得 org-scoped 組織統計資料（camelCase）
     */
    private function getOrganizationStats(OrganizationSetting $organization): array
    {
        $orgUserIds = User::where('organization_id', $organization->id)->pluck('id');

        $recentActivity = $this->getRecentActivity($orgUserIds);

        return [
            'totalUsers' => $orgUserIds->count(),
            'totalDepartments' => Department::where('organization_id', $organization->id)->count(),
            'totalForms' => FormTemplate::whereIn('created_by', $orgUserIds)->count(),
            'totalWorkflows' => WorkflowTemplate::whereIn('created_by', $orgUserIds)->where('is_current', true)->count(),
            'activeWorkflows' => WorkflowTemplate::whereIn('created_by', $orgUserIds)->where('is_current', true)->where('is_active', true)->count(),
            'recentActivity' => $recentActivity,
        ];
    }

    private function getRecentActivity(Collection $orgUserIds): array
    {
        $actionLabels = [
            'started' => '啟動了工作流程',
            'approved' => '審批通過',
            'rejected' => '拒絕審批',
            'completed' => '完成了工作流程',
            'cancelled' => '取消了工作流程',
        ];

        $histories = WorkflowHistory::with(['performer', 'workflowInstance'])
            ->whereHas('workflowInstance.starter', fn ($q) => $q->whereIn('id', $orgUserIds))
            ->orderBy('performed_at', 'desc')
            ->limit(5)
            ->get()
            ->map(fn ($h) => [
                'id' => $h->id,
                'type' => $h->action,
                'description' => ($actionLabels[$h->action] ?? $h->action).'：'.($h->workflowInstance->title ?? ''),
                'user' => $h->performer->name ?? '系統',
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
                'user' => $s->submitter->name ?? '用戶',
                'created_at' => $s->submitted_at?->toISOString() ?? $s->created_at->toISOString(),
            ]);

        return $histories->concat($submissions)
            ->sortByDesc('created_at')
            ->take(5)
            ->values()
            ->toArray();
    }
}
