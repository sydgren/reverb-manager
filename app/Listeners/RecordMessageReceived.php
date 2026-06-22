<?php

namespace App\Listeners;

use App\Models\ReverbMetric;
use Laravel\Reverb\Events\MessageReceived;

class RecordMessageReceived
{
    /**
     * Count client-originated publishes (the customer-facing usage
     * number). MessageReceived fires for every inbound frame, so we skip
     * Pusher protocol frames (pusher:subscribe / ping / …) and only bump
     * for genuine broadcast/trigger events. Runs inside the daemon — keep
     * it tight.
     *
     * Known gap: server-side broadcasts via Reverb's HTTP events API do
     * not emit MessageReceived, so they aren't counted here yet.
     */
    public function handle(MessageReceived $event): void
    {
        if (! self::isPublish($event->message)) {
            return;
        }

        ReverbMetric::bump($event->connection->app()->id(), ReverbMetric::TYPE_PUBLISH);
    }

    /**
     * A publish is any client-originated event — i.e. not a Pusher protocol
     * frame (pusher:subscribe / pusher:ping / …).
     */
    public static function isPublish(string $message): bool
    {
        $payload = json_decode($message, true);

        $name = is_array($payload) ? ($payload['event'] ?? null) : null;

        return is_string($name) && ! str_starts_with($name, 'pusher:');
    }
}
