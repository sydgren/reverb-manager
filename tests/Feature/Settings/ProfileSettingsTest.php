<?php

namespace Tests\Feature\Settings;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfileSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_settings_page_requires_authentication(): void
    {
        $this->get(route('settings.edit'))->assertRedirect(route('login'));
    }

    public function test_a_user_can_rectify_their_name_and_email(): void
    {
        $user = User::factory()->create(['name' => 'Old', 'email' => 'old@example.com']);

        $this->actingAs($user)
            ->patch(route('settings.update'), [
                'name' => 'New Name',
                'email' => 'new@example.com',
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect();

        $user->refresh();
        $this->assertSame('New Name', $user->name);
        $this->assertSame('new@example.com', $user->email);
    }

    public function test_email_must_be_unique_across_other_users(): void
    {
        User::factory()->create(['email' => 'taken@example.com']);
        $user = User::factory()->create(['email' => 'mine@example.com']);

        $this->actingAs($user)
            ->patch(route('settings.update'), [
                'name' => $user->name,
                'email' => 'taken@example.com',
            ])
            ->assertSessionHasErrors('email');

        $this->assertSame('mine@example.com', $user->fresh()->email);
    }

    public function test_keeping_your_own_email_is_allowed(): void
    {
        $user = User::factory()->create(['email' => 'mine@example.com']);

        $this->actingAs($user)
            ->patch(route('settings.update'), [
                'name' => 'Renamed',
                'email' => 'mine@example.com',
            ])
            ->assertSessionHasNoErrors();

        $this->assertSame('Renamed', $user->fresh()->name);
    }
}
