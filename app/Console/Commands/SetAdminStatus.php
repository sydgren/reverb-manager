<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class SetAdminStatus extends Command
{
    protected $signature = 'app:user:admin {email} {--revoke : Revoke admin access instead of granting it}';

    protected $description = "Grant or revoke a user's admin access to Horizon and Pulse.";

    public function handle(): int
    {
        $email = $this->argument('email');

        $user = User::where('email', $email)->first();

        if ($user === null) {
            $this->components->error("No user found for {$email}");

            return self::FAILURE;
        }

        $grant = ! $this->option('revoke');

        // is_admin is intentionally not mass-assignable, so set it directly.
        $user->is_admin = $grant;
        $user->save();

        $this->components->info(
            $grant
                ? "Granted admin access to {$user->email}"
                : "Revoked admin access from {$user->email}",
        );

        return self::SUCCESS;
    }
}
