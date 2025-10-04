<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Auth;
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
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Fortify::twoFactorChallengeView(fn () => Inertia::render('auth/two-factor-challenge'));
        Fortify::confirmPasswordView(fn () => Inertia::render('auth/confirm-password'));

        // 自定義登入後的重定向邏輯
        Fortify::loginView(function () {
            return redirect()->route('home');
        });

        // 重寫登入成功後的重定向
        Fortify::redirects('login', function (Request $request) {
            $user = Auth::user();
            
            if (!$user) {
                return redirect()->route('home');
            }

            // 載入組織關係
            $user->load('organization');
            $slug = $user->organization?->slug;
            
            if (!$slug) {
                return redirect()->route('home');
            }

            // 根據用戶角色重定向
            switch ($user->role) {
                case 'admin':
                case 'manager':
                case 'user':
                default:
                    return redirect()->intended(route('dashboard', ['slug' => $slug]));
            }
        });

        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });
    }
}
