<?php

namespace App\Services\Workflow;

use App\Models\User;
use App\Models\WorkflowHistory;
use App\Models\WorkflowInstance;
use App\Models\WorkflowStepInstance;
use App\Models\WorkflowTemplate;
use Carbon\CarbonImmutable;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use InvalidArgumentException;

class WorkflowEngine
{
    public function startWorkflow(WorkflowTemplate $template, array $payload, User $user): WorkflowInstance
    {
        return DB::transaction(function () use ($template, $payload, $user) {
            $definition = $this->ensureDefinition($template->definition);
            $graph = $this->buildGraph($definition);
            $startNode = $this->findStartNode($graph['nodes']);

            if ($startNode === null) {
                throw new InvalidArgumentException('Workflow template is missing a start node.');
            }

            $formData = $payload['form_data'] ?? [];
            $title = $payload['title'] ?? $template->name;
            $now = CarbonImmutable::now();

            $instance = WorkflowInstance::query()->create([
                'template_id' => $template->id,
                'title' => $title,
                'form_data' => $formData,
                'status' => 'running',
                'active_steps' => [],
                'parallel_mode' => false,
                'started_by' => $user->id,
                'started_at' => $now,
            ]);

            $this->recordHistory($instance, 'workflow_started', [
                'template_id' => $template->id,
                'title' => $title,
            ], $user);

            $this->advanceFromNode($instance, $graph, $startNode, $formData, $user);

            return $instance->fresh(['template', 'stepInstances', 'histories']);
        });
    }

    public function executeStep(WorkflowStepInstance $step, array $payload, User $user): WorkflowStepInstance
    {
        return DB::transaction(function () use ($step, $payload, $user) {
            $step = $step->fresh(['workflowInstance.template']);
            $instance = $step->workflowInstance;
            $template = $instance->template;

            $definition = $this->ensureDefinition($template->definition);
            $graph = $this->buildGraph($definition);
            $node = $graph['nodes'][$step->step_key] ?? null;

            if ($node === null) {
                throw new InvalidArgumentException("Unable to resolve workflow node for step {$step->step_key}.");
            }

            $status = $payload['status'] ?? 'approved';
            $data = $payload['data'] ?? [];
            $comments = $payload['comments'] ?? null;
            $now = CarbonImmutable::now();

            $step->fill([
                'status' => $status,
                'data' => array_merge($step->data ?? [], $data),
            ]);

            if (in_array($status, ['approved', 'rejected', 'skipped'], true)) {
                $step->completed_at = $now;
            }

            if (! $step->assigned_at && isset($payload['assigned_at'])) {
                $step->assigned_at = CarbonImmutable::parse($payload['assigned_at']);
            }

            if (array_key_exists('assigned_to', $payload)) {
                $step->assigned_to = $payload['assigned_to'];
            }

            $step->save();

            if ($data !== []) {
                $instance->update([
                    'form_data' => array_replace_recursive($instance->form_data ?? [], $data),
                ]);
                $instance->refresh();
            }

            $event = in_array($status, ['approved', 'rejected', 'skipped'], true)
                ? 'step_completed'
                : 'step_updated';

            $this->recordHistory($instance, $event, [
                'step_key' => $step->step_key,
                'status' => $status,
                'data' => $data,
            ], $user, $comments);

            if (in_array($status, ['approved', 'rejected', 'skipped'], true)) {
                $this->pruneActiveStep($instance, $step->id);

                $context = array_replace_recursive($instance->form_data ?? [], $data);

                if ($status === 'rejected') {
                    $reason = $payload['reason'] ?? null;
                    $this->suspendWorkflow($instance, $user, $reason, $comments);
                } else {
                    $this->advanceFromNode($instance, $graph, $node, $context, $user);
                }
            }

            return $step->fresh();
        });
    }

    /**
     * @param  array<string, mixed>  $definition
     * @return array{nodes: array<string, array<string, mixed>>, edges: array<string, array<int, array<string, mixed>>>}
     */
    private function buildGraph(array $definition): array
    {
        $nodes = collect($definition['nodes'] ?? [])
            ->keyBy(fn (array $node): string => $node['id']);

        $edges = [];

        foreach ($definition['edges'] ?? [] as $edge) {
            $id = $edge['source'] ?? null;

            if (! $id) {
                continue;
            }

            $edges[$id] ??= [];
            $edges[$id][] = $edge;
        }

        return [
            'nodes' => $nodes->all(),
            'edges' => $edges,
        ];
    }

    /**
     * @param  array<string, mixed>  $nodes
     */
    private function findStartNode(array $nodes): ?array
    {
        foreach ($nodes as $node) {
            if (($node['type'] ?? null) === 'start') {
                return $node;
            }
        }

        return null;
    }

