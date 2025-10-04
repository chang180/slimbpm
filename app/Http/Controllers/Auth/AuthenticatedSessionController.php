<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $user = $request->validateCredentials();

        if (Features::enabled(Features::twoFactorAuthentication()) && $user->hasEnabledTwoFactorAuthentication()) {
            /** @var \Illuminate\Http\Request $request */
            $request->session()->put([
                'login.id' => $user->getKey(),
                'login.remember' => $request->boolean('remember'),
            ]);

            return to_route('two-factor.login');
        }

        /** @var \Illuminate\Http\Request $request */
        Auth::login($user, $request->boolean('remember'));

        $request->session()->regenerate();

        // 重新載入用戶以確保組織關係已載入
        $user->load('organization');

        // 根據用戶角色分流到不同界面
        return $this->redirectBasedOnRole($user);
    }

    /**
     * 根據用戶角色重定向到相應界面
     */
    private function redirectBasedOnRole($user): RedirectResponse
    {
        // 獲取用戶所屬組織的 slug
        $slug = $user->organization?->slug;
        
        if (!$slug) {
            // 如果用戶沒有組織，重定向到歡迎頁面
            return redirect()->intended(route('home'));
        }
        
        switch ($user->role) {
            case 'admin':
            case 'manager':
                // 管理員和主管進入後台管理界面
                return redirect()->intended(route('dashboard', ['slug' => $slug]));
            case 'user':
            default:
                // 一般用戶進入前台用戶界面 (暫時重定向到儀表板)
                return redirect()->intended(route('dashboard', ['slug' => $slug]));
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
