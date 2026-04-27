<?php

namespace App\Listeners;

use App\Models\ReverbMetric;
use Laravel\Reverb\Events\MessageSent;

class RecordMessageSent
{
    /**
     * Bump the hourly counter for this app every time the broadcaster
     * delivers a message. Runs inside the daemon process — keep it
     * tight; a DB upsert is fine, anything heavier should go via queue.
     */
    public function handle(MessageSent $event): void
    {
        $appId = $event->connection->app()->id();

        ReverbMetric::bump($appId, ReverbMetric::TYPE_MESSAGE);
    }
}
