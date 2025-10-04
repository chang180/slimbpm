<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrganizationSetting>
 */
class OrganizationSettingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'slug' => fake()->uuid(),
            'contact_person' => fake()->name(),
            'contact_email' => fake()->email(),
            'industry' => fake()->randomElement(['Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing']),
            'settings' => [
                'timezone' => fake()->timezone(),
                'currency' => fake()->currencyCode(),
                'date_format' => 'Y-m-d',
                'time_format' => 'H:i:s',
            ],
        ];
    }
}
