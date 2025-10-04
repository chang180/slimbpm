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

    public function createNewVersion(WorkflowTemplate $template, array $payload, User $user): WorkflowTemplate
    {
        $newVersion = $this->incrementVersion($template->version);

        return WorkflowTemplate::query()->create([
            'name' => $payload['name'] ?? $template->name,
            'description' => $payload['description'] ?? $template->description,
            'definition' => $payload['definition'] ?? $template->definition,
            'version' => $newVersion,
            'parent_id' => $template->parent_id ?? $template->id,
            'is_active' => true,
            'is_current' => true,
            'created_by' => $user->id,
        ]);
    }

    public function getVersionHistory(WorkflowTemplate $template): Collection
    {
        $rootId = $template->parent_id ?? $template->id;

        return WorkflowTemplate::query()
            ->where('id', $rootId)
            ->orWhere('parent_id', $rootId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function setCurrentVersion(WorkflowTemplate $template): void
    {
        $rootId = $template->parent_id ?? $template->id;

        // 將所有相關版本設為非當前版本
        WorkflowTemplate::query()
            ->where('id', $rootId)
            ->orWhere('parent_id', $rootId)
            ->update(['is_current' => false]);

        // 將選中的版本設為當前版本
        $template->update(['is_current' => true]);
    }

    private function incrementVersion(string $version): string
    {
        $segments = array_map('intval', array_pad(explode('.', $version), 3, 0));
        $segments[2]++; // 增加修訂版本號

        return implode('.', array_slice($segments, 0, 3));
    }
}
