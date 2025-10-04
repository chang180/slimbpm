<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\WorkflowTemplate>
 */
class WorkflowTemplateFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'definition' => [
                'nodes' => [
                    [
                        'id' => 'start-1',
                        'type' => 'start',
                        'data' => ['label' => 'Start'],
                        'position' => ['x' => 0, 'y' => 0],
                    ],
                    [
                        'id' => 'end-1',
                        'type' => 'end',
                        'data' => ['label' => 'End'],
                        'position' => ['x' => 240, 'y' => 0],
                    ],
                ],
                'edges' => [
                    [
                        'id' => 'edge-1',
                        'source' => 'start-1',
                        'target' => 'end-1',
                        'data' => [],
                    ],
                ],
            ],
            'version' => '1.0.0',
            'parent_id' => null,
            'is_current' => true,
            'is_active' => true,
            'created_by' => \App\Models\User::factory(),
        ];
    }
}
