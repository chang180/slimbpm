<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // 表單相關路由
    Route::prefix('forms')->name('forms.')->group(function () {
        Route::get('/', [App\Http\Controllers\FormController::class, 'index'])->name('index');
        Route::get('/create', [App\Http\Controllers\FormController::class, 'create'])->name('create');
        Route::post('/', [App\Http\Controllers\FormController::class, 'store'])->name('store');
        Route::get('/{form}', [App\Http\Controllers\FormController::class, 'show'])->name('show');
        Route::get('/{form}/edit', [App\Http\Controllers\FormController::class, 'edit'])->name('edit');
        Route::put('/{form}', [App\Http\Controllers\FormController::class, 'update'])->name('update');
        Route::delete('/{form}', [App\Http\Controllers\FormController::class, 'destroy'])->name('destroy');
        Route::get('/{form}/submit', [App\Http\Controllers\FormController::class, 'submit'])->name('submit');
        Route::post('/{form}/submit', [App\Http\Controllers\FormController::class, 'processSubmit'])->name('process-submit');
        Route::get('/{form}/results', [App\Http\Controllers\FormController::class, 'results'])->name('results');
        Route::post('/{form}/duplicate', [App\Http\Controllers\FormController::class, 'duplicate'])->name('duplicate');
    });

    // 表單設計器路由
    Route::get('form-builder', function () {
        return Inertia::render('FormBuilder');
    })->name('form-builder');

    // 組織管理路由
    Route::prefix('organization')->name('organization.')->group(function () {
        Route::get('/', [App\Http\Controllers\OrganizationController::class, 'index'])->name('index');
        Route::get('/settings', [App\Http\Controllers\OrganizationController::class, 'settings'])->name('settings');
        Route::put('/settings', [App\Http\Controllers\OrganizationController::class, 'updateSettings'])->name('settings.update');
        Route::get('/info', [App\Http\Controllers\OrganizationController::class, 'info'])->name('info');
        Route::get('/preferences', [App\Http\Controllers\OrganizationController::class, 'preferences'])->name('preferences');
        Route::put('/preferences', [App\Http\Controllers\OrganizationController::class, 'updatePreferences'])->name('preferences.update');
        Route::get('/reports', [App\Http\Controllers\OrganizationController::class, 'reports'])->name('reports');
    });

    // 用戶管理路由
    Route::resource('users', App\Http\Controllers\UserController::class, [
        'names' => [
            'index' => 'web.users.index',
            'create' => 'web.users.create',
            'store' => 'web.users.store',
            'show' => 'web.users.show',
            'edit' => 'web.users.edit',
            'update' => 'web.users.update',
            'destroy' => 'web.users.destroy',
        ]
    ]);

    // 工作流程設計器路由
    Route::get('workflows/designer', function () {
        return Inertia::render('workflows/designer', [
            'workflow' => null,
            'canEdit' => true,
        ]);
    })->name('workflows.designer');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';