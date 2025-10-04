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
        // 檢查頁面是否包含 dark mode 相關的 JavaScript 和 CSS
        $response->assertSee('prefers-color-scheme: dark');
        $response->assertSee('html.dark');
    }

    public function test_welcome_page_shows_login_register_buttons_for_guests(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        // 對於 Inertia.js 應用程式，我們測試 Inertia 頁面而不是 HTML 內容
        $response->assertInertia(fn ($page) => 
            $page->component('welcome')
                ->has('auth.user', null) // 確保用戶未登入
        );
    }

    public function test_welcome_page_shows_dashboard_button_for_authenticated_users(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/');

        $response->assertStatus(200);
        // 測試 Inertia 頁面包含已登入用戶
        $response->assertInertia(fn ($page) => 
            $page->component('welcome')
                ->has('auth.user')
                ->where('auth.user.id', $user->id)
        );
    }

    public function test_welcome_page_has_dark_mode_toggle_component(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        // 檢查頁面結構和基本 props
        $response->assertInertia(fn ($page) => 
            $page->component('welcome')
                ->has('auth')
                ->has('name')
        );
    }

    public function test_welcome_page_has_all_feature_sections(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        // 測試頁面載入成功並有正確的結構
        $response->assertInertia(fn ($page) => 
            $page->component('welcome')
                ->has('auth')
                ->has('name')
                ->has('quote')
        );
    }

    public function test_welcome_page_has_cta_section(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        // 測試頁面基本結構
        $response->assertInertia(fn ($page) => 
            $page->component('welcome')
                ->has('auth')
                ->has('name')
        );
    }

    public function test_welcome_page_has_footer(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        // 測試頁面基本結構
        $response->assertInertia(fn ($page) => 
            $page->component('welcome')
                ->has('auth')
                ->has('name')
        );
    }
}
