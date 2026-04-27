<?php

/*
|--------------------------------------------------------------------------
| Reverb config — env-driven, multi-app friendly.
|--------------------------------------------------------------------------
|
| Single app (default): set REVERB_APP_ID / REVERB_APP_KEY / REVERB_APP_SECRET.
|
| Multiple apps: set REVERB_APPS to a JSON array. Each entry needs at minimum
| `app_id`, `key`, `secret`. Any field listed in `$defaults` below is filled
| in automatically. Example:
|
|   REVERB_APPS='[
|     {"app_id":"webhook-dev","key":"wd-key","secret":"wd-sec","allowed_origins":["https://hooks.example.com"]},
|     {"app_id":"crm","key":"crm-key","secret":"crm-sec","allowed_origins":["https://crm.example.com"]}
|   ]'
|
*/

$defaults = [
    'options' => [
        'host' => env('REVERB_HOST'),
        'port' => env('REVERB_PORT', 443),
        'scheme' => env('REVERB_SCHEME', 'https'),
        'useTLS' => env('REVERB_SCHEME', 'https') === 'https',
    ],
    'allowed_origins' => ['*'],
    'ping_interval' => env('REVERB_APP_PING_INTERVAL', 60),
    'activity_timeout' => env('REVERB_APP_ACTIVITY_TIMEOUT', 30),
    'max_connections' => env('REVERB_APP_MAX_CONNECTIONS'),
    'max_message_size' => env('REVERB_APP_MAX_MESSAGE_SIZE', 10_000),
    'accept_client_events_from' => env('REVERB_APP_ACCEPT_CLIENT_EVENTS_FROM', 'members'),
    'rate_limiting' => [
        'enabled' => env('REVERB_APP_RATE_LIMITING_ENABLED', false),
        'max_attempts' => env('REVERB_APP_RATE_LIMIT_MAX_ATTEMPTS', 60),
        'decay_seconds' => env('REVERB_APP_RATE_LIMIT_DECAY_SECONDS', 60),
        'terminate_on_limit' => env('REVERB_APP_RATE_LIMIT_TERMINATE', false),
    ],
];

$encoded = env('REVERB_APPS');

if (! empty($encoded)) {
    $apps = json_decode((string) $encoded, true) ?: [];

    $apps = array_map(static function (array $app) use ($defaults): array {
        return array_replace_recursive($defaults, $app);
    }, $apps);
} else {
    $apps = [
        array_replace_recursive($defaults, [
            'app_id' => env('REVERB_APP_ID'),
            'key' => env('REVERB_APP_KEY'),
            'secret' => env('REVERB_APP_SECRET'),
        ]),
    ];
}

return [

    'default' => env('REVERB_SERVER', 'reverb'),

    'servers' => [

        'reverb' => [
            'host' => env('REVERB_SERVER_HOST', '0.0.0.0'),
            'port' => env('REVERB_SERVER_PORT', 8080),
            'path' => env('REVERB_SERVER_PATH', ''),
            'hostname' => env('REVERB_HOST'),
            'options' => [
                'tls' => [],
            ],
            'max_request_size' => env('REVERB_MAX_REQUEST_SIZE', 10_000),
            'scaling' => [
                'enabled' => env('REVERB_SCALING_ENABLED', false),
                'channel' => env('REVERB_SCALING_CHANNEL', 'reverb'),
                'server' => [
                    'url' => env('REDIS_URL'),
                    'host' => env('REDIS_HOST', '127.0.0.1'),
                    'port' => env('REDIS_PORT', '6379'),
                    'username' => env('REDIS_USERNAME'),
                    'password' => env('REDIS_PASSWORD'),
                    'database' => env('REDIS_DB', '0'),
                    'timeout' => env('REDIS_TIMEOUT', 60),
                ],
            ],
            'pulse_ingest_interval' => env('REVERB_PULSE_INGEST_INTERVAL', 15),
            'telescope_ingest_interval' => env('REVERB_TELESCOPE_INGEST_INTERVAL', 15),
        ],

    ],

    'apps' => [
        'provider' => env('REVERB_APPS_PROVIDER', 'database'),
        'apps' => $apps,
    ],

];
