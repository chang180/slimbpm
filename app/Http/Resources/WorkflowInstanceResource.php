<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkflowInstanceResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'template_id' => $this->template_id,
            'title' => $this->title,
            'status' => $this->status,
            'active_steps' => $this->active_steps ?? [],
            'parallel_mode' => (bool) $this->parallel_mode,
            'form_data' => $this->form_data ?? [],
            'started_by' => $this->started_by,
            'started_at' => $this->started_at?->toIso8601String(),
            'completed_at' => $this->completed_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'template' => $this->whenLoaded('template', fn () => [
                'id' => $this->template->id,
                'name' => $this->template->name,
                'version' => $this->template->version,
            ]),
            'starter' => $this->whenLoaded('starter', fn () => [
                'id' => $this->starter->id,
                'name' => $this->starter->name,
                'email' => $this->starter->email,
            ]),
            'steps' => WorkflowStepInstanceResource::collection(
                $this->whenLoaded('stepInstances')
            ),
            'histories' => WorkflowHistoryResource::collection(
                $this->whenLoaded('histories')
            ),
        ];
    }
}
