<?php

namespace App\Http\Controllers;

use App\Models\Invitation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InvitationManagementController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        if (! in_array($user->role, ['admin', 'manager'])) {
            abort(403);
        }

        $invitations = Invitation::query()
            ->with(['inviter', 'acceptedUser'])
            ->where('organization_id', $user->organization_id)
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->input('status')))
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('invitations/Index', [
            'invitations' => $invitations,
        ]);
    }
}
