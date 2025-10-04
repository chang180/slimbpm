<?php

namespace App\Services\Workflow;

use App\Models\User;
use App\Models\WorkflowTemplate;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use InvalidArgumentException;

class WorkflowTemplateManager
{
    public function defaults(): Collection
    {
        return collect(config('workflow-templates.defaults', []));
    }

    public function cloneTemplate(WorkflowTemplate $template, array $payload, User $user): WorkflowTemplate
    {
        $data = [
            'name' => $payload['name'],
            'description' => $payload['description'] ?? $template->description,
            'definition' => $template->definition,
            'version' => $payload['version'] ?? '1.0.0',
            'is_active' => $payload['is_active'] ?? true,
            'is_current' => true,
            'parent_id' => $payload['parent_id'] ?? null,
            'created_by' => $user->id,
        ];

        return WorkflowTemplate::query()->create($data);
    }

    public function importTemplate(array $payload, User $user): WorkflowTemplate
    {
        $definition = $this->normalizeDefinition($payload['definition']);

        $data = [
            'name' => $payload['name'],
            'description' => $payload['description'] ?? null,
            'definition' => $definition,
            'version' => $payload['version'] ?? '1.0.0',
            'is_active' => $payload['is_active'] ?? true,
            'is_current' => true,
            'parent_id' => $payload['parent_id'] ?? null,
            'created_by' => $user->id,
        ];

        return WorkflowTemplate::query()->create($data);
    }

    /**
     * @return array<string, mixed>
     */
    public function exportTemplate(WorkflowTemplate $template): array
    {
        return [
            'name' => $template->name,
            'description' => $template->description,
            'version' => $template->version,
            'is_active' => (bool) $template->is_active,
            'definition' => $template->definition,
        ];
    }

    /**
     * @param  array<string, mixed>  $definition
     * @return array<string, mixed>
     */
    private function normalizeDefinition(array $definition): array
    {
        if (! Arr::has($definition, 'nodes') || ! is_array($definition['nodes'])) {
            throw new InvalidArgumentException('Workflow definition must include nodes.');
        }

        if (! Arr::has($definition, 'edges') || ! is_array($definition['edges'])) {
            throw new InvalidArgumentException('Workflow definition must include edges.');
        }

        return $definition;
    }
}
