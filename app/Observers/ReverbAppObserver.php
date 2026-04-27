<?php

namespace App\Observers;

use App\Jobs\RestartReverb;
use App\Models\ReverbApp;

class ReverbAppObserver
{
    public function created(ReverbApp $app): void
    {
        $this->restart();
    }

    public function updated(ReverbApp $app): void
    {
        $this->restart();
    }

    public function deleted(ReverbApp $app): void
    {
        $this->restart();
    }

    /**
     * Always graceful — reverb:restart signals the running daemon to
     * drain connections and exit. Supervisor starts a fresh process
     * which picks up the new app list from the database.
     */
    private function restart(): void
    {
        RestartReverb::dispatch();
    }
}
