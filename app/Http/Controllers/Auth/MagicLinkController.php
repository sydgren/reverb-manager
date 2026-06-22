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
            'remember' => ['nullable', 'boolean'],
        ]);

        $user = User::where('email', $data['email'])->first();

        if ($user !== null) {
            $url = URL::temporarySignedRoute(
                'login.consume',
                now()->addMinutes(15),
                // The remember choice rides in the signed payload, so it
                // can't be tampered with between request and consumption.
                ['user' => $user->id, 'remember' => $request->boolean('remember') ? 1 : 0],
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
        // A persistent "remember me" cookie is not consent-exempt under
        // ePrivacy, so we only set it when the user explicitly opted in.
        Auth::login($user, remember: $request->boolean('remember'));

        $request->session()->regenerate();

        return redirect()->intended(route('apps.index'));
    }
}
