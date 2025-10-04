<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkflowHistoryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'action' => $this->action,
            'performed_by' => $this->performed_by,
            'performed_user' => $this->whenLoaded('performer', fn () => [
                'id' => $this->performer->id,
                'name' => $this->performer->name,
                'email' => $this->performer->email,
            ]),
            'performed_at' => $this->performed_at?->toIso8601String(),
            'data' => $this->data ?? [],
            'comments' => $this->comments,
        ];
    }
}
