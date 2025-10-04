<?php

namespace App\Jobs;

use App\Models\Notification;
use App\Services\NotificationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendNotificationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public Notification $notification
    ) {}

    /**
     * Execute the job.
     */
    public function handle(NotificationService $notificationService): void
    {
        try {
            $user = $this->notification->user;

            $notificationService->sendNotification(
                $user,
                $this->notification->type,
                $this->notification->subject,
                $this->notification->content
            );

            Log::info('背景通知發送成功', [
                'notification_id' => $this->notification->id,
                'user_id' => $user->id,
                'type' => $this->notification->type,
            ]);

        } catch (\Exception $e) {
            Log::error('背景通知發送失敗', [
                'notification_id' => $this->notification->id,
                'error' => $e->getMessage(),
            ]);

            $this->notification->update(['status' => 'failed']);

            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('通知發送工作失敗', [
            'notification_id' => $this->notification->id,
            'error' => $exception->getMessage(),
        ]);

        $this->notification->update(['status' => 'failed']);
    }
}
