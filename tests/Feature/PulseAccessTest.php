<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use Tests\TestCase;

class PulseAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_may_view_pulse(): void
    {
        $admin = User::factory()->admin()->create();

        $this->assertTrue(Gate::forUser($admin)->allows('viewPulse'));
    }

    public function test_non_admin_user_may_not_view_pulse(): void
    {
        $user = User::factory()->create();

        $this->assertFalse(Gate::forUser($user)->allows('viewPulse'));
    }

    public function test_guest_may_not_view_pulse(): void
    {
        $this->assertFalse(Gate::forUser(null)->allows('viewPulse'));
    }
}
