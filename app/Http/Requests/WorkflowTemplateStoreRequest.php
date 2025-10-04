<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class WorkflowTemplateStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        $definition = $this->input('definition');

        if (is_string($definition)) {
            $decoded = json_decode($definition, true);

            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $this->merge(['definition' => $decoded]);
            }
        }

        if ($this->has('is_active')) {
            $casted = filter_var($this->input('is_active'), FILTER_VALIDATE_BOOL, FILTER_NULL_ON_FAILURE);

            if ($casted !== null) {
                $this->merge(['is_active' => $casted]);
            }
        }
    }

    public function rules(): array
    {
        $nodeTypes = ['start', 'approval', 'condition', 'end'];

        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'definition' => ['required', 'array'],
            'definition.nodes' => ['required', 'array', 'min:1'],
            'definition.edges' => ['required', 'array'],
            'definition.metadata' => ['sometimes', 'array'],
            'definition.nodes.*.id' => ['required', 'string'],
            'definition.nodes.*.type' => ['required', Rule::in($nodeTypes)],
            'definition.nodes.*.data' => ['required', 'array'],
            'definition.nodes.*.position' => ['required', 'array'],
            'definition.nodes.*.position.x' => ['required', 'numeric'],
            'definition.nodes.*.position.y' => ['required', 'numeric'],
            'definition.edges.*.id' => ['required', 'string'],
            'definition.edges.*.source' => ['required', 'string'],
            'definition.edges.*.target' => ['required', 'string'],
            'definition.edges.*.data' => ['sometimes', 'array'],
            'definition.edges.*.type' => ['sometimes', 'string'],
            'parent_id' => ['nullable', 'integer', 'exists:workflow_templates,id'],
            'version' => ['nullable', 'string', 'max:50'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