    private function advanceFromNode(
        WorkflowInstance $instance,
        array $graph,
        array $currentNode,
        array $context,
        User $user
    ): void {
        $outgoing = $graph['edges'][$currentNode['id']] ?? [];

        if ($outgoing === []) {
            if ($currentNode['type'] === 'end') {
                $this->completeWorkflow($instance, $user);
            }

            return;
        }

        $activatedSteps = [];

        if ($currentNode['type'] === 'condition') {
            $edge = $this->resolveConditionalEdge($outgoing, $context);

            if ($edge !== null) {
                $activatedSteps = array_merge(
                    $activatedSteps,
                    $this->activateNode($instance, $graph, $edge['target'], $context, $user)
                );
            }
        } else {
            foreach ($outgoing as $edge) {
                $activatedSteps = array_merge(
                    $activatedSteps,
                    $this->activateNode($instance, $graph, $edge['target'], $context, $user)
                );
            }
        }

        if ($activatedSteps !== []) {
            $activeStepIds = array_values(array_unique(array_merge($instance->active_steps ?? [], $activatedSteps)));

            $instance->update([
                'active_steps' => $activeStepIds,
                'parallel_mode' => count($activeStepIds) > 1,
            ]);

            $instance->active_steps = $activeStepIds;
            $instance->parallel_mode = count($activeStepIds) > 1;
        }
    }

    /**
     * @param  array<string, mixed>  $graph
     * @return int[]
     */
    private function activateNode(
        WorkflowInstance $instance,
        array $graph,
        string $nodeId,
        array $context,
        User $user
    ): array {
        $node = $graph['nodes'][$nodeId] ?? null;

        if ($node === null) {
            return [];
        }

        if ($node['type'] === 'end') {
            $this->completeWorkflow($instance, $user);

            return [];
        }

        if ($node['type'] === 'condition') {
            $this->recordHistory($instance, 'condition_evaluated', [
                'node' => $nodeId,
            ], $user);

            $this->advanceFromNode($instance, $graph, $node, $context, $user);

            return [];
        }

        $step = WorkflowStepInstance::query()->create([
            'workflow_instance_id' => $instance->id,
            'step_id' => $this->nextStepNumber($instance),
            'step_key' => $nodeId,
            'status' => 'pending',
            'data' => $node['data']['config'] ?? [],
        ]);

        $this->recordHistory($instance, 'step_activated', [
            'step_key' => $nodeId,
        ], $user);

        return [$step->id];
    }

    /**
     * @param  array<int, array<string, mixed>>  $edges
     */
    private function resolveConditionalEdge(array $edges, array $context): ?array
    {
        $defaultEdge = null;

        foreach ($edges as $edge) {
            $condition = Arr::get($edge, 'data.condition');

            if ($condition) {
                if ($this->evaluateCondition($condition, $context)) {
                    return $edge;
                }

                continue;
            }

            if (Arr::get($edge, 'data.isDefault')) {
                $defaultEdge = $edge;
            }
        }

        return $defaultEdge ?? ($edges[0] ?? null);
    }

    private function evaluateCondition(string $expression, array $context): bool
    {
        $orGroups = preg_split('/\s*\|\|\s*/', trim($expression)) ?: [];

        foreach ($orGroups as $group) {
            $andParts = preg_split('/\s*&&\s*/', trim((string) $group)) ?: [];
            $groupResult = true;

            foreach ($andParts as $part) {
                $part = trim($part);

                if ($part === '') {
                    continue;
                }

                if (! $this->evaluateSimpleExpression($part, $context)) {
                    $groupResult = false;
                    break;
                }
            }

            if ($groupResult) {
                return true;
            }
        }

        return false;
    }

    private function evaluateSimpleExpression(string $expression, array $context): bool
    {
        if (! preg_match('/^(?<left>[a-zA-Z0-9_.]+)\s*(?<operator>==|!=|>=|<=|>|<)\s*(?<right>.+)$/', $expression, $matches)) {
            return false;
        }

        $leftValue = $this->resolveContextValue($context, $matches['left']);
        $rightValue = $this->normalizeValue($matches['right']);

        return match ($matches['operator']) {
            '==' => $leftValue == $rightValue,
            '!=' => $leftValue != $rightValue,
            '>' => is_numeric($leftValue) && is_numeric($rightValue) && $leftValue > $rightValue,
            '>=' => is_numeric($leftValue) && is_numeric($rightValue) && $leftValue >= $rightValue,
            '<' => is_numeric($leftValue) && is_numeric($rightValue) && $leftValue < $rightValue,
            '<=' => is_numeric($leftValue) && is_numeric($rightValue) && $leftValue <= $rightValue,
            default => false,
        };
    }

