<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationSettingController extends Controller
{
    /**
     * 取得用戶的通知設定
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $settings = $user->notificationSettings()->first();

        if (! $settings) {
            // 如果沒有設定，建立預設設定
            $settings = $user->notificationSettings()->create([
                'email_notifications' => true,
                'line_notifications' => false,
                'telegram_notifications' => false,
                'whatsapp_notifications' => false,
            ]);
        }

        return response()->json($settings);
    }

    /**
     * 更新通知設定
     */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'email_notifications' => 'boolean',
            'line_notifications' => 'boolean',
            'telegram_notifications' => 'boolean',
            'whatsapp_notifications' => 'boolean',
        ]);

        $settings = $user->notificationSettings()->first();

        if ($settings) {
            $settings->update($validated);
        } else {
            $settings = $user->notificationSettings()->create($validated);
        }

        return response()->json($settings);
    }

    /**
     * 重置通知設定為預設值
     */
    public function reset(Request $request): JsonResponse
    {
        $user = $request->user();

        $settings = $user->notificationSettings()->first();

        if ($settings) {
            $settings->update([
                'email_notifications' => true,
                'line_notifications' => false,
                'telegram_notifications' => false,
                'whatsapp_notifications' => false,
            ]);
        } else {
            $settings = $user->notificationSettings()->create([
                'email_notifications' => true,
                'line_notifications' => false,
                'telegram_notifications' => false,
                'whatsapp_notifications' => false,
            ]);
        }

        return response()->json($settings);
    }
}
