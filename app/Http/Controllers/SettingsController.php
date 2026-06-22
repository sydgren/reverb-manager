<?php

namespace App\Http\Controllers;

use App\Models\ReverbMetric;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function edit(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('settings/index', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'plan' => $user->plan->value,
                'created_at' => $user->created_at?->toIso8601String(),
            ],
        ]);
    }

    /**
     * Rectification (GDPR Art. 16) — let the user correct their account data.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
        ]);

        $user->update($data);

        return back();
    }

    /**
     * Data portability (GDPR Art. 20) — a structured, machine-readable export
     * of everything we hold about the user. App secrets are omitted; they are
     * credentials, not personal data, and remain visible in the app itself.
     */
    public function export(Request $request): JsonResponse
    {
        $user = $request->user();

        $apps = $user->reverbApps()->orderBy('created_at')->get();

        $export = [
            'exported_at' => now()->toIso8601String(),
            'account' => [
                'name' => $user->name,
                'email' => $user->email,
                'plan' => $user->plan->value,
                'created_at' => $user->created_at?->toIso8601String(),
            ],
            'reverb_apps' => $apps->map(fn ($app): array => [
                'app_id' => $app->app_id,
                'name' => $app->name,
                'key' => $app->key,
                'allowed_origins' => $app->allowed_origins,
                'max_connections' => $app->max_connections,
                'created_at' => $app->created_at?->toIso8601String(),
            ])->all(),
            'usage_metrics' => ReverbMetric::query()
                ->whereIn('reverb_app_id', $apps->pluck('app_id'))
                ->orderBy('bucket_hour')
                ->get(['reverb_app_id', 'bucket_hour', 'type', 'count'])
                ->map(fn (ReverbMetric $m): array => [
                    'reverb_app_id' => $m->reverb_app_id,
                    'bucket_hour' => $m->bucket_hour?->toIso8601String(),
                    'type' => $m->type,
                    'count' => $m->count,
                ])->all(),
        ];

        return response()
            ->json($export, options: JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
            ->withHeaders([
                'Content-Disposition' => 'attachment; filename="reverb-manager-data-export.json"',
            ]);
    }

    /**
     * Erasure (GDPR Art. 17) — delete the account and everything tied to it.
     * Deleting the apps cascades through the foreign key and fires the observer
     * that drains the broadcaster; their hourly metrics are keyed by app_id
     * (no FK), so we purge those explicitly.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $user = $request->user();

        $appIds = $user->reverbApps()->pluck('app_id');

        ReverbMetric::query()->whereIn('reverb_app_id', $appIds)->delete();
        $user->reverbApps()->each(fn ($app) => $app->delete());

        Auth::logout();
        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
