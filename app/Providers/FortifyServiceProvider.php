<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // 自定義email verification的重定向邏輯
        $this->app->instance(\Laravel\Fortify\Contracts\VerifyEmailResponse::class, new class implements \Laravel\Fortify\Contracts\VerifyEmailResponse
        {
            public function toResponse($request)
            {
                $user = \Illuminate\Support\Facades\Auth::user();

                if (! $user) {
                    return redirect()->route('home');
                }

                // 重新從資料庫取得用戶資料以確保有最新的 organization_id
                $user = \App\Models\User::find($user->id);

                if ($user && $user->organization_id) {
                    $organization = \App\Models\OrganizationSetting::find($user->organization_id);
                    if ($organization) {
                        return redirect(route('dashboard', ['slug' => $organization->slug]).'?verified=1');
                    }
                }

                return redirect()->route('home');
            }
        });

        // 自定義登入後的重定向邏輯
        $this->app->instance(\Laravel\Fortify\Contracts\LoginResponse::class, new class implements \Laravel\Fortify\Contracts\LoginResponse
        {
            public function toResponse($request)
            {
                $user = \Illuminate\Support\Facades\Auth::user();

                if (! $user) {
                    return redirect()->route('home');
                }

                // 直接使用 organization_id 查詢組織
                if ($user->organization_id) {
                    $organization = \App\Models\OrganizationSetting::find($user->organization_id);
                    if ($organization) {
                        return redirect()->intended(route('dashboard', ['slug' => $organization->slug]));
                    }
                }

                return redirect()->route('home');
            }
        });

        // 自定義註冊後的重定向邏輯
        $this->app->instance(\Laravel\Fortify\Contracts\RegisterResponse::class, new class implements \Laravel\Fortify\Contracts\RegisterResponse
        {
            public function toResponse($request)
            {
                $user = \Illuminate\Support\Facades\Auth::user();

                if (! $user) {
                    return redirect()->route('home');
                }

                // 直接使用 organization_id 查詢組織
                if ($user->organization_id) {
                    $organization = \App\Models\OrganizationSetting::find($user->organization_id);
                    if ($organization) {
                        return redirect()->intended(route('dashboard', ['slug' => $organization->slug]));
                    }
                }

                return redirect()->route('home');
            }
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Fortify::twoFactorChallengeView(fn () => Inertia::render('auth/two-factor-challenge'));
        Fortify::confirmPasswordView(fn () => Inertia::render('auth/confirm-password'));
        Fortify::verifyEmailView(fn () => Inertia::render('auth/verify-email'));

        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });
    }
}
