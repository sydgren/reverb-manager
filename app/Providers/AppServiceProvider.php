<?php

namespace App\Providers;

use App\Listeners\RecordMessageReceived;
use App\Listeners\RecordMessageSent;
use App\Models\User;
use App\Reverb\DatabaseApplicationProvider;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Laravel\Reverb\ApplicationManager;
use Laravel\Reverb\Events\MessageReceived;
use Laravel\Reverb\Events\MessageSent;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Reverb's ApplicationManager extends Illuminate\Support\Manager, so
        // a "driver" named `database` is resolved via createDatabaseDriver()
        // unless we explicitly register an extension. Teach the manager to
        // hand us the DatabaseApplicationProvider when the config asks for
        // the `database` provider.
        $app = $this->app;
        $app->afterResolving(
            ApplicationManager::class,
            function (ApplicationManager $manager) use ($app): void {
                // Manager::extend re-binds $this on the closure to the
                // manager itself, so capture the container by closure.
                $manager->extend(
                    'database',
                    fn () => $app->make(DatabaseApplicationProvider::class),
                );
            },
        );
    }

    public function boot(): void
    {
        Event::listen(MessageSent::class, RecordMessageSent::class);
        Event::listen(MessageReceived::class, RecordMessageReceived::class);

        // Only administrators may view the Pulse dashboard. Mirrors the
        // viewHorizon gate.
        Gate::define('viewPulse', function (?User $user = null): bool {
            return $user?->is_admin === true;
        });
    }
}
