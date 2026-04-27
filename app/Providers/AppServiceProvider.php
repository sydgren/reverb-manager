<?php

namespace App\Providers;

use App\Models\ReverbApp;
use App\Observers\ReverbAppObserver;
use App\Reverb\DatabaseApplicationProvider;
use Illuminate\Support\ServiceProvider;
use Laravel\Reverb\Contracts\ApplicationProvider;

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
    }
}
