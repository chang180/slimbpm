<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\WorkflowTemplateStoreRequest;
use App\Http\Requests\WorkflowTemplateUpdateRequest;
use App\Http\Resources\WorkflowTemplateResource;
use App\Models\WorkflowTemplate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class WorkflowController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = WorkflowTemplate::query()
            ->with(['creator'])
            ->withCount(['children', 'instances'])
            ->when($request->boolean('only_active'), fn ($builder) => $builder->where('is_active', true))
            ->when($request->boolean('only_current'), fn ($builder) => $builder->where('is_current', true))
            ->when($request->string('search')->trim()->value(), function ($builder, string $search) {
                $builder->where(function ($inner) use ($search) {
                    $inner->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('version', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('updated_at');

        $templates = $query->paginate($request->integer('per_page', 15))->appends($request->query());

        return WorkflowTemplateResource::collection($templates);
    }

    public function store(WorkflowTemplateStoreRequest $request): JsonResponse
    {
        $data = $request->validated();
        $definition = $data['definition'];
        $parentId = $data['parent_id'] ?? null;
        $userId = $request->user()->id;

        $template = DB::transaction(function () use ($data, $definition, $parentId, $userId) {
            $payload = [
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'definition' => $definition,
                'version' => $data['version'] ?? '1.0.0',
                'is_active' => $data['is_active'] ?? true,
                'is_current' => true,
                'created_by' => $userId,
            ];

            if ($parentId) {
                $parent = WorkflowTemplate::query()->findOrFail($parentId);
                $rootId = $parent->parent_id ?? $parent->id;

                $this->markLineageAsNotCurrent($rootId);

                $payload['parent_id'] = $rootId;
                $payload['version'] = $data['version'] ?? $this->incrementVersion($parent->version);
            }

            return WorkflowTemplate::query()->create($payload);
        });

        return (new WorkflowTemplateResource(
            $template->load(['creator', 'parent'])->loadCount(['children', 'instances'])
        ))->response()->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(WorkflowTemplate $workflow): WorkflowTemplateResource
    {
        $workflow->load(['creator', 'parent'])->loadCount(['children', 'instances']);

        return new WorkflowTemplateResource($workflow);
    }

    public function update(WorkflowTemplateUpdateRequest $request, WorkflowTemplate $workflow): JsonResponse|WorkflowTemplateResource
    {
        if ($request->boolean('create_new_version')) {
            $template = DB::transaction(function () use ($request, $workflow) {
                $data = $request->validated();

                $payload = [
                    'name' => $data['name'] ?? $workflow->name,
                    'description' => $data['description'] ?? $workflow->description,
                    'definition' => $data['definition'] ?? $workflow->definition,
                    'is_active' => $data['is_active'] ?? $workflow->is_active,
                    'is_current' => true,
                    'created_by' => $request->user()->id,
                    'parent_id' => $workflow->parent_id ?? $workflow->id,
                    'version' => $data['version'] ?? $this->incrementVersion($workflow->version),
                ];

                $this->markLineageAsNotCurrent($payload['parent_id']);

                return WorkflowTemplate::query()->create($payload);
            });

            $template->load(['creator', 'parent'])->loadCount(['children', 'instances']);

            return (new WorkflowTemplateResource($template))
                ->response()
                ->setStatusCode(Response::HTTP_CREATED);
        }

        $data = $request->validated();

        $workflow = DB::transaction(function () use ($data, $workflow) {
            $updates = collect($data)->only([
                'name',
                'description',
                'definition',
                'version',
                'is_active',
                'is_current',
            ])->all();

            $workflow->fill($updates)->save();

            return $workflow;
        });

        $workflow->load(['creator', 'parent'])->loadCount(['children', 'instances']);

        return new WorkflowTemplateResource($workflow);
    }

    public function destroy(WorkflowTemplate $workflow): Response
    {
        DB::transaction(function () use ($workflow) {
            $workflow->update([
                'is_active' => false,
                'is_current' => false,
            ]);
        });

        return response()->noContent();
    }

    private function markLineageAsNotCurrent(int $rootId): void
    {
        WorkflowTemplate::query()
            ->where('id', $rootId)
            ->orWhere('parent_id', $rootId)
            ->update(['is_current' => false]);
    }

    private function incrementVersion(?string $version): string
    {
        $segments = array_map('intval', array_pad(explode('.', $version ?: '1.0.0'), 3, 0));

        $segments[2]++;

        return implode('.', array_slice($segments, 0, 3));
    }
}
