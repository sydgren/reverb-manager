<?php

use App\Models\ReverbMetric;
use Illuminate\Support\Facades\Schedule;

Schedule::command('model:prune', ['--model' => [ReverbMetric::class]])
    ->daily()
    ->withoutOverlapping();
