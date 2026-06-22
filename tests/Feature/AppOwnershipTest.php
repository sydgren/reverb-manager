<?php

namespace Tests\Feature;

use App\Models\ReverbApp;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class AppOwnershipTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_lists_only_the_authenticated_users_apps(): void
    {
        $user = User::factory()->create();
        ReverbApp::factory()->count(2)->for($user)->create();
        ReverbApp::factory()->create(); // belongs to someone else

        $this->actingAs($user)
            ->get(route('apps.index'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('apps/index')
                ->has('apps', 2)
            );
    }

    public function test_a_user_cannot_view_another_users_app(): void
    {
        $app = ReverbApp::factory()->create();

        $this->actingAs(User::factory()->create())
            ->get(route('apps.show', $app))
            ->assertForbidden();
    }

    public function test_a_user_cannot_update_another_users_app(): void
    {
        $app = ReverbApp::factory()->create(['name' => 'original']);

        $this->actingAs(User::factory()->create())
            ->patch(route('apps.update', $app), ['name' => 'hijacked'])
            ->assertForbidden();

        $this->assertSame('original', $app->fresh()->name);
    }

    public function test_a_user_cannot_delete_another_users_app(): void
    {
        $app = ReverbApp::factory()->create();

        $this->actingAs(User::factory()->create())
            ->delete(route('apps.destroy', $app))
            ->assertForbidden();

        $this->assertModelExists($app);
    }

    public function test_a_created_app_belongs_to_the_authenticated_user(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('apps.store'), ['name' => 'mine'])
            ->assertRedirect();

        $this->assertSame($user->id, ReverbApp::firstWhere('name', 'mine')->user_id);
    }
}
