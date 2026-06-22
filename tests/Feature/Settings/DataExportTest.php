<?php

namespace Tests\Feature\Settings;

use App\Models\ReverbApp;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DataExportTest extends TestCase
{
    use RefreshDatabase;

    public function test_export_requires_authentication(): void
    {
        $this->get(route('settings.export'))->assertRedirect(route('login'));
    }

    public function test_export_returns_the_users_data_as_a_json_download(): void
    {
        $user = User::factory()->create(['email' => 'me@example.com']);
        ReverbApp::factory()->for($user)->create(['name' => 'Mine']);

        $response = $this->actingAs($user)->get(route('settings.export'));

        $response->assertOk();
        $response->assertHeader('content-disposition', 'attachment; filename="reverb-manager-data-export.json"');
        $response->assertJsonPath('account.email', 'me@example.com');
        $response->assertJsonPath('reverb_apps.0.name', 'Mine');
    }

    public function test_export_only_includes_the_authenticated_users_apps(): void
    {
        $user = User::factory()->create();
        ReverbApp::factory()->for($user)->create();
        ReverbApp::factory()->create(); // someone else's

        $response = $this->actingAs($user)->get(route('settings.export'));

        $response->assertOk();
        $this->assertCount(1, $response->json('reverb_apps'));
    }
}
