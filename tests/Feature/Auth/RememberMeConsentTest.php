<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\URL;
use Illuminate\Testing\TestResponse;
use Tests\TestCase;

class RememberMeConsentTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_persistent_cookie_is_set_only_when_the_user_consents(): void
    {
        $user = User::factory()->create();

        $response = $this->get($this->consumeUrl($user, remember: 1));

        $response->assertRedirect();
        $this->assertAuthenticatedAs($user);
        $this->assertTrue($this->hasRememberCookie($response));
    }

    public function test_no_persistent_cookie_is_set_without_consent(): void
    {
        $user = User::factory()->create();

        $response = $this->get($this->consumeUrl($user, remember: 0));

        $response->assertRedirect();
        $this->assertAuthenticatedAs($user);
        $this->assertFalse($this->hasRememberCookie($response));
    }

    private function consumeUrl(User $user, int $remember): string
    {
        return URL::temporarySignedRoute(
            'login.consume',
            now()->addMinutes(15),
            ['user' => $user->id, 'remember' => $remember],
        );
    }

    private function hasRememberCookie(TestResponse $response): bool
    {
        foreach ($response->headers->getCookies() as $cookie) {
            if (str_starts_with($cookie->getName(), 'remember_') && $cookie->getValue() !== null) {
                return true;
            }
        }

        return false;
    }
}
