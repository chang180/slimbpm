<?php

namespace App\Http\Controllers;

use App\Models\OrganizationSetting;
use App\Models\User;
use App\Models\Department;
use App\Models\WorkflowTemplate;
use App\Models\FormTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrganizationController extends Controller
{
    /**
     * 顯示組織管理主頁面
     */
    public function index(): Response
    {
        $organization = OrganizationSetting::first() ?? OrganizationSetting::create([
            'name' => '預設組織',
            'description' => '系統預設組織',
            'email' => 'admin@example.com',
            'phone' => '+886-2-1234-5678',
            'website' => 'https://example.com',
            'address' => '台北市信義區信義路五段7號',
        ]);

        $stats = $this->getOrganizationStats();

        return Inertia::render('Organization/Index', [
            'organization' => $organization,
            'stats' => $stats,
        ]);
    }

    /**
     * 顯示組織設定頁面
     */
    public function settings(): Response
    {
        $organization = OrganizationSetting::first() ?? OrganizationSetting::create([
            'name' => '預設組織',
            'description' => '系統預設組織',
        ]);

        $settings = [
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
        ];

        return Inertia::render('Organization/Settings', [
            'organization' => $organization,
            'settings' => $settings,
        ]);
    }

    /**
     * 更新組織設定
     */
    public function updateSettings(Request $request)
    {
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

        // 這裡會實作實際的設定更新邏輯
        // 目前只是返回成功訊息

        return response()->json(['message' => '組織設定已成功更新！']);
    }

    /**
     * 顯示組織資訊頁面
     */
    public function info(): Response
    {
        $organization = OrganizationSetting::first() ?? OrganizationSetting::create([
            'name' => '預設組織',
            'description' => '系統預設組織',
            'email' => 'admin@example.com',
            'phone' => '+886-2-1234-5678',
            'website' => 'https://example.com',
            'address' => '台北市信義區信義路五段7號',
        ]);

        $stats = $this->getOrganizationStats();

        return Inertia::render('Organization/Info', [
            'organization' => $organization,
            'stats' => $stats,
        ]);
    }

    /**
     * 顯示組織偏好設定頁面
     */
    public function preferences(): Response
    {
        $organization = OrganizationSetting::first() ?? OrganizationSetting::create([
            'name' => '預設組織',
            'description' => '系統預設組織',
        ]);

        $preferences = [
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
        ];

        return Inertia::render('Organization/Preferences', [
            'organization' => $organization,
            'preferences' => $preferences,
        ]);
    }

    /**
     * 更新組織偏好設定
     */
    public function updatePreferences(Request $request)
    {
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

        // 這裡會實作實際的偏好設定更新邏輯
        // 目前只是返回成功訊息

        return response()->json(['message' => '偏好設定已成功更新！']);
    }

    /**
     * 顯示組織統計報表頁面
     */
    public function reports(): Response
    {
        $organization = OrganizationSetting::first() ?? OrganizationSetting::create([
            'name' => '預設組織',
            'description' => '系統預設組織',
        ]);

        $stats = $this->getOrganizationStats();

        return Inertia::render('Organization/Reports', [
            'organization' => $organization,
            'stats' => $stats,
        ]);
    }

    /**
     * 取得組織統計資料
     */
    private function getOrganizationStats(): array
    {
        return [
            'total_users' => User::count(),
            'active_users' => User::where('is_active', true)->count(),
            'total_departments' => Department::count(),
            'total_workflows' => WorkflowTemplate::count(),
            'total_forms' => FormTemplate::count(),
            'recent_activity' => [
                [
                    'id' => 1,
                    'type' => 'user_created',
                    'description' => '新增用戶：張三',
                    'user_name' => '系統管理員',
                    'created_at' => now()->subHours(2)->toISOString(),
                ],
                [
                    'id' => 2,
                    'type' => 'department_created',
                    'description' => '建立部門：技術部',
                    'user_name' => '系統管理員',
                    'created_at' => now()->subHours(4)->toISOString(),
                ],
                [
                    'id' => 3,
                    'type' => 'workflow_created',
                    'description' => '建立工作流程：請假申請',
                    'user_name' => '系統管理員',
                    'created_at' => now()->subHours(6)->toISOString(),
                ],
                [
                    'id' => 4,
                    'type' => 'form_created',
                    'description' => '建立表單：員工資料表',
                    'user_name' => '系統管理員',
                    'created_at' => now()->subHours(8)->toISOString(),
                ],
                [
                    'id' => 5,
                    'type' => 'user_updated',
                    'description' => '更新用戶：李四',
                    'user_name' => '系統管理員',
                    'created_at' => now()->subHours(12)->toISOString(),
                ],
            ],
        ];
    }
}
