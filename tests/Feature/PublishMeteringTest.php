<?php

namespace Tests\Feature;

use App\Listeners\RecordMessageReceived;
use App\Models\ReverbApp;
use App\Models\ReverbMetric;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class PublishMeteringTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_client_event_counts_as_a_publish(): void
    {
        $this->assertTrue(RecordMessageReceived::isPublish(
            '{"event":"client-typing","channel":"room","data":{}}'
        ));
    }

    public function test_a_pusher_protocol_frame_is_not_a_publish(): void
    {
        $this->assertFalse(RecordMessageReceived::isPublish(
            '{"event":"pusher:subscribe","data":{"channel":"room"}}'
        ));
    }

    public function test_malformed_messages_are_not_publishes(): void
    {
        $this->assertFalse(RecordMessageReceived::isPublish('not json'));
        $this->assertFalse(RecordMessageReceived::isPublish('{"data":{}}'));
    }

    public function test_show_exposes_publishes_within_the_current_calendar_month(): void
    {
        $user = User::factory()->create();
        $app = ReverbApp::factory()->for($user)->create();

        ReverbMetric::create([
            'reverb_app_id' => $app->app_id,
            'bucket_hour' => now()->startOfMonth()->addDay(),
            'type' => ReverbMetric::TYPE_PUBLISH,
            'count' => 7,
        ]);
        ReverbMetric::create([
            'reverb_app_id' => $app->app_id,
            'bucket_hour' => now()->subMonth(),
            'type' => ReverbMetric::TYPE_PUBLISH,
            'count' => 99,
        ]);

        $this->actingAs($user)
            ->get(route('apps.show', $app))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('stats.publishes_month', 7)
            );
    }
}
