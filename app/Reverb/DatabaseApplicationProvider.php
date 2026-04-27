<?php

namespace App\Reverb;

use App\Models\ReverbApp;
use Illuminate\Support\Collection;
use Laravel\Reverb\Application;
use Laravel\Reverb\Contracts\ApplicationProvider;
use Laravel\Reverb\Exceptions\InvalidApplication;

class DatabaseApplicationProvider implements ApplicationProvider
{
    /**
     * @return Collection<int, Application>
     */
    public function all(): Collection
    {
        return ReverbApp::query()
            ->get()
            ->map(fn (ReverbApp $app) => $this->toApplication($app->toReverbConfig()));
    }

    public function findById(string $id): Application
    {
        $app = ReverbApp::where('app_id', $id)->first();

        if (! $app) {
            throw new InvalidApplication;
        }

        return $this->toApplication($app->toReverbConfig());
    }

    public function findByKey(string $key): Application
    {
        $app = ReverbApp::where('key', $key)->first();

        if (! $app) {
            throw new InvalidApplication;
        }

        return $this->toApplication($app->toReverbConfig());
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function toApplication(array $data): Application
    {
        return new Application(
            $data['app_id'],
            $data['key'],
            $data['secret'],
            $data['ping_interval'],
            $data['activity_timeout'] ?? 30,
            $data['allowed_origins'],
            $data['max_message_size'],
            $data['max_connections'] ?? null,
            $data['accept_client_events_from'] ?? 'all',
            $data['rate_limiting'] ?? null,
            $data['options'] ?? [],
        );
    }
}
