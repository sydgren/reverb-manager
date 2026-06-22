<?php

namespace App\Http\Controllers;

use App\Jobs\RestartReverb;
use App\Models\ReverbMetric;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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
                'Content-Disposition' => 'attachment; filename="reverberberb-data-export.json"',
            ]);
    }

    /**
     * Erasure (GDPR Art. 17) — delete the account and everything tied to it.
     * Their hourly metrics are keyed by app_id (no FK), so we purge those
     * explicitly alongside the apps.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $user = $request->user();

        $appIds = $user->reverbApps()->pluck('app_id');

        // Log out first: logging out *after* deleting would re-persist the
        // user (SessionGuard cycles the remember token via save()) and
        // resurrect the row we just erased.
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Erase atomically — a half-finished erasure would leave orphaned
        // personal data. Bulk-delete the apps (skips the per-row observer) so
        // we dispatch a single broadcaster restart afterwards, not one per app.
        DB::transaction(function () use ($user, $appIds): void {
            ReverbMetric::query()->whereIn('reverb_app_id', $appIds)->delete();
            $user->reverbApps()->delete();
            $user->delete();
        });

        if ($appIds->isNotEmpty()) {
            RestartReverb::dispatch();
        }

        return redirect('/');
    }
}
