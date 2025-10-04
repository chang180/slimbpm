<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WorkflowTemplate extends Model
{
    protected $fillable = [
        'name',
        'description',
        'definition',
        'version',
        'parent_id',
        'is_current',
        'is_active',
        'created_by',
    ];

    protected $casts = [
        'definition' => 'array',
        'is_current' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(WorkflowTemplate::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(WorkflowTemplate::class, 'parent_id');
    }

    public function instances(): HasMany
    {
        return $this->hasMany(WorkflowInstance::class, 'template_id');
    }

    public function formTemplates(): HasMany
    {
        return $this->hasMany(FormTemplate::class, 'workflow_template_id');
    }
}
