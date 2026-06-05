<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $notifications = Notification::query()
            ->where('user_id', $user->id)
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->input('status')))
            ->when($request->filled('type'), fn ($q) => $q->where('type', $request->input('type')))
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();

        $unreadCount = Notification::query()
            ->where('user_id', $user->id)
            ->where('status', 'pending')
            ->count();

        return Inertia::render('notifications/Index', [
            'notifications' => $notifications,
            'unreadCount' => $unreadCount,
            'filters' => $request->only(['status', 'type']),
        ]);
    }
}
