<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * 取得用戶的通知列表
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = $user->notifications()->latest();

        // 狀態篩選
        if ($request->has('status')) {
            $query->where('status', $request->get('status'));
        }

        // 類型篩選
        if ($request->has('type')) {
            $query->where('type', $request->get('type'));
        }

        $notifications = $query->paginate(20);

        return response()->json($notifications);
    }

    /**
     * 建立新的通知
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'type' => 'required|in:email,line,telegram,whatsapp',
            'subject' => 'nullable|string|max:255',
            'content' => 'required|string',
        ]);

        $notification = Notification::create($validated);

        return response()->json($notification, 201);
    }

    /**
     * 取得特定通知
     */
    public function show(Notification $notification): JsonResponse
    {
        // 檢查權限
        if ($notification->user_id !== Auth::id()) {
            return response()->json(['message' => '無權限查看此通知'], 403);
        }

        return response()->json($notification);
    }

    /**
     * 更新通知狀態
     */
    public function update(Request $request, Notification $notification): JsonResponse
    {
        // 檢查權限
        if ($notification->user_id !== Auth::id()) {
            return response()->json(['message' => '無權限修改此通知'], 403);
        }

        $validated = $request->validate([
            'status' => 'sometimes|in:pending,sent,failed',
        ]);

        $notification->update($validated);

        return response()->json($notification);
    }

    /**
     * 刪除通知
     */
    public function destroy(Notification $notification): JsonResponse
    {
        // 檢查權限
        if ($notification->user_id !== Auth::id()) {
            return response()->json(['message' => '無權限刪除此通知'], 403);
        }

        $notification->delete();

        return response()->json(['message' => '通知已刪除']);
    }

    /**
     * 標記通知為已讀
     */
    public function markAsRead(Notification $notification): JsonResponse
    {
        // 檢查權限
        if ($notification->user_id !== Auth::id()) {
            return response()->json(['message' => '無權限修改此通知'], 403);
        }

        $notification->update(['status' => 'sent']);

        return response()->json(['message' => '通知已標記為已讀']);
    }

    /**
     * 批量標記通知為已讀
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        $user = $request->user();

        $user->notifications()
            ->where('status', 'pending')
            ->update(['status' => 'sent']);

        return response()->json(['message' => '所有通知已標記為已讀']);
    }

    /**
     * 取得未讀通知數量
     */
    public function unreadCount(Request $request): JsonResponse
    {
        $user = $request->user();

        $count = $user->notifications()
            ->where('status', 'pending')
            ->count();

        return response()->json(['unread_count' => $count]);
    }
}
