<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\InvitationResendRequest;
use App\Http\Requests\InvitationStoreRequest;
use App\Models\Invitation;
use App\Models\User;
use App\Notifications\InvitationNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Notification;

class InvitationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $organizationId = $request->user()->organization_id;

        $query = Invitation::query()
            ->with(['inviter', 'acceptedUser'])
            ->where('organization_id', $organizationId)
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->input('status')))
            ->orderByDesc('created_at');

        $invitations = $query->paginate($request->integer('per_page', 20))->appends($request->query());

        return response()->json([
            'data' => $invitations->items(),
            'meta' => [
                'current_page' => $invitations->currentPage(),
                'last_page' => $invitations->lastPage(),
                'total' => $invitations->total(),
                'per_page' => $invitations->perPage(),
            ],
        ]);
    }

    public function store(InvitationStoreRequest $request): JsonResponse
    {
        $data = $request->validated();
        $user = $request->user();
        $organizationId = $user->organization_id;

        $created = 0;
        $skipped = [];

        foreach ($data['emails'] as $email) {
            // 若已有 pending/sent 的邀請，跳過
            $existing = Invitation::query()
                ->where('organization_id', $organizationId)
                ->where('email', $email)
                ->whereIn('status', ['pending', 'sent'])
                ->first();

            if ($existing) {
                $skipped[] = $email;

                continue;
            }

            // 若已是組織成員，跳過
            if (User::query()->where('email', $email)->where('organization_id', $organizationId)->exists()) {
                $skipped[] = $email;

                continue;
            }

            $invitation = Invitation::create([
                'organization_id' => $organizationId,
                'invited_by' => $user->id,
                'email' => $email,
                'role' => $data['role'],
                'token' => Invitation::generateToken(),
                'status' => 'sent',
                'sent_at' => now(),
                'expires_at' => now()->addDays(7),
            ]);

            Notification::route('mail', $email)
                ->notify(new InvitationNotification($invitation->load(['organization', 'inviter'])));

            $created++;
        }

        return response()->json([
            'message' => $created.' 個邀請已發送',
            'created' => $created,
            'skipped' => $skipped,
        ], Response::HTTP_CREATED);
    }

    public function destroy(Request $request, Invitation $invitation): Response|JsonResponse
    {
        if ($invitation->organization_id !== $request->user()->organization_id) {
            abort(404);
        }

        if (! in_array($request->user()->role, ['admin', 'manager'])) {
            abort(403);
        }

        if (! $invitation->isPending()) {
            return response()->json(['message' => '只能取消待處理的邀請'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $invitation->update(['status' => 'cancelled']);

        return response()->noContent();
    }

    public function resend(InvitationResendRequest $request, Invitation $invitation): JsonResponse
    {
        if ($invitation->organization_id !== $request->user()->organization_id) {
            abort(404);
        }

        if (! in_array($invitation->status, ['pending', 'sent', 'expired'])) {
            return response()->json(['message' => '此邀請無法重新發送'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $invitation->update([
            'status' => 'sent',
            'token' => Invitation::generateToken(),
            'sent_at' => now(),
            'expires_at' => now()->addDays(7),
        ]);

        Notification::route('mail', $invitation->email)
            ->notify(new InvitationNotification($invitation->load(['organization', 'inviter'])));

        return response()->json(['message' => '邀請已重新發送']);
    }
}
