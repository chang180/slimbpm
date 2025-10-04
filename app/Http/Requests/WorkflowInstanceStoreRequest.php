<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WorkflowInstanceStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        if (is_string($this->input('form_data'))) {
            $decoded = json_decode($this->input('form_data'), true);

            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $this->merge(['form_data' => $decoded]);
            }
        }
    }

    public function rules(): array
    {
        return [
            'template_id' => ['required', 'integer', 'exists:workflow_templates,id'],
            'title' => ['nullable', 'string', 'max:255'],
            'form_data' => ['nullable', 'array'],
        ];
    }
}
