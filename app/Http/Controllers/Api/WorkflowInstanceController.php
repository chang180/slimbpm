<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\WorkflowInstanceStoreRequest;
use App\Http\Requests\WorkflowInstanceUpdateRequest;
use App\Http\Resources\WorkflowInstanceResource;
use App\Models\WorkflowInstance;
use App\Models\WorkflowTemplate;
use App\Services\Workflow\WorkflowEngine;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class WorkflowInstanceController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = WorkflowInstance::query()
            ->with(['template', 'starter'])
            ->withCount(['stepInstances', 'histories'])
            ->when($request->filled('status'), fn ($builder) => $builder->where('status', $request->input('status')))
            ->when($request->filled('template_id'), fn ($builder) => $builder->where('template_id', $request->input('template_id')))
            ->when($request->boolean('only_active'), fn ($builder) => $builder->whereIn('status', ['running', 'suspended']))
            ->orderByDesc('updated_at');

        $instances = $query->paginate($request->integer('per_page', 15))->appends($request->query());

        return WorkflowInstanceResource::collection($instances);
    }

    public function store(
        WorkflowInstanceStoreRequest $request,
        WorkflowEngine $engine
    ): JsonResponse {
        $data = $request->validated();
        $template = WorkflowTemplate::query()->findOrFail($data['template_id']);

        $instance = $engine->startWorkflow($template, $data, $request->user());

        return (new WorkflowInstanceResource(
            $instance->load([
                'template',
                'starter',
                'stepInstances.assignedUser',
                'histories.performer',
            ])
        ))->response()->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(WorkflowInstance $workflowInstance): WorkflowInstanceResource
    {
        $workflowInstance->load([
            'template',
            'starter',
            'stepInstances.assignedUser',
            'histories.performer',
        ]);

        return new WorkflowInstanceResource($workflowInstance);
    }

    public function update(
        WorkflowInstanceUpdateRequest $request,
        WorkflowInstance $workflowInstance,
        WorkflowEngine $engine
    ): WorkflowInstanceResource {
        $data = $request->validated();
        $user = $request->user();

        $instance = match ($data['action']) {
            'suspend' => $engine->suspendWorkflow($workflowInstance, $user, $data['reason'] ?? null, $data['comments'] ?? null),
            'resume' => $engine->resumeWorkflow($workflowInstance, $user, $data['comments'] ?? null),
            'cancel' => $engine->cancelWorkflow($workflowInstance, $user, $data['reason'] ?? null, $data['comments'] ?? null),
        };

        return new WorkflowInstanceResource(
            $instance->load([
                'template',
                'starter',
                'stepInstances.assignedUser',
                'histories.performer',
            ])
        );
    }

    public function destroy(Request $request, WorkflowInstance $workflowInstance, WorkflowEngine $engine): Response
    {
        $engine->cancelWorkflow($workflowInstance, $request->user(), $request->input('reason'), $request->input('comments'));

        return response()->noContent();
    }
}
