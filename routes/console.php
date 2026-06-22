<?php

use App\Models\ReverbMetric;
use Illuminate\Support\Facades\Schedule;

Schedule::command('model:prune', ['--model' => [ReverbMetric::class]])
    ->daily()
    ->withoutOverlapping();

// Drop failed jobs older than a week so login-email payloads (which embed
// the recipient's address) don't linger in the failed_jobs table.
Schedule::command('queue:prune-failed', ['--hours' => 168])
    ->weekly();
