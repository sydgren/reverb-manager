<?php

namespace App\Providers;

use App\Listeners\RecordMessageSent;
use App\Models\ReverbApp;
use App\Observers\ReverbAppObserver;
use App\Reverb\DatabaseApplicationProvider;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;
use Laravel\Reverb\Contracts\ApplicationProvider;
use Laravel\Reverb\Events\MessageSent;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        if (config('reverb.apps.provider') === 'database') {
            $this->app->singleton(
                ApplicationProvider::class,
                DatabaseApplicationProvider::class,
            );
        }
    }

    public function boot(): void
    {
        ReverbApp::observe(ReverbAppObserver::class);

        Event::listen(MessageSent::class, RecordMessageSent::class);
    }
}
