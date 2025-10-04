<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        $userId = $request->user()->id;

        // 重新從資料庫取得用戶資料以確保有最新的 organization_id
        $user = \App\Models\User::find($userId);

        if (! $user) {
            return redirect(route('home').'?verified=1');
        }

        if ($user->hasVerifiedEmail()) {
            // 已驗證的用戶重定向到 dashboard
            if ($user->organization_id) {
                $organization = \App\Models\OrganizationSetting::find($user->organization_id);
                if ($organization) {
                    return redirect(route('dashboard', ['slug' => $organization->slug]).'?verified=1');
                }
            }

            return redirect(route('home').'?verified=1');
        }

        $request->fulfill();

        // 驗證完成後重定向到 dashboard
        // 重新取得用戶資料確保有最新的 organization_id
        $user = \App\Models\User::find($userId);

        if ($user && $user->organization_id) {
            $organization = \App\Models\OrganizationSetting::find($user->organization_id);
            if ($organization) {
                return redirect(route('dashboard', ['slug' => $organization->slug]).'?verified=1');
            }
        }

        return redirect(route('home').'?verified=1');
    }
}
