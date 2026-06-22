<?php

namespace App\Plans;

enum Plan: string
{
    case Free = 'free';

    /**
     * The caps for this plan, read from config/plans.php so values stay
     * tunable without touching code. Subscription tiers slot in here later.
     */
    public function limits(): PlanLimits
    {
        /** @var array{max_apps: int, max_connections: int, max_publishes_per_month: int} $config */
        $config = config("plans.{$this->value}");

        return new PlanLimits(
            maxApps: $config['max_apps'],
            maxConnections: $config['max_connections'],
            maxPublishesPerMonth: $config['max_publishes_per_month'],
        );
    }
}
