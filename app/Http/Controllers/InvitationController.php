<?php

namespace App\Http\Controllers;

use App\Models\Invitation;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class InvitationController extends Controller
{
    public function accept(string $token): Response|RedirectResponse
    {
        $invitation = Invitation::query()
            ->with(['organization', 'inviter'])
            ->where('token', $token)
            ->firstOrFail();

        if (! $invitation->isPending()) {
            return Inertia::render('invitations/Invalid', [
                'reason' => $invitation->status === 'accepted' ? 'already_accepted'
                    : ($invitation->isExpired() ? 'expired' : 'cancelled'),
            ]);
        }

        if (Auth::check()) {
            $user = Auth::user();

            if ($user->email !== $invitation->email) {
                return Inertia::render('invitations/WrongAccount', [
                    'invitation' => [
                        'email' => $invitation->email,
                        'organization_name' => $invitation->organization->name,
                    ],
                ]);
            }

            return $this->completeAcceptance($invitation, $user);
        }

        $existingUser = User::query()->where('email', $invitation->email)->first();

        return Inertia::render('invitations/Accept', [
            'invitation' => [
                'token' => $invitation->token,
                'email' => $invitation->email,
                'role' => $invitation->role,
                'organization_name' => $invitation->organization->name,
                'inviter_name' => $invitation->inviter->name,
                'expires_at' => $invitation->expires_at?->toIso8601String(),
            ],
            'hasExistingAccount' => $existingUser !== null,
        ]);
    }

    public function store(Request $request, string $token): RedirectResponse
    {
        $invitation = Invitation::query()
            ->with(['organization', 'inviter'])
            ->where('token', $token)
            ->firstOrFail();

        if (! $invitation->isPending()) {
            return redirect()->route('home')->with('error', '此邀請已失效');
        }

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->input('name'),
            'email' => $invitation->email,
            'password' => Hash::make($request->input('password')),
            'organization_id' => $invitation->organization_id,
            'role' => $invitation->role,
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        event(new Registered($user));

        return $this->completeAcceptance($invitation, $user);
    }

    public function login(Request $request, string $token): RedirectResponse
    {
        $invitation = Invitation::query()
            ->with('organization')
            ->where('token', $token)
            ->firstOrFail();

        if (! $invitation->isPending()) {
            return redirect()->route('home')->with('error', '此邀請已失效');
        }

        $request->validate([
            'password' => ['required', 'string'],
        ]);

        $user = User::query()->where('email', $invitation->email)->first();

        if (! $user || ! Hash::check($request->input('password'), $user->password)) {
            return back()->withErrors(['password' => '密碼不正確']);
        }

        return $this->completeAcceptance($invitation, $user);
    }

    private function completeAcceptance(Invitation $invitation, User $user): RedirectResponse
    {
        if ($user->organization_id !== $invitation->organization_id) {
            $user->update(['organization_id' => $invitation->organization_id, 'role' => $invitation->role]);
        }

        $invitation->update([
            'status' => 'accepted',
            'accepted_by' => $user->id,
            'accepted_at' => now(),
        ]);

        Auth::login($user);

        return redirect(route('dashboard', ['slug' => $invitation->organization->slug]));
    }
}
