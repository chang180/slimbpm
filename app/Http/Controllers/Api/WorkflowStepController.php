<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\WorkflowStepExecuteRequest;
use App\Http\Resources\WorkflowInstanceResource;
use App\Models\WorkflowInstance;
use App\Models\WorkflowStepInstance;
use App\Services\Workflow\WorkflowEngine;

class WorkflowStepController extends Controller
{
    public function update(
        WorkflowStepExecuteRequest $request,
        WorkflowInstance $workflowInstance,
        WorkflowStepInstance $step,
        WorkflowEngine $engine
    ): WorkflowInstanceResource {
        if ($step->workflow_instance_id !== $workflowInstance->id) {
            abort(404);
        }

        $engine->executeStep($step, $request->validated(), $request->user());

        $workflowInstance->refresh()->load([
            'template',
            'starter',
            'stepInstances.assignedUser',
            'histories.performer',
        ]);

        return new WorkflowInstanceResource($workflowInstance);
    }
}
