<?php

namespace Tests\Feature;

use App\Models\ReverbApp;
use App\Models\User;
use App\Reverb\DatabaseApplicationProvider;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Bus;
use Laravel\Reverb\Exceptions\InvalidApplication;
use Tests\TestCase;

/**
 * The database-backed application provider resolves apps live on every
 * connection, so app changes take effect without restarting the Reverb
 * daemon. These tests guard that contract — and that no app lifecycle event
 * silently reintroduces an automatic broadcaster restart.
 */
class LiveAppResolutionTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_newly_created_app_is_immediately_resolvable_by_key(): void
    {
        $app = ReverbApp::factory()->create();

        $resolved = app(DatabaseApplicationProvider::class)->findByKey($app->key);

        $this->assertSame($app->app_id, $resolved->id());
    }

    public function test_a_deleted_app_stops_authenticating_new_connections(): void
    {
        $app = ReverbApp::factory()->create();
        $key = $app->key;

        $app->delete();

        $this->expectException(InvalidApplication::class);

        app(DatabaseApplicationProvider::class)->findByKey($key);
    }

    public function test_app_lifecycle_does_not_dispatch_a_broadcaster_restart(): void
    {
        Bus::fake();

        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('apps.store'), ['name' => 'no restart'])
            ->assertRedirect();

        $app = $user->reverbApps()->firstOrFail();

        $this->actingAs($user)
            ->patch(route('apps.update', $app), ['name' => 'renamed'])
            ->assertRedirect();

        $this->actingAs($user)
            ->delete(route('apps.destroy', $app))
            ->assertRedirect();

        Bus::assertNothingDispatched();
    }
}
