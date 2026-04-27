<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Artisan;

/**
 * Triggers a graceful reload of the Reverb daemon. The `reverb:restart`
 * command writes a token to the cache; the running daemon polls that
 * cache and gracefully drains connections + exits when it changes.
 * Supervisor immediately starts a fresh process.
 */
class RestartReverb implements ShouldQueue
{
    use Queueable;

    public function handle(): void
    {
        Artisan::call('reverb:restart');
    }
}
