<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Prunable;

class ReverbMetric extends Model
{
    use Prunable;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'reverb_app_id',
        'bucket_hour',
        'type',
        'count',
    ];

    public const TYPE_MESSAGE = 'message';

    public function prunable(): Builder
    {
        return static::query()->where('bucket_hour', '<', now()->subDays(90));
    }

    /**
     * Atomically bump the counter for the given app + hour bucket.
     */
    public static function bump(string $appId, string $type, int $by = 1): void
    {
        $hour = now()->minute(0)->second(0)->microsecond(0);

        // Postgres / MySQL / SQLite: ON DUPLICATE / ON CONFLICT all
        // supported via Eloquent's upsert. We compute the new count via
        // raw expression to avoid a round-trip.
        $existing = static::query()
            ->where('reverb_app_id', $appId)
            ->where('bucket_hour', $hour)
            ->where('type', $type)
            ->lockForUpdate()
            ->first();

        if ($existing) {
            $existing->increment('count', $by);

            return;
        }

        static::create([
            'reverb_app_id' => $appId,
            'bucket_hour' => $hour,
            'type' => $type,
            'count' => $by,
        ]);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'bucket_hour' => 'datetime',
            'count' => 'integer',
        ];
    }
}
