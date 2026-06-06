<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\WorkflowTemplate;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\WorkflowInstance>
 */
class WorkflowInstanceFactory extends Factory
{
    public function definition(): array
    {
        return [
            'template_id' => WorkflowTemplate::factory(),
            'title' => $this->faker->sentence(4),
            'form_data' => [],
            'status' => $this->faker->randomElement(['running', 'completed', 'suspended', 'cancelled']),
            'active_steps' => null,
            'parallel_mode' => false,
            'started_by' => User::factory(),
            'started_at' => now(),
            'completed_at' => null,
        ];
    }

    public function running(): static
    {
        return $this->state(fn () => ['status' => 'running', 'active_steps' => ['step-1']]);
    }

    public function completed(): static
    {
        return $this->state(fn () => ['status' => 'completed', 'active_steps' => null, 'completed_at' => now()]);
    }

    public function suspended(): static
    {
        return $this->state(fn () => ['status' => 'suspended']);
    }

    public function cancelled(): static
    {
        return $this->state(fn () => ['status' => 'cancelled']);
    }
}
