<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\OrganizationSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class CompanyLoginController extends Controller
{
    /**
     * 顯示企業後台登入頁面
     */
    public function create(string $slug): Response
    {
        $organization = OrganizationSetting::where('slug', $slug)->firstOrFail();

        return Inertia::render('auth/LoginCompany', [
            'organization' => [
                'name' => $organization->name,
                'slug' => $organization->slug,
            ],
        ]);
    }

    /**
     * 顯示企業前台登入頁面
     */
    public function createPortal(string $slug): Response
    {
        $organization = OrganizationSetting::where('slug', $slug)->firstOrFail();

        return Inertia::render('auth/PortalLogin', [
            'organization' => [
                'name' => $organization->name,
                'slug' => $organization->slug,
            ],
        ]);
    }

    /**
     * 處理企業後台登入
     */
    public function store(Request $request, string $slug)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $organization = OrganizationSetting::where('slug', $slug)->firstOrFail();

        // 確保用戶屬於該組織
        $user = \App\Models\User::where('email', $request->email)
            ->where('organization_id', $organization->id)
            ->first();

        if (! $user) {
            throw ValidationException::withMessages([
                'email' => '找不到該企業的用戶帳號。',
            ]);
        }

        // 確保用戶有後台權限 (admin 或 manager)
        if (! in_array($user->role, ['admin', 'manager'])) {
            throw ValidationException::withMessages([
                'email' => '您沒有後台管理權限。',
            ]);
        }

        // 檢查登入限制
        if (RateLimiter::tooManyAttempts($this->throttleKey($request), 5)) {
            $seconds = RateLimiter::availableIn($this->throttleKey($request));

            throw ValidationException::withMessages([
                'email' => "登入嘗試過於頻繁，請 {$seconds} 秒後再試。",
            ]);
        }

        if (! Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey($request));

            throw ValidationException::withMessages([
                'email' => '提供的憑證與我們的記錄不符。',
            ]);
        }

        $request->session()->regenerate();

        RateLimiter::clear($this->throttleKey($request));

        return redirect()->intended(route('dashboard', ['slug' => $slug]));
    }

    /**
     * 處理企業前台登入
     */
    public function storePortal(Request $request, string $slug)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $organization = OrganizationSetting::where('slug', $slug)->firstOrFail();

        // 確保用戶屬於該組織
        $user = \App\Models\User::where('email', $request->email)
            ->where('organization_id', $organization->id)
            ->first();

        if (! $user) {
            throw ValidationException::withMessages([
                'email' => '找不到該企業的用戶帳號。',
            ]);
        }

        // 檢查登入限制
        if (RateLimiter::tooManyAttempts($this->throttleKey($request), 5)) {
            $seconds = RateLimiter::availableIn($this->throttleKey($request));

            throw ValidationException::withMessages([
                'email' => "登入嘗試過於頻繁，請 {$seconds} 秒後再試。",
            ]);
        }

        if (! Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey($request));

            throw ValidationException::withMessages([
                'email' => '提供的憑證與我們的記錄不符。',
            ]);
        }

        $request->session()->regenerate();

        RateLimiter::clear($this->throttleKey($request));

        // 根據角色重定向到不同頁面
        if (in_array($user->role, ['admin', 'manager'])) {
            return redirect()->intended(route('dashboard', ['slug' => $slug]));
        } else {
            // 暫時重定向到儀表板，稍後會創建前台頁面
            return redirect()->intended(route('dashboard', ['slug' => $slug]));
        }
    }

    /**
     * 獲取登入限制鍵
     */
    protected function throttleKey(Request $request): string
    {
        return Str::transliterate(Str::lower($request->string('email')).'|'.$request->ip());
    }
}
