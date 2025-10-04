<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WelcomePageDarkModeTest extends TestCase
{
    use RefreshDatabase;

    public function test_welcome_page_loads_successfully(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('welcome'));
    }

    public function test_welcome_page_has_dark_mode_toggle(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        // 檢查頁面是否包含 dark mode 相關的類別
        $response->assertSee('dark:from-gray-900');
        $response->assertSee('dark:text-white');
    }

    public function test_welcome_page_shows_login_register_buttons_for_guests(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertSee('登入');
        $response->assertSee('免費註冊');
    }

    public function test_welcome_page_shows_dashboard_button_for_authenticated_users(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/');

        $response->assertStatus(200);
        $response->assertSee('進入系統');
    }

    public function test_welcome_page_has_dark_mode_toggle_component(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        // 檢查是否包含 dark mode 切換相關的文字
        $response->assertSee('淺色');
        $response->assertSee('深色');
    }

    public function test_welcome_page_has_all_feature_sections(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertSee('核心功能特色');
        $response->assertSee('表單設計器');
        $response->assertSee('工作流程引擎');
        $response->assertSee('用戶管理');
        $response->assertSee('通知系統');
        $response->assertSee('數據分析');
        $response->assertSee('安全可靠');
    }

    public function test_welcome_page_has_cta_section(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertSee('準備好開始您的工作流程數位化之旅了嗎？');
        $response->assertSee('免費開始使用');
        $response->assertSee('聯繫我們');
    }

    public function test_welcome_page_has_footer(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertSee('產品功能');
        $response->assertSee('技術支援');
        $response->assertSee('關於我們');
        $response->assertSee('版權所有');
    }
}
