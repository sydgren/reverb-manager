<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\MagicLinkNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;
use Inertia\Response;

class MagicLinkController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('auth/login');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', $data['email'])->first();

        if ($user !== null) {
            $url = URL::temporarySignedRoute(
                'login.consume',
                now()->addMinutes(15),
                ['user' => $user->id],
            );

            $user->notify(new MagicLinkNotification($url));
        }

        // Always redirect to the same confirmation, regardless of whether
        // the email matched a real user — avoids leaking which addresses
        // are registered.
        return redirect()->route('login.sent');
    }

    public function sent(): Response
    {
        return Inertia::render('auth/magic-link-sent');
    }

    public function consume(Request $request, User $user): RedirectResponse
    {
        Auth::login($user, remember: true);

        $request->session()->regenerate();

        return redirect()->intended(route('apps.index'));
    }
}
