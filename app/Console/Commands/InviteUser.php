<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Notifications\MagicLinkNotification;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

class InviteUser extends Command
{
    protected $signature = 'reverb-manager:invite {email} {--name= : Display name}';

    protected $description = 'Create an admin user (passwordless) and email them a magic link to sign in.';

    public function handle(): int
    {
        $email = $this->argument('email');
        $name = $this->option('name') ?? Str::title(Str::before($email, '@'));

        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => bcrypt(Str::random(40)),
                'email_verified_at' => now(),
            ],
        );

        $url = URL::temporarySignedRoute(
            'login.consume',
            now()->addHours(24),
            ['user' => $user->id],
        );

        $user->notify(new MagicLinkNotification($url));

        $this->components->info("Invited {$user->email}");
        $this->components->twoColumnDetail('Magic link', $url);
        $this->components->warn('The link is valid for 24h.');

        return self::SUCCESS;
    }
}
