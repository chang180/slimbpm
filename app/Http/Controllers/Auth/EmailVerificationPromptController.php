<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    /**
     * Show the email verification prompt page.
     */
    public function __invoke(Request $request): Response|RedirectResponse
    {
        $userId = $request->user()->id;

        // 重新從資料庫取得用戶資料以確保有最新的 organization_id
        $user = \App\Models\User::find($userId);

        if (! $user) {
            return redirect(route('home'));
        }

        if ($user->hasVerifiedEmail()) {
            // 已驗證的用戶重定向到 dashboard
            if ($user->organization_id) {
                $organization = \App\Models\OrganizationSetting::find($user->organization_id);
                if ($organization) {
                    return redirect(route('dashboard', ['slug' => $organization->slug]));
                }
            }

            return redirect('/dashboard-redirect');
        }

        return Inertia::render('auth/verify-email', ['status' => $request->session()->get('status')]);
    }
}
