<?php

namespace App\Notifications;

use App\Models\Invitation;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InvitationNotification extends Notification
{
    use Queueable;

    public function __construct(
        public readonly Invitation $invitation,
    ) {}

    /** @return array<int, string> */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $acceptUrl = url('/invitations/accept/'.$this->invitation->token);
        $orgName = $this->invitation->organization->name;
        $inviterName = $this->invitation->inviter->name;
        $roleLabel = match ($this->invitation->role) {
            'admin' => '管理員',
            'manager' => '主管',
            default => '成員',
        };

        return (new MailMessage)
            ->subject("您受邀加入 {$orgName}")
            ->greeting('您好！')
            ->line("{$inviterName} 邀請您以「{$roleLabel}」身份加入 **{$orgName}**。")
            ->line('點擊下方按鈕接受邀請，即可開始使用 SlimBPM 系統。')
            ->action('接受邀請', $acceptUrl)
            ->line('此邀請連結將在 7 天後失效。')
            ->line('若您不認識傳送邀請的人，請忽略此郵件。')
            ->salutation('SlimBPM 快簽團隊');
    }

    /** @return array<string, mixed> */
    public function toArray(object $notifiable): array
    {
        return [
            'invitation_id' => $this->invitation->id,
            'organization_id' => $this->invitation->organization_id,
        ];
    }
}
