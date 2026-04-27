<?php

namespace App\Models;

use Database\Factories\ReverbAppFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ReverbApp extends Model
{
    /** @use HasFactory<ReverbAppFactory> */
    use HasFactory, HasUlids;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'app_id',
        'name',
        'key',
        'secret',
        'allowed_origins',
        'ping_interval',
        'activity_timeout',
        'max_connections',
        'max_message_size',
        'accept_client_events_from',
        'rate_limit_enabled',
        'rate_limit_max_attempts',
        'rate_limit_decay_seconds',
        'rate_limit_terminate_on_limit',
    ];

    /**
     * @var list<string>
     */
    protected $hidden = ['secret'];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (ReverbApp $app): void {
            if (empty($app->key)) {
                $app->key = static::generateKey();
            }
            if (empty($app->secret)) {
                $app->secret = static::generateSecret();
            }
            if (empty($app->app_id)) {
                $app->app_id = static::generateAppId();
            }
        });
    }

    public static function generateAppId(): string
    {
        do {
            $id = (string) random_int(100_000, 999_999_999);
        } while (static::where('app_id', $id)->exists());

        return $id;
    }

    public static function generateKey(): string
    {
        do {
            $key = Str::lower(Str::random(20));
        } while (static::where('key', $key)->exists());

        return $key;
    }

    public static function generateSecret(): string
    {
        return Str::lower(Str::random(40));
    }

    /**
     * Convert to the array shape Reverb's Application expects.
     *
     * @return array<string, mixed>
     */
    public function toReverbConfig(): array
    {
        return [
            'app_id' => $this->app_id,
            'key' => $this->key,
            'secret' => $this->secret,
            'options' => [
                'host' => config('reverb.servers.reverb.hostname'),
                'port' => config('reverb.apps.options.port', 443),
                'scheme' => config('reverb.apps.options.scheme', 'https'),
                'useTLS' => config('reverb.apps.options.scheme', 'https') === 'https',
            ],
            'allowed_origins' => $this->allowed_origins ?? ['*'],
            'ping_interval' => $this->ping_interval,
            'activity_timeout' => $this->activity_timeout,
            'max_connections' => $this->max_connections,
            'max_message_size' => $this->max_message_size,
            'accept_client_events_from' => $this->accept_client_events_from,
            'rate_limiting' => [
                'enabled' => $this->rate_limit_enabled,
                'max_attempts' => $this->rate_limit_max_attempts,
                'decay_seconds' => $this->rate_limit_decay_seconds,
                'terminate_on_limit' => $this->rate_limit_terminate_on_limit,
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'allowed_origins' => 'array',
            'rate_limit_enabled' => 'boolean',
            'rate_limit_terminate_on_limit' => 'boolean',
        ];
    }
}
