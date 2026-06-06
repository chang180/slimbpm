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
            'timezone' => 'Asia/Tokyo',
            'language' => 'zh-TW',
            'date_format' => 'Y-m-d',
            'time_format' => 'H:i',
            'currency' => 'TWD',
            'notifications' => [
                'email_notifications' => true,
                'system_notifications' => false,
                'security_notifications' => true,
            ],
            'security' => [
                'password_policy' => [
                    'min_length' => 10,
                    'require_uppercase' => true,
                    'require_lowercase' => true,
                    'require_numbers' => true,
                    'require_symbols' => false,
                ],
                'session_timeout' => 60,
                'two_factor_required' => false,
            ],
            'appearance' => [
                'theme' => 'dark',
                'primary_color' => '#3b82f6',
                'logo_url' => '',
            ],
        ];

        $response = $this->actingAs($user)->put('/organization/settings', $settingsData);

        $response->assertStatus(200)
            ->assertJson(['message' => '組織設定已成功更新！']);

        $organization->refresh();
        $this->assertEquals('Asia/Tokyo', $organization->settings['timezone']);
        $this->assertEquals(10, $organization->settings['security']['password_policy']['min_length']);
        $this->assertEquals('dark', $organization->settings['appearance']['theme']);
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
                'auto_backup' => false,
                'backup_frequency' => 'weekly',
                'data_retention_days' => 180,
                'log_level' => 'warning',
            ],
            'notifications' => [
                'email_digest' => true,
                'digest_frequency' => 'daily',
                'system_alerts' => true,
                'security_alerts' => true,
                'maintenance_notices' => false,
            ],
            'security' => [
                'session_timeout' => 60,
                'password_expiry_days' => 30,
                'failed_login_lockout' => true,
                'ip_whitelist' => [],
                'audit_logging' => true,
            ],
            'display' => [
                'default_theme' => 'dark',
                'language' => 'zh-TW',
                'timezone' => 'Asia/Taipei',
                'date_format' => 'Y-m-d',
                'items_per_page' => 50,
            ],
        ];

        $response = $this->actingAs($user)->put('/organization/preferences', $preferencesData);

        $response->assertStatus(200)
            ->assertJson(['message' => '偏好設定已成功更新！']);

        $organization->refresh();
        $this->assertEquals('weekly', $organization->settings['preferences']['system']['backup_frequency']);
        $this->assertEquals(50, $organization->settings['preferences']['display']['items_per_page']);
        $this->assertEquals('dark', $organization->settings['preferences']['display']['default_theme']);
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

    public function test_stats_are_scoped_to_current_organization(): void
    {
        $orgA = OrganizationSetting::factory()->create();
        $orgB = OrganizationSetting::factory()->create();

        $userA = User::factory()->create(['organization_id' => $orgA->id]);
        User::factory()->count(3)->create(['organization_id' => $orgA->id]);
        User::factory()->count(5)->create(['organization_id' => $orgB->id]);

        $response = $this->actingAs($userA)->get('/organization');

        $response->assertStatus(200)
            ->assertInertia(fn ($page) => $page->component('Organization/Index')
                ->where('stats.totalUsers', 4)
            );
    }

    public function test_user_cannot_access_other_organization_settings(): void
    {
        $orgA = OrganizationSetting::factory()->create(['settings' => null]);
        $orgB = OrganizationSetting::factory()->create(['settings' => null]);

        $userA = User::factory()->create(['organization_id' => $orgA->id]);

        $settingsData = [
            'timezone' => 'Asia/Tokyo',
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

        // userA updates settings — should update orgA only, not orgB
        $this->actingAs($userA)->put('/organization/settings', $settingsData);

        $orgA->refresh();
        $orgB->refresh();

        $this->assertEquals('Asia/Tokyo', $orgA->settings['timezone']);
        $this->assertNull($orgB->settings);
    }
}
