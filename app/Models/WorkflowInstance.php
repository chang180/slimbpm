<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WorkflowInstance extends Model
{
    protected $fillable = [
        'template_id',
        'title',
        'form_data',
        'status',
        'active_steps',
        'parallel_mode',
        'started_by',
        'started_at',
        'completed_at',
    ];

    protected $casts = [
        'form_data' => 'array',
        'active_steps' => 'array',
        'parallel_mode' => 'boolean',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function template(): BelongsTo
    {
        return $this->belongsTo(WorkflowTemplate::class, 'template_id');
    }

    public function starter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'started_by');
    }

    public function stepInstances(): HasMany
    {
        return $this->hasMany(WorkflowStepInstance::class);
    }

    public function histories(): HasMany
    {
        return $this->hasMany(WorkflowHistory::class);
    }

    public function formSubmissions(): HasMany
    {
        return $this->hasMany(FormSubmission::class);
    }
}
