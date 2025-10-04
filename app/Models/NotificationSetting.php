<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotificationSetting extends Model
{
    protected $fillable = [
        'user_id',
        'email_notifications',
        'line_notifications',
        'telegram_notifications',
        'whatsapp_notifications',
    ];

    protected $casts = [
        'email_notifications' => 'boolean',
        'line_notifications' => 'boolean',
        'telegram_notifications' => 'boolean',
        'whatsapp_notifications' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
