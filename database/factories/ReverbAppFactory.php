<?php

namespace Database\Factories;

use App\Models\ReverbApp;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ReverbApp>
 */
class ReverbAppFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(2, true),
            'allowed_origins' => ['*'],
        ];
    }
}
