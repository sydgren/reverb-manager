<?php

namespace App\Http\Controllers;

use App\Models\ReverbApp;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AppController extends Controller
{
    public function index(): Response
    {
        $apps = ReverbApp::query()
            ->orderByDesc('created_at')
            ->get(['id', 'app_id', 'name', 'key', 'allowed_origins', 'rate_limit_enabled', 'created_at']);

        return Inertia::render('apps/index', [
            'apps' => $apps->map(fn (ReverbApp $a): array => [
                'app_id' => $a->app_id,
                'name' => $a->name,
                'key' => $a->key,
                'allowed_origins' => $a->allowed_origins ?? ['*'],
                'rate_limit_enabled' => $a->rate_limit_enabled,
                'created_at' => $a->created_at?->toIso8601String(),
            ])->all(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('apps/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateRequest($request);

        $app = ReverbApp::create($data);

        return redirect()
            ->route('apps.show', $app)
            ->with('reveal_secret', $app->secret);
    }

    public function show(Request $request, ReverbApp $app): Response
    {
        return Inertia::render('apps/show', [
            'app' => [
                'app_id' => $app->app_id,
                'name' => $app->name,
                'key' => $app->key,
                'allowed_origins' => $app->allowed_origins ?? ['*'],
                'ping_interval' => $app->ping_interval,
                'activity_timeout' => $app->activity_timeout,
                'max_connections' => $app->max_connections,
                'max_message_size' => $app->max_message_size,
                'accept_client_events_from' => $app->accept_client_events_from,
                'rate_limit_enabled' => $app->rate_limit_enabled,
                'rate_limit_max_attempts' => $app->rate_limit_max_attempts,
                'rate_limit_decay_seconds' => $app->rate_limit_decay_seconds,
                'rate_limit_terminate_on_limit' => $app->rate_limit_terminate_on_limit,
                'created_at' => $app->created_at?->toIso8601String(),
            ],
            'reveal_secret' => $request->session()->get('reveal_secret'),
        ]);
    }

    public function update(Request $request, ReverbApp $app): RedirectResponse
    {
        $data = $this->validateRequest($request);

        $app->update($data);

        return redirect()->route('apps.show', $app);
    }

    public function destroy(ReverbApp $app): RedirectResponse
    {
        $app->delete();

        return redirect()->route('apps.index');
    }

    public function rotateSecret(ReverbApp $app): RedirectResponse
    {
        $newSecret = ReverbApp::generateSecret();
        $app->update(['secret' => $newSecret]);

        return redirect()
            ->route('apps.show', $app)
            ->with('reveal_secret', $newSecret);
    }

    /**
     * @return array<string, mixed>
     */
    private function validateRequest(Request $request): array
    {
        return $request->validate([
            'name' => ['nullable', 'string', 'max:120'],
            'allowed_origins' => ['nullable', 'array'],
            'allowed_origins.*' => ['string'],
            'ping_interval' => ['nullable', 'integer', 'min:5', 'max:600'],
            'activity_timeout' => ['nullable', 'integer', 'min:5', 'max:600'],
            'max_connections' => ['nullable', 'integer', 'min:1'],
            'max_message_size' => ['nullable', 'integer', 'min:128'],
            'accept_client_events_from' => ['nullable', Rule::in(['all', 'members', 'none'])],
            'rate_limit_enabled' => ['nullable', 'boolean'],
            'rate_limit_max_attempts' => ['nullable', 'integer', 'min:1'],
            'rate_limit_decay_seconds' => ['nullable', 'integer', 'min:1'],
            'rate_limit_terminate_on_limit' => ['nullable', 'boolean'],
        ]);
    }
}
