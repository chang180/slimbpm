<?php

namespace Tests\Feature;

use App\Models\OrganizationSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrganizationManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
    }

    public function test_can_view_organization_index(): void
    {
        $organization = OrganizationSetting::factory()->create();
        $user = User::factory()->create(['organization_id' => $organization->id]);

        $response = $this->actingAs($user)->get('/organization');

        $response->assertStatus(200)
            ->assertInertia(fn ($page) => $page->component('Organization/Index')
                ->has('organization')
                ->has('stats')
            );
    }

    public function test_can_view_organization_settings(): void
    {
        $organization = OrganizationSetting::factory()->create();
        $user = User::factory()->create(['organization_id' => $organization->id]);

        $response = $this->actingAs($user)->get('/organization/settings');

        $response->assertStatus(200)
            ->assertInertia(fn ($page) => $page->component('Organization/Settings')
                ->has('organization')
                ->has('settings')
            );
    }

    public function test_can_update_organization_settings(): void
    {
        $organization = OrganizationSetting::factory()->create();
        $user = User::factory()->create(['organization_id' => $organization->id]);

        $settingsData = [
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

        $response = $this->actingAs($user)->put('/organization/settings', $settingsData);

        $response->assertStatus(200)
            ->assertJson(['message' => '組織設定已成功更新！']);
    }

    public function test_can_view_organization_info(): void
    {
        $organization = OrganizationSetting::factory()->create();
        $user = User::factory()->create(['organization_id' => $organization->id]);

        $response = $this->actingAs($user)->get('/organization/info');

        $response->assertStatus(200)
            ->assertInertia(fn ($page) => $page->component('Organization/Info')
                ->has('organization')
                ->has('stats')
            );
    }

    public function test_can_view_organization_preferences(): void
    {
        $organization = OrganizationSetting::factory()->create();
        $user = User::factory()->create(['organization_id' => $organization->id]);

        $response = $this->actingAs($user)->get('/organization/preferences');

        $response->assertStatus(200)
            ->assertInertia(fn ($page) => $page->component('Organization/Preferences')
                ->has('organization')
                ->has('preferences')
            );
    }

    public function test_can_update_organization_preferences(): void
    {
        $organization = OrganizationSetting::factory()->create();
        $user = User::factory()->create(['organization_id' => $organization->id]);

        $preferencesData = [
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

        $response = $this->actingAs($user)->put('/organization/preferences', $preferencesData);

        $response->assertStatus(200)
            ->assertJson(['message' => '偏好設定已成功更新！']);
    }

    public function test_can_view_organization_reports(): void
    {
        $organization = OrganizationSetting::factory()->create();
        $user = User::factory()->create(['organization_id' => $organization->id]);

        $response = $this->actingAs($user)->get('/organization/reports');

        $response->assertStatus(200)
            ->assertInertia(fn ($page) => $page->component('Organization/Reports')
                ->has('organization')
                ->has('stats')
            );
    }

    public function test_requires_authentication_to_access_organization_pages(): void
    {
        $response = $this->get('/organization');
        $response->assertRedirect('/login');

        $response = $this->get('/organization/settings');
        $response->assertRedirect('/login');

        $response = $this->get('/organization/info');
        $response->assertRedirect('/login');

        $response = $this->get('/organization/preferences');
        $response->assertRedirect('/login');

        $response = $this->get('/organization/reports');
        $response->assertRedirect('/login');
    }

    public function test_organization_settings_validation(): void
    {
        $organization = OrganizationSetting::factory()->create();
        $user = User::factory()->create(['organization_id' => $organization->id]);

        $response = $this->actingAs($user)->putJson('/organization/settings', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'timezone',
                'language',
                'date_format',
                'time_format',
                'currency',
                'notifications',
                'security',
                'appearance',
            ]);
    }

    public function test_organization_preferences_validation(): void
    {
        $organization = OrganizationSetting::factory()->create();
        $user = User::factory()->create(['organization_id' => $organization->id]);

        $response = $this->actingAs($user)->putJson('/organization/preferences', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'system',
                'notifications',
                'security',
                'display',
            ]);
    }
}
