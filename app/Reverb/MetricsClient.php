<?php

namespace App\Reverb;

use App\Models\ReverbApp;
use Pusher\Pusher;
use Pusher\PusherException;
use Throwable;

/**
 * Wraps the Pusher PHP server SDK to query Reverb's HTTP API for live
 * stats (connections, channels). Reverb listens on 127.0.0.1:8080 by
 * default — the daemon and this web app live on the same host in
 * production, so we reach it directly without going through Nginx.
 */
class MetricsClient
{
    /**
     * Live connection count for the given app, or null if Reverb is
     * unreachable.
     */
    public function connections(ReverbApp $app): ?int
    {
        try {
            $response = $this->client($app)->get("/apps/{$app->app_id}/connections");

            return is_array($response) && isset($response['connections'])
                ? (int) $response['connections']
                : null;
        } catch (Throwable) {
            return null;
        }
    }

    /**
     * Live channel count for the given app, or null if Reverb is
     * unreachable.
     */
    public function channels(ReverbApp $app): ?int
    {
        try {
            $response = $this->client($app)->getChannels();

            if (is_object($response) && isset($response->channels)) {
                return count((array) $response->channels);
            }

            return null;
        } catch (PusherException|Throwable) {
            return null;
        }
    }

    private function client(ReverbApp $app): Pusher
    {
        return new Pusher(
            auth_key: $app->key,
            secret: $app->secret,
            app_id: $app->app_id,
            options: [
                'host' => env('REVERB_SERVER_HOST', '127.0.0.1'),
                'port' => (int) env('REVERB_SERVER_PORT', 8080),
                'scheme' => 'http',
                'useTLS' => false,
                'timeout' => 2,
            ],
        );
    }
}
