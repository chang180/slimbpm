<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class WorkflowInstanceUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'action' => ['required', 'string', Rule::in(['resume', 'suspend', 'cancel'])],
            'reason' => ['nullable', 'string', 'max:500'],
            'comments' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
