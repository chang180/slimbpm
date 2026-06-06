<?php

use App\Models\OrganizationSetting;
use App\Models\User;
use Pest\Browser\Playwright\Playwright;

beforeEach(function (): void {
    Playwright::setTimeout(15_000);
});

/**
 * @return array{0: User, 1: OrganizationSetting}
 */
function createBrowserAdmin(): array
{
    $organization = OrganizationSetting::factory()->create();
    $user = User::factory()->withoutTwoFactor()->create([
        'organization_id' => $organization->id,
        'role' => 'admin',
    ]);

    return [$user, $organization];
}

function loginThroughBrowser(User $user): void
{
    visit('/login')
        ->assertSee('登入系統')
        ->fill('email', $user->email)
        ->fill('password', 'password')
        ->click('[data-test="login-button"]')
        ->assertSee('企業管理後台');
}

it('renders the login page', function () {
    visit('/login')
        ->assertSee('登入系統')
        ->assertNoJavaScriptErrors();
});

it('logs in and loads the dashboard without javascript errors', function () {
    [$user] = createBrowserAdmin();

    visit('/login')
        ->assertSee('登入系統')
        ->fill('email', $user->email)
        ->fill('password', 'password')
        ->click('[data-test="login-button"]')
        ->assertSee('企業管理後台')
        ->assertNoJavaScriptErrors();
});

it('loads the forms index when authenticated', function () {
    [$user] = createBrowserAdmin();

    loginThroughBrowser($user);

    visit('/forms')
        ->assertSee('表單管理')
        ->assertNoJavaScriptErrors();
});

it('loads the workflows index when authenticated', function () {
    [$user] = createBrowserAdmin();

    loginThroughBrowser($user);

    visit('/workflows')
        ->assertSee('工作流程')
        ->assertNoJavaScriptErrors();
});

it('opens the notification bell dropdown when authenticated', function () {
    [$user] = createBrowserAdmin();

    loginThroughBrowser($user);

    visit('/dashboard-redirect')
        ->click('[data-test="notification-bell"]')
        ->assertSee('通知');
});
