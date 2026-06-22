<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use Tests\TestCase;

class HorizonAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_may_view_horizon(): void
    {
        $admin = User::factory()->admin()->create();

        $this->assertTrue(Gate::forUser($admin)->allows('viewHorizon'));
    }

    public function test_non_admin_user_may_not_view_horizon(): void
    {
        $user = User::factory()->create();

        $this->assertFalse(Gate::forUser($user)->allows('viewHorizon'));
    }

    public function test_guest_may_not_view_horizon(): void
    {
        $this->assertFalse(Gate::forUser(null)->allows('viewHorizon'));
    }
}
