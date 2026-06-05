<?php

namespace App\Http\Controllers;

use App\Models\WorkflowInstance;
use App\Models\WorkflowTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class WorkflowInstanceController extends Controller
{
    public function index(Request $request): Response
    {
        $user = Auth::user();

        $myInstances = WorkflowInstance::query()
            ->with(['template', 'starter'])
            ->where('started_by', $user->id)
            ->orderByDesc('updated_at')
            ->paginate(15, ['*'], 'my_page')
            ->withQueryString();

        $pendingSteps = WorkflowInstance::query()
            ->with(['template', 'starter', 'stepInstances' => function ($query) use ($user) {
                $query->where('assigned_to', $user->id)
                    ->whereIn('status', ['pending', 'in_progress']);
            }])
            ->whereHas('stepInstances', function ($query) use ($user) {
                $query->where('assigned_to', $user->id)
                    ->whereIn('status', ['pending', 'in_progress']);
            })
            ->whereIn('status', ['running', 'suspended'])
            ->orderByDesc('updated_at')
            ->paginate(15, ['*'], 'pending_page')
            ->withQueryString();

        return Inertia::render('workflows/Index', [
            'myInstances' => $myInstances,
            'pendingSteps' => $pendingSteps,
            'filters' => $request->only(['status', 'tab']),
        ]);
    }

    public function create(Request $request): Response
    {
        $organization = $request->get('current_organization');

        $templates = WorkflowTemplate::query()
            ->where('organization_id', $organization->id)
            ->where('is_active', true)
            ->where('is_current', true)
            ->orderBy('name')
            ->get()
            ->map(fn ($t) => [
                'id' => $t->id,
                'name' => $t->name,
                'description' => $t->description,
                'version' => $t->version,
            ]);

        return Inertia::render('workflows/Start', [
            'templates' => $templates,
            'selectedTemplateId' => $request->integer('template_id') ?: null,
        ]);
    }

    public function show(WorkflowInstance $workflowInstance): Response
    {
        $workflowInstance->load([
            'template',
            'starter',
            'stepInstances.assignedUser',
            'histories.performer',
        ]);

        $currentUser = Auth::user();

        $myPendingSteps = $workflowInstance->stepInstances
            ->filter(fn ($step) => $step->assigned_to === $currentUser->id
                && in_array($step->status, ['pending', 'in_progress']))
            ->values();

        return Inertia::render('workflows/Show', [
            'instance' => [
                'id' => $workflowInstance->id,
                'title' => $workflowInstance->title,
                'status' => $workflowInstance->status,
                'active_steps' => $workflowInstance->active_steps ?? [],
                'parallel_mode' => $workflowInstance->parallel_mode,
                'form_data' => $workflowInstance->form_data ?? [],
                'started_at' => $workflowInstance->started_at?->toIso8601String(),
                'completed_at' => $workflowInstance->completed_at?->toIso8601String(),
                'created_at' => $workflowInstance->created_at->toIso8601String(),
                'template' => [
                    'id' => $workflowInstance->template->id,
                    'name' => $workflowInstance->template->name,
                    'version' => $workflowInstance->template->version,
                    'definition' => $workflowInstance->template->definition,
                ],
                'starter' => [
                    'id' => $workflowInstance->starter->id,
                    'name' => $workflowInstance->starter->name,
                    'email' => $workflowInstance->starter->email,
                ],
                'steps' => $workflowInstance->stepInstances->map(fn ($step) => [
                    'id' => $step->id,
                    'step_id' => $step->step_id,
                    'step_key' => $step->step_key,
                    'status' => $step->status,
                    'assigned_to' => $step->assigned_to,
                    'assigned_at' => $step->assigned_at?->toIso8601String(),
                    'completed_at' => $step->completed_at?->toIso8601String(),
                    'comments' => $step->comments,
                    'data' => $step->data,
                    'assigned_user' => $step->assignedUser ? [
                        'id' => $step->assignedUser->id,
                        'name' => $step->assignedUser->name,
                    ] : null,
                ]),
                'histories' => $workflowInstance->histories->map(fn ($h) => [
                    'id' => $h->id,
                    'action' => $h->action,
                    'comments' => $h->comments,
                    'performed_at' => $h->performed_at instanceof \DateTimeInterface
                        ? $h->performed_at->format('c')
                        : $h->performed_at,
                    'performer' => $h->performer ? [
                        'id' => $h->performer->id,
                        'name' => $h->performer->name,
                    ] : null,
                    'data' => $h->data,
                ]),
            ],
            'myPendingSteps' => $myPendingSteps->map(fn ($step) => [
                'id' => $step->id,
                'step_id' => $step->step_id,
                'step_key' => $step->step_key,
                'status' => $step->status,
            ]),
            'canManage' => $workflowInstance->started_by === $currentUser->id
                || in_array($currentUser->role, ['admin', 'manager']),
        ]);
    }
}
