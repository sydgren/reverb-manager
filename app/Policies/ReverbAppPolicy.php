<?php

namespace App\Policies;

use App\Models\ReverbApp;
use App\Models\User;

class ReverbAppPolicy
{
    public function view(User $user, ReverbApp $reverbApp): bool
    {
        return $this->owns($user, $reverbApp);
    }

    public function update(User $user, ReverbApp $reverbApp): bool
    {
        return $this->owns($user, $reverbApp);
    }

    public function delete(User $user, ReverbApp $reverbApp): bool
    {
        return $this->owns($user, $reverbApp);
    }

    private function owns(User $user, ReverbApp $reverbApp): bool
    {
        return $reverbApp->user_id === $user->id;
    }
}
