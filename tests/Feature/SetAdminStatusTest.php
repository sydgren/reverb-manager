<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SetAdminStatusTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_grants_admin_access(): void
    {
        $user = User::factory()->create();

        $this->artisan('app:user:admin', ['email' => $user->email])
            ->assertSuccessful();

        $this->assertTrue($user->refresh()->is_admin);
    }

    public function test_it_revokes_admin_access(): void
    {
        $user = User::factory()->admin()->create();

        $this->artisan('app:user:admin', ['email' => $user->email, '--revoke' => true])
            ->assertSuccessful();

        $this->assertFalse($user->refresh()->is_admin);
    }

    public function test_it_fails_for_unknown_email(): void
    {
        $this->artisan('app:user:admin', ['email' => 'nobody@example.com'])
            ->assertFailed();
    }
}
