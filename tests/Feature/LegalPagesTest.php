<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class LegalPagesTest extends TestCase
{
    use RefreshDatabase;

    public function test_privacy_policy_is_public(): void
    {
        $this->get(route('legal.privacy'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page->component('legal/privacy'));
    }

    public function test_terms_of_service_is_public(): void
    {
        $this->get(route('legal.terms'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page->component('legal/terms'));
    }
}
