<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkflowHistory extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'workflow_instance_id',
        'action',
        'performed_by',
        'performed_at',
        'data',
        'comments',
    ];

    protected $casts = [
        'performed_at' => 'datetime',
        'data' => 'array',
    ];

    public function workflowInstance(): BelongsTo
    {
        return $this->belongsTo(WorkflowInstance::class);
    }

    public function performer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'performed_by');
    }
}
