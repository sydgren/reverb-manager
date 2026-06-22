<?php

use App\Http\Controllers\AppController;
use App\Http\Controllers\SettingsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', '/apps')->name('home');

// Public legal pages (GDPR transparency).
Route::get('privacy', fn () => Inertia::render('legal/privacy'))->name('legal.privacy');
Route::get('terms', fn () => Inertia::render('legal/terms'))->name('legal.terms');

Route::middleware(['auth'])->group(function () {
    Route::get('apps', [AppController::class, 'index'])->name('apps.index');
    Route::get('apps/create', [AppController::class, 'create'])->name('apps.create');
    Route::post('apps', [AppController::class, 'store'])->name('apps.store');
    Route::get('apps/{app:app_id}', [AppController::class, 'show'])->name('apps.show');
    Route::patch('apps/{app:app_id}', [AppController::class, 'update'])->name('apps.update');
    Route::delete('apps/{app:app_id}', [AppController::class, 'destroy'])->name('apps.destroy');

    // Account settings + data subject rights.
    Route::get('settings', [SettingsController::class, 'edit'])->name('settings.edit');
    Route::patch('settings', [SettingsController::class, 'update'])->name('settings.update');
    Route::get('settings/export', [SettingsController::class, 'export'])->name('settings.export');
    Route::delete('settings', [SettingsController::class, 'destroy'])->name('settings.destroy');
});

require __DIR__.'/auth.php';
