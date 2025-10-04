<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            // 載入組織關係並重定向到正確的 dashboard
            $user->load('organization');
            $slug = $user->organization?->slug;

            if ($slug) {
                return redirect()->intended(route('dashboard', ['slug' => $slug]));
            } else {
                return redirect()->intended(route('home'));
            }
        }

        $user->sendEmailVerificationNotification();

        return back()->with('status', 'verification-link-sent');
    }
}
