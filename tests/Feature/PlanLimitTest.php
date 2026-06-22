<?php

namespace Tests\Feature;

use App\Models\ReverbApp;
use App\Models\User;
use App\Plans\Plan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlanLimitTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_new_user_is_on_the_free_plan(): void
    {
        $this->assertSame(Plan::Free, User::factory()->create()->plan);
    }

    public function test_max_connections_cannot_exceed_the_plan_cap(): void
    {
        $cap = Plan::Free->limits()->maxConnections;

        $this->actingAs(User::factory()->create())
            ->post(route('apps.store'), ['max_connections' => $cap + 1])
            ->assertSessionHasErrors('max_connections');

        $this->assertDatabaseCount('reverb_apps', 0);
    }

    public function test_a_new_app_defaults_to_the_plan_connection_cap(): void
    {
        $this->actingAs(User::factory()->create())
            ->post(route('apps.store'), ['name' => 'capped'])
            ->assertRedirect();

        $this->assertSame(
            Plan::Free->limits()->maxConnections,
            ReverbApp::firstWhere('name', 'capped')->max_connections,
        );
    }

    public function test_a_free_user_cannot_create_more_apps_than_the_plan_allows(): void
    {
        $user = User::factory()->create();
        ReverbApp::factory()->count(Plan::Free->limits()->maxApps)->for($user)->create();

        $this->actingAs($user)
            ->post(route('apps.store'), ['name' => 'one too many'])
            ->assertSessionHasErrors('name');

        $this->assertSame(
            Plan::Free->limits()->maxApps,
            $user->reverbApps()->count(),
        );
    }

    public function test_to_reverb_config_carries_max_connections_for_native_enforcement(): void
    {
        $app = ReverbApp::factory()->create(['max_connections' => 25]);

        $this->assertSame(25, $app->toReverbConfig()['max_connections']);
    }
}
