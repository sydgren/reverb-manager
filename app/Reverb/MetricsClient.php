<?php

namespace App\Reverb;

use App\Models\ReverbApp;
use Pusher\Pusher;
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
            // pusher-php-server prepends /apps/{app_id} to the path itself.
            $response = $this->client($app)->get('/connections');

            $connections = match (true) {
                is_object($response) && isset($response->connections) => $response->connections,
                is_array($response) && isset($response['connections']) => $response['connections'],
                default => null,
            };

            return $connections === null ? null : (int) $connections;
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
            // Don't use getChannels() — pusher-php-server assumes the
            // server returns an object map of channels, but Reverb sends
            // an empty array when there are none, which crashes its
            // get_object_vars(). Call the raw endpoint instead.
            $response = $this->client($app)->get('/channels');

            $channels = match (true) {
                is_object($response) && isset($response->channels) => $response->channels,
                is_array($response) && isset($response['channels']) => $response['channels'],
                default => null,
            };

            return $channels === null ? null : count((array) $channels);
        } catch (Throwable) {
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
