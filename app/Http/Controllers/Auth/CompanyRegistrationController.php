<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\OrganizationSetting;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class CompanyRegistrationController extends Controller
{
    /**
     * 顯示企業註冊頁面
     */
    public function create(): Response
    {
        return Inertia::render('auth/RegisterCompany');
    }

    /**
     * 處理企業註冊
     */
    public function store(Request $request)
    {
        $request->validate([
            // 企業資訊
            'company_name' => 'required|string|max:255',
            'contact_person' => 'required|string|max:255',
            'contact_email' => 'required|string|email|max:255',
            'industry' => 'nullable|string|max:255',

            // 管理員資訊
            'admin_name' => 'required|string|max:255',
            'admin_email' => 'required|string|email|max:255|unique:users,email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // 生成唯一的 slug
        $slug = $this->generateUniqueSlug();

        // 創建組織
        $organization = OrganizationSetting::create([
            'name' => $request->company_name,
            'slug' => $slug,
            'contact_person' => $request->contact_person,
            'contact_email' => $request->contact_email,
            'industry' => $request->industry,
            'settings' => [
                'theme' => 'light',
                'timezone' => 'Asia/Taipei',
                'locale' => 'zh-TW',
            ],
        ]);

        // 創建企業管理員
        $user = User::create([
            'name' => $request->admin_name,
            'email' => $request->admin_email,
            'password' => Hash::make($request->password),
            'role' => 'admin',
            'organization_id' => $organization->id,
            // 移除自動驗證，讓用戶通過郵件驗證
        ]);

        event(new Registered($user));

        // 登入用戶以便訪問驗證頁面
        Auth::login($user);

        return redirect()->route('verification.notice')
            ->with('success', '企業註冊成功！請檢查您的郵件並完成驗證。');
    }

    /**
     * 生成唯一的 slug
     */
    private function generateUniqueSlug(): string
    {
        do {
            $slug = Str::uuid()->toString();
        } while (OrganizationSetting::where('slug', $slug)->exists());

        return $slug;
    }
}
