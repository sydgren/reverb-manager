<?php

namespace App\Plans;

/**
 * The caps a plan grants. Connections and monthly publishes are the two
 * pricing levers (price ∝ their product); apps bounds how many Reverb
 * apps a user may own.
 */
readonly class PlanLimits
{
    public function __construct(
        public int $maxApps,
        public int $maxConnections,
        public int $maxPublishesPerMonth,
    ) {}
}
