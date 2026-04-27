<?php

use App\Http\Controllers\AppController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/apps')->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('apps', [AppController::class, 'index'])->name('apps.index');
    Route::get('apps/create', [AppController::class, 'create'])->name('apps.create');
    Route::post('apps', [AppController::class, 'store'])->name('apps.store');
    Route::get('apps/{app:app_id}', [AppController::class, 'show'])->name('apps.show');
    Route::patch('apps/{app:app_id}', [AppController::class, 'update'])->name('apps.update');
    Route::delete('apps/{app:app_id}', [AppController::class, 'destroy'])->name('apps.destroy');
});

require __DIR__.'/auth.php';