    private function resolveContextValue(array $context, string $path): mixed
    {
        return Arr::get($context, $path);
    }

    private function normalizeValue(string $value): mixed
    {
        $value = trim($value);
        $value = Str::of($value)->trim("'\"")->toString();

        if (Str::lower($value) === 'true') {
            return true;
        }

        if (Str::lower($value) === 'false') {
            return false;
        }

        if (is_numeric($value)) {
            return $value + 0;
        }

        return $value;
    }

    private function completeWorkflow(WorkflowInstance $instance, User $user): void
    {
        $instance->refresh();

        if ($instance->status === 'completed' || ($instance->active_steps ?? []) !== []) {
            return;
        }

        $instance->update([
            'status' => 'completed',
            'completed_at' => CarbonImmutable::now(),
            'active_steps' => [],
            'parallel_mode' => false,
        ]);

        $instance->active_steps = [];
        $instance->parallel_mode = false;

        $this->recordHistory($instance, 'workflow_completed', [], $user);
    }

    private function recordHistory(
        WorkflowInstance $instance,
        string $action,
        array $data,
        ?User $user = null,
        ?string $comments = null
    ): void {
        WorkflowHistory::query()->create([
            'workflow_instance_id' => $instance->id,
            'action' => $action,
            'performed_by' => $user?->id,
            'performed_at' => CarbonImmutable::now(),
            'data' => $data,
            'comments' => $comments,
        ]);
    }

    private function pruneActiveStep(WorkflowInstance $instance, int $stepId): void
    {
        $active = collect($instance->active_steps ?? [])
            ->reject(static fn (int $id): bool => $id === $stepId)
            ->values()
            ->all();

        $instance->update([
            'active_steps' => $active,
            'parallel_mode' => count($active) > 1,
        ]);

        $instance->active_steps = $active;
        $instance->parallel_mode = count($active) > 1;
    }

    private function ensureDefinition(?array $definition): array
    {
        if (! is_array($definition)) {
            throw new InvalidArgumentException('Workflow template definition is not valid.');
        }

        return $definition;
    }

    private function nextStepNumber(WorkflowInstance $instance): int
    {
        return (int) ($instance->stepInstances()->max('step_id') ?? 0) + 1;
    }

    public function suspendWorkflow(WorkflowInstance $instance, User $user, ?string $reason = null, ?string $comments = null): WorkflowInstance
    {
        return DB::transaction(function () use ($instance, $user, $reason, $comments) {
            $instance->refresh();

            if ($instance->status === 'suspended') {
                return $instance->fresh(['template', 'stepInstances', 'histories']);
            }

            $instance->update([
                'status' => 'suspended',
            ]);

            $this->recordHistory($instance, 'workflow_suspended', array_filter([
                'reason' => $reason,
            ]), $user, $comments);

            return $instance->fresh(['template', 'stepInstances', 'histories']);
        });
    }

    public function resumeWorkflow(WorkflowInstance $instance, User $user, ?string $comments = null): WorkflowInstance
    {
        return DB::transaction(function () use ($instance, $user, $comments) {
            $instance->refresh();

            if ($instance->status === 'completed' || $instance->status === 'cancelled') {
                return $instance->fresh(['template', 'stepInstances', 'histories']);
            }

            if ($instance->status !== 'running') {
                $instance->update(['status' => 'running']);

                $this->recordHistory($instance, 'workflow_resumed', [], $user, $comments);
            }

            if (($instance->active_steps ?? []) === []) {
                $this->completeWorkflow($instance, $user);
            }

            return $instance->fresh(['template', 'stepInstances', 'histories']);
        });
    }

    public function cancelWorkflow(WorkflowInstance $instance, User $user, ?string $reason = null, ?string $comments = null): WorkflowInstance
    {
        return DB::transaction(function () use ($instance, $user, $reason, $comments) {
            $instance->refresh();

            $now = CarbonImmutable::now();

            $instance->stepInstances()
                ->whereNull('completed_at')
                ->each(static function (WorkflowStepInstance $step) use ($now) {
                    $step->update([
                        'status' => 'skipped',
                        'completed_at' => $now,
                    ]);
                });

            $instance->update([
                'status' => 'cancelled',
                'completed_at' => $now,
                'active_steps' => [],
                'parallel_mode' => false,
            ]);

            $instance->active_steps = [];
            $instance->parallel_mode = false;

            $this->recordHistory($instance, 'workflow_cancelled', array_filter([
                'reason' => $reason,
            ]), $user, $comments);

            return $instance->fresh(['template', 'stepInstances', 'histories']);
        });
    }
}
