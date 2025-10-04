<?php

namespace App\Services;

use App\Jobs\SendNotificationJob;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    /**
     * 發送通知給用戶
     */
    public function sendNotification(User $user, string $type, string $subject, string $content, bool $async = true): Notification
    {
        // 檢查用戶的通知設定
        $settings = $user->notificationSettings;
        if (! $settings) {
            $settings = $user->notificationSettings()->create([
                'email_notifications' => true,
                'line_notifications' => false,
                'telegram_notifications' => false,
                'whatsapp_notifications' => false,
            ]);
        }

        // 檢查該類型的通知是否啟用
        $settingKey = $type.'_notifications';
        if (! $settings->$settingKey) {
            throw new \Exception("用戶未啟用 {$type} 通知");
        }

        // 建立通知記錄
        $notification = Notification::create([
            'user_id' => $user->id,
            'type' => $type,
            'subject' => $subject,
            'content' => $content,
            'status' => 'pending',
        ]);

        if ($async) {
            // 使用背景工作發送通知
            SendNotificationJob::dispatch($notification);
        } else {
            // 同步發送通知
            try {
                switch ($type) {
                    case 'email':
                        $this->sendEmailNotification($notification);
                        break;
                    case 'line':
                        $this->sendLineNotification($notification);
                        break;
                    case 'telegram':
                        $this->sendTelegramNotification($notification);
                        break;
                    case 'whatsapp':
                        $this->sendWhatsAppNotification($notification);
                        break;
                    default:
                        throw new \Exception("不支援的通知類型: {$type}");
                }

                $notification->update([
                    'status' => 'sent',
                    'sent_at' => now(),
                ]);

            } catch (\Exception $e) {
                Log::error('通知發送失敗: '.$e->getMessage(), [
                    'notification_id' => $notification->id,
                    'user_id' => $user->id,
                    'type' => $type,
                ]);

                $notification->update(['status' => 'failed']);
                throw $e;
            }
        }

        return $notification;
    }

    /**
     * 批量發送通知
     */
    public function sendBulkNotifications(array $userIds, string $type, string $subject, string $content): array
    {
        $results = [];

        foreach ($userIds as $userId) {
            try {
                $user = User::findOrFail($userId);
                $notification = $this->sendNotification($user, $type, $subject, $content);
                $results[] = [
                    'user_id' => $userId,
                    'status' => 'success',
                    'notification_id' => $notification->id,
                ];
            } catch (\Exception $e) {
                $results[] = [
                    'user_id' => $userId,
                    'status' => 'failed',
                    'error' => $e->getMessage(),
                ];
            }
        }

        return $results;
    }

    /**
     * 發送 Email 通知
     */
    private function sendEmailNotification(Notification $notification): void
    {
        // 這裡可以整合 Laravel Mail 或其他 Email 服務
        // 目前只是記錄到日誌
        Log::info('Email 通知已發送', [
            'notification_id' => $notification->id,
            'user_id' => $notification->user_id,
            'subject' => $notification->subject,
        ]);
    }

    /**
     * 發送 Line 通知
     */
    private function sendLineNotification(Notification $notification): void
    {
        // 這裡可以整合 Line Notify API
        Log::info('Line 通知已發送', [
            'notification_id' => $notification->id,
            'user_id' => $notification->user_id,
            'subject' => $notification->subject,
        ]);
    }

    /**
     * 發送 Telegram 通知
     */
    private function sendTelegramNotification(Notification $notification): void
    {
        // 這裡可以整合 Telegram Bot API
        Log::info('Telegram 通知已發送', [
            'notification_id' => $notification->id,
            'user_id' => $notification->user_id,
            'subject' => $notification->subject,
        ]);
    }

    /**
     * 發送 WhatsApp 通知
     */
    private function sendWhatsAppNotification(Notification $notification): void
    {
        // 這裡可以整合 WhatsApp Business API
        Log::info('WhatsApp 通知已發送', [
            'notification_id' => $notification->id,
            'user_id' => $notification->user_id,
            'subject' => $notification->subject,
        ]);
    }

    /**
     * 取得用戶的通知統計
     */
    public function getNotificationStats(User $user): array
    {
        $total = $user->notifications()->count();
        $sent = $user->notifications()->where('status', 'sent')->count();
        $pending = $user->notifications()->where('status', 'pending')->count();
        $failed = $user->notifications()->where('status', 'failed')->count();

        return [
            'total' => $total,
            'sent' => $sent,
            'pending' => $pending,
            'failed' => $failed,
            'success_rate' => $total > 0 ? round(($sent / $total) * 100, 2) : 0,
        ];
    }
}
