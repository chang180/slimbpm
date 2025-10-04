<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FormTemplate extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'description',
        'definition',
        'category',
        'tags',
        'is_public',
        'workflow_template_id',
        'is_active',
        'created_by',
    ];

    protected $casts = [
        'definition' => 'array',
        'tags' => 'array',
        'is_public' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function workflowTemplate(): BelongsTo
    {
        return $this->belongsTo(WorkflowTemplate::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(FormSubmission::class);
    }
}
