<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class WorkflowTemplateUpdateRequest extends FormRequest
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

        foreach (['is_active', 'is_current', 'create_new_version'] as $key) {
            if (! $this->has($key)) {
                continue;
            }

            $casted = filter_var($this->input($key), FILTER_VALIDATE_BOOL, FILTER_NULL_ON_FAILURE);

            if ($casted !== null) {
                $this->merge([$key => $casted]);
            }
        }
    }

    public function rules(): array
    {
        $nodeTypes = ['start', 'approval', 'condition', 'end'];

        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'definition' => ['sometimes', 'array'],
            'definition.nodes' => ['sometimes', 'array', 'min:1'],
            'definition.edges' => ['sometimes', 'array'],
            'definition.metadata' => ['sometimes', 'array'],
            'definition.nodes.*.id' => ['required_with:definition.nodes', 'string'],
            'definition.nodes.*.type' => ['required_with:definition.nodes', Rule::in($nodeTypes)],
            'definition.nodes.*.data' => ['required_with:definition.nodes', 'array'],
            'definition.nodes.*.position' => ['required_with:definition.nodes', 'array'],
            'definition.nodes.*.position.x' => ['required_with:definition.nodes', 'numeric'],
            'definition.nodes.*.position.y' => ['required_with:definition.nodes', 'numeric'],
            'definition.edges.*.id' => ['required_with:definition.edges', 'string'],
            'definition.edges.*.source' => ['required_with:definition.edges', 'string'],
            'definition.edges.*.target' => ['required_with:definition.edges', 'string'],
            'definition.edges.*.data' => ['sometimes', 'array'],
            'definition.edges.*.type' => ['sometimes', 'string'],
            'version' => ['sometimes', 'string', 'max:50'],
            'is_active' => ['sometimes', 'boolean'],
            'is_current' => ['sometimes', 'boolean'],
            'create_new_version' => ['sometimes', 'boolean'],
        ];
    }
}
