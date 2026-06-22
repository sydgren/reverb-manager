<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Plan limits
    |--------------------------------------------------------------------------
    |
    | Caps per plan, keyed by the App\Plans\Plan enum value. Only `free`
    | exists today; paid tiers slot in alongside it. `max_publishes_per_month`
    | is metered/displayed but not yet enforced.
    |
    */

    'free' => [
        'max_apps' => 1,
        'max_connections' => 100,
        'max_publishes_per_month' => 100_000,
    ],

];
