<?php

namespace Tests\Feature\Settings;

use App\Models\ReverbApp;
use App\Models\ReverbMetric;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AccountDeletionTest extends TestCase
{
    use RefreshDatabase;

    public function test_deletion_requires_authentication(): void
    {
        $this->delete(route('settings.destroy'))->assertRedirect(route('login'));
    }

    public function test_a_user_can_erase_their_account_and_all_associated_data(): void
    {
        $user = User::factory()->create();
        $app = ReverbApp::factory()->for($user)->create();
        ReverbMetric::create([
            'reverb_app_id' => $app->app_id,
            'bucket_hour' => now(),
            'type' => ReverbMetric::TYPE_MESSAGE,
            'count' => 5,
        ]);

        $this->actingAs($user)
            ->delete(route('settings.destroy'))
            ->assertRedirect('/');

        $this->assertGuest();
        $this->assertModelMissing($user);
        $this->assertModelMissing($app);
        $this->assertDatabaseMissing('reverb_metrics', ['reverb_app_id' => $app->app_id]);
    }

    public function test_a_user_with_a_remember_token_is_fully_erased(): void
    {
        // Regression: logging out after delete re-persists the user via the
        // remember-token cycle and resurrects the row. Logout must come first.
        $user = User::factory()->create(['remember_token' => 'a-real-token']);

        $this->actingAs($user)
            ->delete(route('settings.destroy'))
            ->assertRedirect('/');

        $this->assertModelMissing($user);
    }

    public function test_deletion_leaves_other_users_data_intact(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $otherApp = ReverbApp::factory()->for($other)->create();

        $this->actingAs($user)->delete(route('settings.destroy'))->assertRedirect('/');

        $this->assertModelExists($other);
        $this->assertModelExists($otherApp);
    }
}
