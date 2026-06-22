<?php

namespace App\Models;

use App\Plans\Plan;
use App\Plans\PlanLimits;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasUlids, Notifiable;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
    ];

    /**
     * @var list<string>
     */
    protected $hidden = [
        'remember_token',
    ];

    /**
     * @var array<string, mixed>
     */
    protected $attributes = [
        'plan' => Plan::Free->value,
    ];

    /**
     * @return HasMany<ReverbApp, $this>
     */
    public function reverbApps(): HasMany
    {
        return $this->hasMany(ReverbApp::class);
    }

    public function planLimits(): PlanLimits
    {
        return $this->plan->limits();
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'plan' => Plan::class,
        ];
    }

    /**
     * Magic-link only — the auth pipeline never checks a password,
     * but Authenticatable's contract still requires the method.
     */
    public function getAuthPassword(): string
    {
        return '';
    }
}
